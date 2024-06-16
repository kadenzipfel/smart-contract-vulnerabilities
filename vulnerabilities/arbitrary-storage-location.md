## Write to Arbitrary Storage Location

Only authorized addresses should have access to write to sensitive storage locations. If there isn't proper authorization checks throughout the contract, a malicious user may be able to overwrite sensitive data. However, even if there are authorization checks for writing to sensitive data, an attacker may still be able to overwrite the sensitive data via insensitive data. This could give an attacker access to overwrite important variables such as the contract owner. 

To prevent this from occurring, we not only want to protect sensitive data stores with authorization requirements, but we also want to ensure that writes to one data structure cannot inadvertently overwrite entries of another data structure.

For an example, try [Ethernaut - Alien Codex](https://ethernaut.openzeppelin.com/level/19). If it's too hard, see [this walkthrough (SPOILER)](https://github.com/theNvN/ethernaut-openzeppelin-hacks/blob/main/level_19_Alien-Codex.md).

### Sources

- [SWC-124: Write to Arbitrary Storage Location](https://swcregistry.io/docs/SWC-124)
- [USCC 2017 Submission by doughoyte](https://github.com/Arachnid/uscc/tree/master/submissions-2017/doughoyte)
