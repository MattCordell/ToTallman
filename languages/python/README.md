# ToTallman v2.0.0 - Python Implementation

Cross-language Tall Man lettering library for medication safety.

## Overview

This is the Python implementation of ToTallman, which converts medication names to Tall Man
lettering format using mixed case (e.g., "predniSONE") to prevent medication errors by
highlighting distinguishing characters in look-alike, sound-alike (LASA) drug names.

## Features

- ✅ **Unicode-safe**: Proper NFC normalization and casefolding
- ✅ **Character-by-character iteration**: No regex, deterministic behaviour
- ✅ **Multi-word drug support**: Handles "MS Contin", "isopto CARpine"
- ✅ **Hyphenated drugs**: Supports "SOLU-medrol", "DEPO-medrol"
- ✅ **Multiple lists**: DEFAULT, AU, FDA, ISMP, NZ
- ✅ **Build-time embedding**: Zero runtime I/O, embedded dictionaries
- ✅ **100% canonical pass rate**: Passes all 98 canonical tests
- ✅ **Byte-identical output**: Verified against C# reference via parity check
- ✅ **Typed**: PEP 561 py.typed marker, strict mypy-clean

## Quick Start

### Installation

```bash
pip install totallman
```

### Usage

```python
from totallman import to_tallman

# Basic usage (DEFAULT list)
result = to_tallman("Patient prescribed prednisone")
# Returns: "Patient prescribed predniSONE"

# Specify a different list
result = to_tallman("Use vincristine", "FDA")
# Returns: "Use vinCRIStine"

# Multi-word drugs
result = to_tallman("Patient needs ms contin")
# Returns: "Patient needs MS Contin"

# Hyphenated drugs
result = to_tallman("Administer solu-medrol")
# Returns: "Administer SOLU-medrol"

# None input returns empty string
result = to_tallman(None)
# Returns: ""
```

## Building from Source

### Prerequisites

- Python 3.9 or later
- Node.js (to run the shared list compiler)

### Build Steps

```bash
# Clone repository
git clone https://github.com/MattCordell/ToTallman
cd ToTallman

# Compile shared lists (required once; re-run if source lists change)
node tools/compile-lists/compile-lists.js

# Generate embedded Python lists from compiled artifact
python languages/python/tools/embed_lists.py

# Install package in editable mode with dev dependencies
pip install -e "languages/python[dev]"

# Run tests
cd languages/python
python -m pytest tests/

# Run canonical suite via shared harness
cd ../..
node tools/test-runner/run-canonical-tests.js languages/python/test-adapter.js
```

### Build Process

The build process:
1. `tools/compile-lists/compile-lists.js` computes NFC normalisation, casefold keys, and
   per-list `maxWords` caps from the source JSON lists — shared semantics run once.
2. `languages/python/tools/embed_lists.py` serialises the compiled artifact into
   `src/totallman/_embedded_lists.py` — no semantics, formatting only.
3. The package ships the committed `_embedded_lists.py`; no build-time Node dependency at
   install time.

## Architecture

### Core Components

- **converter.py**: Main conversion logic with greedy longest-match algorithm
- **\_unicode.py**: Unicode character classification (`is_letter_or_mark`) and casefolding
- **exceptions.py**: `TallmanError` exception
- **\_embedded\_lists.py**: Auto-generated embedded dictionaries (committed; no runtime I/O)
- **cli.py**: CLI entry point (`python -m totallman` or `totallman`)

### Algorithm

The implementation uses a **greedy longest-match** algorithm (spec §7):

1. Return `""` for None or empty input
2. Normalise the whole input to Unicode NFC
3. Iterate character-by-character:
   - When a Unicode letter or combining mark is found, extract the contiguous word run
   - Try a single-word dictionary lookup
   - Lookahead past any `' '` or `'-'` separator for multi-word / hyphenated entries
     (bounded by the per-list `maxWords` cap); a longer match wins (greedy)
   - Emit the canonical Tall Man form if found, otherwise the original word
   - Non-letter characters (punctuation, whitespace, digits) are copied through unchanged

### Key Design Decisions

