## Unclogged Blockchain Reliance

Many contracts rely on calls happening within certain period of time, but Ethereum can be spammed with very high Gwei transactions for a decent amount of time relatively cheaply.

For example, FOMO3D (a countdown game where the last investor wins the jackpot, but each investment adds time to the countdown) was won by a user who completely clogged the blockchain for a small period of time, disallowing others from investing until the timer ran out and he won (see [DoS with Block Gas Limit](/attacks/dos-gas-limit.md)).

There are many "croupier" gambling contracts nowadays that rely on past blockhashes to provide RNG. This is not a terrible source of RNG for the most part, and they even account for the pruning of hashes that happens after 256 blocks, but at that point many of them simply null the bet. This would allow someone to make bets on many of these similarly-functioning contracts with a certain result as the winner for them all, check the croupier's submission while it's still pending, and, if it's unfavorable, simply clog the blockchain until pruning occurs and you can get your bets returned.

Contributed by: [RobertMCForster](https://github.com/RobertMCForster)