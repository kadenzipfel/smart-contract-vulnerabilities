# Presence of Unused Variables

## Preconditions
- Contract declares state variables, local variables, function parameters, or imports that are never referenced
- OR: return values from function calls are silently discarded

## Vulnerable Pattern
```solidity
contract Vault {
    uint256 public totalDeposits;
    uint256 public unusedCounter; // Declared but never read or written

    function deposit(uint256 amount, bytes memory data) external {
        // `data` parameter never used — possible missing validation
        totalDeposits += amount;
    }

    function process() external {
        // Return value from transfer silently discarded
        // This may indicate missing success check
        IERC20(token).transfer(recipient, amount);

        uint256 result = _calculate();
        // `result` computed but never used — missing logic?
    }
}
```

## Detection Heuristics
1. Search for state variables that are never referenced in any function (only declared)
2. Search for function parameters that are never used in the function body
3. Search for local variables that are assigned but never read
4. Check for return values from external calls that are not captured or checked
5. For each unused variable, determine: is it dead code (safe to remove) or does it indicate missing logic (a bug)?
6. Check compiler warnings for unused variable alerts

## False Positives
- The variable is part of an interface implementation and must be declared for signature compatibility even if unused
- The variable is used in a commented-out or conditional compilation path
- The variable is reserved for future use and documented as such
- Function parameters prefixed with `_` to explicitly mark as unused (e.g., `function hook(uint256 /* _amount */)`)

## Remediation
- For dead code: remove the unused variable entirely
- For missing logic: implement the intended use (e.g., check the return value, use the parameter for validation)
- For interface-required but unused parameters: use the unnamed parameter syntax
```solidity
// Remove dead state variables
// uint256 public unusedCounter; — DELETE

// Unnamed parameters for interface compliance
function onERC721Received(
    address,     // operator — unused
    address,     // from — unused
    uint256,     // tokenId — unused
    bytes memory  // data — unused
) external pure returns (bytes4) {
    return this.onERC721Received.selector;
}

// Check return values
(bool success,) = IERC20(token).transfer(recipient, amount);
require(success);
```
