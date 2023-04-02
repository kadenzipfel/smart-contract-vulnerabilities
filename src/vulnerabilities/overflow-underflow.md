## Integer Overflow and Underflow

In solidity, integer types have maximum values. For example:

`uint8` => 255
`uint16` => 65535
`uint24` => 16777215
`uint256` => (2^256) - 1

Overflow and underflow bugs can occur when you exceed the maximum value (overflow) or when you go below the minimum value (underflow). When you exceed the maximum value, you go back down to zero, and when you go below the minimum value, it brings you back up to the maximum value.

Since smaller integer types like: `uint8`, `uint16`, etc. have smaller maximum values, it can be easier to cause an overflow, thus they should be used with greater caution.

Older contracts often made use of the [SafeMath library](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol), to avoid over/underflows, but in solidity >=v0.8.0, SafeMath logic is built in by default. It's important to consider that regardless of SafeMath logic being used, either built-in or used manually in older contracts, over/underflows still trigger reverts, which may result in [denial of service](./dos-revert.md) of important functionality or other unexpected effects. Built-in SafeMath logic may also be avoided with `unchecked` blocks, [see docs for more info](https://docs.soliditylang.org/en/v0.8.15/control-structures.html?highlight=unchecked#checked-or-unchecked-arithmetic).

### Sources

- https://consensys.github.io/smart-contract-best-practices/attacks/insecure-arithmetic/
