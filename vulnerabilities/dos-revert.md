## DoS with (Unexpected) revert

A DoS (Denial of Service) may be caused when logic is unable to be executed as a result of an unexpected revert. This can happen for a number of reasons and it's important to consider all the ways in which your logic may revert. The examples listed below are *non-exhaustive*.

### Reverting funds transfer

DoS (Denial of Service) attacks can occur in functions when you try to send funds to a user and the functionality relies on that fund transfer being successful. 

This can be problematic in the case that the funds are sent to a smart contract created by a bad actor, since they can simply create a fallback function that reverts all payments. 

For example:

```solidity
// INSECURE
contract Auction {
    address currentLeader;
    uint highestBid;

    function bid() payable {
        require(msg.value > highestBid);

        require(currentLeader.send(highestBid)); // Refund the old leader, if it fails then revert

        currentLeader = msg.sender;
        highestBid = msg.value;
    }
}
```

As you can see in this example, if an attacker bids from a smart contract with a fallback function reverting all payments, they can never be refunded, and thus no one can ever make a higher bid.

This can also be problematic without an attacker present. For example, you may want to pay an array of users by iterating through the array, and of course you would want to make sure each user is properly paid. The problem here is that if one payment fails, the function is reverted and no one is paid. 

```solidity
address[] private refundAddresses;
mapping (address => uint) public refunds;

// bad
function refundAll() public {
    for(uint x; x < refundAddresses.length; x++) { // arbitrary length iteration based on how many addresses participated
        require(refundAddresses[x].send(refunds[refundAddresses[x]])) // doubly bad, now a single failure on send will hold up all funds
    }
}
```

An effective solution to this problem would be to use a pull payment system over the above push payment system. To do this, separate each payment into its own transaction, and have the recipient call the function.

```solidity
contract auction {
    address highestBidder;
    uint highestBid;
    mapping(address => uint) refunds;

    function bid() payable external {
        require(msg.value >= highestBid);

        if (highestBidder != address(0)) {
            refunds[highestBidder] += highestBid; // record the refund that this user can claim
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
    }

    function withdrawRefund() external {
        uint refund = refunds[msg.sender];
        refunds[msg.sender] = 0;
        (bool success, ) = msg.sender.call.value(refund)("");
        require(success);
    }
}
```


Examples from: https://consensys.github.io/smart-contract-best-practices/attacks/denial-of-service/
https://consensys.github.io/smart-contract-best-practices/development-recommendations/general/external-calls/

### Over/Underflow

Prior to SafeMath usage, whether built-in in solidity >=0.8.0 or using a library, [over/underflows](./overflow-underflow.md) would result in rolling over to the minimum/maximum value. Now that checked math is commonplace, it's important to recognize that the effect of checked under/overflows is a revert, which may DoS important logic. 

Regardless of usage of checked math, it's necessary to ensure that any valid input will not result in an over/underflow. Take extra care when working with smaller integers e.g. `int8`/`uint8`, `int16`/`uint16`, `int24`/`uint24`, etc..

### Unexpected Balance

It's important to take caution in enforcing expected contract balances of tokens or Ether as those balances may be increased by an attacker to cause an unexpected revert. This is easily possible with ERC20 tokens by simply `transfer`ring to the contract, but is also possible with Ether by forcibly sending Ether to a contract.

Consider, for example, a contract which expects the Ether balance to be 0 for the first deposit to allow for custom accounting logic. An attacker may forcibly send Ether to the contract before the first deposit, causing all deposits to revert. 

### Divide by Zero
In solidity if the contract attempts to perform division when the denominator is ``zero``, the call reverts. Thus, the denominator should be always checked before division to prevent DoS revert.
```solidity
function foo(uint num, uint den) public pure returns(uint result) {
  result = num / den; // if den = 0, the execution reverts
}
```

### Sources

- [Consensys Smart Contract Best Practices - Denial of Service](https://consensys.github.io/smart-contract-best-practices/attacks/denial-of-service/)
- [Consensys Smart Contract Best Practices - External Calls](https://consensys.github.io/smart-contract-best-practices/development-recommendations/general/external-calls/)
