## Signature Malleability

It's generally assumed that a valid signature cannot be modified without the private key and remain valid. However, it is possible to modify and signature and maintain validity. One example of a system which is vulnerable to signature malleability is one in which validation as to whether an action can be executed is determined based on whether the signature has been previously used.

```solidity
// UNSECURE
require(!signatureUsed[signature]);

// Validate signer and perform state modifying logic
...

signatureUsed[signature] = true;
```

In the above example, we can see that the `signature` is saved in a `signatureUsed` mapping after execution and validated to not exist in that mapping before execution. The problem with this is that if the `signature` can be modified while maintaining validity, the transaction can be repeated by an attacker.

### How it works

To understand how signature malleability works, we first need to understand a bit about elliptic curve cryptography. 

An elliptic curve consists of all the points that satisfy an equation of the form:

$y^2 = x^3 + ax + b$

where

$4a^3 + 27b^2 \not= 0$ (to avoid singular points)

Some examples:

![Elliptic Curves](./img/elliptic-curves.png)

Note that the curves are always symmetrical about the x-axis

The curve used by Ethereum is secp256k1, which looks like this:

![secp256k1](./img/secp256k1.png)

Now that we understand the basics of elliptic curve cryptography, we can dig into how signature malleability actually works on Ethereum. 

Ethereum uses [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) as its signature scheme. ECDSA signatures consist of a pair of numbers, $(r, s)$, with an integer order $n$. As a result of the x-axis symmetry, if $(r, s)$ is a valid signature, then so is $(r, -s$ mod $n)$. 

It's possible to calculate this complementary signature without knowing the private key used to produce it in the first place, which gives an attacker the ability to produce a second valid signature.

### Mitigation

To avoid this issue, it's imperative to recognize that validating that a signature is not reused is insufficient in enforcing that the transaction is not replayed.


### Sources

- [SWC-117](https://swcregistry.io/docs/SWC-117)
- [Bitcoin Transaction Malleability](https://eklitzke.org/bitcoin-transaction-malleability)
- [The Math Behind Elliptic Curve Cryptography](https://hackernoon.com/what-is-the-math-behind-elliptic-curve-cryptography-f61b25253da3)
