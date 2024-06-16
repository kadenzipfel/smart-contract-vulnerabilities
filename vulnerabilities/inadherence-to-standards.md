## Inadherence to Standards

In terms of smart contract development, it's important to follow standards. Standards are set to prevent vulnerabilities, and ignoring them can lead to unexpected effects.

Take for example binance's original BNB token. It was marketed as an ERC20 token, but it was later pointed out that it wasn't actually ERC20 compliant for a few reasons:

- It prevented sending to 0x0
- It blocked transfers of 0 value
- It didn't return true or false for success or fail

The main cause for concern with this improper implementation is that if it is used with a smart contract that expects an ERC-20 token, it will behave in unexpected ways. It could even get locked in the contract forever. 

Although standards aren't always perfect, and may someday become antiquated, they foster proper expectations to provide for secure smart contracts.

Suggested by: [RobertMCForster](https://github.com/RobertMCForster)

### Sources

- [BNB: Is It Really an ERC-20 Token?](https://finance.yahoo.com/news/bnb-really-erc-20-token-160013314.html)
- [Binance Isn't ERC-20](https://blog.goodaudience.com/binance-isnt-erc-20-7645909069a4)