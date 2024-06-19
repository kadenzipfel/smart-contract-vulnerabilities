## Precision Loss

Solidity uses fixed point arithmetic, that means it doesn't support decimal value. As a result, any decimal value is truncated. Thus, performing numerical operations can cause precision loss especially when division is performed before multiplication.

```solidity
uint a = 11;
uint b = 2;
uint c = 10;

function funcA() public {
    return a / b * c; 
}

function funcB() public {
    return a * c / b;
}
```

In the above code example, ``funcA()`` returns:
```soldiity
11 / 2 * 10 = 50
```
and ``funcB()`` returns:
```solidity
11 * 10 / 2 = 55
```
Solidity truncates any non-integer result to the nearest lower integer. Thus in ``funcA()``, instead of ``11 / 2 = 5.5``, ``0.5`` is truncated and the result amounts to ``5``. This results in the function returning ``50`` instead of ``55`` due to division before multiplication whereas multiplication before division returns the correct value.

Also, if the Numerator is lower than the Denominator during division, the result will be zero in solidity.

```solidity
uint num = 10;
uint den = 20;

function foo() public pure returns(uint result) {
  result = num / den; // returns 0
}
```

In regular math, the function ``foo()`` will return ``10 / 20 = 0.5``. But, the function returns ``0`` due to integer truncation in solidity. Therefore, It needs to be always made sure that numerator is greater than the denominator to avoid unexpected results.