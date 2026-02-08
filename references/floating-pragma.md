# Floating Pragma

## Preconditions
- Deployable contract uses a floating or range pragma (e.g., `pragma solidity ^0.8.0`, `pragma solidity >=0.8.0`)
- The contract is intended for deployment (not a library or package for external consumption)

## Vulnerable Pattern
```solidity
// Floating pragma — could compile with any 0.8.x version
pragma solidity ^0.8.0;

contract Token {
    // May be compiled with 0.8.0 (tested) or 0.8.25 (untested)
    // Different compiler versions may have different bugs or behavior
    mapping(address => uint256) public balances;
}

// Range pragma — even wider range
pragma solidity >=0.7.0 <0.9.0;
```

## Detection Heuristics
1. Search for `pragma solidity` declarations in all `.sol` files
2. If the pragma contains `^`, `>=`, `>`, or a range (e.g., `>=0.8.0 <0.9.0`), flag it as floating
3. Check if the file is a deployable contract or a library/package — libraries are exempt
4. A locked pragma looks like `pragma solidity 0.8.20;` (exact version, no caret or range)
5. Check if different files in the project use different Solidity versions — this creates inconsistency risk

## False Positives
- Libraries and packages intended for external consumption (e.g., npm packages, OpenZeppelin-style libraries) appropriately use floating pragmas for compatibility
- Interface files (`.sol` files containing only `interface` definitions) may use floating pragmas
- The floating pragma is in a test file, not a production contract

## Remediation
- Use locked pragmas for all deployable contracts: `pragma solidity 0.8.20;`
- Verify the locked version is tested and free of known compiler bugs
- Maintain consistent Solidity versions across the project
```solidity
// Locked pragma — deterministic compilation
pragma solidity 0.8.20;

contract Token {
    mapping(address => uint256) public balances;
}
```
