# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

ToTallman is a cross-language Tall Man lettering library for medication safety. Tall Man lettering uses mixed case (e.g., "predniSONE" vs "prednisoLONE") to prevent medication errors by highlighting distinguishing characters.

The high level objectives and requirements for this project are detailed in `ToTallman Updated Specification.md`

Ignore the `/archive` directory (if it exists) - do not read or modify content.

**Current Status**
See `Project Plan.md` for detailed phase tracking and status.

## General Guide to workflow.
- Ask clarifying questions before making architectural changes.
- Construct an implementation plan if one has not already been prepared.
- When the user has confirmed they are happy with the changes, update the `Project Plan.md` to reflect the progress.
- If any decisions are made that contradict the `ToTallman Updated Specification.md` - seek clarification/confirmation before proceeding, and update the Specification document if the changes are agreed upon.



## Standards
Each language implementation should adhere to the following relevant conventions:
JavaScript / TypeScript - TypeScript-eslint Recommended + Prettier formatting + strict TypeScript
Python - Black + Ruff + Pydantic type hints + PEP 8
Java - Google Java Style + Spotless auto-formatter
C# - Microsoft .NET conventions + EditorConfig + Roslyn analyzers

Additional considerations:
- Prioritize readability over cleverness
- Type hints required on all public functions
- Prioritise compatability, security and stability when choosing libraries and frameworks etc.


---

## Essential Commands

### Validate Tallman Lists
```bash
cd tools/validator
npm install
npm run validate
```
- Validates all JSON files against schema
- Detects duplicates (case-insensitive)
- Generates `tallman-lists/manifest.json`
- Exit code: 0 = pass, 1 = validation errors

### Run Canonical Test Suite

**Validation-only mode** (checks test schema):
```bash
cd tools/test-runner
npm install
npm test
```

**Test against implementation** (requires adapter):
```bash
cd tools/test-runner
node run-canonical-tests.js <path-to-adapter>
```

Adapter must export: `module.exports = { toTallman: function(input, listId) { return result; } }`

Exit code: 0 = 100% pass, 1 = failures detected

### Build .NET Solution
```bash
dotnet build ToTallman.sln
dotnet test Tests_ToTallman/Tests_ToTallman.csproj
```

---

## Build-Time Embedding Architecture

**Key Insight**: Tallman lists are NOT loaded at runtime. They're embedded at build time.

### Data Flow
```
JSON Lists (source) → Validator → NFC Normalize + Derive Keys → Generate Language Code → Compile
```

### Why This Pattern?
- **Zero I/O**: No file loading at runtime
- **Native data structures**: C# Dictionary, Python dict, JS object, Java Map
- **Security**: No configuration injection attacks
- **Performance**: Direct hash table lookups

### JSON Source Structure
Location: `/tallman-lists/*.json` (5 files)

Format enforced by `/tallman-lists/schema.json`:
```json
{
  "id": "AU",
  "description": "Australian National Tall Man Lettering List",
  "source": "https://...",
  "version": "20171124.0",
  "entries": ["predniSONE", "prednisoLONE", ...]
}
```


## Canonical Algorithm Requirements
**Source**: `/ToTallman Updated Specification.md` Section 7

### Pseudocode (Reference Implementation)
```
function ToTallman(input, listId = "DEFAULT"):
    if input is null:
        return ""

    input = normalize_to_NFC(input)
    result = ""
    i = 0

    while i < length(input):
        if is_unicode_letter_or_mark(input[i]):
            start = i
            while i < length(input) and is_unicode_letter_or_mark(input[i]):
                i += 1

            word = input[start:i]
            key = unicode_casefold(word)

            if key in dictionary[listId]:
                result += dictionary[listId][key]
            else:
                result += word
        else:
            result += input[i]
            i += 1

    return result
```

### Critical Requirements
1. **Character-by-character iteration** (NOT regex, NOT space-splitting)
2. **Unicode NFC normalization** at start (handles decomposed characters)
3. **Unicode casefolding** for matching (NOT simple `ToLower()` or `lower()`)
4. **Word boundaries** = any non-letter/combining-mark character
5. **Whole-word matching only** - "prednisone" → "predniSONE", but "myprednisonetest" unchanged
6. **Punctuation preserved** - "prednisone," → "predniSONE," (comma is word boundary)
7. **Multi-word drugs supported** - "MS Contin" must match as single entry

## Test Suite Architecture

### Test Files
Location: `/tests/canonical/*.json` (9 files, 83 total tests)

### Test Format
Schema: `/tests/canonical/test-schema.json`
Example:
```json
{
  "tests": [
    {
      "description": "Drug name followed by comma",
      "input": "prednisone, prednisolone",
      "listId": "DEFAULT",
      "expected": "predniSONE, prednisoLONE"
    }
  ]
}
```

### Creating Test Adapters
Each language needs adapter at `/languages/<lang>/test-adapter.js`:
```javascript
module.exports = {
  toTallman: function(input, listId) {
    // Call your implementation
    return yourImplementation.convert(input, listId);
  }
};
```


## File Navigation Guide

**"What lists are available?"**
→ `/tallman-lists/manifest.json` (auto-generated)

**"How should lists be formatted?"**
→ `/tallman-lists/schema.json`

**"What's the canonical algorithm?"**
→ `/ToTallman Updated Specification.md` (Section 7 - Canonical Algorithm)

**"What does current v1.x get wrong?"**
→ `/tests/canonical/KNOWN-FAILURES.md`

**"How are tests structured?"**
→ `/tests/canonical/test-schema.json` + any `*.json` in same directory

**"How do I validate lists?"**
→ `/tools/validator/README.md`

**"How do I run tests?"**
→ `/tools/test-runner/README.md`

**"What's the overall project status?"**
→ `/Project Plan.md`

**"What are the technical requirements?"**
→ `/ToTallman Updated Specification.md`

---

## What NOT to Do
### ❌ Do NOT Fix v1.x Code
The implementation in `/ToTallman/Tallman.cs` is being replaced, not fixed. Implement Phase 3 in new `/languages/csharp/` directory.

### ❌ Do NOT Use Regex Replacement
v1.x used regex. v2.0.0 uses character-by-character iteration per canonical algorithm.

### ❌ Do NOT Use Simple Case Conversion
- C#: NOT `ToLower()` → Use `ToUpperInvariant().ToLowerInvariant()` or proper casefolding
- Python: NOT `lower()` → Use `casefold()`
- JavaScript: NOT `toLowerCase()` → Use proper Unicode casefolding
- Java: Use ICU4J for proper casefolding

### ❌ Do NOT Load JSON at Runtime
Lists must be embedded at build time. No file I/O in production code.

### ❌ Do NOT Skip NFC Normalization
Unicode NFC normalization is required at algorithm start. Non-negotiable.

---

## Summary for New Contributors

1. **Read first**: `Project Plan.md` (status), `ToTallman Updated Specification.md` (algorithm)
2. **Validate data**: Run `tools/validator` before any coding
3. **Understand v1.x failures**: Read `tests/canonical/KNOWN-FAILURES.md`
4. **Follow canonical algorithm**: Character iteration, Unicode NFC, proper casefolding
5. **Test rigorously**: 100% pass required (83/83 tests)
6. **Respect phase gates**: Phase 3 blocks Phases 4-6

The project is well-structured with clear separation: data layer (Phase 1), tests (Phase 2), implementation (Phases 3-4), automation (Phase 5), documentation (Phase 6). Focus on getting Phase 3 to 100% test pass before proceeding.
