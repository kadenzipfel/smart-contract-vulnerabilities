# Smart Contract Vulnerabilities

A collection of smart contract vulnerabilities along with prevention methods

### Access Control

- [Authorization Through tx.origin](./vulnerabilities/authorization-txorigin.md)
- [Insufficient Access Control](./vulnerabilities/insufficient-access-control.md)
- [Delegatecall to Untrusted Callee](./vulnerabilities/delegatecall-untrusted-callee.md)
- [Signature Malleability](./vulnerabilities/signature-malleability.md)
- [Missing Protection against Signature Replay Attacks](./vulnerabilities/missing-protection-signature-replay.md)

### Math

- [Integer Overflow and Underflow](./vulnerabilities/overflow-underflow.md)
- [Off-By-One](./vulnerabilities/off-by-one.md)
- [Lack of Precision](./vulnerabilities/lack-of-precision.md)

### Control Flow

- [Reentrancy](./vulnerabilities/reentrancy.md)
- [DoS with Block Gas Limit](./vulnerabilities/dos-gas-limit.md)
- [DoS with (Unexpected) revert](./vulnerabilities/dos-revert.md)
- [Using `msg.value` in a Loop](./vulnerabilities/msgvalue-loop.md)
- [Transaction-Ordering Dependence](./vulnerabilities/transaction-ordering-dependence.md)
- [Insufficient Gas Griefing](./vulnerabilities/insufficient-gas-griefing.md)

### Data Handling

- [Unchecked Return Value](./vulnerabilities/unchecked-return-values.md)
- [Write to Arbitrary Storage Location](./vulnerabilities/arbitrary-storage-location.md)
- [Unbounded Return Data](./vulnerabilities/unbounded-return-data.md)
- [Uninitialized Storage Pointer](./vulnerabilities/uninitialized-storage-pointer.md)
- [Unexpected `ecrecover` null address](./vulnerabilities/unexpected-ecrecover-null-address.md)

### Unsafe Logic

- [Weak Sources of Randomness from Chain Attributes](./vulnerabilities/weak-sources-randomness.md)
- [Hash Collision when using abi.encodePacked() with Multiple Variable-Length Arguments](./vulnerabilities/hash-collision.md)
- [Timestamp Dependence](./vulnerabilities/timestamp-dependence.md)
- [Unsafe Low-Level Call](./vulnerabilities/unsafe-low-level-call.md)
- [Unsupported Opcodes](./vulnerabilities/unsupported-opcodes.md)
- [Unencrypted Private Data On-Chain](./vulnerabilities/unencrypted-private-data-on-chain.md)
- [Asserting Contract from Code Size](./vulnerabilities/asserting-contract-from-code-size.md)

### Code Quality

- [Floating Pragma](./vulnerabilities/floating-pragma.md)
- [Outdated Compiler Version](./vulnerabilities/outdated-compiler-version.md)
- [Use of Deprecated Functions](./vulnerabilities/use-of-deprecated-functions.md)
- [Incorrect Constructor Name](./vulnerabilities/incorrect-constructor.md)
- [Shadowing State Variables](./vulnerabilities/shadowing-state-variables.md)
- [Incorrect Inheritance Order](./vulnerabilities/incorrect-inheritance-order.md)
- [Presence of Unused Variables](./vulnerabilities/unused-variables.md)
- [Default Visibility](./vulnerabilities/default-visibility.md)
- [Inadherence to Standards](./vulnerabilities/inadherence-to-standards.md)
- [Assert Violation](./vulnerabilities/assert-violation.md)
- [Requirement Violation](./vulnerabilities/requirement-violation.md)
