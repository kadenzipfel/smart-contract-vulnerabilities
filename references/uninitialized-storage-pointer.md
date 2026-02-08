# Uninitialized Storage Pointer

## Preconditions
- Solidity version <0.5.0
- Local variables of complex types (structs, arrays) are declared without an explicit `storage` or `memory` data location
- The variable defaults to `storage`, pointing to slot 0

## Vulnerable Pattern
```solidity
// Solidity <0.5.0 only
pragma solidity ^0.4.24;

contract Registry {
    address public owner;      // Stored in slot 0
    uint256 public totalUsers; // Stored in slot 1

    struct User {
        address addr;
        uint256 balance;
    }

    User[] public users;

    function addUser(address _addr, uint256 _balance) external {
        // No data location specified — defaults to storage
        // Points to slot 0 (owner) and slot 1 (totalUsers)
        User u;        // u.addr aliases slot 0 (owner)
        u.addr = _addr;    // Overwrites owner!
        u.balance = _balance; // Overwrites totalUsers!
        users.push(u);
    }
}
```

## Detection Heuristics
1. Check the Solidity version: if >=0.5.0, this vulnerability is impossible (compiler requires explicit data location)
2. For <0.5.0: search for local struct or array variable declarations without `storage` or `memory` keyword
3. If a local variable of a complex type has no data location, it defaults to `storage` at slot 0 — writes to it overwrite the first state variables
4. Check which state variables occupy slots 0, 1, 2, etc. — these are the ones at risk of overwrite
5. Look for struct field assignments on local variables that could alias storage

## False Positives
- Solidity >=0.5.0 (compiler enforces explicit data location — this can't happen)
- The variable is explicitly declared as `memory` (e.g., `User memory u`)
- The variable is explicitly declared as `storage` and intentionally points to a known storage location

## Remediation
- Upgrade to Solidity >=0.5.0 where explicit data locations are compiler-enforced
- For legacy contracts, add explicit `memory` or `storage` to all local complex-type declarations
```solidity
function addUser(address _addr, uint256 _balance) external {
    User memory u;         // Explicit memory — no storage aliasing
    u.addr = _addr;
    u.balance = _balance;
    users.push(u);
}
```
