## Function Default Visibility

Function visibility can be specified as either: public, private, internal, or external. It's important to consider which visibility is best for your smart contract function. 

Many smart contract attacks are caused by a developer forgetting or forgoing to use a visibility modifier. The function is then set as public by default, which can lead to unintended state changes.

### Sources

- https://swcregistry.io/docs/SWC-100
- https://consensys.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/visibility/
- https://github.com/sigp/solidity-security-blog#visibility
