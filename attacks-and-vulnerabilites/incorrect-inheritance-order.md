## Incorrect Inheritance Order

In Solidity, it is possible to inherit from multiple sources, which if not properly understood can introduce ambiguity. This ambiguity is known as the Diamond Problem, wherein if two base contracts have the same functon, which one should be prioritized? Luckily, Solidity handles this problem gracefully, that is as long as the developer understands the solution. 

The solution Solidity provides to the Diamond Problem is by using reverse C3 linearization. This means that it will linearize the inheritance from right to left, so the order of inheritance matters. It is suggested to start with more general contracts and end with more specific contracts to avoid problems.

### Sources

- https://consensys.github.io/smart-contract-best-practices/recommendations/#multiple-inheritance-caution
- https://solidity.readthedocs.io/en/v0.4.25/contracts.html#multiple-inheritance-and-linearization
- https://pdaian.com/blog/solidity-anti-patterns-fun-with-inheritance-dag-abuse/