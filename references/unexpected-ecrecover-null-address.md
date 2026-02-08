# Unexpected ecrecover Null Address

## Preconditions
- Contract uses `ecrecover` directly (not via OpenZeppelin's ECDSA library)
- The recovered address is not checked against `address(0)`
- The expected signer variable could be uninitialized (defaults to `address(0)`)

## Vulnerable Pattern
```solidity
contract Vault {
    address public signer; // Uninitialized — defaults to address(0)

    function withdrawWithSig(uint256 amount, uint8 v, bytes32 r, bytes32 s) external {
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, amount));

        // ecrecover returns address(0) for invalid signatures
        // (e.g., v != 27 && v != 28)
        address recovered = ecrecover(hash, v, r, s);

        // If signer is uninitialized (address(0)) and recovered is address(0),
        // this check passes — anyone can withdraw
        require(recovered == signer, "invalid signature");

        _withdraw(msg.sender, amount);
    }
}
```

## Detection Heuristics
1. Search for `ecrecover(` calls in the codebase
2. Check if the returned address is validated against `address(0)` — flag if not
3. Check the variable that the recovered address is compared against — can it ever be `address(0)`? (uninitialized, never set, cleared by admin)
4. Check if OpenZeppelin's `ECDSA.recover` is used instead — it reverts on null recovery automatically
5. In upgradeable contracts, check if the signer is set during `initialize()` — if `initialize` is never called, signer remains `address(0)`

## False Positives
- `require(recovered != address(0))` check is present after `ecrecover`
- OpenZeppelin's `ECDSA.recover` is used (handles null address internally)
- The expected signer is set in the constructor or initializer and can never be `address(0)` (validated on set)

## Remediation
- Always check `require(recovered != address(0), "invalid signature")` after `ecrecover`
- Use OpenZeppelin's `ECDSA.recover` which reverts on invalid signatures and null recovery
- Validate that signer variables cannot be `address(0)` at any point
```solidity
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

function withdrawWithSig(uint256 amount, bytes memory sig) external {
    bytes32 hash = keccak256(abi.encodePacked(msg.sender, amount));
    bytes32 ethHash = ECDSA.toEthSignedMessageHash(hash);
    address recovered = ECDSA.recover(ethHash, sig); // Reverts if address(0)
    require(recovered == signer, "invalid signature");
    _withdraw(msg.sender, amount);
}
```
