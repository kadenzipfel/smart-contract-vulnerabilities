# Lack of Precision

## Preconditions
- Contract performs integer arithmetic (division, fee calculations, reward distributions)
- Division is performed before multiplication, OR
- Numerators can be smaller than denominators (producing zero), OR
- No fixed-point scaling (WAD/RAY) is used for fractional calculations

## Vulnerable Pattern
```solidity
function calculateFee(uint256 amount, uint256 daysEarly) external view returns (uint256) {
    // Division BEFORE multiplication — truncates intermediate result
    uint256 dailyRate = amount / 365; // Loses precision
    uint256 fee = dailyRate * daysEarly; // Error compounds

    // Correct: amount * daysEarly / 365 (multiply first)
    return fee;
}

function distribute(uint256 reward, uint256 totalShares) external {
    for (uint256 i = 0; i < holders.length; i++) {
        // If reward < totalShares, this is always 0
        uint256 share = reward / totalShares * balances[holders[i]];
        _transfer(holders[i], share);
    }
}
```

## Detection Heuristics
1. Search for division operations (`/`) in arithmetic expressions
2. Check if division appears before multiplication in the same expression — this loses precision
3. Check if the numerator can be smaller than the denominator — the result truncates to zero
4. Look for fee, reward, interest, or share calculations without scaling factors (e.g., 1e18)
5. Check rounding direction: does truncation favor the protocol or the user? In fee/debt calculations, rounding should favor the protocol; in reward/credit calculations, it should favor the user

## False Positives
- Multiplication is performed before division in the correct order
- Fixed-point math libraries (WAD = 1e18, RAY = 1e27) are used to maintain precision
- The numerator is guaranteed to be larger than the denominator by prior validation
- The precision loss is intentionally accepted and documented (e.g., dust amounts)

## Remediation
- Always multiply before dividing: `amount * rate / divisor` instead of `amount / divisor * rate`
- Use fixed-point math with scaling factors (1e18 for WAD, 1e27 for RAY)
- Round in favor of the protocol for fees/debts, in favor of users for rewards/credits
- Use `mulDiv` from OpenZeppelin or PRBMath for safe full-precision multiplication then division
```solidity
// Correct: multiply first, then divide
uint256 fee = amount * daysEarly / 365;

// With scaling for precision
uint256 WAD = 1e18;
uint256 scaledRate = (amount * WAD) / totalSupply;
uint256 reward = (scaledRate * userBalance) / WAD;
```
