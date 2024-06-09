# Using ``msg.value`` in a loop.

The value of ``msg.value`` in a transaction’s call never gets updated, even if the called contract ends up sending some or all of the ETH to another contract. This means that using ``msg.value`` in ``for`` or ``while`` loops, without extra accounting logic, will either lead to the transaction reverting (when there are no longer sufficient funds for later iterations), or to the contract being drained (when the contract itself has an ETH balance).

```solidity
contract depositer {
    function deposit(address weth) payable external {
        for (uint i = 0; i < 5; i ++) {
            WETH(weth).deposit{value: msg.value}();
        }
    }
}
```
In the above example, first iteration will use all the ``msg.value`` sent and other iterations can:
1. Drain the contract if some ETH balance exists inside the contract.
2. Revert on zero value transfer if ETH balance doesn't exist inside the contract.
3. Succeed with zero value transfer.

Also, if a function has a check like ``msg.value > 0.1e18``, that function can be called multiple times in a same transaction as ``msg.value`` is not updated in a transaction call.
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

 Thus, Using ``msg.value`` inside a loop is dangerous because this might allow the sender to ``re-use`` the ``msg.value``.

Reuse of ``msg.value`` can also show up with payable multicalls. Multicalls enable a user to submit a list of transactions to avoid paying the 21,000 gas transaction fee over and over. However, If ``msg.value`` gets ``re-used`` while looping through the functions to execute, it can cause a serious issue like the [Opyn Hack](https://peckshield.medium.com/opyn-hacks-root-cause-analysis-c65f3fe249db).

## Sources
- https://www.rareskills.io/post/smart-contract-security#:~:text=Using%20msg.,show%20up%20with%20payable%20multicalls.
- https://trustchain.medium.com/ethereum-msg-value-reuse-vulnerability-5afd0aa2bcef