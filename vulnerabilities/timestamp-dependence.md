## Timestamp Dependence

**NOTE: This vulnerability no longer affects Ethereum mainnet as of the Proof of Stake merge. [Read more](https://ethereum.stackexchange.com/a/140818)**

The timestamp of a block, accessed by `block.timestamp` or alias `now` can be manipulated by a miner. There are three considerations you should take into account when using a timestamp to execute a contract function.

### Timestamp Manipulation

If a timestamp is used in an attempt to generate randomness, a miner can post a timestamp within 15 seconds of block validation, giving them the ability to set the timestamp as a value that would increase their odds of benefitting from the function.

For example, a lottery application may use the block timestamp to pick a random bidder in a group. A miner may enter the lottery then modify the timestamp to a value that gives them better odds at winning the lottery.

Timestamps should thus not be used to create randomness. See [Weak Sources of Randomness for Chain Attributes](weak-sources-randomness.md).

### The 15-second Rule

Ethereum's reference specification, the Yellow Paper, doesn't specify a limit as to how much blocks can change in time, it just has to be bigger than the timestamp of its parent. This being said, popular protocol implementations reject blocks with timestamps greater than 15 seconds in the future, so as long as your time-dependent event can safely vary by 15 seconds, it may be safe to use a block timestamp.

### Don't use `block.number` as a timestamp

You can estimate the time difference between events using `block.number` and the average block time, but block times may change and break the functionality, so it's best to avoid this use.


### Sources

- [Consensys Smart Contract Best Practices - Timestamp Dependence (Attacks)](https://consensys.github.io/smart-contract-best-practices/attacks/timestamp-dependence/)
- [Consensys Smart Contract Best Practices - Timestamp Dependence (Development Recommendations)](https://consensys.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/timestamp-dependence/)
