# Timestamp Dependence

## Preconditions
- Contract uses `block.timestamp` (or the deprecated `now` alias) for security-sensitive logic
- The outcome of that logic can be influenced by a timestamp shift within the manipulation window (~15s on PoW chains, slot-fixed on PoS Ethereum but variable on L2s/sidechains)
- OR: `block.number` is used as a proxy for elapsed time

## Vulnerable Pattern
```solidity
// Timestamp as sole randomness source
function roll() external {
    // Validator can manipulate block.timestamp to bias outcome
    uint256 result = uint256(keccak256(abi.encodePacked(block.timestamp))) % 6;
    if (result == 0) {
        _payWinner(msg.sender);
    }
}

// Tight time window vulnerable to manipulation
function claimBonus() external {
    // 15-second window — validator can push timestamp to include/exclude
    require(block.timestamp >= deadline && block.timestamp <= deadline + 15);
    _sendBonus(msg.sender);
}
```

## Detection Heuristics
1. Search for `block.timestamp` and `now` (deprecated alias) usage
2. If used for randomness (e.g., fed into `keccak256` for a random value), flag immediately — this is always exploitable
3. If used in conditional logic, check the time window: can a ~15-second manipulation affect the outcome?
4. Search for `block.number` used as a time proxy (e.g., `block.number * 12` for seconds) — flag as fragile since block times change
5. For L2/sidechain deployments, check chain-specific timestamp guarantees — some have weaker constraints than mainnet PoS

## False Positives
- `block.timestamp` used only for logging or non-critical display purposes
- Time windows are large enough (hours/days) that a 15-second manipulation is irrelevant
- On PoS Ethereum mainnet, timestamps are fixed per 12-second slots — validator manipulation is constrained to slot boundaries, not arbitrary values
- `block.timestamp` used with a commit-reveal scheme where the timestamp alone doesn't determine the outcome

## Remediation
- Never use `block.timestamp` for randomness — use Chainlink VRF or another verifiable randomness oracle
- For time-dependent logic, ensure the acceptable window is significantly larger than the manipulation range
- Avoid `block.number` as a time proxy; use `block.timestamp` with appropriate tolerance
- On L2s/sidechains, verify chain-specific timestamp constraints before relying on `block.timestamp`
```solidity
// Safe: large time window where 15s manipulation is irrelevant
require(block.timestamp >= vestingEnd, "still vesting");
// vestingEnd is months/years away — manipulation doesn't matter
```
