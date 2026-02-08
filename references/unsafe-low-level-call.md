# Unsafe Low-Level Call

## Preconditions
- Contract uses `.call()`, `.delegatecall()`, `.staticcall()`, or `.send()` for external interactions
- The return value is not checked, OR
- The target address may not have deployed code (user-provided, destroyed, or never deployed)

## Vulnerable Pattern
```solidity
function payout(address to, uint256 amount) external {
    // Unchecked return value — silent failure
    to.call{value: amount}("");
    totalPaid += amount; // Updated even if call failed
}

function interact(address target, bytes calldata data) external {
    // Call to non-existent contract "succeeds" silently
    // EVM treats call to codeless address as successful
    (bool success,) = target.call(data);
    require(success); // Passes even if target has no code!
    _markComplete();
}
```

## Detection Heuristics
1. Search for `.call(`, `.send(`, `.delegatecall(`, `.staticcall(` in the codebase
2. For each, check if the returned `bool` is captured AND checked (e.g., `require(success)`)
3. If the return value is not captured or not checked, flag it — execution continues after failure
4. For calls to user-supplied addresses, check if `target.code.length > 0` is verified before the call — the EVM silently succeeds on calls to addresses with no code
5. Note: `address.code.length` check can be bypassed during constructor execution (code size is 0)
6. Check if state changes after the call assume it succeeded

## False Positives
- Return value is properly checked with `require(success)`
- High-level Solidity calls are used (e.g., `IERC20(token).transfer(...)`) which include automatic `extcodesize` checks and revert on failure
- The call is intentionally fire-and-forget with no state depending on success (rare, must be documented)

## Remediation
- Always check return values: `require(success, "call failed")`
- Verify target has code before low-level calls: `require(target.code.length > 0)`
- Prefer high-level Solidity calls for known interfaces — they include automatic code existence checks
- For critical integrations, combine both checks
```solidity
function payout(address to, uint256 amount) external {
    require(to.code.length > 0 || to == tx.origin, "no code at target");
    (bool success,) = to.call{value: amount}("");
    require(success, "transfer failed");
    totalPaid += amount;
}
```
