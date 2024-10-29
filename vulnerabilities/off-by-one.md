## Off-By-One

Off-by-one errors are a common mistake made by programmers in which the intended boundaries are incorrect by only one, though these errors may seem insignificant, the effect can easily be quite severe. 

### Array lengths

Properly determining intended array lengths is a common source of off-by-one errors. Particularly since 0-indexing means the final value in an array is `array.length - 1`.

Consider for example a function intended to loop over a list of recipients to transfer funds to each user, but the loop length is incorrectly set.

```solidity
// Incorrectly sets upper bound to users.length - 1
// Final user in array doesn't receive token transfer
for (uint256 i; i < users.length - 1; ++i) {
	token.transfer(users[i], 1 ether);
}
```

### Incorrect comparison operator

It's common for comparison operators to be off by one when, e.g. `>` should be used in place of `>=`. This is especially common when the logic includes some kind of negation, leading to mental friction in deciphering the intended vs implemented bounds.

Consider for example a Defi protocol with liquidation logic documented to liquidate a user only if their collateralization ratio is *below* 1e18.

```solidity
// Incorrectly liquidates if collateralizationRatio is == 1 ether
if (collateralizationRatio > 1 ether) {
	...
} else {
	liquidate();
}
```

### Sources

- [OpenCoreCH - Smart Contract Auditing Heuristics: Off-by-One Errors](https://github.com/OpenCoreCH/smart-contract-auditing-heuristics#off-by-one-errors)