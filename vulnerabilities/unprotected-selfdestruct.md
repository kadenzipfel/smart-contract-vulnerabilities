## Unprotected Selfdestruct Instruction

In contracts that have a `selfdestruct` method, if there are missing or insufficient access controls, malicious actors can self-destruct the contract. It's important to consider whether self-destruct functionality is absolutely necessary. If it is necessary, consider using a multisig authorization to prevent an attack. 

This attack was used in the [Parity Attack](https://www.parity.io/a-postmortem-on-the-parity-multi-sig-library-self-destruct/). An anonymous user located, and exploited a vulnerability in the "library" smart contract, making themself the contract owner. The attacker then proceeded to self-destruct the contract. This led to funds being blocked in 587 unique wallets, holding a total of 513,774.16 Ether.

### Sources

https://swcregistry.io/docs/SWC-106
https://www.parity.io/a-postmortem-on-the-parity-multi-sig-library-self-destruct/