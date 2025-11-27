# Canonical Test Runner

This tool runs the canonical test suite against ToTallman implementations across all languages.

## Purpose

The canonical test runner ensures that all language implementations produce identical output for the same inputs, validating:
- Algorithm correctness
- Cross-language consistency
- Edge case handling
- Unicode safety

## Installation

```bash
cd tools/test-runner
npm install
```

## Usage

### Validation Only Mode

Validates test files against the schema without running tests:

```bash
npm test
```

### Testing an Implementation

```bash
node run-canonical-tests.js <path-to-adapter>
```

Example:
```bash
node run-canonical-tests.js ../../languages/csharp/test-adapter.js
```

## Test Adapter Format

Each language must provide an adapter module that exports a `toTallman` function:

```javascript
// Example adapter
module.exports = {
  toTallman: function(input, listId) {
    // Call your implementation
    // Return the converted string
    return result;
  }
};
```

## Test Files

The canonical test suite includes:
- `basic-replacement.json` - Simple whole-word matching (8 tests)
- `case-insensitive.json` - Upper/lower/mixed case (7 tests)
- `no-substring.json` - No partial word replacement (8 tests)
- `punctuation.json` - Punctuation preservation (9 tests)
- `unicode-nfc.json` - Unicode normalization (6 tests)
- `unicode-casefolding.json` - Special Unicode cases (6 tests)
- `multi-list.json` - Different list behaviors (11 tests)
- `edge-cases.json` - Null, empty, whitespace (15 tests)
- `multi-word.json` - Hyphenated/multi-word drugs (13 tests)

**Total: 83 canonical test cases**

## Exit Codes

- `0`: All tests passed
- `1`: One or more tests failed or validation errors

## Output

The runner provides colored output showing:
- ✓ Passed tests (green)
- ✗ Failed tests (red)
- Detailed failure information with input/expected/actual
- Summary statistics

## Integration

This runner is designed to be used:
- During development for each language
- In CI/CD pipelines
- For cross-language validation
- Before releases
