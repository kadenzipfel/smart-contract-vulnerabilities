# DoS with (Unexpected) Revert

## Preconditions
- Critical contract logic depends on an external call succeeding
- A single revert in the external call blocks the entire function
- OR: strict equality checks on contract balance can be violated by force-sent ETH
- OR: division by zero is possible due to unvalidated denominators

## Vulnerable Pattern
```solidity
// Push-payment: one reverting recipient blocks all payments
function payAll() external {
    for (uint256 i = 0; i < recipients.length; i++) {
        // If ANY recipient reverts (e.g., contract with no receive()),
        // the entire function reverts — no one gets paid
        require(payable(recipients[i]).send(amounts[i]), "transfer failed");
    }
}

// Strict balance check broken by force-sent ETH
function withdraw() external {
    // Attacker sends ETH via selfdestruct, breaking this check
    require(address(this).balance == expectedBalance, "invariant");
    _processWithdrawal();
}

// Division by zero
function distribute(uint256 totalShares) external {
    // If totalShares == 0, this reverts and blocks the function
    uint256 perShare = totalRewards / totalShares;
}
```

## Detection Heuristics
1. Search for loops containing `require` or `assert` on external call results — one failure blocks all iterations
2. Search for push-payment patterns: contract iterating over recipients and sending ETH/tokens in one transaction
3. Search for strict balance equality checks (`address(this).balance ==`) — these can be broken by `selfdestruct` or coinbase rewards force-sending ETH
4. Search for division operations and check if the denominator can be zero
5. Check for `require(success)` after `.send()` or `.call()` inside loops — this turns a single recipient failure into a full DoS
6. Look for "highest bidder" or "king of the hill" patterns where the current leader's refund must succeed for a new leader to be set

## False Positives
- Pull-payment pattern is used (each recipient withdraws individually)
- The external call target is a trusted, known contract that will not revert
- Division denominator is guaranteed non-zero by prior checks or invariants
- Balance checks use `>=` instead of `==`
- The function handles individual failures gracefully (try/catch, continue on failure)

## Remediation
- Replace push-payment with pull-payment: let recipients withdraw individually
- Use `>=` instead of `==` for balance checks to tolerate force-sent ETH
- Validate all denominators before division: `require(totalShares > 0)`
- In loops, handle individual call failures without reverting the whole transaction
- Use try/catch for external calls where failure should not be fatal
```solidity
// Pull-payment pattern
mapping(address => uint256) public pendingWithdrawals;

function claimPayment() external {
    uint256 amount = pendingWithdrawals[msg.sender];
    require(amount > 0, "nothing to claim");
    pendingWithdrawals[msg.sender] = 0;
    (bool success,) = msg.sender.call{value: amount}("");
    require(success);
}
```
