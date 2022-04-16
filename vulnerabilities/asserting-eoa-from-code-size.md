## Asserting EOA from Code Size

A common method for asserting whether a sender is a contract or EOA has been to check the code size of the sender. This check asserts that if the sender has a code size > 0 that it must be a contract and if not then it must be an EOA. For example:

```
function mint(uint256 amount) public {
  if (msg.sender.code.length != 0) revert CallerNotEOA();
}
```

However, it was recently discovered that this assertion is not valid, and can be exploited - [exploit](https://github.com/0xKitsune/Ghost-Contract). For this reason, it's important that your smart contract logic does not assert that a sender address is an EOA simply because the code size is 0.

### Sources

- https://github.com/0xKitsune/Ghost-Contract
