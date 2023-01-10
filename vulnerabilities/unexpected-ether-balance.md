## Unexpected Ether Balance

Since it is always possible to send Ether to a contract, see [Forcibly Sending Ether to a Smart Contract](/attacks/forcibly-sending-ether.md), if a contract assumes a specific balance, it is vulnerable to attack.

Say we have a contract that prevents all functions from executing if there is any Ether stored in the contract. If a malicious user decides to exploit this by forcibly sending Ether, they will cause a DoS, rendering the contract unusable. For this reason, it's important to never use strict equality checks for the balance of Ether in a contract.

### Sources

- https://swcregistry.io/docs/SWC-132
- https://consensys.github.io/smart-contract-best-practices/attacks/denial-of-service/
- https://blog.sigmaprime.io/solidity-security.html#ether
- https://medium.com/@nmcl/gridlock-a-smart-contract-bug-73b8310608a9
