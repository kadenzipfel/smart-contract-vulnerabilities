# Weak Sources of Randomness from Chain Attributes

## Preconditions
- Contract generates "random" values using on-chain data: `block.timestamp`, `blockhash`, `block.difficulty` / `block.prevrandao`, `block.number`, or combinations thereof
- The random value determines outcomes with economic value (lotteries, games, minting, distributions)

## Vulnerable Pattern
```solidity
function drawLottery() external {
    // All inputs are deterministic and publicly visible
    // Another contract can compute the same value in the same tx
    uint256 random = uint256(keccak256(abi.encodePacked(
        block.timestamp,
        block.prevrandao,
        msg.sender
    ))) % 100;

    if (random < 5) {
        _payWinner(msg.sender);
    }
}

// Attacker contract
contract Exploit {
    function attack(Lottery target) external {
        // Compute the same "random" value before calling
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            address(this)
        ))) % 100;

        // Only call if we'll win
        if (random < 5) {
            target.drawLottery();
        }
    }
}
```

## Detection Heuristics
1. Search for `block.timestamp`, `block.prevrandao`, `block.difficulty`, `blockhash`, `block.number` used as inputs to `keccak256` or arithmetic operations producing a "random" value
2. Check if the resulting value determines an outcome with economic impact (winner selection, token distribution, NFT rarity, game outcome)
3. If randomness is derived exclusively from on-chain data, flag it — a contract in the same transaction can compute the identical value
4. Check if `blockhash` is used for a future block (returns 0 for blocks not yet mined) or a block older than 256 blocks (also returns 0)
5. Check if validators/miners can influence the inputs to bias the outcome

## False Positives
- Chainlink VRF or another verifiable randomness oracle is used
- On-chain data is combined with an off-chain commit-reveal scheme (the on-chain part alone doesn't determine the outcome)
- The randomness doesn't determine anything with economic value
- `block.prevrandao` on PoS Ethereum provides sufficient entropy for the specific use case (not for high-value outcomes)

## Remediation
- Use Chainlink VRF (Verifiable Random Function) for provably fair randomness
- Implement a commit-reveal scheme: users commit hashed choices, reveal in a later block
- Never use `block.timestamp`, `blockhash`, or `block.prevrandao` alone for randomness in high-value contexts
```solidity
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract FairLottery is VRFConsumerBaseV2 {
    function requestRandom() external {
        requestRandomWords(keyHash, subId, confirmations, gasLimit, 1);
    }

    function fulfillRandomWords(uint256, uint256[] memory randomWords) internal override {
        uint256 winner = randomWords[0] % participants.length;
        _payWinner(participants[winner]);
    }
}
```
