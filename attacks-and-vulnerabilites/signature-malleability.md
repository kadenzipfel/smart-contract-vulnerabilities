## Signature Malleability

Often, people assume that the use of a cryptographic signature system in smart contracts verifies that signatures are unique, however, this isn't the case. Signatures in Ethereum can be altered without the private key and remain valid. For example, elliptic key cryptography consists of three variables: *v*, *r*, and *s* and if these values are modified in just the right way, you can obtain a valid signature with an invalid private key.

To avoid the problem of signature malleability, never use a signature in a signed message hash to check if previously signed messages have been processed by the contract because malicious users can find your signature and recreate it.

### Sources

https://swcregistry.io/docs/SWC-117
https://eklitzke.org/bitcoin-transaction-malleability
https://hackernoon.com/what-is-the-math-behind-elliptic-curve-cryptography-f61b25253da3