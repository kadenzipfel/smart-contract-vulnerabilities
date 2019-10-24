## Write to Arbitrary Storage Location

Only authorized addresses should have access to write to sensitive storage locations. If there isn't proper authorization checks throughout the contract, a malicious user may be able to overwrite sensitive data. However, even if there are authorization checks for writing to sensitive data, an attacker may still be able to overwrite the sensitive data via insensitive data. This could give an attacker access to overwrite important variables such as the contract owner. 

To prevent this from occuring, we not only want to protect sensitive data stores with authorization requirements, but we also want to ensure that writes to one data structure cannot inadvertently overwrite entries of another data structure.

### Sources

- https://swcregistry.io/docs/SWC-124
- https://github.com/Arachnid/uscc/tree/master/submissions-2017/doughoyte