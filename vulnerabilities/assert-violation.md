## Assert Violation

In Solidity `0.4.10`, the following functions were created: `assert()`, `require()`, and `revert()`. Here we'll discuss the assert function and how to use it.

Formally said, the `assert()` function is meant to assert invariants; informally said, `assert()` is an overly assertive bodyguard that protects your contract, but steals your gas in the process. Properly functioning contracts should never reach a failing assert statement. If you've reached a failing assert statement, you've either improperly used `assert()`, or there is a bug in your contract that puts it in an invalid state.

If the condition checked in the `assert()` is not actually an invariant, it's suggested that you replace it with a `require()` statement.

### Sources

- [SWC-110](https://swcregistry.io/docs/SWC-110)
- [The Use of revert, assert, and require in Solidity and the New REVERT Opcode in the EVM](https://medium.com/blockchannel/the-use-of-revert-assert-and-require-in-solidity-and-the-new-revert-opcode-in-the-evm-1a3a7990e06e)
