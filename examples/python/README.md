# ToTallman — Python Example

Demonstrates the ToTallman Python library using both the `DEFAULT` and `AU` lists.

## Prerequisites

Python 3.9+.

## Run

Install the library from the local source, then run the example:

```powershell
# From the repo root:
pip install ./languages/python
python examples/python/example.py
```

## Expected output

```
Input:   Prescribe vincristine and vinblastine carefully; prednisone requires monitoring.
DEFAULT: Prescribe vinCRISTine and vinBLASTine carefully; predniSONE requires monitoring.
AU:      Prescribe vinCRISTine and vinBLASTine carefully; prednisone requires monitoring.
```

Note that `prednisone` is only in the `DEFAULT` list, not `AU` — the output differs between lists.

With custom input text:

```powershell
python examples/python/example.py "prednisone and prednisolone"
```
