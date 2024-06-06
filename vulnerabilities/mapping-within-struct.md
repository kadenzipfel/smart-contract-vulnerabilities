# Deleting a mapping within a struct

It is a common assumption that deleting ``struct`` will delete all of it's data entirely but there is an exception. Deleting structs that contain dynamic data types does not delete the dynamic data. For example: If a ``mapping`` (or dynamic array) is inside a struct, and the struct is deleted, the mapping or array will not be deleted. The remaining data may be used to compromise the contract.

```solidity
    struct BalancesStruct{
        address owner;
        mapping(address => uint) balances;
    }

    mapping(address => BalancesStruct) public stackBalance;

    function remove() internal{
         delete stackBalance[msg.sender]; // doesn't delete balances mapping
    }
```
``remove()`` function above deletes an item of ``stackBalance``. The mapping ``balances`` is never deleted, so remove does not work as intended.


## Sources
- https://docs.soliditylang.org/en/latest/types.html#delete