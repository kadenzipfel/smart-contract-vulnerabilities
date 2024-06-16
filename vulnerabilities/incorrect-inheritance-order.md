## Incorrect Inheritance Order

In Solidity, it is possible to inherit from multiple sources, which if not properly understood can introduce ambiguity. This ambiguity is known as the Diamond Problem, wherein if two base contracts have the same function, which one should be prioritized? Luckily, Solidity handles this problem gracefully, that is as long as the developer understands the solution. 

The solution Solidity provides to the Diamond Problem is by using reverse C3 linearization. This means that it will linearize the inheritance from right to left, so the order of inheritance matters. It is suggested to start with more general contracts and end with more specific contracts to avoid problems.

### Sources

- [Consensys: Smart Contract Best Practices - Complex Inheritance](https://consensys.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/complex-inheritance/)
- [Solidity Documentation: Multiple Inheritance and Linearization](https://solidity.readthedocs.io/en/v0.4.25/contracts.html#multiple-inheritance-and-linearization)
- [Wikipedia: The Diamond Problem](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem)
- [Wikipedia: C3 Linearization](https://en.wikipedia.org/wiki/C3_linearization)
