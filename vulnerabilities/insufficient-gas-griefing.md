## Insufficient Gas Griefing

Griefing is a type of attack often performed in video games, where a malicious user plays a game in an unintended way to bother other players, also known as trolling. This type of attack is also used to prevent transactions from being performed as intended.

This attack can be done on contracts which accept data and use it in a sub-call on another contract. This method is often used in multisignature wallets as well as transaction relayers. If the sub-call fails, either the whole transaction is reverted, or execution is continued.

Let's consider a simple relayer contract as an example. As shown below, the relayer contract allows someone to make and sign a transaction, without having to execute the transaction. Often this is used when a user can't pay for the gas associated with the transaction.

```
contract Relayer {
    mapping (bytes => bool) executed;

    function relay(bytes _data) public {
        // replay protection; do not call the same transaction twice
        require(executed[_data] == 0, "Duplicate call");
        executed[_data] = true;
        innerContract.call(bytes4(keccak256("execute(bytes)")), _data);
    }
}
```

The user who executes the transaction, the 'forwarder', can effectively censor transactions by using just enough gas so that the transaction executes, but not enough gas for the sub-call to succeed.

There are two ways this could be prevented. The first solution would be to only allow trusted users to relay transactions. The other solution is to require that the forwarder provides enough gas, as seen below.

```
// contract called by Relayer
contract Executor {
    function execute(bytes _data, uint _gasLimit) {
        require(gasleft() >= _gasLimit);
        ...
    }
}
```

### Sources

- https://consensys.github.io/smart-contract-best-practices/attacks/griefing/
- https://ethereum.stackexchange.com/questions/62829/what-does-griefing-mean
- https://ethereum.stackexchange.com/questions/73261/griefing-attacks-are-they-profitable-for-the-attacker
- https://en.wikipedia.org/wiki/Griefer
