## Unchecked Call Return Value

If the return value of a low-level call is not checked, the execution may resume even if the function call throws an error. This can lead to unexpected behaviour and break the program logic. A failed call can even be caused by an attacker, who may be able to further exploit the application.

In solidity, you can either use low-level calls such as: `address.call()`, `address.callcode()`, `address.delegatecall()`, and `address.send()`; or you can use contract calls such as: `ExternalContract.doSomething()`. Low-level calls will never throw an exception, instead they will return `false` if they encounter an exception, whereas contract calls will automatically throw.

In the case that you use low-level calls, be sure to check the return value to handle possible failed calls.

### Sources

https://swcregistry.io/docs/SWC-104
https://consensys.github.io/smart-contract-best-practices/recommendations/#handle-errors-in-external-calls