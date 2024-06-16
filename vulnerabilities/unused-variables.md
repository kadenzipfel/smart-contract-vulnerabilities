## Presence of Unused Variables

Although it is allowed, it is best practice to avoid unused variables. Unused variables can lead to a few different problems:

- Increase in computations (unnecessary gas consumption)
- Indication of bugs or malformed data structures
- Decreased code readability

It is highly recommended to remove all unused variables from a code base.

### Sources

- [SWC-131: Missing Protection Against Signature Replay Attacks](https://swcregistry.io/docs/SWC-131)
- [Solidity Issue #718](https://github.com/ethereum/solidity/issues/718)
- [Solidity Issue #2563](https://github.com/ethereum/solidity/issues/2563)