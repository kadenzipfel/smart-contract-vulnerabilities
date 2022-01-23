## Unprotected Callback

When writing or interacting with callback functions in solidity, it's important to ensure that they can't be used to perform unexpected effects.

Take for example OpenZeppelin's `ERC721._safeMint` function:

```
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

The function is titled `_safeMint` because it prevents tokens from being unintentionally minted to a contract by checking first whether that contract has implemented ERC721Receiver, i.e. marking itself as a willing recipient of NFTs.

This all seems fine, but since `_checkOnERC721Received` is a callback function, the recipient contract may define any arbitrary logic to be executed, including reenterring the initial mint function, thereby bypassing limits defined in the contract code. For example, in the following function:

```
// INSECURE
function mint(uint amount) external {
    require(balanceOf(msg.sender).add(amount) <= MAX_PER_USER, "exceed max per user");
    for (uint256 i = 0; i < amount; i++) {
        uint mintIndex = totalSupply();
        _safeMint(msg.sender, mintIndex);
    }
}
```

Since we have access to the unprotected callback we can reenter the mint function after just one token is minted and mint an additional `MAX_PER_USER - 1` tokens as follows:

```
function onERC721Received(
    address,
    address,
    uint256,
    bytes memory
) public virtual override returns (bytes4) {
    if (!complete) {
      complete = true;
      implementation.mint(maxMints - 1);
    }
    return this.onERC721Received.selector;
}
```

To remedy the vulnerability we can use the [`ERC721._mint`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/8f70c8867e31d2d2f212ecea079b1f1afecb0440/contracts/token/ERC721/ERC721.sol#L280) function or a [Reentrancy Guard](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol).

### Sources/Further reading

- https://github.com/KadenZipfel/max-mint-exploit
- https://samczsun.com/the-dangers-of-surprising-code/
