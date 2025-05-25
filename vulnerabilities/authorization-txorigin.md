## Authorization Through tx.origin

`tx.origin` is a global variable in Solidity which returns the address that sent a transaction. It's important that you never use `tx.origin` for authorization since another contract can use a fallback function to call your contract and gain authorization since the authorized address is stored in `tx.origin`. Consider this example:

```solidity

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// THIS CONTRACT CONTAINS A BUG - DO NOT USE
contract TxUserWallet {
    address owner;

    constructor() public {
        owner = msg.sender;
    }

    function transferTo(address payable dest, uint amount) public {
        require(tx.origin == owner);
        dest.transfer(amount);
    }
}
```

Here we can see that the `TxUserWallet` contract authorizes the `transferTo()` function with `tx.origin`. 

```solidity

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface TxUserWallet {
    function transferTo(address payable dest, uint amount) external;
}

contract TxAttackWallet {
    address payable private immutable owner;

    // Constructor sets the contract deployer as the owner
    constructor() {
        owner = payable(msg.sender);
    }

    // fallback function to receive Ether and trigger transfer

    fallback() external payable {
        // Call transferTo on TxUserWallet (msg.sender) to send its balance to owner

        TxUserWallet(msg.sender).transferTo(owner, msg.sender.balance);
    }
}
```

Now if someone were to trick your 'TxUserWallet' contract into sending ether to the `TxAttackWallet` contract, they can steal all funds from  'TxUserWallet'  by passing the `tx.origin` check.

To prevent this kind of attack, use `msg.sender` for authorization.

Examples from: https://solidity.readthedocs.io/en/develop/security-considerations.html#tx-origin

### Sources

- [SWC-115](https://swcregistry.io/docs/SWC-115)
- [Solidity Security Considerations - tx.origin](https://solidity.readthedocs.io/en/develop/security-considerations.html#tx-origin)
- [Consensys Smart Contract Best Practices - tx.origin](https://consensys.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/tx-origin/)
- [SigP Solidity Security Blog - tx.origin](https://github.com/sigp/solidity-security-blog#tx-origin)