- **`str.lower()`, not `str.casefold()`**: All list entries are ASCII-only (validator-enforced,
  spec §3.2). Within ASCII, `lower()` equals Unicode Default Case Folding. `casefold()` is
  intentionally avoided: it folds non-ASCII characters differently (e.g. German ß → ss) and
  would diverge from C#/JS runtimes if the ASCII constraint were ever relaxed.
- **Structure-sensitive matching**: "SOLU-medrol" (with hyphen) ONLY matches input that also
  contains a hyphen — NOT "solumedrol" or "solu medrol".
- **No regex**: Deterministic character-by-character iteration, matching the canonical algorithm.

## Testing

### Run Unit Tests

```bash
cd languages/python
python -m pytest tests/ -v
```

### Run Canonical Suite (98 tests)

```bash
# From repo root — requires Node.js
cd tools/test-runner && npm install
cd ../..
node tools/test-runner/run-canonical-tests.js languages/python/test-adapter.js
```

Expected: 100% pass (98/98 tests)

### Run Cross-Language Parity Check

```bash
# Build C# first (required for the C# adapter)
dotnet build languages/csharp/ToTallman.sln -c Debug
node tools/parity-check/run-parity-check.js
```

Expected: Python output is byte-identical to C# for all 98 canonical inputs.

## Available Lists

| List ID | Description | Entries | Source |
|---------|-------------|---------|--------|
| DEFAULT | Aggregate from multiple sources | 202 | Combined |
| AU | Australian National List (2017) | 206 | Australian |
| FDA | US FDA/ISMP List (2016) | 37 | FDA |
| ISMP | ISMP List (2016) | 143 | ISMP |
| NZ | New Zealand List (2013) | 190 | New Zealand |

## API Reference

```python
def to_tallman(text: str | None, list_id: str = "DEFAULT") -> str
```

**Parameters:**
- `text`: The input string. `None` or empty returns `""`.
- `list_id`: The Tall Man list to use (default: `"DEFAULT"`).

**Returns:** The input with recognised drug names converted to Tall Man form.

**Raises:** `TallmanError` if `list_id` is not found.

```python
def available_lists() -> frozenset[str]
```

Returns the set of valid list IDs (e.g. `{"DEFAULT", "AU", "FDA", "ISMP", "NZ"}`).

```python
def list_version(list_id: str) -> str
```

Returns the version string (`YYYYMMDD.N`) for the given list. Raises `TallmanError` if unknown.

```python
class TallmanError(Exception)
```

Raised for an unknown `list_id`. The message names the offending ID and lists all available IDs.

## Examples

### Basic Replacement

```python
to_tallman("prednisone")          # → "predniSONE"
to_tallman("PREDNISONE")          # → "predniSONE" (case-insensitive)
to_tallman("prednisone!")         # → "predniSONE!" (punctuation preserved)
```

### Multi-Word Drugs

```python
to_tallman("ms contin")           # → "MS Contin"
to_tallman("isopto carpine")      # → "isopto CARpine"
```

### Hyphenated Drugs

```python
to_tallman("solu-medrol")         # → "SOLU-medrol"
to_tallman("depo-provera")        # → "depo-PROVERA"
```

### No Substring Replacement

```python
to_tallman("myprednisonetest")    # → "myprednisonetest" (no word boundary)
```

### Different Lists

```python
to_tallman("vincristine", "FDA")  # → "vinCRIStine"
to_tallman("vincristine", "AU")   # → "vinCRISTine"
```

### Available Lists & Versions

```python
from totallman import available_lists, list_version

print(available_lists())          # frozenset({'AU', 'DEFAULT', 'FDA', 'ISMP', 'NZ'})
print(list_version("DEFAULT"))    # "20180819.0"
```

## Performance

- **Build-time embedding**: All dictionaries embedded at package install time
- **Zero runtime I/O**: No file loading or network calls
- **O(n) complexity**: Linear time in input length
- **O(1) lookups**: Native Python dict hash table lookups

## License

MIT License — see [LICENSE](../../LICENSE) for details.

## References

- [Tall Man Lettering](https://www.ismp.org/recommendations/tall-man-letters-list)
- [Medication Safety](https://www.fda.gov/drugs/medication-errors-related-cder-regulated-drug-products/tall-man-tall-man-lettering)
- [Unicode NFC Normalization](https://unicode.org/reports/tr15/)
