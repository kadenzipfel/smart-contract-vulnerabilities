# Hash Collision with abi.encodePacked()

## Preconditions
- Contract uses `abi.encodePacked()` to encode data before hashing (typically with `keccak256`)
- Two or more adjacent arguments in the `encodePacked` call are variable-length types (strings, bytes, dynamic arrays)
- The resulting hash is used for authentication, deduplication, or signature verification

## Vulnerable Pattern
```solidity
function verify(string memory a, string memory b, bytes memory sig) external {
    // abi.encodePacked("a", "bc") == abi.encodePacked("ab", "c")
    // Attacker shifts bytes between arguments to forge a valid hash
    bytes32 hash = keccak256(abi.encodePacked(a, b));
    require(ECDSA.recover(hash, sig) == trustedSigner);
    _execute(a, b);
}

// Array variant:
// abi.encodePacked([addr1, addr2], [addr3])
//   == abi.encodePacked([addr1], [addr2, addr3])
```

## Detection Heuristics
1. Search for `abi.encodePacked(` calls
2. Check how many arguments are variable-length types (string, bytes, dynamic arrays like `address[]`, `uint256[]`)
3. If two or more adjacent arguments are variable-length, flag it — elements can be shifted between arguments to produce an identical encoding
4. Check if the packed result feeds into `keccak256` for security-sensitive purposes (signature verification, access control, deduplication)
5. If only one argument is variable-length, or all arguments are fixed-length (address, uint256, bool), it is safe

## False Positives
- Only one argument is a variable-length type (no adjacent dynamic types to shift between)
- All arguments are fixed-length types (address, uint256, bytes32, bool, etc.)
- `abi.encode()` is used instead of `abi.encodePacked()` (includes length prefixes, no collision)
- The hash is not used for any security-sensitive purpose

## Remediation
- Replace `abi.encodePacked()` with `abi.encode()` — it includes length prefixes that prevent collisions
- If `encodePacked` must be used for gas efficiency, ensure at most one argument is a variable-length type
- Alternatively, separate variable-length arguments with fixed-length delimiters
```solidity
// Safe: abi.encode includes length prefixes
bytes32 hash = keccak256(abi.encode(a, b));

// Also safe: only one variable-length argument
bytes32 hash = keccak256(abi.encodePacked(fixedAddr, dynamicString));
```
