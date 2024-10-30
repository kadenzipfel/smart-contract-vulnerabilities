## Requirement Violation

The `require()` method is meant to validate conditions, such as inputs or contract state variables, or to validate return values from external contract calls. For validating external calls, inputs can be provided by callers, or they can be returned by callees. In the case that an input violation has occurred by the return value of a callee, likely one of two things has gone wrong:

- There is a bug in the contract that provided the input.
- The requirement condition is too strong.

To solve this issue, first consider whether the requirement condition is too strong. If necessary, weaken it to allow any valid external input. If the problem isn't the requirement condition, there must be a bug in the contract providing external input. Ensure that this contract is not providing invalid inputs.

### Sources

- [SWC-123: Requirement Violation (SWC Registry)](https://swcregistry.io/docs/SWC-123)
- [The Use of revert, assert, and require in Solidity, and the New REVERT Opcode in the EVM](https://medium.com/blockchannel/the-use-of-revert-assert-and-require-in-solidity-and-the-new-revert-opcode-in-the-evm-1a3a7990e06e)
