## Floating Pragma

It is considered best practice to pick one compiler version and stick with it. With a floating pragma, contracts may accidentally be deployed using an outdated or problematic compiler version which can cause bugs, putting your smart contract's security in jeopardy. For open-source projects, the pragma also tells developers which version to use, should they deploy your contract. The chosen compiler version should be thoroughly tested and considered for known bugs. 

The exception in which it is acceptable to use a floating pragma, is in the case of libraries and packages. Otherwise, developers would need to manually update the pragma to compile locally.

### Sources

- [SWC-103](https://swcregistry.io/docs/SWC-103)
- [Consensys Smart Contract Best Practices - Locking Pragmas](https://consensys.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/locking-pragmas/)