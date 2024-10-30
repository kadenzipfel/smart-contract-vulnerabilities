# Unsupported Opcodes

EVM-compatible chains, such as zkSync Era, BNB Chain, Polygon, Optimism and Arbitrum implement the Ethereum Virtual Machine (EVM) and its opcodes. However, opcode support can vary across these chains, which can lead to bugs and issues if not considered during smart contract development and deployment.

## PUSH0 Opcode Compatibility
The `PUSH0` opcode was introduced during the Shanghai hard fork of the Shapella upgrade (Solidity v0.8.20) and is available in certain EVM-compatible chains. However, not all chains have implemented support for this opcode yet.

### Is `PUSH0` supported:
1. Ethereum: YES
2. Arbitrum One: YES
3. Optimism: YES
4. ...

More chain differences and opcode support can be found on: [evmdiff.com](https://www.evmdiff.com)

You can also check compatibility by running the following command assuming you have Foundry set up:

```bash
cast call --rpc-url $ARBITRUM_RPC_URL --create 0x5f
```

Getting a `0x` response from running the above command means the opcode is supported; an error indicates the opcode isn't supported on that chain.

## CREATE and CREATE2 on zkSync Era
On zkSync Era, contract deployment uses the hash of the bytecode and the `factoryDeps` field of EIP712 transactions contains the bytecode. The actual deployment occurs by providing the contract's hash to the `ContractDeployer` system contract.

To ensure that `create` and `create2` functions operate correctly, the compiler MUST be aware of the bytecode of the deployed contract in advance. The compiler interprets the calldata arguments as incomplete input for `ContractDeployer`, with the remaining part filled in by the compiler internally. The Yul `datasize` and `dataoffset` instructions have been adjusted to return the constant size and bytecode hash rather than the bytecode itself.

The following code will not function correctly because the compiler is not aware of the bytecode beforehand but will work fine on Ethereum Mainnet:

```solidity
function myFactory(bytes memory bytecode) public {
   assembly {
      addr := create(0, add(bytecode, 0x20), mload(bytecode))
   }
}
```

## `.transfer()` on zkSync Era
The `transfer()` function in Solidity is limited to 2300 gas, which can be insufficient if the receiving contract's fallback or receive function involves more complex logic. This can lead to the transaction reverting if the gas limit is exceeded.

It is for this exact reason that the Gemholic project on zkSync Era locked its 921 ETH that was raised during the Gemholic token sale making the funds inaccessible. 

This was because the contract deployment did not account for zkSync Era's handling of the `.transfer()` function.

### Sources

- [zkSync Era docs](https://docs.zksync.io/build/developer-reference/differences-with-ethereum.html#create-create2)
- [CodeHawks first flight submission: The TokenFactory.sol can't deploy on the ZKSync Era](https://www.codehawks.com/submissions/clomptuvr0001ie09bzfp4nqw/4)
- [GemstoneIDO Contract Issue Analysis on Medium](https://medium.com/coinmonks/gemstoneido-contract-stuck-with-921-eth-an-analysis-of-why-transfer-does-not-work-on-zksync-era-d5a01807227d)