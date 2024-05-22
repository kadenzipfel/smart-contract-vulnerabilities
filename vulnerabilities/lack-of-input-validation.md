## Lack of Input Validation

This attack is not specifically performed on Solidity contracts themselves but on third-party applications that interact with smart contracts. I add this attack for completeness and to raise awareness of how parameters can be manipulated in smart contracts.

When passing parameters to a smart contract, the parameters are encoded according to the ABI specification. It is possible to send parameters that are shorter than the expected parameter length (for example, sending an address that is only 38 hex characters (19 bytes) instead of the standard 40 hex characters (20 bytes)).

In such a scenario, the EVM will pad 0's to the end of the parameters to make up for the expected length.

This becomes an issue when third-party applications do not validate inputs. The clearest example of this is an exchange that doesn't verify the address of an ERC-20 token when a user requests a withdrawal.

Consider the standard ERC-20 transfer function interface:

```solidity
function transfer(address to, uint tokens) public returns (bool success);
```

Now consider an exchange holding a large amount of a token (let's say `INC`) and a user wishes to withdraw their share of 100 tokens. 

The user would submit their address, `0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead` and the number of tokens, `100`. 

The exchange would encode these parameters in the order specified by the `transfer()` function, i.e., address then tokens. 

The encoded result would be:
```
a9059cbb000000000000000000000000deaddeaddeaddeaddeaddeaddeaddeaddeaddead000000000000000000000000000000000000000000000000056bc75e2d63100000
```

The first four bytes `a9059cbb` are the `transfer()` function signature, the second 32 bytes are the address `to`, followed by the final 32 bytes which represent the number of tokens.

Notice that the hex `56bc75e2d63100000` at the end corresponds to 100 tokens (with 18 decimal places, as specified by the `INC` token contract).

Okay, so what?

Let's look at what happens if we were to send an address that was missing 1 byte (2 hex digits). Specifically, let's say an attacker sends `0xdeaddeaddeaddeaddeaddeaddeaddeaddeadde`, an address (missing the last two digits) and the same `100` tokens to withdraw. If the exchange doesn't validate this input, it would get encoded as:
```
a9059cbb000000000000000000000000deaddeaddeaddeaddeaddeaddeaddeaddeadde00000000000000000000000000000000000000000000000056bc75e2d6310000000
```

The difference is very subtle.

Note that `00` has been padded to the end of the encoding, to make up for the short address that was sent. When this gets sent to the smart contract, the address parameter will read as `0xdeaddeaddeaddeaddeaddeaddeaddeaddeadde00` and the value will be read as `56bc75e2d6310000000` (notice the two extra 0's). 

This value is now `25600` tokens (the value has been multiplied by 256). In this example, if the exchange held this many tokens, the user would withdraw 25600 tokens (whilst the exchange thinks the user is only withdrawing 100) to the modified address.

Obviously, the attacker won't possess the modified address in this example, but remember addresses in Ethereum are deterministic, meaning that they can be calculated prior to actually creating the address. This is the case for addresses creating contracts and also for contracts spawning other contracts. In fact, a created contract's address is determined by:

```
keccak256(rlp.encode([<account_address>, <transaction_nonce>]))
```

An example function from [pyethereum](https://github.com/ethereum/pyethereum/blob/782842758e219e40739531a5e56fff6e63ca567b/ethereum/utils.py)

```python
def mk_contract_address(sender, nonce): 
    return sha3(rlp.encode([normalize_address(sender), nonce]))[12:] 
```

Essentially, a contract's address is just the `keccak256` hash of the account that created it concatenated with the account's transaction nonce. The same is true for contracts, except contracts' nonces start at 1 whereas addresses' transaction nonces start at 0.

This means that given an Ethereum address, we can calculate all the possible contract addresses that this address can spawn. For example, if the address `0x123000...000` were to create a contract on its 100th transaction, it would create the contract address `keccak256(rlp.encode[0x123...000, 100])`, which would give the contract address `0xed4cafc88a13f5d58a163e61591b9385b6fe6d1a`

This means that the attacker can easily bruteforce the desired address!

## Preventative Techniques

It is obvious to say that validating all inputs before sending them to the blockchain will prevent these kinds of attacks.

It should also be noted that parameter ordering plays an important role here. As padding only occurs at the end, careful ordering of parameters in the smart contract can potentially mitigate some forms of this attack.

## Sources
- [Parameter Attack](https://blog.sigmaprime.io/solidity-security.html#short-address)