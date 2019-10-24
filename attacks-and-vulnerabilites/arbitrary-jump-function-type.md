## Arbitrary Jump with Function Type Variable

Function types are supported in Solidity. This means that a variable of type function can be assigned to a function with a matching signature. The function can then be called from the variable just like any other function. Users should not be able to change the function variable, but in some cases this is possible.

If the smart contract uses certain assembly instructions, `mstore` for example, an attacker may be able to point the function variable to any other function. This may give the attacker the ability to break the functionality of the contract, and perhaps even drain the contract funds.

Since inline assembly is a way to access the EVM at a low level, it bypasses many important safety features. So it's important to only use assembly if it is necessary and properly understood.

### Sources

- https://swcregistry.io/docs/SWC-127
- https://medium.com/authio/solidity-ctf-part-2-safe-execution-ad6ded20e042
- https://solidity.readthedocs.io/en/v0.5.12/assembly.html
- https://solidity.readthedocs.io/en/v0.4.25/types.html#function-types