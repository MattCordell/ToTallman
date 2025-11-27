# Known Failures - Current C# Implementation

This document tracks known failures of the current (v1.x) C# implementation against the canonical test suite.

**Date**: 2025-11-27
**Implementation**: ToTallman v1.x (c:\Repos\ToTallman\ToTallman\Tallman.cs)

---

## Summary

The current implementation has several limitations that prevent it from passing the full canonical test suite:

1. **Punctuation Handling**: Only splits on spaces, not other word boundaries
2. **Unicode Support**: No NFC normalization or proper casefolding
3. **Multi-Word Drugs**: Cannot handle space-separated drug names
4. **Algorithm Issues**: Uses space-splitting which breaks on punctuation

---

## Expected Failures by Category

### 1. Punctuation Tests (`punctuation.json`)

**Status**: ❌ **FAIL** - Estimated 7/9 failures

**Issue**: The current implementation uses `term.ToLower().Split(' ')` which only splits on spaces. Drug names followed by punctuation (commas, periods, etc.) are not recognized as separate words.

**Examples**:
```csharp
// Current behavior:
"prednisone," → "prednisone," (WRONG)
// Expected:
"prednisone," → "predniSONE," (CORRECT)
```

**Affected Tests**:
- Drug name followed by comma
- Drug name followed by period
- Drug name in parentheses
- Drug name with exclamation/question/quotes/colon/semicolon

**Root Cause**: `Split(' ')` doesn't handle punctuation as word boundaries.

---

### 2. Unicode NFC Normalization (`unicode-nfc.json`)

**Status**: ⚠️ **PARTIAL** - May pass by accident

**Issue**: No explicit NFC normalization. Behavior depends on how .NET handles Unicode internally.

**Risk**: Decomposed vs precomposed characters (é as U+00E9 vs e+◌́ as U+0065 U+0301) may not match consistently.

---

### 3. Unicode Casefolding (`unicode-casefolding.json`)

**Status**: ⚠️ **PARTIAL** - Most will pass, some edge cases may fail

**Issue**: Uses `ToLower()` instead of proper Unicode casefolding. Special cases like Turkish İ/i or German ß may not behave correctly.

**Note**: Most tests use ASCII so will pass. Unicode edge cases untested in v1.x.

---

### 4. Multi-Word Drugs (`multi-word.json`)

**Status**: ❌ **FAIL** - Estimated 6/13 failures

**Issue**: Current implementation cannot match multi-word drug names separated by spaces (e.g., "MS Contin", "isopto CARpine").

**Examples**:
```csharp
// Current behavior:
"ms contin" → "ms contin" (WRONG - splits on space)
// Expected:
"ms contin" → "MS Contin" (CORRECT)
```

**Affected Tests**:
- MS Contin
- isopto CARpine
- isopto HOMATROpine

**Workaround Status**: Hyphenated drugs (SOLU-medrol) may work if hyphen creates word boundary in regex, but space-separated will definitely fail.

---

### 5. Edge Cases with Numbers (`edge-cases.json`)

**Status**: ❌ **FAIL** - Estimated 1-2 failures

**Issue**: Drug names adjacent to numbers (e.g., "prednisone5mg") won't split properly.

**Example**:
```csharp
// Current behavior:
"prednisone5mg" → "prednisone5mg" (WRONG)
// Expected:
"prednisone5mg" → "predniSONE5mg" (CORRECT - number is word boundary)
```

---

### 6. Specific List Behavior (`multi-list.json`)

**Status**: ❌ **FAIL** - **BUG IN IMPLEMENTATION**

**Critical Bug**: The `ToTallman(string term, Tallman.List specificList)` method has a bug on line 89:

```csharp
public static string ToTallman(this String term, Tallman.List specificList)
{
    var words = term.ToLower().Split(' ');
    foreach (var word in words)
    {
        if (Tallmen.ContainsKey(word))  // BUG: Uses Tallmen instead of specified list!
        {
            string pattern = String.Format(@"\b(?i){0}\b", word);
            Regex rgx = new Regex(pattern);
            term = rgx.Replace(term, Tallmen[word]);  // BUG: Uses Tallmen instead!
        }
    }
    return term;
}
```

**Impact**: The method always uses the DEFAULT list regardless of which list is specified.

**Affected Tests**: All multi-list.json tests that specify AU, FDA, ISMP, or NZ will fail.

---

## Estimated Pass Rate

Based on analysis:

| Test File | Total | Est. Pass | Est. Fail | Pass Rate |
|-----------|-------|-----------|-----------|-----------|
| basic-replacement.json | 8 | 6 | 2 | 75% |
| case-insensitive.json | 7 | 7 | 0 | 100% |
| no-substring.json | 8 | 8 | 0 | 100% |
| punctuation.json | 9 | 2 | 7 | 22% |
| unicode-nfc.json | 6 | 6 | 0 | 100% * |
| unicode-casefolding.json | 6 | 6 | 0 | 100% * |
| multi-list.json | 11 | 0 | 11 | 0% |
| edge-cases.json | 15 | 13 | 2 | 87% |
| multi-word.json | 13 | 7 | 6 | 54% |
| **TOTAL** | **83** | **55** | **28** | **66%** |

\* May pass by accident, not guaranteed

---

## Recommendations for v2.0.0

The new implementation must address:

1. ✅ **Use proper word boundary detection** - Not just space-splitting
2. ✅ **Implement NFC normalization** - `String.Normalize(NormalizationForm.FormC)`
3. ✅ **Use Unicode-aware character iteration** - `Char.GetUnicodeCategory()`
4. ✅ **Fix list selection bug** - Actually use the specified list
5. ✅ **Handle multi-word drugs** - Algorithm extension for space/hyphen-separated names
6. ✅ **Character-by-character iteration** - Follow canonical algorithm spec

---

## Testing Notes

The v1.x implementation has never been tested against this comprehensive suite. These failure estimates are based on code analysis. Actual results may vary when tests are run.

To run tests against current implementation:
1. Create a test adapter for v1.x C# code
2. Run: `node tools/test-runner/run-canonical-tests.js <adapter-path>`
3. Compare actual failures to these estimates
