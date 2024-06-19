## Missing Protection against Signature Replay Attacks

Sometimes in smart contracts it is necessary to perform signature verification to improve usability and gas cost. However, consideration needs to be taken when implementing signature verification. To protect against Signature Replay Attacks, the contract should only be allowing new hashes to be processed. This prevents malicious users from replaying another users signature multiple times.

To be extra safe with signature verification, follow these recommendations:

- Store every message hash processed by the contract, then check messages hashes against the existing ones before executing the function.
- Include the address of the contract in the hash to ensure that the message is only used in a single contract.
- Never generate the message hash including the signature. See [Signature Malleability](./signature-malleability.md)

### Sources

- [SWC-121](https://swcregistry.io/docs/SWC-121)
- [Medium - Replay Attack Vulnerability in Ethereum Smart Contracts](https://medium.com/cypher-core/replay-attack-vulnerability-in-ethereum-smart-contracts-introduced-by-transferproxy-124bf3694e25)