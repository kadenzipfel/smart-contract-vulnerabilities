# Outdated Compiler Version

## Preconditions
- Contract is compiled with a Solidity version significantly behind the latest stable release
- The compiler version used has known bugs or is missing important security features

## Vulnerable Pattern
```solidity
// Old version missing built-in overflow checks
pragma solidity 0.7.6;

contract Token {
    mapping(address => uint256) public balances;

    function transfer(address to, uint256 amount) external {
        // No overflow protection — 0.7.x lacks built-in checks
        // Requires manual SafeMath usage
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}

// Slightly newer but still has known bugs
pragma solidity 0.8.0;
// 0.8.0 had ABI encoding bugs fixed in later patches
```

## Detection Heuristics
1. Check the `pragma solidity` version in all contract files
2. Compare against the latest stable Solidity release — flag if significantly outdated
3. Cross-reference the exact version against the Solidity known bugs list
4. Check if the contract misses key safety features from newer versions:
   - <0.8.0: no built-in overflow/underflow checks
   - <0.8.4: no custom errors (gas efficiency)
   - <0.8.20: no PUSH0 opcode support
5. Flag if the version has known critical bugs (check https://solidity.readthedocs.io/en/latest/bugs.html)

## False Positives
- The version is intentionally chosen for compatibility with a specific deployment target or toolchain
- The version is recent (within 1-2 minor versions of latest) and has no known critical bugs
- The project has documented reasons for the specific version choice

## Remediation
- Upgrade to the latest stable Solidity version unless there's a specific compatibility constraint
- Cross-reference the current version against the known bugs list before and after upgrading
- When upgrading across major boundaries (e.g., 0.7 to 0.8), review all arithmetic for compatibility with built-in overflow checks
```solidity
// Use latest stable version
pragma solidity 0.8.24;

contract Token {
    mapping(address => uint256) public balances;

    function transfer(address to, uint256 amount) external {
        balances[msg.sender] -= amount; // Built-in overflow check
        balances[to] += amount;
    }
}
```
