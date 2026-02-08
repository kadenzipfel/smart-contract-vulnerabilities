# msg.value Reuse in Loops

## Preconditions
- `msg.value` is referenced inside a loop (`for`, `while`) or in a function called multiple times within a single external call
- The contract has an existing ETH balance or the logic assumes `msg.value` is "spent" per iteration

## Vulnerable Pattern
```solidity
function batchBuy(uint256[] calldata ids) external payable {
    for (uint256 i = 0; i < ids.length; i++) {
        // msg.value is the SAME on every iteration — it never decreases
        // If price == 1 ETH and user sends 1 ETH, they can buy N items
        require(msg.value >= price, "insufficient payment");
        _mint(msg.sender, ids[i]);
    }
    // User paid 1 ETH but bought N items
}

// Payable multicall — same issue
function multicall(bytes[] calldata calls) external payable {
    for (uint256 i = 0; i < calls.length; i++) {
        // msg.value forwarded to each sub-call — reused each time
        (bool s,) = address(this).delegatecall(calls[i]);
        require(s);
    }
}
```

## Detection Heuristics
1. Search for `msg.value` usage inside `for`, `while`, or `do-while` loops
2. Search for `msg.value` in functions that are called via `delegatecall` in a loop (multicall patterns)
3. Check if `msg.value` is used in a `require` check inside a loop — passes on every iteration after a single payment
4. Search for internal functions that reference `msg.value` and are called multiple times from a payable external function
5. Check if the contract subtracts from a local tracking variable instead of relying on `msg.value` directly

## False Positives
- The function tracks remaining value in a local variable and decrements it per iteration (e.g., `remaining -= price`)
- `msg.value` is only referenced once outside any loop
- The loop is guaranteed to execute exactly once
- The function validates total cost against `msg.value` before the loop (e.g., `require(msg.value == price * ids.length)`)

## Remediation
- Track remaining ETH in a local variable and decrement per operation
- Validate total cost upfront: `require(msg.value == price * count)`
- In multicall patterns, ensure `msg.value` is consumed only once, or use a tracking variable
```solidity
function batchBuy(uint256[] calldata ids) external payable {
    uint256 totalCost = price * ids.length;
    require(msg.value >= totalCost, "insufficient payment");

    for (uint256 i = 0; i < ids.length; i++) {
        _mint(msg.sender, ids[i]);
    }

    // Refund excess
    if (msg.value > totalCost) {
        payable(msg.sender).transfer(msg.value - totalCost);
    }
}
```
