## Weak Sources of Randomness from Chain Attributes

Using chain attributes for randomness, e.g.: `block.timestamp`, `blockhash`, and `block.difficulty` can seem like a good idea since they often produce pseudo-random values. The problem however, is that Ethereum is entirely deterministic and all available on-chain data is public. Chain attributes can either be predicted or manipulated, and should thus never be used for random number generation.

A common solution is to use an oracle solution such as [Chainlink VRF](https://docs.chain.link/vrf/v2/introduction/).

### Sources

- https://swcregistry.io/docs/SWC-120
- https://ethereum.stackexchange.com/questions/419/when-can-blockhash-be-safely-used-for-a-random-number-when-would-it-be-unsafe
- https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract
- https://fravoll.github.io/solidity-patterns/randomness.html