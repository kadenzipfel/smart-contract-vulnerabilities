# Requirement Violation

## Preconditions
- Contract uses `require()` statements for input or state validation
- The `require` condition is overly restrictive (rejects valid inputs) or too loose (accepts invalid inputs)
- OR: `require()` validates return values from external contracts whose behavior doesn't match assumptions

## Vulnerable Pattern
```solidity
// Overly restrictive: blocks legitimate use case
function withdraw(uint256 amount) external {
    // Fails if user has exactly the required amount (should be >=)
    require(balances[msg.sender] > amount, "insufficient");
    balances[msg.sender] -= amount;
    payable(msg.sender).transfer(amount);
}

// External contract assumption mismatch
function processPayment(IERC20 token, uint256 amount) external {
    // Assumes transfer returns true, but some tokens don't return a value
    // require reverts on tokens like USDT
    require(token.transfer(msg.sender, amount), "failed");
}

// Missing error message
function setRate(uint256 rate) external {
    require(rate > 0); // No error message — difficult to debug
}
```

## Detection Heuristics
1. For each `require()`, verify the condition matches the documented business logic (e.g., `>` vs `>=`, `<` vs `<=`)
2. Check if `require()` validates an external call's return value — verify the external contract actually returns what's expected
3. Look for `require()` without error messages — while not a vulnerability, it makes debugging difficult
4. Check if overly strict requirements can DoS critical paths (e.g., withdrawals, liquidations)
5. Check chained contract calls: does an upstream contract provide inputs that could fail downstream `require` checks?

## False Positives
- The `require` condition exactly matches the specification
- The strictness is intentional and documented
- The error message is omitted in a pre-0.8.4 contract for gas optimization (custom errors not yet available)

## Remediation
- Verify each `require` condition against the specification: `>` vs `>=`, `<` vs `<=`
- Add descriptive error messages or use custom errors (Solidity >=0.8.4)
- For external call validations, use SafeERC20 or similar wrappers that handle non-standard return values
```solidity
function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount, "insufficient balance");
    balances[msg.sender] -= amount;
    payable(msg.sender).transfer(amount);
}

// Solidity >=0.8.4: custom errors for gas efficiency
error InsufficientBalance(uint256 available, uint256 requested);

function withdrawV2(uint256 amount) external {
    if (balances[msg.sender] < amount)
        revert InsufficientBalance(balances[msg.sender], amount);
    balances[msg.sender] -= amount;
    payable(msg.sender).transfer(amount);
}
```
