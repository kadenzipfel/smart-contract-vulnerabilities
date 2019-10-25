## Honeypot

A honeypot is a type of smart contract attack that appears to be a vulnerable contract, but is actually just a trap. Honeypots work by luring attackers with a balance stored in the smart contract, and what appears to be a vulnerability in the code. Typically, to access the funds, the attacker would have to send their own funds, but unbeknownst to them, there is some kind of recovery mechanism allowing the smart contract owner to recover their own funds along with the funds of the attacker.

Let's look at a couple different real world examples:

```
pragma solidity ^0.4.18;

contract MultiplicatorX3
{
    address public Owner = msg.sender;
   
    function() public payable{}
   
    function withdraw()
    payable
    public
    {
        require(msg.sender == Owner);
        Owner.transfer(this.balance);
    }
    
    function Command(address adr,bytes data)
    payable
    public
    {
        require(msg.sender == Owner);
        adr.call.value(msg.value)(data);
    }
    
    function multiplicate(address adr)
    public
    payable
    {
        if(msg.value>=this.balance)
        {        
            adr.transfer(this.balance+msg.value);
        }
    }
}
```

In this [contract](https://etherscan.io/address/0x5aa88d2901c68fda244f1d0584400368d2c8e739#code), it seems that by sending more than the contract balance to `multiplicate()`, you can set your address as the contract owner, then proceed to drain the contract of funds. However, although it seems that `this.balance` is updated after the function is executed, it is actually updated before the function is called, meaning that `multiplicate()` is never executed, yet the attackers funds are locked in the contract.

```
pragma solidity ^0.4.19;

contract Gift_1_ETH
{
    bool passHasBeenSet = false;
    
    function()payable{}
    
    function GetHash(bytes pass) constant returns (bytes32) {return sha3(pass);}
    
    bytes32 public hashPass;
    
    function SetPass(bytes32 hash)
    public
    payable
    {
        if(!passHasBeenSet&&(msg.value >= 1 ether))
        {
            hashPass = hash;
        }
    }
    
    function GetGift(bytes pass)
    external
    payable
    {
        if(hashPass == sha3(pass))
        {
            msg.sender.transfer(this.balance);
        }
    }
    
    function PassHasBeenSet(bytes32 hash)
    public
    {
        if(hash==hashPass)
        {
           passHasBeenSet=true;
        }
    }
}
```

This [contract](https://etherscan.io/address/0x75041597d8f6e869092d78b9814b7bcdeeb393b4#code) is especially sneaky. So long as `passHasBeenSet` is still set to false, anyone could `GetHash()`, `SetPass()`, and `GetGift()`. The sneaky part of this contract, is that the last sentence is entirely true, but the problem is that `passHasBeenSet` is already set to true, even though it's not in the etherscan [transaction log](https://etherscan.io/address/0x75041597d8f6e869092d78b9814b7bcdeeb393b4). 

You see, when smart contracts make transactions to each other they don't appear in the transaction log, this is because they perform what's known as a message call and not a transaction. So what happened here, must have been some external contract setting the pass before anyone else could.

A safer method the attacker should have used would have been to check the contract storage with a security analysis tool, such as [Mythril](https://github.com/ConsenSys/mythril).

### Sources

- https://medium.com/coinmonks/the-phenomena-of-smart-contract-honeypots-755c1f943f7b
- https://etherscan.io/address/0x5aa88d2901c68fda244f1d0584400368d2c8e739#code
- https://etherscan.io/address/0x75041597d8f6e869092d78b9814b7bcdeeb393b4#code
- https://github.com/ConsenSys/mythril
- https://www.usenix.org/system/files/sec19-torres.pdf