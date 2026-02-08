# Off-By-One Errors

## Preconditions
- Contract uses loops with boundary conditions, comparison operators at thresholds, or array index calculations
- The boundary/comparison is off by exactly one from the intended behavior

## Vulnerable Pattern
```solidity
// Skips the last element
function processAll() external {
    for (uint256 i = 0; i < users.length - 1; i++) {
        // Should be i < users.length
        // Last user is never processed
        _distribute(users[i]);
    }
}

// Off-by-one in threshold check
function liquidate(uint256 ratio) external {
    // Should be ratio < MIN_RATIO (liquidate when below)
    // Using <= means accounts AT the minimum are also liquidated
    require(ratio <= MIN_RATIO, "healthy");
    _liquidate();
}

// Out-of-bounds access
function getLastUser() external view returns (address) {
    return users[users.length]; // Should be users.length - 1
}
```

## Detection Heuristics
1. For every loop, check the boundary condition: `< length` vs `<= length` vs `< length - 1`
2. `< length - 1` skips the last element — flag unless intentional
3. `<= length` goes out of bounds on array access — flag always
4. For comparison operators at thresholds (`>`, `>=`, `<`, `<=`), verify the boundary matches the specification (e.g., "greater than" vs "greater than or equal to")
5. Check pagination logic for fence-post errors: does the first page start at 0 or 1? Does the last batch include the final element?
6. Look for `length - 1` on arrays that could be empty — this underflows to `type(uint256).max` in unchecked contexts or reverts in checked contexts

## False Positives
- The boundary is intentionally exclusive (e.g., `< length - 1` to skip the sentinel/last element by design)
- The comparison operator matches the documented specification exactly
- The code is iterating over pairs (`i < length - 1` to compare `arr[i]` with `arr[i+1]`)

## Remediation
- Verify each boundary condition against the specification or documented intent
- Be explicit about inclusive vs exclusive bounds in comments
- Guard against empty array underflow: check `length > 0` before `length - 1`
```solidity
function processAll() external {
    for (uint256 i = 0; i < users.length; i++) {
        _distribute(users[i]);
    }
}

// Explicit about boundary semantics
function liquidate(uint256 ratio) external {
    require(ratio < MIN_RATIO, "healthy"); // Strictly below = liquidatable
    _liquidate();
}
```
