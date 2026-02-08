# Unchecked Return Values

## Preconditions
- Contract uses low-level calls: `.call()`, `.send()`, or `.delegatecall()`
- The boolean return value indicating success/failure is not checked
- State changes occur after the unchecked call, assuming it succeeded

## Vulnerable Pattern
```solidity
function withdraw(uint256 amount) external {
    // .send() returns false on failure but does NOT revert
    msg.sender.send(amount); // Return value ignored
    balances[msg.sender] -= amount; // State updated even if send failed
}

function payout(address to, uint256 amount) external {
    // .call() return value captured but never checked
    (bool success,) = to.call{value: amount}("");
    // success could be false, but execution continues
    totalPaid += amount;
}
```

## Detection Heuristics
1. Search for all `.call(`, `.send(`, `.delegatecall(` invocations
2. For each, check whether the returned boolean is captured AND checked (e.g., `require(success)`, `if (!success) revert`)
3. If the return value is captured but never referenced again, flag it
4. If the return value is not captured at all (e.g., bare `addr.send(amount);`), flag it
5. Check for state changes after unchecked calls — these create inconsistent state on silent failure

## False Positives
- Return value is checked with `require(success)` or equivalent
- The call is intentionally fire-and-forget (documented, no state depends on success) — rare but valid
- Using Solidity's high-level function calls (e.g., `IERC20(token).transfer(...)`) which auto-revert on failure

## Remediation
- Always check the return value: `require(success, "call failed")`
- For ETH transfers to untrusted recipients, consider a pull-payment pattern to avoid DoS if the recipient deliberately reverts
- Prefer high-level Solidity calls when interacting with known interfaces
```solidity
function withdraw(uint256 amount) external {
    balances[msg.sender] -= amount;
    (bool success,) = msg.sender.call{value: amount}("");
    require(success, "ETH transfer failed");
}
```
