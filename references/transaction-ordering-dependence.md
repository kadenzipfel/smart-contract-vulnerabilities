# Transaction-Ordering Dependence (Frontrunning)

## Preconditions
- Transaction inputs are visible in the public mempool before block inclusion
- The outcome of the function depends on transaction ordering
- An attacker can profit by observing and front-running (or sandwiching) the victim's transaction

## Vulnerable Pattern
```solidity
// DEX swap without slippage protection
function swap(address tokenIn, address tokenOut, uint256 amountIn) external {
    // No minimum output amount — attacker sandwiches:
    // 1. Front-run: buy tokenOut (price goes up)
    // 2. Victim's swap executes at worse price
    // 3. Back-run: sell tokenOut (profit from price impact)
    uint256 amountOut = getAmountOut(amountIn);
    IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
    IERC20(tokenOut).transfer(msg.sender, amountOut);
}

// On-chain secret submission
function submitAnswer(bytes32 answer) external {
    // Answer visible in mempool — anyone can copy it
    require(keccak256(abi.encodePacked(answer)) == targetHash);
    _reward(msg.sender);
}

// ERC20 approval race condition
// User approves 100, wants to change to 50
// Attacker sees approve(50) in mempool, spends 100, then spends 50 = 150 total
```

## Detection Heuristics
1. Search for DEX/swap functions: check for slippage protection (`minAmountOut` parameter) and deadline parameters — flag if absent
2. Search for on-chain submissions of secrets, answers, or bids — these are observable in the mempool
3. Search for ERC20 `approve` patterns: check if the contract sets allowance to zero before setting a new value
4. Look for auction/bidding logic where observing others' bids provides an advantage
5. Identify any function where the order of execution matters and inputs are publicly visible before inclusion

## False Positives
- Transaction is submitted via a private mempool (Flashbots Protect, MEV Blocker)
- Commit-reveal scheme is used: commitment hash submitted first, reveal in a later block
- Slippage protection with `minAmountOut` and `deadline` parameters are present
- The function's outcome is order-independent (e.g., simple deposit into a vault at a fixed rate)

## Remediation
- For DEX operations: require `minAmountOut` and `deadline` parameters for slippage protection
- For secret submissions: use commit-reveal schemes (hash commitment first, reveal later)
- For ERC20 approvals: use `increaseAllowance`/`decreaseAllowance` or set to zero first
- Consider Flashbots or private transaction relays for MEV-sensitive operations
```solidity
function swap(
    address tokenIn, address tokenOut, uint256 amountIn,
    uint256 minAmountOut, // Slippage protection
    uint256 deadline       // Time protection
) external {
    require(block.timestamp <= deadline, "expired");
    uint256 amountOut = getAmountOut(amountIn);
    require(amountOut >= minAmountOut, "slippage");
    // ... execute swap
}
```
