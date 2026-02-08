# Signature Malleability

## Preconditions
- Contract uses ECDSA signatures for authorization or deduplication
- Signatures are tracked by their raw bytes (e.g., `mapping(bytes => bool)`) to prevent replay
- No enforcement that the `s` value is in the lower half of the curve order

## Vulnerable Pattern
```solidity
mapping(bytes => bool) public usedSignatures;

function claimReward(bytes memory signature, uint256 amount) external {
    // Deduplication by raw signature bytes
    require(!usedSignatures[signature], "already used");

    bytes32 hash = keccak256(abi.encodePacked(msg.sender, amount));
    address signer = ecrecover(hash, v, r, s);
    require(signer == trustedSigner);

    usedSignatures[signature] = true; // Attacker submits (r, n-s, flipped_v)
    // to bypass this check with a valid but different signature
    _payout(msg.sender, amount);
}
```

## Detection Heuristics
1. Search for `mapping(bytes => bool)` or any mapping keyed by raw signature bytes
2. If signatures are used as mapping keys for deduplication, flag it — an attacker can compute the complementary `(r, n-s)` signature
3. Check if `ecrecover` is called directly without an `s`-value range check
4. Check if OpenZeppelin's ECDSA library is used (it enforces lower-s normalization)
5. If neither a library nor a manual `s < secp256k1n/2` check is present, flag it

## False Positives
- Signatures are deduplicated by message hash or nonce, not by raw signature bytes
- OpenZeppelin's `ECDSA.recover` is used, which rejects high-s signatures
- Manual check enforces `s <= 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0`

## Remediation
- Track used signatures by message hash or nonce, not by raw signature bytes
- Use OpenZeppelin's `ECDSA.recover` which enforces `s` in the lower half of the curve order
- If using raw `ecrecover`, add a manual `s`-value check
```solidity
// Use nonce-based deduplication instead of signature bytes
mapping(address => uint256) public nonces;

function claimReward(uint8 v, bytes32 r, bytes32 s, uint256 amount) external {
    uint256 nonce = nonces[msg.sender]++;
    bytes32 hash = keccak256(abi.encodePacked(msg.sender, amount, nonce));
    address signer = ECDSA.recover(hash, v, r, s); // Rejects malleable sigs
    require(signer == trustedSigner);
    _payout(msg.sender, amount);
}
```
