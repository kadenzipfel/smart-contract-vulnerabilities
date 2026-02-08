# Missing Protection Against Signature Replay

## Preconditions
- Contract verifies ECDSA signatures for authorization
- The signed message does not include a nonce, OR does not include the contract address, OR does not include the chain ID
- No mechanism tracks which signatures have been processed

## Vulnerable Pattern
```solidity
function executeWithSig(address to, uint256 amount, bytes memory sig) external {
    // Missing: nonce, contract address, and chain ID in hash
    // Same signature can be replayed on same contract, other contracts, or other chains
    bytes32 hash = keccak256(abi.encodePacked(to, amount));
    address signer = ECDSA.recover(hash, sig);
    require(signer == authorizer, "invalid sig");

    // No nonce tracking — same signature can be submitted repeatedly
    _transfer(to, amount);
}
```

## Detection Heuristics
1. Search for `ecrecover` or `ECDSA.recover` usage
2. Examine what is included in the signed hash — check for:
   - Nonce: is there a per-signer incrementing nonce? Flag if absent (enables same-contract replay)
   - Contract address (`address(this)`): flag if absent (enables cross-contract replay)
   - Chain ID (`block.chainid`): flag if absent (enables cross-chain replay)
3. Check if processed signatures/hashes are tracked in a mapping to prevent reuse
4. Check if EIP-712 domain separator is used (it includes contract address and chain ID automatically)
5. Verify that the nonce is incremented BEFORE execution, not after (to prevent reentrancy-based replay)

## False Positives
- EIP-712 domain separator is used with proper nonce tracking (covers address + chainId + nonce)
- The signed message includes all three: nonce, contract address, and chain ID
- The signature authorizes a one-time action that is inherently non-replayable (e.g., EIP-2612 permit with deadline and nonce)

## Remediation
- Include nonce, `address(this)`, and `block.chainid` in the signed message hash
- Track processed nonces per signer in a mapping
- Use EIP-712 structured data signing with a domain separator
```solidity
mapping(address => uint256) public nonces;

function executeWithSig(address to, uint256 amount, bytes memory sig) external {
    uint256 nonce = nonces[msg.sender]++;
    bytes32 hash = keccak256(abi.encodePacked(
        to, amount, nonce, address(this), block.chainid
    ));
    bytes32 ethHash = ECDSA.toEthSignedMessageHash(hash);
    address signer = ECDSA.recover(ethHash, sig);
    require(signer == authorizer, "invalid sig");
    _transfer(to, amount);
}
```
