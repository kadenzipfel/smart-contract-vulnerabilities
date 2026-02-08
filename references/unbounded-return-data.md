# Unbounded Return Data

## Preconditions
- Contract makes a low-level `.call()` to an untrusted or user-specified address
- Solidity's automatic return data copying is used (default behavior up to at least v0.8.26)
- No assembly-level restriction on `returndatacopy` size
- The function is on a critical path where revert would lock funds (withdrawals, undelegation)

## Vulnerable Pattern
```solidity
function unstake(address callback) external {
    uint256 amount = stakes[msg.sender];
    stakes[msg.sender] = 0;

    // Solidity automatically copies ALL return data into memory
    // Attacker's callback contract returns megabytes of data
    // Memory expansion cost grows quadratically — causes out-of-gas
    (bool success,) = callback.call(
        abi.encodeWithSignature("onUnstake(uint256)", amount)
    );
    // Even with limited gas stipend, the return data copy
    // happens in the CALLER's gas context
    require(success, "callback failed");
}
```

## Detection Heuristics
1. Search for `.call(`, `.delegatecall(`, `.staticcall(` to addresses that could be attacker-controlled
2. Check if the return data is handled by Solidity's default (captured as `bytes memory` or discarded but still copied)
3. If the call target is untrusted and no assembly-level return data size limit is used, flag it
4. Check if the function is on a critical path — can a revert here lock user funds?
5. Look for callback patterns (delegation hooks, unstaking callbacks, flash loan callbacks) where the callee is attacker-controlled

## False Positives
- The call target is a trusted, known contract (not user-controlled)
- Assembly is used to limit `returndatacopy` to a bounded size (e.g., max 32 bytes)
- `ExcessivelySafeCall` or similar library is used for bounded return data
- The function doesn't revert on call failure (uses try/catch or ignores success)

## Remediation
- Use assembly to limit return data size instead of Solidity's automatic copy
- Use Nomad's `ExcessivelySafeCall` library for calls to untrusted addresses
- Bound `returndatacopy` to only the bytes you need (typically 0 or 32)
```solidity
// Assembly-bounded return data copy
function safeCall(address target, bytes memory data) internal returns (bool success) {
    assembly {
        success := call(gas(), target, 0, add(data, 0x20), mload(data), 0, 0)
        // Only copy up to 32 bytes of return data
        if gt(returndatasize(), 0) {
            returndatacopy(0, 0, min(returndatasize(), 32))
        }
    }
}
```
