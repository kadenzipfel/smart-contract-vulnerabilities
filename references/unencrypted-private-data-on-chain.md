# Unencrypted Private Data On-Chain

## Preconditions
- Sensitive data (passwords, secrets, private keys, game answers) is stored in contract storage
- The developer relies on the `private` visibility modifier for confidentiality
- OR: sensitive data is passed as transaction calldata (publicly visible)

## Vulnerable Pattern
```solidity
contract SecretGame {
    // `private` only prevents OTHER CONTRACTS from reading
    // Anyone can read this via eth_getStorageAt(address, slot)
    bytes32 private secretAnswer;
    string private password;

    constructor(bytes32 _answer, string memory _pwd) {
        secretAnswer = _answer; // Visible in deployment tx calldata
        password = _pwd;        // Readable from storage slot
    }

    function guess(bytes32 _guess) external {
        // Attacker reads secretAnswer from storage first
        require(_guess == secretAnswer, "wrong");
        _reward(msg.sender);
    }
}
```

## Detection Heuristics
1. Search for state variables storing passwords, secrets, keys, answers, or seeds — regardless of visibility modifier
2. Check if any `private` variable is relied upon for confidentiality (not just access control)
3. Look for game/lottery logic where hidden information is stored on-chain before a reveal phase
4. Check constructor parameters and transaction calldata for sensitive values — these are publicly visible on block explorers
5. Search for comments like "secret", "hidden", "private key", "password" near storage declarations

## False Positives
- Data is encrypted or hashed before storage (e.g., commitment hash in a commit-reveal scheme)
- The `private` modifier is used correctly for access control between contracts, not for data confidentiality
- The "sensitive" data is actually public information (e.g., a contract address)

## Remediation
- Never store plaintext secrets on-chain — all storage is publicly readable
- Use commit-reveal schemes for hidden inputs: store `keccak256(secret || salt)` first, reveal later
- For truly private data, keep it off-chain and only store hashes/commitments on-chain
- Consider zero-knowledge proofs for verifiable computation on private data
```solidity
// Commit-reveal scheme
mapping(address => bytes32) public commitments;

function commit(bytes32 hash) external {
    // User submits keccak256(answer, salt) — answer stays private
    commitments[msg.sender] = hash;
}

function reveal(bytes32 answer, bytes32 salt) external {
    require(commitments[msg.sender] == keccak256(abi.encodePacked(answer, salt)));
    _processAnswer(msg.sender, answer);
}
```
