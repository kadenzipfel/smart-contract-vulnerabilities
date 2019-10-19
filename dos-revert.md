## DoS with (Unexpected) revert

DoS (Denial of Service) attacks can occur in functions when you try to send funds to a user and the functionality relies on that fund transfer being successful. 

This can be problematic in the case that the funds are sent to a smart contract created by a bad actor, since they can simply create a fallback function that reverts all payments. 

For example:

```
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

This can also be problematic without an attacker present. For example, you may want to pay an array of users by iterating through the array, and of course you would want to make sure each user is properly paid. The problem here is that if one payment fails, the funtion is reverted and no one is paid. 

```
address[] private refundAddresses;
mapping (address => uint) public refunds;

// bad
function refundAll() public {
    for(uint x; x < refundAddresses.length; x++) { // arbitrary length iteration based on how many addresses participated
        require(refundAddresses[x].send(refunds[refundAddresses[x]])) // doubly bad, now a single failure on send will hold up all funds
    }
}
```

An effective solution to this problem would be to use a pull payment system over the current push payment system. To do this, separate each payment into it's own transaction, and have the recipient call the function.

```
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


Examples from: https://consensys.github.io/smart-contract-best-practices/known_attacks/#dos-with-unexpected-revert
https://consensys.github.io/smart-contract-best-practices/recommendations/#favor-pull-over-push-for-external-calls

### Sources

https://consensys.github.io/smart-contract-best-practices/known_attacks/#dos-with-unexpected-revert
https://consensys.github.io/smart-contract-best-practices/recommendations/#favor-pull-over-push-for-external-calls