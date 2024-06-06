## Unencrypted Private Data On-Chain

Ethereum smart contract code, storage, and any data transacted on-chain can always be read. Treat it as such. Even if your code is not verified on Etherscan, attackers can still decompile or check transactions to and from it to analyze it. For this reason, it's imperative that private data is never stored on-chain unencrypted.

### Example

Let's consider a scenario where players participate in an Odd or Even game. Each player submits a number, and the winner is determined by the sum of both numbers being odd or even. Here is a vulnerable implementation:

```solidity
// Vulnerable contract storing unencrypted private data
contract OddEven {
    struct Player { 
        address payable addr; 
        uint number;
    }
   
    Player[2] private players;
    uint8 count = 0; 

    function play(uint number) public payable {
        require(msg.value == 1 ether);
        players[count] = Player(payable(msg.sender), number);
        count++;
        if (count == 2) selectWinner();
    }
   
    function selectWinner() private {
        uint n = players[0].number + players[1].number;
        players[n % 2].addr.transfer(address(this).balance);
        delete players;
        count = 0;
    }
}
```

In this contract, the `players` array stores the submitted numbers in plain text. Although the `players` array is marked as private, this only means it is not accessible via other smart contracts. However, anyone can read the blockchain and view the stored values. This means the first player's number will be visible, allowing the second player to select a number that they know will make them a winner.

### Protection Mechanisms
To protect sensitive data, consider the following strategies:

1) Commit-Reveal Scheme: Use a commit-reveal scheme where the data is committed to the blockchain in one phase and revealed in another.
2) Zero-Knowledge Proofs: Use cryptographic techniques such as zero-knowledge proofs to validate data without revealing it.

### References

- [Medium Article: Attack Vectors in Solidity #4: Unencrypted Private Data On-Chain](https://medium.com/@natachigram/attack-vectors-in-solidity-4-unencrypted-private-data-on-chain-cf4f3ff1cf71)
- [Solidity by Example: Accessing Private Data](https://solidity-by-example.org/hacks/accessing-private-data/)
- [SWC Registry: Unencrypted Private Data On-Chain](https://swcregistry.io/docs/SWC-136)
- [Zero-Knowledge Proofs](https://blog.ethereum.org/2016/12/05/zksnarks-in-a-nutshell/)