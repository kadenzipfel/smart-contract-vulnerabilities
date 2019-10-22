## State Variable Default Visibility

It's common for developers to explicitly declare function visibility, but not so common to declare variable visibility. State variables can have one of three visibility identifiers: `public`, `internal`, or `private`. Luckily, the default visibility for variables is internal and not public, but even if you intend on declaring a variable as internal, it's important to be explicit so that there are no incorrect assumptions as to who can access the variable.

### Sources

https://swcregistry.io/docs/SWC-108
https://consensys.github.io/smart-contract-best-practices/recommendations/#explicitly-mark-visibility-in-functions-and-state-variables