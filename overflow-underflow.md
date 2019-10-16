## Integer Overflow and Underflow

In solidity, integer types have maximum values. For example:

`uint8` => 255
`uint16` => 65535
`uint24` => 16777215
`uint256` => (2^256) - 1

Overflow and underflow bugs can occur when you exceed the maximum value (overflow) or when you go below the minimum value (underflow). When you exceed the maximum value, you go back down to zero, and when you go below the minimum value, it brings you back up to the maximum value.

Since smaller integer types like: `uint8`, `uint16`, etc. have smaller maximum values, it can be easier to cause an overflow, thus they should be used with greater caution.

Likely the best available solution to overflow and underflow bugs is to use the [OpenZeppelin SafeMath library](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol) when performing mathematical operations.


### Sources

https://consensys.github.io/smart-contract-best-practices/known_attacks/#integer-overflow-and-underflow