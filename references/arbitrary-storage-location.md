# Write to Arbitrary Storage Location

## Preconditions
- Contract has a dynamic array in storage
- User input controls the index used for writing to that array
- No bounds checking on the index before the write
- OR: assembly-level `sstore` with a user-controlled slot value

## Vulnerable Pattern
```solidity
uint256[] public data;
address public owner;

function write(uint256 index, uint256 value) external {
    // User controls index — can compute an index that maps
    // to any storage slot via the array's storage layout:
    // array elements start at keccak256(slot_of_length)
    // attacker calculates index to target owner's slot
    data[index] = value;
}

// Assembly variant
function writeSlot(uint256 slot, uint256 value) external {
    assembly {
        sstore(slot, value) // Direct arbitrary storage write
    }
}
```

## Detection Heuristics
1. Search for dynamic array writes where the index comes from user input or function parameters
2. Check if the index is bounds-checked before the write (e.g., `require(index < data.length)`)
3. Search for `sstore` in assembly blocks — check if the slot parameter is user-controlled
4. Search for `.length` assignments on dynamic arrays (Solidity <0.6.0 allowed `array.length = X`, enabling array expansion to reach any slot)
5. If an unbounded array write exists, verify whether the array's keccak256-based slot layout could collide with other state variable slots

## False Positives
- Array index is validated against `array.length` before writing
- The array uses `push()` only (indices are not user-controlled)
- Assembly `sstore` uses a hardcoded or internally computed slot
- Modern Solidity (>=0.6.0) prevents direct `.length` manipulation

## Remediation
- Always bounds-check array indices: `require(index < data.length)`
- Use `push()` and `pop()` instead of direct index assignment for dynamic arrays
- Avoid exposing `sstore` with user-controlled slot values
- Use mappings instead of arrays when random-access writes are needed
```solidity
function safeWrite(uint256 index, uint256 value) external {
    require(index < data.length, "out of bounds");
    data[index] = value;
}
```
