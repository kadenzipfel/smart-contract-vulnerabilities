# Unsupported Opcodes on EVM-Compatible Chains

## Preconditions
- Contract is intended for deployment on an EVM-compatible chain other than Ethereum mainnet (zkSync Era, Arbitrum, Optimism, Polygon, BNB Chain, etc.)
- The contract uses opcodes or patterns that are not supported or behave differently on the target chain

## Vulnerable Pattern
```solidity
// PUSH0 opcode: Solidity >=0.8.20 emits PUSH0
// Not supported on all chains — contract fails to deploy
pragma solidity 0.8.20;

contract Token {
    // Compiled bytecode contains PUSH0 — reverts on chains without support
}

// .transfer() on zkSync Era — 2300 gas stipend insufficient
function withdraw() external {
    // transfer() forwards only 2300 gas
    // On zkSync Era, basic operations cost more — this always reverts
    // Gemholic lost 921 ETH to this exact issue
    payable(msg.sender).transfer(amount);
}

// Dynamic create on zkSync Era
function deploy(bytes memory bytecode) external {
    assembly {
        // zkSync requires bytecode known at compile time
        // Runtime create from arbitrary bytecode fails
        let addr := create(0, add(bytecode, 0x20), mload(bytecode))
    }
}
```

## Detection Heuristics
1. Check the Solidity version: if >=0.8.20, verify the target chain supports the PUSH0 opcode
2. Search for `.transfer()` and `.send()` — these use a 2300 gas stipend that may be insufficient on chains with different gas cost structures (especially zkSync Era)
3. Search for assembly `create` / `create2` with runtime-supplied bytecode — this fails on zkSync Era
4. Search for `selfdestruct` — deprecated and non-functional on some chains post-Dencun
5. If the project targets multiple chains, cross-reference all opcodes used against each target chain's compatibility (use evmdiff.com)

## False Positives
- Contract is only deployed on Ethereum mainnet
- Solidity version is <0.8.20 (no PUSH0 emitted)
- `.call{value: amount}("")` is used instead of `.transfer()` (forwards all available gas)
- The project explicitly documents which chains are supported and tests against them

## Remediation
- Use `.call{value: amount}("")` instead of `.transfer()` or `.send()` for ETH transfers
- For multi-chain deployments, compile with Solidity <0.8.20 or use `--evm-version paris` to avoid PUSH0
- On zkSync Era, use compile-time known bytecode for contract creation
- Test deployments on each target chain before mainnet launch
- Use evmdiff.com to verify opcode compatibility per chain
```solidity
// Safe ETH transfer for all EVM chains
function withdraw(uint256 amount) external {
    (bool success,) = msg.sender.call{value: amount}("");
    require(success, "transfer failed");
}

// Avoid PUSH0: compile with Paris EVM target
// solc --evm-version paris
```
