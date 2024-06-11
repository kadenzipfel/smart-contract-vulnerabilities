# Unexpected Balances in Smart Contracts

Unexpected balances in smart contracts can lead to significant accounting issues when the contract's logic relies on the balance for its operations. Two prominent examples of such issues are "force-feeding a contract" and inflation attacks.

## Force-Feeding

Force-feeding is a technique where Ether is sent directly to a smart contract without invoking any of its functions. This can disrupt the contract's internal accounting mechanisms, particularly if the contract relies on balance checks for its logic.

In typical smart contract operation, Ether is sent to a contract via a transaction that calls a payable function or invokes the `receive()` or `fallback()` functions. If a contract lacks these functions, transactions sending Ether to it will normally be reverted, ensuring the contract does not inadvertently receive funds.

Force-feeding bypasses this by sending Ether in a manner that doesn't require calling the contract's functions, thereby avoiding the checks and logic coded in Solidity.

### Force Feeding Methods

#### Block Rewards and Coinbase

In Proof of Stake systems like Ethereum, validators earn block rewards for successfully adding blocks to the blockchain. These rewards are sent to an address known as the **coinbase address**. Validators typically set this address to their own wallets, but an attacker-validator can set it to a target smart contract’s address.

Since block reward transfers are handled at the protocol level, they bypass Solidity-level checks. As a result, the target contract receives Ether directly as part of the block reward, regardless of any Solidity-coded restrictions.

## Inflation Attacks

An inflation attack target vault and vault-like smart contracts. These vaults act like investment pools that hold funds sent to it. The below shows how the attack occurs:

1. **A Vault Opens for Business:** A new vault opens, ready for investors to deposit funds.
2. **Attacker Sneaks in First:** A malicious actor makes the first deposit to such a vault either by frontrunning another investor or by monitoring new vault launches and makes a tiny deposit, e.g 1 wei before any real investors. This gives the attacker a small share of the vault.
3. **Attacker Inflates the Pot:** The attacker quickly deposits a large amount of money (by sending funds directly to the smart contract and not calling any function in the contract), inflating the total value in the vault. This is where the unexpected balance occurs!
4. **Real Investor Gets Squeezed:** An unsuspecting investor tries to deposit, but because of the attacker's sneaky first move, the exchange rate gets messed up.
5. **Investor Gets Nothing:** Due to the inflated value, the real investor ends up getting practically zero shares for their deposit.
6. **Attacker Cashes Out:** The attacker, now holding the only significant share, withdraws all the money from the vault.

