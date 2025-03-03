## Caching Storage in Memory

Storage variables such as structs are often loaded into memory for efficiency. When incorrectly handled, this can lead to inconsistent state updates. This type of vulnerability can manifest when developers cache storage values in memory variables but either fail to update the storage after modifying the memory variables or incorrectly synchronize between memory and storage.

### Storage vs Memory in Solidity

In Solidity, `storage` refers to data that is persistently stored on the blockchain, while `memory` is temporary and exists only during function execution. Reading from storage is expensive, so developers often cache storage values in memory to reduce gas costs. However, this optimization can lead to vulnerabilities if not handled correctly. 

### Self-transfer Free Minting Bug

One common example of this vulnerability is the "self-transfer free minting" bug, where tokens can be minted for free by exploiting incorrect memory handling during self-transfers.

```solidity
struct UserData {
    bytes32 id;
    uint256 balance;
    address account;
}

mapping(address => UserData) public users;

// VULNERABLE
function transfer(address from, address to, uint248 transferValue)  {   
    UserData memory _accountFrom = users[from];
    if (blacklisted[_accountFrom.id]) revert();
    
    UserData memory _accountTo = users[to];
    if (blacklisted[_accountTo.id]) revert();
    
    if (_accountFrom.balance < transferValue) revert();

    users[from].balance = _accountFrom.balance - transferValue;
    
    // CRITICAL BUG
    // When from == to, the _accountTo.balance was cached before
    // _accountFrom.balance was reduced so it increases the user balance.
    users[to].balance = _accountTo.balance + transferValue;
    
    emit Transfer(from, to, transferValue);
}
```

In this example, when a user transfers tokens to themselves (from = to), the vulnerability emerges. The function first caches the account data for both the sender and recipient in memory. When the addresses are the same, these are logically the same storage slot, but two different memory variables are created.

1. `_accountDataFrom` is loaded with the current balance
2. `accountDataTo` is also loaded with the same current balance
3. When updating storage, the sender's balance is reduced by `transferValue`
4. The recipient's balance is then increased by `transferValue`, but using the cached value in `accountDataTo` which does not reflect the reduction that just happened

This allows users to artificially increase their token balance by executing self-transfers, effectively minting tokens without authorization.

### Stale Struct State Bug

Another example is when a struct is cached in memory, then modified, but not correctly written back to storage:

```solidity
// VULNERABLE
struct UserAccount {
    uint256 balance;
    uint256 reward;
    uint256 lastUpdateTime;
    bool isActive;
}

mapping(address => UserAccount) public accounts;

function updateAccountAndClaim(address user) external {
    // Cache the account in memory
    UserAccount memory account = accounts[user];
    
    // Calculate new rewards
    uint256 timeElapsed = block.timestamp - account.lastUpdateTime;
    uint256 newRewards = calculateRewards(account.balance, timeElapsed);
    
    account.reward += newRewards; // Update memory values
    
    // Transfer rewards
    if (account.reward > 0 && account.isActive) {
        uint256 amountToTransfer = account.reward;
        account.reward = 0; // Reset rewards in memory
        
        // External call
        (bool success, ) = user.call{value: amountToTransfer}("");
        require(success, "Transfer failed");
    }
    
    // Update only timestamp in storage, forgetting to update the reward field
    accounts[user].lastUpdateTime = block.timestamp;
    
}
```

In this case, the function caches the user's account in memory, updates the reward, then transfers rewards to the user. However, it only writes the updated timestamp back to storage, forgetting to update the reward field. As a result, users can claim the same rewards multiple times because the reward balance in storage remains unchanged.


### Prevention Methods

To prevent vulnerabilities related to caching storage in memory:

1. **Be extra careful when caching storage into memory** - Ensure all updated members are written back to storage after modification.


2. **Use fuzz testing** - A simple fuzz test can catch these issues by testing edge cases like self-transfers.

```solidity
function testFuzz_TransferSelfAndOthers(address from, address to, uint248 amount) public {
    // Store balances before transfer
    uint256 balanceFromBefore = token.balanceOf(from);
    uint256 balanceToBefore = token.balanceOf(to);
    
    // Execute transfer
    vm.prank(from);
    token.transfer(to, amount);
    
    // Assert correct balances whether self-transfer or not
    assertEq(token.balanceOf(from), balanceFromBefore - amount);
    assertEq(token.balanceOf(to), balanceToBefore + amount);
}
```

### Sources

- [Self transfer can lead to unlimited mint ](https://solodit.cyfrin.io/issues/h-01-self-transfer-can-lead-to-unlimited-mint-code4rena-notional-notional-git)
- [Mint PerpetualYieldTokens for free by self-transfer](https://solodit.cyfrin.io/issues/mint-perpetualyieldtokens-for-free-by-self-transfer-spearbit-timeless-pdf)
- [Smart Contract Auditing Heuristics](https://github.com/OpenCoreCH/smart-contract-auditing-heuristics?tab=readme-ov-file#behavior-when-src--dst)

