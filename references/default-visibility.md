# Default Visibility

## Preconditions
- Functions or state variables are declared without an explicit visibility specifier
- For functions: Solidity <0.5.0 (compiler does not enforce explicit visibility; defaults to `public`)
- For state variables: any Solidity version (defaults to `internal`, but developer may have intended `private`)
- The function or variable performs sensitive operations or holds sensitive data

## Vulnerable Pattern
```solidity
// Solidity <0.5.0: function defaults to public
contract Wallet {
    address owner;

    // No visibility specified — defaults to public
    // Anyone can call this and take ownership
    function initWallet(address _owner) {
        owner = _owner;
    }

    // Internal helper exposed as public by default
    function _sendFunds(address to, uint256 amount) {
        payable(to).transfer(amount);
    }
}
```

## Detection Heuristics
1. Check the Solidity version: if <0.5.0, search for functions without `public`, `external`, `internal`, or `private` keywords
2. For any version, search for state variables without explicit visibility — they default to `internal`
3. For each function without explicit visibility, check if it modifies state or performs sensitive operations — these are exposed as `public` by default
4. Look for functions prefixed with `_` (convention for internal) that lack the `internal` keyword
5. In Solidity >=0.5.0, the compiler requires function visibility — but state variable visibility is still optional

## False Positives
- Solidity >=0.5.0 contracts: the compiler enforces function visibility, so missing function visibility won't compile
- State variable intended to be `internal` and correctly defaults to `internal`
- The function is genuinely intended to be `public`

## Remediation
- Always specify explicit visibility for all functions and state variables
- Upgrade to Solidity >=0.5.0 where function visibility is compiler-enforced
- Review all functions to ensure visibility matches intended access level
```solidity
contract Wallet {
    address private owner;

    function initWallet(address _owner) internal {
        owner = _owner;
    }

    function _sendFunds(address to, uint256 amount) private {
        payable(to).transfer(amount);
    }
}
```
