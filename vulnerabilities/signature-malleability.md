## Signature Malleability

It's generally assumed that a valid signature cannot be modified without the private key and remain valid. However, in some cases it is possible to modify the signature and maintain validity. One example of a system which can allow for a signature to be modified and remain valid is one in which the signature is included in a signed message hash which is used to prevent replays, e.g.

```
// UNSECURE
bytes32 txid = keccak256(abi.encodePacked(getTransferHash(_to, _value, _gasPrice, _nonce), _signature));
require(!signatureUsed[txid]);

address from = recoverTransferPreSigned(_signature, _to, _value, _gasPrice, _nonce);

// Modify important state of signing account
...

signatureUsed[txid] = true;
```

In the above example, we can see that the `txid` is saved in a `signatureUsed` mapping after execution and validated to not exist in that mapping before execution. The problem with this is that if the resulting `txid` can be modified while maintaining valid inputs and a valid signature, the transaction can be repeated by an attacker.

### How it works

To understand how signature malleability works, we first need to understand a bit about elliptic curve cryptography. 

An elliptic curve consists of all the points that satisfy an equation of the form:

$y^2 = x^3 + ax + b$

where

$4a^3 + 27b^2 \not= 0$ (to avoid singular points)

Some examples:

![Elliptic Curves](./img/elliptic-curves.png)

Note that the curves are always symmetrical about the x-axis

The curve used by Ethereum is secp256k1, which looks like:
![secp256k1](./img/secp256k1.png)

Now that we understand the basics of elliptic curve cryptography, we can dig into how signature malleability actually works on Ethereum. 

Ethereum uses [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) as it's signature scheme. ECDSA signatures consist of a pair of numbers, $(r, s)$, with an integer order $n$. As a result of the x-axis symmetry, if $(r, s)$ is a valid signature, then so is $(r, -s$ mod $n)$. 

It's possible to calculate this complementary signature without knowing the private key used to produce it in the first place, which gives an attacker the ability to produce a second valid signature, resulting in a different `txid`.

### Mitigation

To avoid this issue, it's imperative that signatures are not included in a signed message hash used to enforce that the signature is not replayed.

```
// No longer includes signature
bytes32 txid = getTransferHash(_to, _value, _gasPrice, _nonce);
require(!signatureUsed[txid]);

address from = recoverTransferPreSigned(_signature, _to, _value, _gasPrice, _nonce);

// Modify important state of signing account
...

signatureUsed[txid] = true;
```

### Sources

- https://swcregistry.io/docs/SWC-117
- https://eklitzke.org/bitcoin-transaction-malleability
- https://hackernoon.com/what-is-the-math-behind-elliptic-curve-cryptography-f61b25253da3