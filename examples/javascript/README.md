# ToTallman — JavaScript Example

Demonstrates the ToTallman JavaScript library using both the `DEFAULT` and `AU` lists.

## Prerequisites

Node.js 18+.

## Run

Build the library first, then install and run the example:

```powershell
# From the repo root — build the library once:
cd languages/js
npm install
npm run build
cd ../..

# Install example dependencies and run:
cd examples/javascript
npm install
npm start
```

With custom input text:

```powershell
node examples/javascript/example.js "prednisone and prednisolone"
```

## Expected output

```
Input:   Prescribe vincristine and vinblastine carefully; prednisone requires monitoring.
DEFAULT: Prescribe vinCRISTine and vinBLASTine carefully; predniSONE requires monitoring.
AU:      Prescribe vinCRISTine and vinBLASTine carefully; prednisone requires monitoring.
```

Note that `prednisone` is only in the `DEFAULT` list, not `AU` — the output differs between lists.
