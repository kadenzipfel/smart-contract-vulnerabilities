## Incorrect Constructor Name

Before Solidity `0.4.22`, the only way to define a constructor was by creating a function with the contract name. In some cases this was problematic. For example, if a smart contract is re-used with a different name but the constructor function isn't also changed it simply becomes a regular, callable function.

Now with modern versions of Solidity, you can define the constructor with the `constructor` keyword, effectively deprecating this vulnerability. Thus the solution to this problem is simply to use modern Solidity compiler versions.

### Sources

- https://swcregistry.io/docs/SWC-118
- https://blog.sigmaprime.io/solidity-security.html#constructors