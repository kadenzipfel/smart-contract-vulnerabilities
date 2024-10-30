## Deleting a Mapping Within a Struct

It is a common assumption that deleting a ``struct`` will delete all of it's data entirely but there is an exception. Deleting structs with dynamic data types does not delete the data stored inside them.

For example: If a ``mapping`` (or dynamic array) is inside a struct, and the struct is deleted, the mapping will not be deleted. This is because mappings are implemented as hash tables and the EVM does not keep track of which keys have been used in the mapping. As a result, EVM doesn't know how to reset a mapping and the remaining data can be used to compromise the contract. 

```solidity
    struct BalancesStruct{
        address owner;
        mapping(address => uint) balances;
    }

    mapping(address => BalancesStruct) public stackBalance;

    function remove() internal{
         delete stackBalance[msg.sender]; // doesn't delete balances mapping inside BalancesStruct
    }
```
``remove()`` function above deletes an item of ``stackBalance``. But the mapping ``balances`` inside ``BalancesStruct`` won't reset. Only individual keys and what they map to can be deleted. Example: ``delete stackBalance[msg.sender].balances[x]`` will delete the data stored at address ``x`` in the balances mapping.

### Sources

- [Solidity Documentation - Delete](https://docs.soliditylang.org/en/latest/types.html#delete)