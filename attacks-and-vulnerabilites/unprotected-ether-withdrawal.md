## Unprotected Ether Withdrawal

Without adequate access controls, bad actors may be able to withdraw some or all Ether from a contract. This can be caused by misnaming a function intended to be a contructor, giving anyone access to re-initialize the contract. To avoid this vulnerability, only allow withdrawals to be triggered by those authorized, or as intended, and name your constructor appropriately.

### Sources

- https://swcregistry.io/docs/SWC-105
- https://etherscan.io/address/0xe82719202e5965Cf5D9B6673B7503a3b92DE20be#code