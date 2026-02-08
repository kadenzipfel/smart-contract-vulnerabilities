# Incorrect Inheritance Order

## Preconditions
- Contract uses multiple inheritance (`is ContractA, ContractB, ...`)
- Two or more parent contracts define a function with the same name and signature
- The inheritance order (left-to-right) does not match the developer's intended resolution

## Vulnerable Pattern
```solidity
contract Ownable {
    function owner() public view virtual returns (address) {
        return _owner; // Returns EOA owner
    }
}

contract Governance {
    function owner() public view virtual returns (address) {
        return governance; // Returns governance contract
    }
}

// C3 linearization: rightmost (Ownable) takes precedence
// Developer intended Governance.owner() but gets Ownable.owner()
contract Treasury is Governance, Ownable {
    // owner() resolves to Ownable (rightmost) — may not be intended
    // Should be: is Ownable, Governance (if Governance should win)
}
```

## Detection Heuristics
1. Identify all contracts using multiple inheritance (`is A, B, C`)
2. For each inheritance chain, check if parent contracts define functions with the same name and signature
3. Verify the inheritance order follows general-to-specific (most base first, most derived last) — Solidity's C3 linearization gives precedence to the rightmost parent
4. Check `override` specifiers: `override(A, B)` should explicitly list which parents are being overridden
5. Trace the actual resolution order and compare against documented or intended behavior

## False Positives
- Only one parent defines the function (no ambiguity)
- The contract explicitly overrides the function with `override(A, B)` and provides its own implementation
- The inheritance order is intentionally general-to-specific and produces the correct resolution

## Remediation
- Order inheritance from most base to most derived (general-to-specific, left-to-right)
- Explicitly override conflicting functions and specify which parents: `override(ContractA, ContractB)`
- Test function resolution in complex hierarchies
```solidity
// Correct: general-to-specific order
contract Treasury is Ownable, Governance {
    function owner() public view override(Ownable, Governance) returns (address) {
        return Governance.owner(); // Explicit resolution
    }
}
```
