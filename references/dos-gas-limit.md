# DoS with Block Gas Limit

## Preconditions
- Contract iterates over a dynamic array or mapping whose size can grow unboundedly
- The iteration must complete in a single transaction (no batching/pagination)
- OR: time-sensitive logic where block stuffing by an attacker can delay transaction inclusion

## Vulnerable Pattern
```solidity
address[] public recipients;

function addRecipient(address r) external {
    recipients.push(r); // Array grows without bound
}

// Push-payment: one tx must process all recipients
function distributeRewards() external {
    for (uint256 i = 0; i < recipients.length; i++) {
        // When recipients.length grows large enough,
        // this loop exceeds block gas limit and ALWAYS reverts
        payable(recipients[i]).transfer(reward);
    }
}
```

## Detection Heuristics
1. Identify all loops (`for`, `while`) in the codebase
2. For each loop, check if the iteration count depends on a dynamic array or storage structure that can grow over time
3. If the loop is unbounded and must complete in a single transaction, flag it — it will eventually exceed the block gas limit
4. Check if the function supports batching or pagination (e.g., `startIndex`, `batchSize` parameters) — if not, flag it
5. For time-sensitive functions (auctions, deadlines, liquidations), check if an attacker could stuff blocks with high-gas transactions to delay inclusion

## False Positives
- Loop iterates over a fixed-size or bounded array (e.g., `uint256[10]`, array with a capped `maxLength`)
- Function supports paginated/batched execution across multiple transactions
- Loop iteration count is controlled by the caller (e.g., batch size parameter with reasonable max)
- The array is admin-only appendable and has a practical maximum

## Remediation
- Replace push-payment (contract sends to all) with pull-payment (recipients withdraw individually)
- If iteration is unavoidable, add batching/pagination with `startIndex` and `batchSize` parameters
- Cap array sizes with a maximum length check on push operations
- For time-sensitive logic, avoid designs where block stuffing can be profitable
```solidity
// Pull-payment pattern
mapping(address => uint256) public pendingWithdrawals;

function claimReward() external {
    uint256 amount = pendingWithdrawals[msg.sender];
    pendingWithdrawals[msg.sender] = 0;
    payable(msg.sender).transfer(amount);
}
```
