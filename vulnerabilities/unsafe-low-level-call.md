## Unsafe Low-Level Call

In Solidity, you can either use low-level calls such as: `address.call()`, `address.callcode()`, `address.delegatecall()`, and `address.send()`; or you can use contract calls such as: `ExternalContract.doSomething()`.

Low-level calls can be a good way to efficiently or arbitrarily make contract calls. However, it's important to be aware of the caveats it possesses. 

### Unchecked call return value

Low-level calls will never throw an exception, instead they will return `false` if they encounter an exception, whereas contract calls will automatically throw. Thus if the return value of a low-level call is not checked, the execution may resume even if the function call throws an error. This can lead to unexpected behaviour and break the program logic. A failed call can even be caused intentionally by an attacker, who may be able to further exploit the application.

In the case that you use low-level calls, be sure to check the return value to handle possible failed calls, e.g.:

```solidity
// Simple transfer of 1 ether
(bool success,) = to.call{value: 1 ether}("");
// Revert if unsuccessful
require(success);
```

### Successful call to non-existent contract

As noted in the [Solidity docs](https://docs.soliditylang.org/en/v0.8.15/control-structures.html?highlight=low%20level%20calls#external-function-calls): "Due to the fact that the EVM considers a call to a non-existing contract to always succeed, Solidity uses the `extcodesize` opcode to check that the contract that is about to be called actually exists (it contains code) and causes an exception if it does not. This check is skipped if the return data will be decoded after the call and thus the ABI decoder will catch the case of a non-existing contract.

Note that this check is not performed in case of [low-level calls](https://docs.soliditylang.org/en/v0.8.15/units-and-global-variables.html#address-related) which operate on addresses rather than contract instances."

It's imperative that we do not simply assume that a contract to be called via a low-level call actually exists, since if it doesn't our logic will proceed even though our external call effectively failed. This can lead to loss of funds and/or an invalid contract state. Instead, we must verify that the contract being called exists, either immediately before being called with an `extcodesize` check, or by verifying during contract deployment and using a `constant`/`immutable` value if the contract can be fully trusted.

```solidity
// Verify address is a contract
require(to.code.length > 0);
// Simple transfer of 1 ether
(bool success,) = to.call{value: 1 ether}("");
// Revert if unsuccessful
require(success);
```


### Sources

- [SWC-104: Record Replay](https://swcregistry.io/docs/SWC-104)
- [Consensys Smart Contract Best Practices - External Calls](https://consensys.github.io/smart-contract-best-practices/development-recommendations/general/external-calls/)
