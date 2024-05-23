# Smart Contract Vulnerability Style Guide
This style guide outlines the formatting and content expectations for contributions to this repository, focusing on vulnerabilities in smart contracts deployed on Ethereum Virtual Machine [(EVM)-compatible](https://ethereum.org/en/developers/docs/evm/) chains.

## Document Structure
- *Markdown (.md) Files:* Content will primarily be authored in [markdown format](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) for improved readability and version control.
- *Consistent Naming:* Use descriptive file names that convey the vulnerability discussed. Examples: `unsupported-opcodes.md`, `default-visibility.md`.
- *Heading Hierarchy:* Utilize clear heading levels (##, ###, etc.) to structure content and improve navigation. 

## Content Guidelines
- *Vulnerability Type:* Identify the type of vulnerability at the beginning of the document (eg. Unsupported Opcodes, Reentrancy, Access Control).
- *Technical Explanation:* Provide a concise technical explanation of the vulnerability, including potential impact and exploit scenarios. Use code snippets where necessary to illustrate the issue.
- *Affected Chains (Optional):* Specify which EVM-compatible chains are susceptible to the vulnerability. Highlight any chain-specific considerations. 
- *Detection and Mitigation (Optional):* Outline recommended methods for detecting the vulnerability during smart contract audits and suggest mitigation strategies for developers. Tools and best practices can be included here. 
- *Examples (Optional):* If applicable, include real-world examples of smart contracts impacted by the vulnerability.
- *Severity Rating (Optional):* Consider incorporating a severity rating system to prioritize vulnerabilities based on potential impact.
- *Updating the README:* When you add a new vulnerability and its corresponding markdown file, remember to update `README.md` with the new entry. 

## Code Snippet Formatting
- *Code Blocks:* Use [markdown code blocks](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks) to present code snippets.
- *Syntax Highlighting:* Enable [syntax highlighting](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks#syntax-highlighting) for Solidity code using appriopriate markdown extensions or tools to enhance readability. 
- *Comments:* Include comments within code snippets where necessary to explain specific lines or logic.

## External References
- *Links:* Link to relevant resources such as official chain documentation, vulnerability reports, and blog posts for further exploration. 
- *Citations:* Use clear in-text citations and a dedicated "Sources" section to reference external sources. 

## Additional Considerations
- *Target Audience:* Tailor the level of technical detail to a broad audience with an interest in smart contract security. 
- *Concise and Actionable:* Focus on providing actionable information to help developers identify and prevent vulnerabilities.
- *Community Contributions:* Encourage community contributions and maintain a welcoming environment for pull requests and discussions. 
- *Versioning:* Maintain a clear versioning system to track updates and changes to vulnerabilities. 