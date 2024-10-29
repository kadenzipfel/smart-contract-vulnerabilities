## Lack of Precision

In Solidity, there are a limited variety of number types. Differently from many programming languages, floating point numbers are unsupported. Fixed point numbers are partially supported, but cannot be assigned to or from. The primary number type in Solidity are integers, of which resulting values of calculations are always rounded down.

Since division often results in a remainder, performing division with integers generally requires a lack of precision to some degree. To see how a lack of precision may cause a serious flaw, consider the following example in which we charge a fee for early withdrawals denominated in the number of days early that the withdrawal is made:

```solidity
uint256 daysEarly = withdrawalsOpenTimestamp - block.timestamp / 1 days
uint256 fee = amount / daysEarly * dailyFee
```

The problem with this is that in the case that a user withdraws 1.99 days early, since 1.99 will round down to 1, the user only pays about half the intended fee.

In general, we should ensure that numerators are sufficiently larger than denominators to avoid precision errors. A common solution to this problem is to use fixed point logic, i.e. raising integers to a sufficient number of decimals such that the lack of precision has minimal effect on the contract logic. A good rule of thumb is to raise numbers to 1e18 (commonly referred to as WAD).