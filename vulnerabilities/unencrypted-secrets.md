## Unencrypted Secrets

Ethereum smart contract code can always be read. Treat it as such. Even if your code is not verified on Etherscan, attackers can still decompile or even just check transactions to and from it to analyze it.

One example of a problem here would be having a "guessing game" where the user has to guess a stored private variable to win the Ether in the contract. This is, of course, extremely trivial to exploit (to the point that you shouldn't try it because it's almost certainly a honeypot contract that's much trickier).

Another common problem here is using unencrypted off-chain secrets, such as API keys, with Oracle calls. If your API key can be determined, malicious actors can either simply use it for themselves, or take advantage of other vectors such as exhausting your allowed API calls and forcing the Oracle to return an error page which may or may not lead to problems depending on the structure of the contract.

Contributed by: [RobertMCForster](https://github.com/RobertMCForster)