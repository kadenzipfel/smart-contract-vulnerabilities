# Authorization Through tx.origin

## Preconditions
- Contract uses `tx.origin` for authorization or access control checks (e.g., `require(tx.origin == owner)`)
- A legitimate owner/admin may interact with untrusted external contracts

## Vulnerable Pattern
```solidity
contract Wallet {
    address public owner;

    function transferTo(address to, uint256 amount) external {
        // tx.origin is the EOA that initiated the entire tx chain
        // If owner calls MaliciousContract, which calls Wallet.transferTo,
        // tx.origin is still the owner — check passes
        require(tx.origin == owner, "not owner");
        payable(to).transfer(amount);
    }
}

contract Attacker {
    Wallet wallet;
    // Owner calls this (e.g., via a phishing link)
    fallback() external {
        // tx.origin == owner because owner initiated the tx
        wallet.transferTo(address(this), address(wallet).balance);
    }
}
```

## Detection Heuristics
1. Search for all instances of `tx.origin` in the codebase
2. If `tx.origin` is used in a `require`, `if`, or comparison for authorization purposes, flag it
3. Check if `tx.origin` is compared against privileged addresses (owner, admin, etc.)
4. Note: `tx.origin == msg.sender` used to verify EOA status is a different pattern (see asserting-contract-from-code-size) — still flag it but for different reasons (breaks with account abstraction)

## False Positives
- `tx.origin` used only for logging or analytics, not for authorization
- `tx.origin` used in combination with `msg.sender` checks where `msg.sender` is the primary authorization mechanism

## Remediation
- Replace `tx.origin` with `msg.sender` for all authorization checks
- `msg.sender` reflects the immediate caller, not the transaction originator
```solidity
function transferTo(address to, uint256 amount) external {
    require(msg.sender == owner, "not owner"); // Immediate caller check
    payable(to).transfer(amount);
}
```
