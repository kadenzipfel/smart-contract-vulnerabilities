## Use of Deprecated Functions

As time goes by, functions in Solidity are deprecated and often replaced with better functions. It's important to not use deprecated functions, as it can lead to unexpected effects and compilation errors.

Here is a list of deprecated functions and alternatives. Many alternatives are simply aliases, and won't break current behaviour if used as a replacement for its deprecated counterpart.

| Deprecated              | Alternatives              |
| :---------------------- | ------------------------: |
| `suicide(address)`      |	`selfdestruct(address)`   |
| `block.blockhash(uint)` |	`blockhash(uint)`         |
| `sha3(...)`	            | `keccak256(...)`          |
| `callcode(...)`	        | `delegatecall(...)`       |
| `throw`	                | `revert()`                |
| `msg.gas`	              | `gasleft`                 |
| `constant`              | `view`                    |
| `var`	                  | `corresponding type name` |

### Sources

https://swcregistry.io/docs/SWC-111
https://github.com/ethereum/solidity/releases