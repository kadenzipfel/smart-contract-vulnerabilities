# Inadherence to Standards

## Preconditions
- Contract claims to implement a standard (ERC20, ERC721, ERC1155, etc.) but deviates from the specification
- OR: contract integrates external tokens assuming strict standard compliance without handling common deviations

## Vulnerable Pattern
```solidity
// Non-compliant ERC20: missing return value on transfer
// (matches USDT, BNB behavior — breaks callers that check return)
function transfer(address to, uint256 amount) external {
    balances[msg.sender] -= amount;
    balances[to] += amount;
    // Missing: return true;
    // Missing: emit Transfer(msg.sender, to, amount);
}

// Caller assumes strict compliance — breaks on non-compliant tokens
function depositToken(IERC20 token, uint256 amount) external {
    // Reverts on tokens that don't return bool (USDT)
    require(token.transfer(address(this), amount), "transfer failed");
    deposits[msg.sender] += amount;
    // Bug: doesn't account for fee-on-transfer tokens
    // Actual received amount may be less than `amount`
}
```

## Detection Heuristics
1. For token implementations: check that all required functions, return values, and events match the standard exactly (e.g., ERC20 requires `transfer` returns `bool` and emits `Transfer`)
2. For token integrations: check if `SafeERC20` is used for `transfer`/`transferFrom`/`approve` calls — raw IERC20 calls break on non-compliant tokens
3. Check for hardcoded assumptions: 18 decimals, no fee-on-transfer, no rebasing, no blocklists
4. For fee-on-transfer tokens: check if the contract uses balance-before/balance-after pattern to measure actual received amount
5. Check for missing `safeTransfer`/`safeTransferFrom` wrappers

## False Positives
- The contract explicitly documents that it only supports fully compliant ERC20 tokens and enforces this via a whitelist
- `SafeERC20` from OpenZeppelin is used, which handles missing return values
- The contract checks balance differences to account for fee-on-transfer

## Remediation
- For token implementations: strictly follow the standard — include all return values, events, and function signatures
- For token integrations: use OpenZeppelin's `SafeERC20` for all token interactions
- Use balance-before/balance-after pattern for fee-on-transfer support
- Don't hardcode decimals — read from the token contract
```solidity
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
using SafeERC20 for IERC20;

function depositToken(IERC20 token, uint256 amount) external {
    uint256 balBefore = token.balanceOf(address(this));
    token.safeTransferFrom(msg.sender, address(this), amount);
    uint256 received = token.balanceOf(address(this)) - balBefore;
    deposits[msg.sender] += received;
}
```
