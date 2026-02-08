# Unsecure Signatures

## Preconditions
- Contract uses ECDSA signatures for authorization, authentication, or message verification
- One or more of the following sub-vulnerabilities are present:
  - Signature malleability (tracking by raw bytes)
  - Missing replay protection (no nonce, chainId, or contract address)
  - Unchecked ecrecover null address return
  - Hash collisions from `abi.encodePacked` with multiple dynamic types
  - No EIP-712 structured data signing

## Vulnerable Pattern
```solidity
// Combines multiple signature anti-patterns
function execute(bytes memory sig, address to, uint256 amount) external {
    // 1. No nonce — replay attack
    // 2. No address(this) — cross-contract replay
    // 3. No block.chainid — cross-chain replay
    bytes32 hash = keccak256(abi.encodePacked(to, amount));

    // 4. Raw ecrecover — no null address check
    address recovered = ecrecover(hash, v, r, s);
    // 5. No s-value malleability check
    require(recovered == signer);

    // 6. Signature tracked by bytes — malleable bypass
    require(!used[sig]);
    used[sig] = true;

    _transfer(to, amount);
}
```

## Detection Heuristics
1. Search for `ecrecover` or `ECDSA.recover` — this indicates signature usage
2. Check each sub-vulnerability in order:
   - **Malleability**: is deduplication done by raw signature bytes? Flag if yes
   - **Replay**: does the signed hash include nonce + `address(this)` + `block.chainid`? Flag any missing
   - **Null address**: is the recovered address checked against `address(0)`? Flag if not
   - **Hash collision**: is `abi.encodePacked` used with multiple dynamic types? Flag if yes
   - **EIP-712**: is structured typed data signing used? Flag if not (lower severity)
3. Check if OpenZeppelin's ECDSA library is used — it handles malleability and null address automatically
4. Check for front-running risk: can a signed message be observed in the mempool and submitted by someone else?

## False Positives
- OpenZeppelin's ECDSA library is used with EIP-712 domain separator, nonce tracking, and proper hash construction — all sub-vulnerabilities are addressed
- EIP-2612 permit pattern is used correctly (includes nonce, deadline, domain separator)
- The contract is a simple forwarder where signature security is handled by a downstream contract

## Remediation
- Use OpenZeppelin's ECDSA library for signature recovery (handles malleability + null address)
- Implement EIP-712 structured data signing with domain separator (covers chainId + contract address)
- Track nonces per signer to prevent replay
- Use `abi.encode` instead of `abi.encodePacked` for hash construction
```solidity
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract SecureSig is EIP712("SecureSig", "1") {
    mapping(address => uint256) public nonces;

    bytes32 constant EXECUTE_TYPEHASH =
        keccak256("Execute(address to,uint256 amount,uint256 nonce)");

    function execute(address to, uint256 amount, bytes memory sig) external {
        uint256 nonce = nonces[msg.sender]++;
        bytes32 structHash = keccak256(abi.encode(EXECUTE_TYPEHASH, to, amount, nonce));
        bytes32 hash = _hashTypedDataV4(structHash);
        address recovered = ECDSA.recover(hash, sig);
        require(recovered == signer, "invalid sig");
        _transfer(to, amount);
    }
}
```
