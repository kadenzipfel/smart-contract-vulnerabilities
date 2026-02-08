# Delegatecall to Untrusted Callee

## Preconditions
- Contract uses `delegatecall`
- The target address of the `delegatecall` is derived from user input, function parameters, or a mutable state variable settable by non-admin users
- OR: a proxy pattern where the implementation address can be changed by unauthorized parties

## Vulnerable Pattern
```solidity
// User-controlled delegatecall target
function forward(address callee, bytes calldata data) external {
    // Attacker supplies callee = malicious contract
    // Malicious contract overwrites storage (e.g., slot 0 = owner)
    (bool success,) = callee.delegatecall(data);
    require(success);
}

// Proxy with unprotected implementation setter
function setImplementation(address _impl) external {
    // Missing: require(msg.sender == admin)
    implementation = _impl;
}
```

## Detection Heuristics
1. Search for all `delegatecall` invocations in the codebase
2. For each, trace the target address: is it hardcoded, immutable, admin-only settable, or user-influenced?
3. If the target comes from a function parameter, calldata, or storage variable — check that only authorized roles can set it
4. For proxy contracts, verify that `upgradeTo` / `setImplementation` functions have proper access control
5. Check storage layout compatibility between the proxy and all possible implementation contracts
6. Flag any generic forwarding function that passes user-supplied addresses to `delegatecall`

## False Positives
- `delegatecall` target is hardcoded or immutable (e.g., `address immutable IMPL`)
- Target is set only in the constructor and cannot be changed
- Target is restricted to a whitelist of audited contracts
- Standard proxy patterns (EIP-1967, UUPS, TransparentProxy) with proper access control on upgrades

## Remediation
- Restrict `delegatecall` targets to trusted, immutable, or admin-only-settable addresses
- Use established proxy patterns (OpenZeppelin TransparentProxy, UUPS) with proper access control
- Never expose `delegatecall` with a user-supplied target address
- Verify storage layout compatibility between proxy and implementation contracts using tools like OpenZeppelin's storage layout checker
```solidity
// Safe: immutable implementation
address immutable implementation;
constructor(address _impl) {
    implementation = _impl;
}
fallback() external payable {
    (bool s,) = implementation.delegatecall(msg.data);
    require(s);
}
```
