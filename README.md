# Smart Contract Attack Vectors

The goal of this repository is to create the most clear and concise collection of smart contract attack vectors, to improve overall ecosystem security.

## Attacks

- [Front-Running AKA Transaction-Ordering Dependence](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/attacks/front-running.md)
- [Authorization Through tx.origin](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/attacks/authorization-txorigin.md)
- [DoS with Block Gas Limit](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/attacks/dos-gas-limit.md)
- [DoS with (Unexpected) revert](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/attacks/dos-revert.md)
- [Forcibly Sending Ether to a Smart Contract](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/attacks/forcibly-sending-ether.md)
- [Insufficient Gas Griefing](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/attacks/insufficient-gas-griefing.md)
- [Reentrancy](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/attacks/reentrancy.md)

## Vulnerabilities

- [Integer Overflow and Underflow](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/overflow-underflow.md)
- [Timestamp Dependence](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/timestamp-dependence.md)
- [Floating Pragma](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/floating-pragma.md)
- [Function Default Visibility](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/function-default-visibility.md)
- [Outdated Compiler Version](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/outdated-compiler-version.md)
- [Unchecked Call Return Value](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/unchecked-call-return-value.md)
- [Unprotected Ether Withdrawal](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/unprotected-ether-withdrawal.md)
- [Unprotected Selfdestruct Instruction](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/unprotected-selfdestruct.md)
- [State Variable Default Visibility](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/state-variable-default-visibility.md)
- [Uninitialized Storage Pointer](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/uninitialized-storage-pointer.md)
- [Assert Violation](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/assert-violation.md)
- [Use of Deprecated Functions](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/use-of-deprecated-functions.md)
- [Delegatecall to Untrusted Callee](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/delegatecall-untrusted-callee.md)
- [Signature Malleability](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/signature-malleability.md)
- [Incorrect Constructor Name](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/incorrect-constructor.md)
- [Shadowing State Variables](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/shadowing-state-variables.md)
- [Weak Sources of Randomness from Chain Attributes](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/weak-sources-randomness.md)
- [Missing Protection against Signature Replay Attacks](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/missing-protection-signature-replay.md)
- [Requirement Validation](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/requirement-violation.md)
- [Write to Arbitrary Storage Location](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/arbitrary-storage-location.md)
- [Incorrect Inheritance Order](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/incorrect-inheritance-order.md)
- [Arbitrary Jump with Function Type Variable](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/arbitrary-jump-function-type.md)
- [Presence of Unused Variables](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/unused-variables.md)
- [Unexpected Ether Balance](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/unexpected-ether-balance.md)
- [Unencrypted Secrets](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/unencrypted-secrets.md)
- [Faulty Contract Detection](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/faulty-contract-detection.md)
- [Unclogged Blockchain Reliance](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/unclogged-blockchain-reliance.md)
- [Inadherence to Standards](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/inadherence-to-standards.md)

## Further Reading

- https://github.com/ethereum/wiki/wiki/Safety
- https://swcregistry.io/
- https://eprint.iacr.org/2016/1007.pdf
- https://www.dasp.co/
- https://consensys.github.io/smart-contract-best-practices/
- https://github.com/sigp/solidity-security-blog

## Contributions

If you notice any mistakes, typos or missing attacks/vulnerabilities, please feel free to open an issue or pull request. All contributions are very much appreciated. 