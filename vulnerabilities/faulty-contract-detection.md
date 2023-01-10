## Faulty Contract Detection

Some contracts do not want other contracts to interact with them (very common in gambling contracts using [sub-par RNG](/vulnerabilities/weak-sources-randomness.md)).

A common way to prevent this is to check whether the calling account has any code stored in it. However, contract accounts initiating calls during their construction will not yet show that they store code, effectively bypassing the contract detection.

Contributed by: [RobertMCForster](https://github.com/RobertMCForster)