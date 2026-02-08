# Asserting Contract from Code Size

## Preconditions
- Contract uses `extcodesize` or `address.code.length` to check whether an address is an EOA vs. a contract
- This check gates access control, anti-bot logic, or security-sensitive operations
- The check assumes that code size == 0 means EOA

## Vulnerable Pattern
```solidity
modifier onlyEOA() {
    // During constructor execution, extcodesize returns 0
    // An attacker calling from their constructor bypasses this check
    require(msg.sender.code.length == 0, "no contracts");
    _;
}

function mint() external onlyEOA {
    _mint(msg.sender, 1);
}

// Assembly variant
function isContract(address addr) internal view returns (bool) {
    uint256 size;
    assembly { size := extcodesize(addr) }
    return size > 0; // Returns false during constructor
}
```

## Detection Heuristics
1. Search for `extcodesize`, `.code.length`, or helper functions named `isContract`
2. Check if the result is used to gate access (e.g., `require(... == 0)` to allow only EOAs)
3. If used for EOA-only enforcement, flag it — contracts calling from their constructor have code size 0
4. Also check for `tx.origin == msg.sender` as an alternative EOA check — flag it as incompatible with account abstraction (ERC-4337) and smart contract wallets
5. Check if the "no contracts" logic protects anything security-sensitive (minting limits, anti-bot, etc.)

## False Positives
- `extcodesize` is used to check if a contract EXISTS at an address (not to distinguish EOA vs contract)
- The check is combined with other protections that don't rely solely on code size
- The function has no security implications if called by a contract

## Remediation
- There is no fully reliable on-chain method to distinguish EOAs from contracts
- Redesign logic to not depend on this distinction — make the system work correctly regardless of caller type
- If EOA-only behavior is truly needed, consider off-chain verification (e.g., signed messages from known EOAs)
- Remove `isContract` checks from security-critical paths
```solidity
// Instead of gating by caller type, use per-address limits
mapping(address => bool) public hasMinted;

function mint() external {
    require(!hasMinted[msg.sender], "already minted");
    hasMinted[msg.sender] = true;
    _mint(msg.sender, 1);
}
```
