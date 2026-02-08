# Shadowing State Variables

## Preconditions
- Contract inherits from one or more parent contracts
- A state variable in the child contract has the same name as a state variable in a parent contract
- Solidity version <0.6.0 (>=0.6.0 disallows state variable shadowing with a compiler error)
- OR: function parameters or local variables shadow state variables (any Solidity version)

## Vulnerable Pattern
```solidity
contract Base {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}

// Solidity <0.6.0: this compiles without error
contract Child is Base {
    address public owner; // Shadows Base.owner — creates a NEW variable

    function setOwner(address _owner) external {
        owner = _owner; // Sets Child.owner, NOT Base.owner
    }

    // Base's functions still read Base.owner (the original)
    // Child's functions read Child.owner (the shadow)
    // These are two different storage variables!
}

// Local variable shadowing (any version)
contract Example {
    uint256 public value = 100;

    function getValue() public view returns (uint256) {
        uint256 value = 0; // Shadows state variable
        return value; // Returns 0, not 100
    }
}
```

## Detection Heuristics
1. Check Solidity version: if <0.6.0, search for state variables in child contracts that share names with parent contract variables
2. For any version, search for function parameters and local variables that share names with state variables
3. Check compiler warnings — modern Solidity warns about local shadowing even if it allows it
4. For each shadowed variable, trace which version (parent's or child's) each function reads/writes — inconsistency indicates a bug
5. Pay special attention to `owner`, `admin`, and other access-control variables being shadowed

## False Positives
- Solidity >=0.6.0: state variable shadowing is a compiler error, so it can't happen
- Local variable shadowing where the intent is clear and the state variable is not needed in that scope (still bad practice but not exploitable)
- The shadowing is in a test file or non-production code

## Remediation
- Upgrade to Solidity >=0.6.0 where state variable shadowing is a compiler error
- For local variable shadowing, use distinct names (e.g., prefix with `_` for parameters)
- Rename conflicting variables to be unique across the inheritance chain
```solidity
contract Child is Base {
    // Don't redeclare — use Base.owner directly
    function setOwner(address _newOwner) external {
        owner = _newOwner; // Modifies Base.owner
    }
}
```
