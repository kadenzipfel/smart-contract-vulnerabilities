## Faulty Contract Detection

Some contracts do not want other contracts to interact with them (very common in gambling contracts using [sub-par RNG](https://github.com/KadenZipfel/smart-contract-attack-vectors/blob/master/vulnerabilities/weak-sources-randomness.md)).

A common way to prevent this is to check whether the calling account has any code stored in it, however contract accounts initiating calls during their construction will not yet show that they store code.

An example of this is the FOMO3D bug.

Contributed by: [RobertMCForster](https://github.com/RobertMCForster)