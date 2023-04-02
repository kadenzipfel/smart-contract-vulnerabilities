## Forcibly Sending Ether to a Contract

Occasionally, it is unwanted for users to be able to send Ether to a smart contract. Unfortunately for these circumstances, it's possible to bypass a contract fallback function and forcibly send Ether.

```
contract Vulnerable {
    function () payable {
        revert();
    }

    function somethingBad() {
        require(this.balance > 0);
        // Do something bad
    }
}
```

Though it seems like any transaction to the Vulnerable contract should be reverted, there are actually a couple ways to forcibly send Ether.

The first method is to call the `selfdestruct` method on a contract with the Vulnerable contract address set as the beneficiary. This works because `selfdestruct` will not trigger the fallback function.

Another method is to precompute a contract's address and send Ether to the address before the contract is even deployed. Surprisingly enough, this is possible.

Example from: https://consensys.github.io/smart-contract-best-practices/attacks/force-feeding/

### Sources
- https://consensys.github.io/smart-contract-best-practices/attacks/force-feeding/
