## Unchecked Return Values

The main idea behind this type of vulnerability is the failure to properly handle the return values of external function calls. This can have significant consequences, including fund loss and unexpected behavior in the contract's logic.

In Solidity, developers can perform external calls using methods like:

1. `.send()`
2. `.call()`
3. `.transfer()`

`.transfer()` is commonly used to send ether to external accounts, however, the `.send()` function can also be used. For more versatile external calls, `.call()` can be used.

Each of these methods has a different behavior when it comes to error handling. The `.call()` and `.send()` functions return a boolean indicating if the call succeeded or failed. Thus, these functions have a simple caveat: the transaction that executes these functions (`.call()` and `.send()`) WILL NOT revert if the external call fails. Instead, `.call()` and `.send()` will simply return the boolean value `false`.

A common pitfall arises when the return value is not checked, as the developer expects a revert to occur when, in reality, the revert will not occur if not explicitly checked by the smart contract.

For example, if a contract uses `.send()` without checking its return value, transaction execution will continue even if the call fails, resulting in unexpected behavior. Take the below contract for example:

```solidity
/// INSECURE
contract Lotto {

    bool public paidOut = false;
    address public winner;
    uint256 public winAmount;

    /// extra functionality here

    function sendToWinner() public {
        require(!paidOut);
        winner.send(winAmount);
        paidOut = true;
    }

    function withdrawLeftOver() public {
        require(paidOut);                // requires `paidOut` to be true
        msg.sender.send(this.balance);
    }
}
```

The above contract represents a Lotto-like contract, where a winner receives `winAmount` of ether, which typically leaves a little left over for anyone to withdraw.

The bug exists where `.send()` is used without checking the response, i.e., `winner.send(winAmount)`.

In this example, a winner whose transaction fails (either by running out of gas or being a contract that intentionally throws in the fallback function) will still allow `paidOut` to be set to true (regardless of whether ether was sent or not).

In this case, anyone can withdraw the winner's winnings using the `withdrawLeftOver()` function.

A more serious version of this bug occurred in [King of the Ether](https://www.kingoftheether.com/thrones/kingoftheether/index.html). An excellent [post-mortem](https://www.kingoftheether.com/postmortem.html) of this contract has been written, detailing how an unchecked failed `.send()` could be used to attack a contract.

### Preventive Techniques

To mitigate this vulnerability, developers should always check the return value of any call to an external contract. The `require()` function can be used to check if the call was successful and handle any errors that may occur.

A caveat developers should be wary of when using the `require()` function is unexpected reverts that can cause DoS. If the developer naively decides to check for the success or failure of the external `.send()` call like so:

```solidity
/// INSECURE
contract Lotto {

    bool public paidOut = false;
    address public winner;
    uint256 public winAmount;

    /// extra functionality here

  function sendToWinner() public {
        require(!paidOut);
        require(winner.send(winAmount));        // naively check success of the external call
        paidOut = true;
    }

  function withdrawLeftOver() public {
        require(paidOut);                       // requires `paidOut` to be true
        msg.sender.send(this.balance);
    }
```

An attacker interacting with the `Lotto` contract from their own malicious contract and calling the `sendToWinner` function, can just implement a fallback function that reverts all payments making `paidOut` not set to true!

A detailed explanation of this caveat can be found [here](./dos-revert.md)

### Sources

- [SigmaPrime blog post](https://blog.sigmaprime.io/solidity-security.html#unchecked-calls)
- [DoS with an unexpected revert](./dos-revert.md)

