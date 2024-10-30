## Insufficient Access Control

Access control is often imperative in management and ownership of smart contracts. It's important to consider ways in which access control may be circumvented, or insufficiently implemented and the corresponding consequences. Contracts may allow any user to execute sensitive functions without verifying their authorization status. For example, a contract may have functions that transfer ownership, mint tokens, or modify critical state variables without checking if the caller has the appropriate permissions. 

Improper implementation of access control can lead to severe vulnerabilities, allowing unauthorized users to manipulate the contract’s state or even drain its funds. For example:

```solidity
// UNSECURE
function setInterestRate(uint256 _interestRate) public {
    // No access modifier, so anyone can change the interestRate
    interestRate = _interestRate;
}
```

The `setInterestRate` function doesn’t have any access control which means anyone can call it to change the `interestRate`  which can lead to severe consequences. We can resolve this by adding authorization logic, e.g.:

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner can call this function");
    _;
}

function setInterestRate(uint256 _interestRate) public onlyOwner {
    interestRate = _interestRate;
}
```

Now, the `onlyOwner` modifier has been added. This modifier checks if the caller of a function is the contract owner before allowing the function to proceed, ensuring that only the owner of the contract can change the `interestRate`. Similarly, role based access control mechanisms and whitelisting mechanisms can be implemented for proper access control.


### Sources
- [Access Control Vulnerabilities in Smart Contracts](https://metaschool.so/articles/access-control-vulnerabilities-in-smart-contracts/)
- [Mitigate Access Control Vulnerability](https://medium.com/rektify-ai/how-to-mitigate-access-control-vulnerability-6df74c82af98)

