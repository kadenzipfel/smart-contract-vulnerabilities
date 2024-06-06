# Using ``msg.value`` in a loop

The particularity with msg.value is that ``msg.value`` is set on every contract call and not on the transaction level. Thus, if the function with loop is transferring ``msg.value`` on every iteration, all the ``msg.value`` sent to the function is transferred in the first iteration and other iteration will proceed with ``msg.value = 0`` which may cause unexpected consequences.

```solidity
contract depositer {
    function deposit(address weth) payable external {
        for (uint i = 0; i < 5; i ++) {
            WETH(weth).deposit{value: msg.value}(); // all the ``msg.value`` will be used in the first iteration
        }
    }
}
```

Also, if a function has a check like ``msg.value > 0.1e18``, that function can be called multiple times in a same transaction as ``msg.value`` value is not subtracted unless it's transferred out of the contract. Thus, Using ``msg.value`` inside a loop is dangerous because this might allow the sender to “re-use” the msg.value.

```solidity
function batchBuy(address[] memory addr) external payable{
    mapping (uint => address) nft;
    for (uint i = 0; i < addr.length; i++) {
         buy1NFT(addr[i])
    }
    function buy1NFT(address to) internal {
         if (msg.value < 1 ether) { revert("not enough ether") } // buy unlimited times after paying 1 ether once
         nft[numero] = address;
    }
}
```

Reuse of ``msg.value`` can show up with payable multicalls. Multicalls enable a user to submit a list of transactions to avoid paying the 21,000 gas transaction fee over and over. However, ``msg.value`` gets ``re-used`` while looping through the functions to execute, potentially enabling the user to double spend.

This was the root cause of the [Opyn Hack](https://peckshield.medium.com/opyn-hacks-root-cause-analysis-c65f3fe249db).

## Sources
- https://www.rareskills.io/post/smart-contract-security#:~:text=Using%20msg.,show%20up%20with%20payable%20multicalls.
- https://trustchain.medium.com/ethereum-msg-value-reuse-vulnerability-5afd0aa2bcef