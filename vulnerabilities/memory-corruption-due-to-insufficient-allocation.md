# Memory Corruption Due to Insufficient Memory Allocation

Memory corruption occurs when a program writes outside the bounds of allocated memory, potentially overwriting other important data.

In Solidity, especially when using inline assembly, it's crucial to allocate enough memory to avoid memory corruption issues.

Below is an example heavily borrowed off and simplified from [this](https://solodit.xyz/issues/memory-corruption-in-buffer-fixed-consensys-ens-permanent-registrar-markdown) Ethereum Name Service(ENS) audit to demonstrate the issue:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import {Test} from "forge-std/Test.sol";

// finding   : https://solodit.xyz/issues/memory-corruption-in-buffer-fixed-consensys-ens-permanent-registrar-markdown
// code from : https://github.com/ensdomains/buffer/blob/c06d796e2f6086473d229a96c2eb75053a19b8ec/contracts/Buffer.sol

library Buffer {

    struct buffer {
        bytes buf;
        uint capacity;
    }

    function init(buffer memory buf, uint capacity) internal pure returns(buffer memory) {
        if (capacity % 32 != 0) {
            capacity += 32 - (capacity % 32);
        }
        // Allocate space for the buffer data
        buf.capacity = capacity;

        assembly {
            let ptr := mload(0x40)
            mstore(buf, ptr)
            mstore(ptr, 0)

            // does not account for length 0x20 (32), even though the `write` function does
            mstore(0x40, add(ptr, capacity))
            /// @audit fix: mstore(0x40, add(32, add(ptr, capacity)))
        }
        return buf;
    }

    function append(buffer memory buf, bytes memory data) internal pure returns (buffer memory) {
        return write(buf, buf.buf.length, bytes32(data), data.length);
    }

    function write(buffer memory buf, uint off, bytes32 data, uint len) private pure returns(buffer memory) {
        if (len + off > buf.capacity) {
            resize(buf, max(buf.capacity, len) * 2);
        }

        uint mask = 256 ** len - 1;
        // Right-align data
        data = data >> (8 * (32 - len));

        assembly {
            // Memory address of the buffer data
            let bufptr := mload(buf)

            // Address = buffer address + sizeof(buffer length) + off + len
            let dest := add(add(bufptr, off), len)

            mstore(dest, or(and(mload(dest), not(mask)), data))
            // Update buffer length if we extended it

            if gt(add(off, len), mload(bufptr)) {
                mstore(bufptr, add(off, len))
            }
        }
        return buf;
    }

    function resize(buffer memory buf, uint capacity) private pure {
        bytes memory oldbuf = buf.buf;
        init(buf, capacity);
        append(buf, oldbuf);
    }

    function max(uint a, uint b) private pure returns(uint) {
        if (a > b) {
            return a;
        }
        return b;
    }

}
```

A library `Buffer` is used to manage a dynamically-sized byte array (`bytes`) with a specific capacity. The library contains functions to initialize the buffer (`init`), add data (`append`) and write data to the buffer (`write`)


```solidity
contract BufferTest is Test {
    using Buffer for Buffer.buffer;

    function test_MemoryCorruption() external {
        Buffer.buffer memory buffer;
        buffer.init(1);

        // `foo` immediately follows buffer.buf in memory
        bytes memory foo = new bytes(0x01);

        // sanity check passes
        assert(1 == foo.length);

        // append "A" 0x41 (65) to buffer. This gets written to the high order byte of `foo.length`
        buffer.append("A");

        /** 
         * foo.length == 0x4100000000000000000000000000000000000000000000000000000000000001
         * == 29400335157912315244266070412362164103369332044010299463143527189509193072641
         * the below assertion passes showing the memory corruption
         */
        
        assertEq(29400335157912315244266070412362164103369332044010299463143527189509193072641, foo.length);
         
    }
}
```

- The above foundry test is borrowed from the amazing work of [Dacian](https://x.com/DevDacian)

### Memory Corruption Explained

1. **Initialization**:
    - `Buffer::init` initializes a buffer with a specified capacity.
    - Memory allocation is done using `mstore`, and the Free Memory Pointer Address (FMPA) is updated.

2. **Memory Corruption**:
    - In the test, `foo` is a new byte array created right after the buffer in memory.
    - When `buffer.append("A")` is called, it writes data into the buffer.
    - Due to insufficient memory allocation, this write operation overwrites the memory allocated for `foo`

3. **Demonstrating the Issue**:
    - The `append` function ultimately calls `write`, which calculates the destination address in memory and writes the data.
    - This write corrupts adjacent memory, i.e `foo.length`


Run the test in foundry's debugger using

```
forge test --match-contract BufferTest --debug test_MemoryCorruption
```

and examine in details how this memory corruption happens

## Mitigating the issue

To prevent memory corruption, ensure the allocation accounts for the length of the buffer:

```solidity
function init(buffer memory buf, uint capacity) internal pure returns(buffer memory) {
    if (capacity % 32 != 0) {
        capacity += 32 - (capacity % 32);
    }
    buf.capacity = capacity;
    assembly {
        let ptr := mload(0x40)
        mstore(buf, ptr)
        mstore(ptr, 0)
        mstore(0x40, add(32, add(ptr, capacity)))
    }
    return buf;
}
```

Applying the suggested fix results in `foo.length` being written to `0x140` which prevents the memory corruption.


## Sources
- Heavily borrowed from: [Heading Memory Corruption Due To Insufficient Allocation](https://dacian.me/solidity-inline-assembly-vulnerabilities#heading-memory-corruption-due-to-insufficient-allocation)
- [Slot Confusion Leading to Corrupted Reserve Amounts](https://solodit.xyz/issues/m-02-due-to-slot-confusion-reserve-amounts-in-the-pump-will-be-corrupted-resulting-in-wrong-oracle-values-code4rena-basin-basin-git)
- [Bit Shifting Errors Leading to Corrupted Reserve Amounts](https://solodit.xyz/issues/m-03-due-to-bit-shifting-errors-reserve-amounts-in-the-pump-will-be-corrupted-resulting-in-wrong-oracle-values-code4rena-basin-basin-git)
- [ENS Audit](https://solodit.xyz/issues/memory-corruption-in-buffer-fixed-consensys-ens-permanent-registrar-markdown)
