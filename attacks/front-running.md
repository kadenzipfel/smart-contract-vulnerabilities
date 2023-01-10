## Front-Running AKA Transaction-Ordering Dependence

Front-running is, "a course of action where an entity benefits from prior access to privileged market information about upcoming transactions and trades." This knowledge of future events in a market can lead to exploitation.

For example, knowing that a very large purchase of a specific token is going to occur, a bad actor can purchase that token in advance, and sell the token for a profit when the oversized buy order increases the price.

Front-running attacks have long been an issue in financial markets, and due to blockchain's transparent nature, the problem is coming up again in cryptocurrency markets.

Since the solution to this problem varies on a per contract basis, it can be hard to protect against. Possible solutions include batching transactions and using a pre-commit scheme, i.e. allow users to submit details at a later time.


### Sources

- https://consensys.github.io/smart-contract-best-practices/attacks/frontrunning/
- https://users.encs.concordia.ca/~clark/papers/2019_wtsc_front.pdf
