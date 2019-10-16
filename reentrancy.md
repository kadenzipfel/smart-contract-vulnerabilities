## Reentrancy

Reentrancy is an attack that can occur when a bug in a contract function can allow a function interaction to proceed multiple times when it should otherwise be prohibited. This can be used to drain funds from a smart contract if used maliciously. In fact, reentrancy was the attack vector used in the DAO hack.

### Single function reentrancy

A single function reentrancy attack occurs when a vulnerable function is the same function that an attacker is trying to recursively call.

```
// INSECURE
function withdraw() external {
    uint256 amount = balances[msg.sender];
    require(msg.sender.call.value(amount)());
    balances[msg.sender] = 0;
}
```

Here we can see that the balance is only modified after the funds have been transferred. This can allow a hacker to call the function many times before the balance is set to 0, effectively draining the smart contract.

### Cross-function reentrancy

A cross-function reentrancy attack is a more complex version of the same process. Cross-function reentrancy occurs when a vulnerable function shares state with a function that an attacker can exploit.

```
// INSECURE
function transfer(address to, uint amount) external {
  if (balances[msg.sender] >= amount) {
    balances[to] += amount;
    balances[msg.sender] -= amount;
  }
}

function withdraw() external {
  uint256 amount = balances[msg.sender];
  require(msg.sender.call.value(amount)());
  balances[msg.sender] = 0;
}
```

In this example, a hacker can exploit this contract by having a fallback function call `transfer()` to transfer spent funds before the balance is set to 0 in the `withdraw()` function.

### Reentrancy prevention

When transfering funds in a smart contract, use `send` or `transfer` instead of `call`. The problem with using `call` is that unlike the other functions, it doesn't have a gas limit of 2300. This means that `call` can be used in external function calls which can be used to perform reentrancy attacks.

Another solid prevention method is to **mark untrusted functions**. 

```
function untrustedWithdraw() public {
  uint256 amount = balances[msg.sender];
  require(msg.sender.call.value(amount)());
  balances[msg.sender] = 0;
}
```

In addition, for optimum security use the **checks-effects-interactions pattern**. This is a simple rule of thumb for ordering smart contract functions.

The function should begin with *checks*, e.g. `require` and `assert` statements.

Next, the *effects* of the contract should be performed, i.e. state modifications.

Finally, we can perform *interactions* with other smart contracts, e.g. external function calls.

This structure is effective against reentrancy because the modified state of the contract will prevent bad actors from performing malicious interactions.

```
function withdraw() external {
  uint256 amount = balances[msg.sender];
  balances[msg.sender] = 0;
  require(msg.sender.call.value(amount)());
}
```

Since the balance is set to 0 before any interactions are performed, if the contract is called recursively, there is nothing to send after the first transaction.


Examples from: https://medium.com/coinmonks/protect-your-solidity-smart-contracts-from-reentrancy-attacks-9972c3af7c21


### Sources

https://consensys.github.io/smart-contract-best-practices/known_attacks/
https://medium.com/@gus_tavo_guim/reentrancy-attack-on-smart-contracts-how-to-identify-the-exploitable-and-an-example-of-an-attack-4470a2d8dfe4
https://medium.com/coinmonks/protect-your-solidity-smart-contracts-from-reentrancy-attacks-9972c3af7c21