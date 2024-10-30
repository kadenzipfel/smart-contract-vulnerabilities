## Integer Overflow and Underflow
In solidity, Integer types have maximum and minimum values. Integer overflow occurs when an integer variable exceeds the maximum value that can be stored in that variable type. Similarly, Integer underflow occurs when an integer variable goes below the minimum value for that variable type. Example: The maximum value ``uint8`` can store is ``255``. Now, when you store ``256`` in ``uint8`` it will overflow and the value will reset to 0. When you store ``257``, the value will be ``1``, ``2`` for ``258`` and so on. Similarly, if you try to store ``-1`` in the uint8 variable the value of the variable will become ``255``, and so on as it will underflow.

Some integer types and their min/max values:
| Type   |      Max      |  Min |
|----------|-------------|------|
| uint8 |  255 | 0 |
| uint16 | 65535 |   0 |
| uint24 | 16777215 | 0 |
| uint256 | 2^256 - 1 |  0 |

Since smaller integer types like: ``uint8``, ``uint16``, etc have smaller maximum values, it can be easier to cause an overflow, thus they should be used with greater caution.

To prevent over/underflows, [Safe Math Library](https://github.com/ConsenSysMesh/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol) is often used by contracts with older versions of Solidity but Solidity >=0.8 protects against integer overflows and underflows through the use of built-in safe math functions. It's important to consider that regardless of SafeMath logic being used, either built-in or used manually in older contracts, over/underflows still trigger reverts, which may result in [denial of service](https://github.com/kadenzipfel/smart-contract-vulnerabilities/blob/master/vulnerabilities/dos-revert.md) of important functionality or other unexpected effects. Even after the update of solidity to 0.8, there are scenarios in which the integer overflow and underflow can still occur without the transaction reverting.

### Typecasting
The most common way in which integer over/underflow is possible when you convert an integer of a larger uint data type to a smaller data type.
```solidity
uint256 public a = 258;
uint8 public b = uint8(a); // typecasting uint256 to uint8
```
The above code snippet will overflow and the ``2`` will be stored in the variable ``b`` due to the fact that maximum value in uint8 data type is ``255``. So, it will overflow and reset to ``0`` without reverting.

### Using Shift Operators
Overflow & underflow checks are not performed for shift operations like they are performed for other arithmetic operations. Thus, over/underflows can occur.

The left shift ``<<`` operator shifts all the beats in the first operand by the number specified in the second operand. Shifting an operand by 1 position is equivalent to multiplying it by 2, shifting 2 positions is equivalent to multiplying it by 4, and shifting 3 positions is equivalent to multiplying by 8. 

```solidity
uint8 public a = 100;
uint8 public b = 2;

uint8 public c = a << b; // overflow as 100 * 4 > 255
```
In the above code, left shifting ``a`` which is ``100`` by 2 positions ``b`` is equivalent to multiplying 100 by 4. So the result will overflow and the value in c will be ``144`` because ``400-256`` is ``144``.

### Use of Inline Assembly:
Inline Assembly in solidity is performed using YUL language. In YUL programming language, integer underflow & overflow is possible as compiler does not check automatically for it as YUL is a low-level language that is mostly used for making the code more optimized, which does this by omitting many opcodes.

```solidity
uint8 public a = 255;

function addition() public returns (uint8 result) {
    assembly {
        result := add(sload(a.slot), 1) // adding 1 will overflow and reset to 0
        // using inline assembly
    }

    return result;
}
```
In the above code we are adding ``1`` into the variable with inline assembly and then returning the result. The variable result will overflow and 0 will be returned, despite this the contract will not throw an error or revert.

### Use of unchecked code block:
Performing arithmetic operations inside the unchecked block saves a lot of gas because it omits several checks and opcodes. But, some of these opcodes are used in default arithmetic operations in 0.8 to check for underflow/overflow.

```solidity
uint8 public a = 255;

function uncheck() public{

  unchecked {
      a++;  // overflow and reset to 0 without reverting
  }

}
```
The unchecked code block is only recommended if you are sure that there is no possible way for the arithmetic to overflow or underflow.

### Sources

- [Solidity Documentation - 0.8.0 Breaking Changes](https://docs.soliditylang.org/en/latest/080-breaking-changes.html)
- [Medium - How Solidity 0.8 Protects Against Integer Underflow/Overflow and How They Can Still Happen](https://faizannehal.medium.com/how-solidity-0-8-protect-against-integer-underflow-overflow-and-how-they-can-still-happen-7be22c4ab92f)
