# Assert Violation

## Preconditions
- Contract uses `assert()` statements
- The `assert` condition can be reached through valid program execution (not a true invariant)
- OR: `assert()` is used to validate user input or external call results instead of `require()`

## Vulnerable Pattern
```solidity
function transfer(address to, uint256 amount) external {
    // WRONG: assert used for input validation — should be require
    // In Solidity <0.8.0, this consumes ALL remaining gas on failure
    assert(balances[msg.sender] >= amount);

    balances[msg.sender] -= amount;
    balances[to] += amount;
}

function withdraw() external {
    uint256 bal = balances[msg.sender];
    balances[msg.sender] = 0;
    (bool success,) = msg.sender.call{value: bal}("");
    // WRONG: assert used to check external call result
    assert(success);
}
```

## Detection Heuristics
1. Search for all `assert(` calls in the codebase
2. For each, determine whether the condition is a true invariant (mathematically impossible to violate in a correct contract) or an input/state validation
3. If the condition depends on user input, external call results, or mutable external state, flag it — it should be `require()` instead
4. Check Solidity version: in <0.8.0, failing `assert` uses the `0xfe` INVALID opcode and consumes ALL remaining gas; in >=0.8.0, it reverts with `Panic(uint256)` error code `0x01` (refunds remaining gas but provides no custom message)
5. If an `assert` can be triggered by an attacker, check if the gas consumption creates a griefing vector

## False Positives
- The `assert` checks a genuine invariant (e.g., `assert(totalSupply == sumOfAllBalances)` after a provably correct operation)
- The condition is mathematically unreachable given the contract's logic
- Used in test code, not production contracts

## Remediation
- Use `require()` for input validation and external call checks — it refunds remaining gas and accepts an error message
- Reserve `assert()` only for invariant checks that should never fail in a correct contract
- In Solidity >=0.8.4, prefer custom errors with `require` for gas-efficient error handling
```solidity
// Correct: require for input validation
function transfer(address to, uint256 amount) external {
    require(balances[msg.sender] >= amount, "insufficient balance");
    balances[msg.sender] -= amount;
    balances[to] += amount;
    // assert is appropriate here: totalSupply should never change during transfer
    assert(balances[msg.sender] + balances[to] == oldSum);
}
```
