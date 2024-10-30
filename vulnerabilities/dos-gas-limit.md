## DoS with Block Gas Limit

One of the primary benefits of a block gas limit is that it prevents attackers from creating an infinite transaction loop. If the gas usage of a transaction exceeds this limit, the transaction will fail. However, along with this benefit comes a side effect which is important to understand.

### Unbounded Operations

An example in which the block gas limit can be an issue is in executing logic in an unbounded loop. Even without any malicious intent, this can easily go wrong. Just by e.g., having too large an array of users to send funds to can exceed the gas limit and prevent the transaction from ever succeeding, potentially permanently locking up funds.

This situation can also lead to an attack. Say a bad actor decides to create a significant amount of addresses, with each address being paid a small amount of funds from the smart contract. If done effectively, the transaction can be blocked indefinitely, possibly even preventing further transactions from going through.

An effective solution to this problem would be to use a pull payment system over the above push payment system. To do this, separate each payment into its own transaction, and have the recipient call the function.

If, for some reason, you really need to loop through an array of unspecified length, at least expect it to potentially take multiple blocks, and allow it to be performed in multiple transactions - as seen in this example:

```solidity
struct Payee {
    address addr;
    uint256 value;
}

Payee[] payees;
uint256 nextPayeeIndex;

function payOut() {
    uint256 i = nextPayeeIndex;
    while (i < payees.length && msg.gas > 200000) {
      payees[i].addr.send(payees[i].value);
      i++;
    }
    nextPayeeIndex = i;
}
```

### Block Stuffing

In some situations, your contract can be attacked with a block gas limit even if you don't loop through an array of unspecified length. An attacker can fill several blocks before a transaction can be processed by using a sufficiently high gas price.

This attack is done by issuing several transactions at a very high gas price. If the gas price is high enough, and the transactions consume enough gas, they can fill entire blocks and prevent other transactions from being processed. 

Ethereum transactions require the sender to pay gas to disincentivize spam attacks, but in some situations, there can be enough incentive to go through with such an attack. For example, a block stuffing attack was used on a gambling Dapp, Fomo3D. The app had a countdown timer, and users could win a jackpot by being the last to purchase a key, except every time a user bought a key, the timer would be extended. An attacker bought a key then stuffed the next 13 blocks in a row so they could win the jackpot.

To prevent such attacks from occurring, it's important to carefully consider whether it's safe to incorporate time-based actions in your application.

Example from: [https://consensys.github.io/smart-contract-best-practices/attacks/denial-of-service/](https://consensys.github.io/smart-contract-best-practices/attacks/denial-of-service/)

### Sources

- [Consensys Smart Contract Best Practices - Denial of Service](https://consensys.github.io/smart-contract-best-practices/attacks/denial-of-service/)
- [Ethereum Developers Documentation - Gas](https://ethereum.org/en/developers/docs/gas/)
