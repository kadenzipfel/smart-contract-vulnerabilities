# Insufficient Access Control

## Preconditions
- Contract has functions that modify sensitive state (ownership, balances, fees, minting, pausing, protocol parameters)
- Those functions lack access control modifiers (`onlyOwner`, `onlyRole`, etc.) or `require(msg.sender == ...)` checks
- OR: access control exists but is incomplete (e.g., role assignments themselves are unprotected)

## Vulnerable Pattern
```solidity
address public owner;
uint256 public feeRate;

// Missing access control — anyone can call
function setFeeRate(uint256 newRate) external {
    feeRate = newRate;
}

// Missing access control — anyone can take ownership
function setOwner(address newOwner) external {
    owner = newOwner;
}

// Incomplete: role grant is unprotected
function grantRole(address user, bytes32 role) external {
    // Missing: require(hasRole(ADMIN_ROLE, msg.sender))
    _roles[role][user] = true;
}
```

## Detection Heuristics
1. Identify all `external` and `public` functions that modify state variables
2. For each, check if it has an access control modifier (`onlyOwner`, `onlyRole`, `whenNotPaused`, etc.) or an inline `require(msg.sender == ...)` check
3. If a state-changing function has no access control, flag it — especially if it modifies ownership, balances, fees, or addresses
4. Check that role/permission management functions themselves are protected (e.g., `grantRole` requires `ADMIN_ROLE`)
5. Check `initialize()` functions in upgradeable contracts — they must have an `initializer` modifier to prevent re-initialization

## False Positives
- The function is intentionally permissionless by design (e.g., `deposit()`, `claim()` where anyone should be able to call)
- Access control is enforced in an internal function that the external function always calls through
- The contract is an implementation behind a proxy, and access control is enforced at the proxy level

## Remediation
- Add explicit access control to every state-changing function that should be restricted
- Use OpenZeppelin's `Ownable` or `AccessControl` for standardized role management
- Protect `initialize()` with the `initializer` modifier
- Apply the principle of least privilege: each function should require the minimum role necessary
```solidity
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Secure is Ownable {
    function setFeeRate(uint256 newRate) external onlyOwner {
        feeRate = newRate;
    }
}
```
