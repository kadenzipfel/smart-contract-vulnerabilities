## Integer Overflow and Underflow
In solidity, integer data types have maximum and minimum values. An Integer overflow occurs when an integer exceeds the maximum value that can be stored in that integer type. Similarly, an integer underflow occurs when an integer goes below the minimum value for that integer type.

Example: The maximum value `uint8` can store is ``255``. When you store `256` in `uint8` it will overflow and the value will reset to 0. When you store `257`, the value will be `1`, `2` for `258` and so on. Similarly, if you try to store `-1` in `uint8` the value becomes `255`, and so on as it will underflow.

Some integer types and their min/max values:
| Type   |      Max      |  Min |
|----------|-------------|------|
| uint8 |  255 | 0 |
| uint16 | 65535 |   0 |
| uint24 | 16777215 | 0 |
| uint256 | 2<sup>256</sup> - 1 |  0 |

Since smaller integer types like: `uint8`, `uint16` etc have smaller maximum values, it can be easier to cause an overflow, thus they should be used with great caution.

To prevent over/underflows, the [Safe Math Library](https://github.com/ConsenSysMesh/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol) is often used by contracts with older versions of Solidity.

Solidity >=v0.8 protects against integer overflows and underflows by default through the use of built-in safe math functions.

It's important to consider that regardless of SafeMath logic being used, either built-in or used manually in older contracts, over/underflows still trigger reverts, which may result in [denial of service](https://github.com/kadenzipfel/smart-contract-vulnerabilities/blob/master/vulnerabilities/dos-revert.md) of important functionality or other unexpected effects. 

Even after the update of solidity to 0.8, there are scenarios in which integer overflows and underflows can still occur without the transaction reverting.

### Typecasting
The most common way in which integer over/underflow happens is when converting an integer of a larger data type to a smaller data type as seen below:

```solidity
uint256 public a = 258;
uint8 public b = uint8(a); // typecasting uint256 to uint8
```

The above code snippet will overflow and the `2` will be stored in the variable `b` due to the fact that maximum value in `uint8` data type is `255`. So, it will overflow and reset to `0` without reverting.

### Using Shift Operators
Overflow & underflow checks are not performed for shift operations! Thus, over/underflows can occur.

The left shift `<<` operator shifts all the bits in the first operand by the number specified in the second operand. Shifting an operand by 1 position is equivalent to multiplying it by 2, shifting 2 positions is equivalent to multiplying it by 4 and shifting 3 positions is equivalent to multiplying by 8. 

```solidity
uint8 public a = 100;
uint8 public b = 2;

uint8 public c = a << b;    // overflow as 100 * 4 > 255
```

In the above code, left shifting `a` which is `100` by 2 positions `b`, is equivalent to multiplying 100 by 4. So the result will overflow and the value in c will be `144` because `400-256` is `144`.

### Use of Inline Assembly:

In Solidity, inline assembly/YUL allows for low-level programming directly with EVM opcodes. This can be powerful but also risky because it lacks the built-in safety checks provided by Solidity, such as protections against overflow and underflow in arithmetic operations even if the Solidity version is >=v0.8

Consider the contract below:

```solidity
uint8 public a = 255;

function addition() public returns (uint8 result) {
    assembly {
        result := add(sload(a.slot), 1) // adding 1 will overflow and reset to 0
    }

    return result;
}
```

In the above code we are adding 1 into the variable with inline assembly and then returning the result. The variable result will overflow and 0 will be returned, despite this the contract will NOT throw an error or revert!


### Subtle Overflow with Smaller Integers (e.g., `uint128`)

When using smaller integers like `uint128`, a very subtle overflow can occur because inline assembly operates with 256-bit values.

Consider the contract below which provides a method to get a swap quote by adding one to the input amount:

```solidity
interface IDexPair {
    function getSwapQuoteUint128(uint128 amountToSwap) external view returns(uint128);
}

contract DexPair is IDexPair {
    function getSwapQuoteUint128(uint128 amountToSwap) external view returns(uint128 outputTokens) {
        assembly {
            outputTokens := add(amountToSwap, 1)
            if lt(outputTokens, amountToSwap) { revert(0, 0) }
        }
    }
}
```

- The problem is that the `add` opcode always produces a 256-bit result. For `uint128` maximum value (`type(uint128).max`), this will not overflow in the 256-bit space but will overflow when treated as `uint128`
    
- The inline assembly overflow check fails because the EVM uses 256-bit arithmetic, while the function is supposed to handle 128-bit values. This discrepancy allows an overflow to evade detection, causing the function to return incorrect results without reverting. Specifically, adding 1 to the maximum uint128 value (2^128 - 1) results in an overflow to 0 instead of triggering the overflow detection.


### Use of unchecked code block:
Performing arithmetic operations inside the unchecked block saves a lot of gas because it omits several checks and opcodes. But some of these opcodes are used in default arithmetic operations in 0.8 to check for underflow/overflow.

```solidity
uint8 public a = 255;

function uncheck() public{

  unchecked {
      a++;      // overflow and reset to 0 without reverting
  }

}
```
The unchecked code block is only recommended if you are sure that there is no possible way for the arithmetic to overflow or underflow.


### Mitigation Strategies

1. Consider using `addmod` for the subtle `uint128` integer overflow. The `addmod` operation confines the result within the `uint128` range.

```solidity
function getSwapQuoteUint128(uint128 amountToSwap) external view returns(uint128 outputTokens) {
    assembly {
        outputTokens := addmod(amountToSwap, 1, 340282366920938463463374607431768211455)
        if lt(outputTokens, amountToSwap) { revert(0, 0) }
    }
}
```

2. Consider performing a post-assembly check for the subtle `uint128` integer overflow. Perform an overflow check outside YUL using normal Solidity to ensure correct behavior for `uint128` as it will compare the 128-bit values.

```solidity
function getSwapQuoteUint128(uint128 amountToSwap) external view returns(uint128 outputTokens) {
    assembly {
        outputTokens := add(amountToSwap, 1)
    }
    require(outputTokens >= amountToSwap, "Overflow detected!");
}
```

3. Add a manual check. The below check for example ensures that if the result is less than the input, it indicates an overflow.

```solidity
function getSwapQuote(uint256 amountToSwap) external view returns(uint256 outputTokens) {
    assembly {
        outputTokens := add(amountToSwap, 1)
        if lt(outputTokens, amountToSwap) { revert(0, 0) }
    }
}
```


## Sources
1. https://docs.soliditylang.org/en/latest/080-breaking-changes.html
2. https://faizannehal.medium.com/how-solidity-0-8-protect-against-integer-underflow-overflow-and-how-they-can-still-happen-7be22c4ab92f
