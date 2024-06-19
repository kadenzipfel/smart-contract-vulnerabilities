## Unbounded Return Data

The [Byzantium](https://blog.ethereum.org/2017/10/12/byzantium-hf-announcement) 2017 mainnet hard-fork introduced [EIP-211](https://eips.ethereum.org/EIPS/eip-211). This EIP established an arbitrary-length return data buffer as well as 2 new opcodes: `RETURNDATASIZE` and `RETURNDATACOPY`. This enables callers to copy all or part of the return data from an external call to memory. The variable length buffer is created empty for each new call-frame. Previously, the size of the return data had to be specified in advance in the call parameters.

However under Solidity's implementation, up until at least `0.8.26`, the entirety of this return data is automatically copied from the buffer into memory. This is true even when using a Solidity low-level call with the omission of the `bytes memory data` syntax.

Consider the following example:

```solidity
pragma solidity 0.8.26;

contract Attacker {
    function returnExcessData() external pure returns (string memory) {
        revert("Passing in excess data that the Solidity compiler will automatically copy to memory");   // Both statements can return unbounded data
        return "Passing in excess data that the Solidity compiler will automatically copy to memory";
    }
}


contract Victim {
    function callAttacker(address attacker) external returns (bool) {
        (bool success, ) = attacker.call{gas: 2500}(abi.encodeWithSignature("returnExcessData()"));
        return success;
    }
}
```

In the above example one can observe that even though the `Victim` contract has not explicitly requested `bytes memory data` to be returned, and has furthermore given the external call a gas stipend of 2500, Solidity will still invoke `RETURNDATACOPY` during the top-level call-frame. This means the `Attacker` contract, through revert or return, can force the `Victim` contract to consume unbounded gas during their own call-frame and not that of the `Attacker`. Given that memory gas costs grow exponentially after 23 words, this attack vector has the potential to prevent certain contract flows from being executed due to an `Out of Gas` error. Examples of vulnerable contract flows include unstaking or undelegating funds where a callback is involved. Here the user may be prevented from unstaking or undelegating their funds, because the transaction reverts due to insufficient gas.

### Mitigation

The recommended mitigation approach is to use Yul to make the low-level call, whilst only allowing bounded return data. This method completely cuts off the attack vector for any arbitrary external call.

Consider the following example from EigenLayer's original mainnet `DelegationManager.sol` contract. In this contract, delegators could delegate and undelegate their restaked assets to a manager, and each of these delegation flows had its own callback hook to an arbitrary external contract the manager specified. However the manager could use their arbitrary external contract to return unbounded data, causing the delegator to run out of gas, and thus not be able to undelegate their assets from that manager.

Therefore to mitigate this griefing risk entirely, EigenLayer used a Yul call, where they limit the return data size to 1 word. If the external manager contract tries to return any more data than this, the excess of 32 bytes simply won't be copied to memory.

```solidity
    function _delegationWithdrawnHook(
        IDelegationTerms dt,
        address staker,
        IStrategy[] memory strategies,
        uint256[] memory shares
    )
        internal
    {
        /**
         * We use low-level call functionality here to ensure that an operator cannot maliciously make this function fail in order to prevent undelegation.
         * In particular, in-line assembly is also used to prevent the copying of uncapped return data which is also a potential DoS vector.
         */
        // format calldata
        bytes memory lowLevelCalldata = abi.encodeWithSelector(IDelegationTerms.onDelegationWithdrawn.selector, staker, strategies, shares);
        // Prepare memory for low-level call return data. We accept a max return data length of 32 bytes
        bool success;
        bytes32[1] memory returnData;
        // actually make the call
        assembly {
            success := call(
                // gas provided to this context
                LOW_LEVEL_GAS_BUDGET,
                // address to call
                dt,
                // value in wei for call
                0,
                // memory location to copy for calldata
                add(lowLevelCalldata, 32),
                // length of memory to copy for calldata
                mload(lowLevelCalldata),
                // memory location to copy return data
                returnData,
                // byte size of return data to copy to memory
                32
            )
        }
        // if the call fails, we emit a special event rather than reverting
        if (!success) {
            emit OnDelegationWithdrawnCallFailure(dt, returnData[0]);
        }
    }
```

### Sources

- [Solidity Issue #12306](https://github.com/ethereum/solidity/issues/12306)
- [ExcessivelySafeCall Repository](https://github.com/nomad-xyz/ExcessivelySafeCall)
- [DelegationManager.sol (lines 259-299)](https://github.com/Layr-Labs/eigenlayer-contracts/blob/0139d6213927c0a7812578899ddd3dda58051928/src/contracts/core/DelegationManager.sol#L259-L299)