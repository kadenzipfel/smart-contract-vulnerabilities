## Unencrypted Private Data On-Chain

Ethereum smart contract code, storage, and any data transacted on-chain can always be read. Treat it as such. Even if your code is not verified on Etherscan, attackers can still decompile or check transactions to and from it to analyze it. For this reason, it's imperative that private data is never stored on-chain unencrypted.

### Explanation

When data is stored on-chain, it is accessible to anyone who can read the blockchain. This includes all transaction data and contract storage. Even if the source code of your smart contract is not publicly verified, an attacker can decompile the bytecode to analyze its functionality and access storage data.

### Example

Let's consider a scenario where a user stores their email, password, and username on-chain without encryption:

```solidity
// Vulnerable contract storing unencrypted private data
pragma solidity ^0.8.0;

contract UserInfo {
    struct User {
        string username;
        string email;
        string password;
    }

    mapping(address => User) private users;

    function setUserInfo(string memory _username, string memory _email, string memory _password) public {
        users[msg.sender] = User(_username, _email, _password);
    }

    function getUserInfo() public view returns (string memory, string memory) {
        User memory user = users[msg.sender];
        return (user.username, user.email);
    }
}
```

In this contract, the `users` mapping stores the username, email, and password in plain text. Although the `users` mapping is marked as private, this only means it is not accessible via other smart contracts. However, anyone can read the blockchain and view the stored values.

### Protection Mechanisms
To protect sensitive data, consider the following strategies:

1) Encryption: Encrypt data before storing it on-chain. Only store encrypted data and manage decryption keys off-chain.
2) Off-Chain Storage: Store sensitive data off-chain and only reference it on-chain when necessary.
3) Zero-Knowledge Proofs: Use cryptographic techniques such as zero-knowledge proofs to validate data without revealing it.

### References

- [Medium Article: Attack Vectors in Solidity #4: Unencrypted Private Data On-Chain](https://medium.com/@natachigram/attack-vectors-in-solidity-4-unencrypted-private-data-on-chain-cf4f3ff1cf71)
- [Solidity by Example: Accessing Private Data](https://solidity-by-example.org/hacks/accessing-private-data/)
- [SWC Registry: Unencrypted Private Data On-Chain](https://swcregistry.io/docs/SWC-136)
- [Zero-Knowledge Proofs](https://blog.ethereum.org/2016/12/05/zksnarks-in-a-nutshell/)