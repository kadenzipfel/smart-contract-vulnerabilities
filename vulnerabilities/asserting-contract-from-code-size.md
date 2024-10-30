## Asserting contract from Code Size

A common method for asserting whether a sender is a contract or EOA has been to check the code size of the sender. This check asserts that if the sender has a code size > 0 that it must be a contract and if not then it must be an EOA. For example:

```solidity
function mint(uint256 amount) public {
  if (msg.sender.code.length != 0) revert CallerNotEOA();
}
```

However, as noted in the [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf), "During initialization code execution, EXTCODESIZE on the address should return zero, which is the length of the code of the account while CODESIZE should return the length of the initialization". 

[This repo](https://github.com/0xKitsune/Ghost-Contract/blob/main/src/Ghost.sol) shows how we may exploit this logic by simply calling during creation of a new contract.

As we can see, it's important that we recognize that although we may be certain that an account with a non-zero codesize is a contract, we can't be certain that an account with a zero codesize is not a contract.

### Sources

- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
- [Ghost Contract on GitHub](https://github.com/0xKitsune/Ghost-Contract)
