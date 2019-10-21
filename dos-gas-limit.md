## DoS with Block Gas Limit

In the Ethereum blockchain, the blocks all have a gas limit. One of the benefits of a block gas limit is that it prevents attackers from creating an infinite transaction loop, but if the gas usage of a transaction exceeds this limit, the transaction will fail. This can lead to a DoS attack in a couple different ways.

### Unbounded Operations

A situation in which the block gas limit can be an issue is in sending funds to an array of addresses. Even without any malicious intent, this can easily go wrong. Just by having too large an array of users to pay can max out the gas limit and prevent the transaction from ever succeeding. 

This situation can also lead to an attack. Say a bad actor decides to create a significant amount of addresses, with each address being paid a small amount of funds from the smart contract. If done effectively, the transaction can be blocked indefinitely, possibly even preventing further transactions from going through.

An effective solution to this problem would be to use a pull payment system over the current push payment system. To do this, separate each payment into it's own transaction, and have the recipient call the function.

If, for some reason, you really need to loop through an array of unspecified length, at least expect it to potentially take multiple blocks, and allow it to be performed in multiple transactions - as seen in this example:

```
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

Ethereum transactions require the sender to pay gas to disincentivize spam attacks, but in some situations, there can be enough incentive to go through with such an attack. For example, a block stuffing attack was used on a gambling Dapp, Fomo3D. The app had a countdown timer, and users could win a jackpot by being the last to purchase a key, except everytime a user bought a key, the timer would be extended. An attacker bought a key then stuffed the next 13 blocks and a row so they could win the jackpot.

To prevent such attacks from occuring, it's important to carefully consider whether it's safe to incorporate time-based actions in your application.

Example from: https://consensys.github.io/smart-contract-best-practices/known_attacks/

### Sources
https://consensys.github.io/smart-contract-best-practices/known_attacks/#dos-with-block-gas-limit
https://github.com/ethereum/wiki/wiki/Design-Rationale#gas-and-fees