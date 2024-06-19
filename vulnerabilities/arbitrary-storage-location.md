## Write to Arbitrary Storage Location

Only authorized addresses should have access to write to sensitive storage locations. If there aren't proper authorization checks throughout the contract, a malicious user may be able to overwrite sensitive data. However, even if there are authorization checks for writing to sensitive data, an attacker may still be able to overwrite the sensitive data via insensitive data. This could give an attacker access to overwrite important variables such as the contract owner. 

To prevent this from occurring, we not only want to protect sensitive data stores with authorization requirements, but we also want to ensure that writes to one data structure cannot inadvertently overwrite entries of another data structure.

### Example

Consider the following Solidity contract:
```solidity
pragma solidity ^0.8.16;

contract Wallet {
    uint[] private bonusCodes;
    address private owner;

    constructor() {
        bonusCodes = new uint[](0);
        owner = msg.sender;
    }

    receive() external payable {
    }

    function pushBonusCode(uint c) public {
        bonusCodes.push(c);
    }

    function popBonusCode() public {
        require(0 <= bonusCodes.length);
        bonusCodes.length--;
    }

    function updateBonusCodeAt(uint idx, uint c) public {
        require(idx < bonusCodes.length, "Index out of bounds");
        bonusCodes[idx] = c;
    }

    function destroy() public {
        require(msg.sender == owner, "Not authorized");
        selfdestruct(payable(msg.sender));
    }
}
```

In this contract, an attacker can exploit the `popBonusCode` function to manipulate the storage layout. By reducing the length of the `bonusCodes` array, the attacker can cause subsequent writes to `bonusCodes` to overwrite the `owner` address, because the `owner` variable is stored right after the `bonusCodes` array in storage.

Try out this challenge from [Ethernaut - Alien Codex](https://ethernaut.openzeppelin.com/level/19). If it's too hard, see [this walkthrough (SPOILER)](https://github.com/theNvN/ethernaut-openzeppelin-hacks/blob/main/level_19_Alien-Codex.md).

### Mitigations

**Authorization Checks**: Ensure that only authorized addresses can modify critical data structures.

### Sources

- [SWC-124: Write to Arbitrary Storage Location](https://swcregistry.io/docs/SWC-124)
- [USCC 2017 Submission by doughoyte](https://github.com/Arachnid/uscc/tree/master/submissions-2017/doughoyte)
