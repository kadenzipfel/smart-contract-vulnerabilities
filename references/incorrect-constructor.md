# Incorrect Constructor Name

## Preconditions
- Solidity version <0.4.22 where constructors are named functions matching the contract name
- The function name does not exactly match the contract name (typo, case mismatch, or contract renamed without updating the constructor)

## Vulnerable Pattern
```solidity
// Solidity <0.4.22: constructor is a named function
contract Owned {
    address public owner;

    // Typo: "owned" != "Owned" (case mismatch)
    // This becomes a regular public function anyone can call
    function owned() public {
        owner = msg.sender;
    }
}

// Contract renamed but constructor not updated
contract Treasury {
    address public owner;

    // Was "Wallet" before rename — now a regular public function
    function Wallet() public {
        owner = msg.sender;
    }
}
```

## Detection Heuristics
1. Check the Solidity version: if >=0.4.22 and the `constructor` keyword is used, this vulnerability does not apply
2. For <0.4.22 contracts: find the function that sets initial state (owner, parameters) and verify its name exactly matches the contract name (case-sensitive)
3. Search for public/external functions that set `owner` or perform one-time initialization — these may be misnamed constructors
4. Check if the contract was renamed at any point (git history, comments) but the constructor function was not updated
5. Flag any named function that appears to perform initialization logic (sets owner, initializes critical state) but doesn't match the contract name

## False Positives
- Solidity >=0.4.22 using the `constructor` keyword (enforced by compiler)
- The function is intentionally a public initializer (e.g., in proxy patterns) with proper access control

## Remediation
- Upgrade to Solidity >=0.4.22 and use the `constructor` keyword
- For legacy contracts, verify the constructor function name exactly matches the contract name
```solidity
// Modern Solidity: compiler-enforced constructor
contract Owned {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}
```
