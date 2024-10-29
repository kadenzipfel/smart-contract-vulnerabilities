## Unexpected `ecrecover` Null Address

`ecrecover` is a precompiled built-in cryptographic function which recovers an address associated with the public key from an elliptic curve signature or *returns zero on error*. The parameters corresponding to the signature are `r`, `s` & `v`.

As noted above, `ecrecover` will return zero on error. It's possible to do this deterministically by setting `v` as any positive number other than 27 or 28.

This can be manipulated by attackers to make it seem like a valid message has been signed by `address(0)`. 

> **NOTE:** The default value for addresses in solidity is `address(0)`. As such, in case important storage variables, e.g. owner/admin, are unset, it's possible to spoof a signature from one of these unset addresses, executing authorized-only logic.

```solidity
// UNSECURE
function validateSigner(address signer, bytes32 message, uint8 v, bytes32 r, bytes32 s) internal pure returns (bool) {
	address recoveredSigner = ecrecover(message, v, r, s);
	return signer == recoveredSigner;
}
```

The above method is intended to only return true if a valid signature is provided. However, as we know, if we set `v` to any value other than 27 or 28, the `recoveredSigner` will be the null address and if the provided `signer` is `address(0)`, the function will unexpectedly return `true`.

We can mitigate this issue by reverting if the `recoveredSigner` address is null, e.g.:

```solidity
function validateSigner(address signer, bytes32 message, uint8 v, bytes32 r, bytes32 s) internal pure returns (bool) {
        address recoveredSigner = ecrecover(message, v, r, s);
        require(recoveredSigner != address(0));
        return signer == recoveredSigner;
}
```

### Sources

- [Solidity Documentation: Mathematical and Cryptographic Functions](https://docs.soliditylang.org/en/latest/units-and-global-variables.html#mathematical-and-cryptographic-functions)
- [Ethereum Stack Exchange Answer](https://ethereum.stackexchange.com/a/69329)
