# Insufficient Gas Griefing

## Preconditions
- Contract relays or forwards calls on behalf of users (meta-transactions, multisig execution, relayer patterns)
- The relayer/executor controls how much gas is forwarded to the sub-call
- Replay protection (nonce/hash marking) occurs before or regardless of sub-call success
- No minimum gas requirement is enforced before the sub-call

## Vulnerable Pattern
```solidity
function execute(address target, bytes calldata data, uint256 gasLimit) external {
    // Replay protection BEFORE sub-call — marks as executed regardless
    require(!executed[nonce], "already executed");
    executed[nonce] = true;
    nonce++;

    // Relayer can provide just enough gas for the outer tx to succeed
    // but insufficient gas for the inner call — it silently fails
    (bool success,) = target.call{gas: gasLimit}(data);
    // success is false, but the nonce is already consumed
    // The action is permanently censored
}
```

## Detection Heuristics
1. Identify relayer/meta-transaction patterns: functions that execute calls on behalf of other users
2. Check if the function marks a nonce/hash as used BEFORE the sub-call succeeds — this enables permanent censorship
3. Check if there's a `gasleft()` validation before the sub-call (e.g., `require(gasleft() >= requiredGas + overhead)`)
4. Look for multisig `execute` functions where the executor controls gas forwarding
5. Check if `.call{gas: X}` is used where `X` comes from the caller — the caller can set it too low

## False Positives
- Replay protection only marks the nonce after confirming sub-call success
- The function enforces a minimum gas requirement before the sub-call
- The sub-call failure is propagated (e.g., `require(success)`) so the outer tx also reverts, preserving the nonce
- The gas parameter is fixed or validated against a minimum

## Remediation
- Enforce minimum gas before sub-calls: `require(gasleft() >= gasLimit + OVERHEAD)`
- Only mark nonces/hashes as used AFTER confirming sub-call success
- Propagate sub-call failures to revert the outer transaction when appropriate
- Use EIP-150 rule awareness: the caller retains 1/64 of gas, so forward at least `gasLimit * 64/63`
```solidity
function execute(address target, bytes calldata data, uint256 gasLimit) external {
    require(gasleft() >= gasLimit + 10000, "insufficient gas");

    (bool success, bytes memory result) = target.call{gas: gasLimit}(data);

    // Only mark as executed if sub-call succeeded
    if (success) {
        executed[nonce] = true;
        nonce++;
    }
}
```
