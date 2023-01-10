# Smart Contract Attack Vectors

The goal of this repository is to create the most clear and concise collection of smart contract attack vectors, to improve overall ecosystem security.

## Attacks

- [DoS with Block Gas Limit](/attacks/dos-gas-limit.md)
- [DoS with (Unexpected) revert](/attacks/dos-revert.md)
- [Forcibly Sending Ether to a Smart Contract](/attacks/forcibly-sending-ether.md)
- [Insufficient Gas Griefing](/attacks/insufficient-gas-griefing.md)
- [Reentrancy](/attacks/reentrancy.md)
- [Honeypot](/attacks/honeypot.md)

## Vulnerabilities

- [Integer Overflow and Underflow](/vulnerabilities/overflow-underflow.md)
- [Timestamp Dependence](/vulnerabilities/timestamp-dependence.md)
- [Authorization Through tx.origin](/vulnerabilities/authorization-txorigin.md)
- [Floating Pragma](/vulnerabilities/floating-pragma.md)
- [Function Default Visibility](/vulnerabilities/function-default-visibility.md)
- [Outdated Compiler Version](/vulnerabilities/outdated-compiler-version.md)
- [Unchecked Call Return Value](/vulnerabilities/unchecked-call-return-value.md)
- [Unprotected Ether Withdrawal](/vulnerabilities/unprotected-ether-withdrawal.md)
- [Unprotected Selfdestruct Instruction](/vulnerabilities/unprotected-selfdestruct.md)
- [State Variable Default Visibility](/vulnerabilities/state-variable-default-visibility.md)
- [Uninitialized Storage Pointer](/vulnerabilities/uninitialized-storage-pointer.md)
- [Assert Violation](/vulnerabilities/assert-violation.md)
- [Use of Deprecated Functions](/vulnerabilities/use-of-deprecated-functions.md)
- [Delegatecall to Untrusted Callee](/vulnerabilities/delegatecall-untrusted-callee.md)
- [Signature Malleability](/vulnerabilities/signature-malleability.md)
- [Incorrect Constructor Name](/vulnerabilities/incorrect-constructor.md)
- [Shadowing State Variables](/vulnerabilities/shadowing-state-variables.md)
- [Weak Sources of Randomness from Chain Attributes](/vulnerabilities/weak-sources-randomness.md)
- [Missing Protection against Signature Replay Attacks](/vulnerabilities/missing-protection-signature-replay.md)
- [Requirement Validation](/vulnerabilities/requirement-violation.md)
- [Write to Arbitrary Storage Location](/vulnerabilities/arbitrary-storage-location.md)
- [Incorrect Inheritance Order](/vulnerabilities/incorrect-inheritance-order.md)
- [Arbitrary Jump with Function Type Variable](/vulnerabilities/arbitrary-jump-function-type.md)
- [Presence of Unused Variables](/vulnerabilities/unused-variables.md)
- [Unexpected Ether Balance](/vulnerabilities/unexpected-ether-balance.md)
- [Unencrypted Secrets](/vulnerabilities/unencrypted-secrets.md)
- [Faulty Contract Detection](/vulnerabilities/faulty-contract-detection.md)
- [Unclogged Blockchain Reliance](/vulnerabilities/unclogged-blockchain-reliance.md)
- [Inadherence to Standards](/vulnerabilities/inadherence-to-standards.md)
- [Unprotected Callback](/vulnerabilities/unprotected-callback.md)
- [Asserting EOA from Code Size](/vulnerabilities/asserting-eoa-from-code-size.md)
- [Transaction-Ordering Dependence](/vulnerabilities/trnasaction-ordering-dependence.md)

## Further Reading

- https://github.com/ethereum/wiki/wiki/Safety
- https://swcregistry.io/
- https://eprint.iacr.org/2016/1007.pdf
- https://www.dasp.co/
- https://consensys.github.io/smart-contract-best-practices/
- https://github.com/sigp/solidity-security-blog
- https://solidity.readthedocs.io/en/latest/bugs.html

## Contributions

If you notice any mistakes, typos or missing attacks/vulnerabilities, please feel free to open an issue or pull request. All contributions are very much appreciated.

Special thanks to [RobertMCForster](https://github.com/RobertMCForster) for many excellent contributions.
