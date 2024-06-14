## Delegatecall to Untrusted Callee

`Delegatecall` is a special variant of a message call. It is almost identical to a regular message call except the target address is executed in the context of the calling contract and `msg.sender` and `msg.value` remain the same. Essentially, `delegatecall` delegates other contracts to modify the calling contract's storage.

Since `delegatecall` gives so much control over a contract, it's very important to only use this with trusted contracts such as your own. If the target address comes from user input, be sure to verify that it is a trusted contract.

### Example

Consider the following contracts where `delegatecall` is misused, leading to a vulnerability:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract Lib {
    address public owner;

    function pwn() public {
        owner = msg.sender;
    }
}

contract HackMe {
    address public owner;
    Lib public lib;

    constructor(Lib _lib) {
        owner = msg.sender;
        lib = Lib(_lib);
    }

    fallback() external payable {
        address(lib).delegatecall(msg.data);
    }
}

contract Attack {
    address public hackMe;

    constructor(address _hackMe) {
        hackMe = _hackMe;
    }

    function attack() public {
        hackMe.call(abi.encodeWithSignature("pwn()"));
    }
}
```

In this example, the `HackMe` contract uses `delegatecall` to forward any call it receives to the `Lib` contract. The `Attack` contract then uses this vulnerability to call the `pwn()` function of `Lib` through the `HackMe` contract, thus changing the owner of `HackMe` contract to the attacker. This demonstrates the dangers of using delegatecall with untrusted callees.

### Mitigations

To mitigate the risks associated with `delegatecall` to untrusted callees, consider the following strategies:

1. **Whitelist Trusted Contracts**: Ensure that the target address for `delegatecall` is a contract you control or a contract that is part of a verified and trusted list.

2. **Limit the Scope of Delegatecall**: Use `delegatecall` only for specific, controlled operations. Avoid exposing it as a general-purpose function unless absolutely necessary.

### Sources

- [SWC Registry: SWC-112](https://swcregistry.io/docs/SWC-112)
- [Solidity Documentation: Delegatecall](https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html#delegatecall-and-libraries)
- [Sigma Prime: Solidity Security](https://blog.sigmaprime.io/solidity-security.html#delegatecall)
- [Ethereum Stack Exchange: Difference Between Call, Callcode, and Delegatecall](https://ethereum.stackexchange.com/questions/3667/difference-between-call-callcode-and-delegatecall)