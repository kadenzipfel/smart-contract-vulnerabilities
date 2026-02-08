# Use of Deprecated Functions

## Preconditions
- Contract uses Solidity functions, keywords, or language features that have been deprecated or removed
- The deprecated feature may behave differently than expected or may not compile on newer Solidity versions

## Vulnerable Pattern
```solidity
pragma solidity ^0.4.24;

contract Legacy {
    function destroy() external {
        // suicide is deprecated — renamed to selfdestruct
        // selfdestruct itself is now deprecated post-Dencun
        suicide(msg.sender);
    }

    function getHash(bytes memory data) external view returns (bytes32) {
        return sha3(data);  // Deprecated — use keccak256
    }

    function getBlockHash(uint256 n) external view returns (bytes32) {
        return block.blockhash(n);  // Deprecated — use blockhash(n)
    }

    function getRemainingGas() external view returns (uint256) {
        return msg.gas;  // Deprecated — use gasleft()
    }
}
```

| Deprecated | Replacement |
|---|---|
| `suicide(address)` | `selfdestruct(address)` (also deprecated) |
| `block.blockhash(uint)` | `blockhash(uint)` |
| `sha3(...)` | `keccak256(...)` |
| `callcode(...)` | `delegatecall(...)` |
| `throw` | `revert()` |
| `msg.gas` | `gasleft()` |
| `constant` (function modifier) | `view` |
| `var` | Explicit type name |

## Detection Heuristics
1. Search for each deprecated keyword: `suicide`, `sha3`, `block.blockhash`, `callcode`, `throw`, `msg.gas`, `constant` (as function modifier), `var`
2. Search for `selfdestruct` — while it's the replacement for `suicide`, it is itself deprecated post-Dencun and non-functional on some chains
3. Check compiler warnings for deprecation notices
4. Flag any usage and recommend the modern replacement

## False Positives
- The deprecated function appears in comments or documentation, not in executable code
- The contract is intentionally targeting an old Solidity version where the deprecated feature is still standard
- Interface definitions that reference deprecated patterns for backward compatibility

## Remediation
- Replace each deprecated function with its modern equivalent (see table above)
- For `selfdestruct`: remove reliance entirely, as it is deprecated and non-functional on some chains post-Dencun
- Upgrade the Solidity version to benefit from compiler enforcement of modern syntax
```solidity
// Modern equivalents
pragma solidity 0.8.24;

contract Modern {
    function getHash(bytes memory data) external pure returns (bytes32) {
        return keccak256(data);
    }

    function getBlockHash(uint256 n) external view returns (bytes32) {
        return blockhash(n);
    }

    function getRemainingGas() external view returns (uint256) {
        return gasleft();
    }
}
```
