## Reentrancy

Reentrancy is an attack that can occur when a bug in a contract may allow a malicious contract to reenter the contract unexpectedly during execution of the original function. This can be used to drain funds from a smart contract if used maliciously. Reentrancy is likely the single most impactful vulnerability in terms of total loss of funds by smart contract hacks, and should be considered accordingly. [List of reentrancy attacks](https://github.com/pcaversaccio/reentrancy-attacks)

### External calls

Reentrancy can be executed by the availability of an external call to an attacker controlled contract. External calls allow for the callee to execute arbitrary code. The existence of an external call may not always be obvious, so it's important to be aware of any way in which an external call may be executed in your smart contracts.

##### ETH transfers

When Ether is transferred to a contract address, it will trigger the `receive` or `fallback` function, as implemented in the contract. An attacker can write any arbitrary logic into the `fallback` method, such that anytime the contract receives a transfer, that logic is executed. 

##### `safeMint`

One example of a hard to spot external call is OpenZeppelin's [`ERC721._safeMint`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/3f610ebc25480bf6145e519c96e2f809996db8ed/contracts/token/ERC721/ERC721.sol#L244) & [`ERC721._safeTransfer`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/3f610ebc25480bf6145e519c96e2f809996db8ed/contracts/token/ERC721/ERC721.sol#L190) functions.

```solidity
/**
  * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
  * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
  */
function _safeMint(
    address to,
    uint256 tokenId,
    bytes memory _data
) internal virtual {
    _mint(to, tokenId);
    require(
        _checkOnERC721Received(address(0), to, tokenId, _data),
        "ERC721: transfer to non ERC721Receiver implementer"
    );
}
```

The function is titled `_safeMint` because it prevents tokens from being unintentionally minted to a contract by checking first whether that contract has implemented ERC721Receiver, i.e. marking itself as a willing recipient of NFTs. This all seems fine, but `_checkOnERC721Received` is an external call to the receiving contract, allowing arbitrary execution.

### Single function reentrancy

A single function reentrancy attack occurs when a vulnerable function is the same function that an attacker is trying to recursively call.

```solidity
// UNSECURE
function withdraw() external {
    uint256 amount = balances[msg.sender];
    (bool success,) = msg.sender.call{value: balances[msg.sender]}("");
    require(success);
    balances[msg.sender] = 0;
}
```

Here we can see that the balance is only modified after the funds have been transferred. This can allow a hacker to call the function many times before the balance is set to 0, effectively draining the smart contract.

### Cross-function reentrancy

A cross-function reentrancy attack is a more complex version of the same process. Cross-function reentrancy occurs when a vulnerable function shares state with a function that an attacker can exploit.

```solidity
// UNSECURE
function transfer(address to, uint amount) external {
  if (balances[msg.sender] >= amount) {
    balances[to] += amount;
    balances[msg.sender] -= amount;
  }
}

function withdraw() external {
  uint256 amount = balances[msg.sender];
  (bool success,) = msg.sender.call{value: balances[msg.sender]}("");
  require(success);
  balances[msg.sender] = 0;
}
```

In this example, a hacker can exploit this contract by having a fallback function call `transfer()` to transfer spent funds before the balance is set to 0 in the `withdraw()` function.

### Read-only Reentrancy

Read-only reentrancy is a novel attack vector in which instead of reentering into the same contract in which state changes have yet to be made, an attacker reenters into another contract which reads from the state of the original contract.

```solidity
// UNSECURE
contract A {
	// Has a reentrancy guard to prevent reentrancy
	// but makes state change only after external call to sender
	function withdraw() external nonReentrant {
		uint256 amount = balances[msg.sender];
		(bool success,) = msg.sender.call{value: balances[msg.sender]}("");
		require(success);
		balances[msg.sender] = 0;
	}
}

contract B {
	// Allows sender to claim equivalent B tokens for A tokens they hold
	function claim() external nonReentrant {
		require(!claimed[msg.sender]);
		balances[msg.sender] = A.balances[msg.sender];
		claimed[msg.sender] = true;
	}
}
```

As we can see in the above example, although both functions have a nonReentrant modifier, it is still possible for an attacker to call `B.claim` during the callback in `A.withdraw`, and since the attackers balance was not yet updated, execution succeeds.

### Reentrancy prevention

The simplest reentrancy prevention mechanism is to use a [`ReentrancyGuard`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/ReentrancyGuard.sol), which allows you to add a modifier, e.g. `nonReentrant`, to functions which may otherwise be vulnerable. Although effective against most forms of reentrancy, it's important to understand how read-only reentrancy may be used to get around this and to always use the **checks-effects-interactions pattern**.

For optimum security, use the **checks-effects-interactions pattern**. This is a simple rule of thumb for ordering smart contract functions.

The function should begin with *checks*, e.g. `require` and `assert` statements.

Next, the *effects* of the contract should be performed, i.e. state modifications.

Finally, we can perform *interactions* with other smart contracts, e.g. external function calls.

This structure is effective against reentrancy because when an attacker reenters the function, the state changes have already been made. For example:

```solidity
function withdraw() external {
  uint256 amount = balances[msg.sender];
  balances[msg.sender] = 0;
  (bool success,) = msg.sender.call{value: balances[msg.sender]}("");
  require(success);
}
```

Since the balance is set to 0 before any interactions are performed, if the contract is called recursively, there is nothing to send after the first transaction.


Examples from: https://medium.com/coinmonks/protect-your-solidity-smart-contracts-from-reentrancy-attacks-9972c3af7c21


### Sources

- [Reentrancy Attacks on Smart Contracts: Best Practices for Pentesters](https://consensys.github.io/smart-contract-best-practices/attacks/reentrancy/)
- [Reentrancy attack on Smart Contracts: How to identify the exploitable and an example of an attack](https://medium.com/@gus_tavo_guim/reentrancy-attack-on-smart-contracts-how-to-identify-the-exploitable-and-an-example-of-an-attack-4470a2d8dfe4)
- [Protect Your Solidity Smart Contracts From Reentrancy Attacks](https://medium.com/coinmonks/protect-your-solidity-smart-contracts-from-reentrancy-attacks-9972c3af7c21)
