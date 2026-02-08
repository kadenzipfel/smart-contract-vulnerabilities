# Reentrancy

## Preconditions
- Contract makes an external call (ETH transfer, token transfer, `.call()`, `.send()`, `.transfer()`, callback hook)
- State is modified after the external call, not before
- No reentrancy guard (`nonReentrant` modifier) on the function
- For cross-function: two or more functions share state, and at least one makes an external call before updating that shared state
- For cross-contract: Contract B reads Contract A's state, and A makes an external call before updating it
- For read-only: Contract A has a reentrancy guard but updates state after an external call; Contract B reads A's state without sharing the same lock

## Vulnerable Pattern
```solidity
// Single-function reentrancy
function withdraw() external {
    uint256 bal = balances[msg.sender];
    // External call BEFORE state update
    (bool success,) = msg.sender.call{value: bal}("");
    require(success);
    // State update AFTER external call — attacker reenters withdraw()
    // and balances[msg.sender] is still the original value
    balances[msg.sender] = 0;
}

// Hidden external calls that trigger callbacks:
// ERC721._safeMint() -> onERC721Received()
// ERC1155.safeTransferFrom() -> onERC1155Received()
// ERC777 token transfers -> tokensReceived() hook
```

## Detection Heuristics
1. Identify all external calls: `.call()`, `.send()`, `.transfer()`, token transfers, `_safeMint()`, `_safeTransfer()`, ERC777/ERC1155 safe transfers
2. For each external call, check if any state variable is written AFTER the call in the same function
3. If state is written after an external call, check if a `nonReentrant` guard is present on the function — flag if absent
4. Check for cross-function reentrancy: does the function share state with other functions that could be called during the reentrant window?
5. Check for cross-contract reentrancy: does any other contract read this contract's state that is stale during the external call?
6. Check for hidden callbacks: `_safeMint`, `_safeTransfer`, ERC777 hooks, ERC1155 hooks — these are external calls even though they don't look like `.call()`

## False Positives
- State is updated BEFORE the external call (checks-effects-interactions pattern correctly followed)
- `nonReentrant` modifier is applied to the function
- The external call target is a trusted, immutable contract (e.g., WETH) with no callback mechanism
- The function is `view`/`pure` and cannot modify state
- The only state read after reentry is already finalized (e.g., immutable variables)

## Remediation
- Apply the checks-effects-interactions pattern: perform all state changes before any external call
- Add OpenZeppelin's `ReentrancyGuard` with `nonReentrant` modifier to all functions that make external calls
- For cross-contract reentrancy, use a shared reentrancy lock across contracts or ensure state is finalized before external calls
```solidity
function withdraw() external nonReentrant {
    uint256 bal = balances[msg.sender];
    balances[msg.sender] = 0;  // State update BEFORE external call
    (bool success,) = msg.sender.call{value: bal}("");
    require(success);
}
```
