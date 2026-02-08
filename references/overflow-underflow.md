# Integer Overflow and Underflow

## Preconditions
- Solidity <0.8.0 without SafeMath, OR
- Arithmetic inside `unchecked { }` blocks, OR
- Arithmetic inside `assembly { }` / Yul blocks, OR
- Type downcasting (e.g., `uint8(uint256Var)`), OR
- Shift operators (`<<`, `>>`) on values near type boundaries

## Vulnerable Pattern
```solidity
// Pre-0.8.0: wraps silently
uint256 balance = 0;
balance -= 1; // Underflows to 2^256 - 1

// Post-0.8.0 bypass via unchecked block
unchecked {
    uint256 x = type(uint256).max;
    x += 1; // Wraps to 0, no revert
}

// Type downcast truncation (all versions)
uint256 big = 256;
uint8 small = uint8(big); // Silently truncates to 0

// Assembly arithmetic (all versions)
assembly {
    let x := sub(0, 1) // Underflows to max uint256
}
```

## Detection Heuristics
1. Check the Solidity version: if <0.8.0, flag ALL arithmetic operations not wrapped in SafeMath
2. If >=0.8.0, search for `unchecked` blocks and audit every arithmetic operation inside them
3. Search for `assembly` blocks and audit all `add`, `sub`, `mul`, `div`, `shl`, `shr` operations within
4. Search for type downcasts: patterns like `uint8(`, `uint16(`, `int8(`, etc. — verify the source value is bounds-checked before casting
5. Search for shift operations (`<<`, `>>`) and verify the operand cannot overflow the target type
6. Check if overflow-induced reverts on critical paths could cause DoS

## False Positives
- Solidity >=0.8.0 arithmetic outside of `unchecked` and `assembly` blocks (automatically checked)
- `unchecked` blocks used only for loop counter increments (`i++`) where overflow is impossible due to bounded loop
- Downcasts where the value is validated to fit the target type before casting (e.g., `require(x <= type(uint8).max)`)
- Assembly arithmetic on values with proven bounds

## Remediation
- For Solidity <0.8.0: use OpenZeppelin's `SafeMath` for all arithmetic
- For >=0.8.0: minimize `unchecked` blocks to only provably safe operations (e.g., bounded loop counters)
- Use OpenZeppelin's `SafeCast` library for all type downcasts
- Validate bounds before assembly arithmetic
```solidity
// Safe downcast
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";
uint8 small = SafeCast.toUint8(big); // Reverts if big > 255
```
