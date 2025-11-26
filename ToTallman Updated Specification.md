# Tallman Case Conversion --- Full Technical Specification

**Version:** 1.0\
**Status:** Draft

------------------------------------------------------------------------

# 1. Introduction

This document defines the complete technical specification for a
cross-language, deterministic, Unicode-safe Tallman case conversion
library, implemented in C#, Python, JavaScript/TypeScript, and Java. All
implementations must produce identical output under all conditions using
a shared canonical dataset.

------------------------------------------------------------------------

# 2. Problem Summary

A Tallman conversion function replaces certain drug names with their
official Tallman‑cased form, where interior letters are capitalised for
readability and medication safety. Matching is whole‑word,
case‑insensitive, Unicode‑safe, and punctuation‑agnostic.

------------------------------------------------------------------------

# 3. Behavioural Requirements

## 3.1 Whole-word Matching

A *word* is: - A contiguous sequence of Unicode letters + combining
marks.

Boundaries occur at: - Start/end of string - Any non-letter/mark char
(punctuation, digits, symbols)

Examples: - `prednisone` → `predniSONE` - `prednisone.` →
`predniSONE.` - `myprednisonetest` → unchanged

## 3.2 Unicode Handling

-   All text normalized to NFC.
-   Case-insensitive comparisons use Unicode casefolding.
-   Word extraction uses Unicode letter + mark categories.

## 3.3 Replacement Rules

-   Replace entire token if the lowercased NFC form matches.
-   Use the canonical Tallman form from the JSON list.
-   Never replace substrings inside larger words.

------------------------------------------------------------------------

# 4. Tallman List Data Format

Stored in `/tallman-lists/*.json`.

## 4.1 JSON Schema

``` json
{
  "id": "AU",
  "description": "Australian approved Tallman list",
  "source": "https://example.gov.au/tallman",
  "version": "20251124.0",
  "entries": [
    "predniSONE",
    "prednisoLONE",
    "DOBUTamine",
    "DOPamine"
  ]
}
```

Rules: - `entries` contains canonical Tallman output. - Input keys
derived automatically via casefold(NFC(entry)).

------------------------------------------------------------------------

# 5. Build-Time Processing

1.  Validate all JSON files.
2.  Normalize + derive lowercase match keys.
3.  Embed lists in each language runtime.
4.  Generate manifest of available list IDs.

------------------------------------------------------------------------

# 6. Runtime API Requirements

    ToTallman(text: string, listId?: string = "DEFAULT") -> string

Behaviour: - DEFAULT list used when omitted. - Throw clear error if
listId invalid.

All platforms must support equivalent overloads.

------------------------------------------------------------------------

# 7. Canonical Algorithm (Pseudocode)

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

------------------------------------------------------------------------

# 8. Canonical Test Suite

## 8.1 Basic Replacement

  Input           Expect
  --------------- ---------------
  `prednisone`    `predniSONE`
  `PredniSoNe`    `predniSONE`
  `prednisone.`   `predniSONE.`

## 8.2 No Substring Replacement

  Input                Expect
  -------------------- -----------
  `myprednisonetest`   unchanged

## 8.3 Punctuation Preservation

  Input                     Expect
  ------------------------- -------------------------
  `prednisone,prednisone`   `predniSONE,predniSONE`

## 8.4 Unicode Composition Tests

-   Decomposed accents must match precomposed forms.

## 8.5 Multi-List

Different lists produce different replacements depending on configured
entries.

------------------------------------------------------------------------

# 9. Directory Structure

    /tallman-lists/*.json
    /spec/TECHNICAL-SPEC.md
    /tests/canonical/*
    /tools/validator/

    /languages/
        /csharp/
        /python/
        /js/
        /java/

    /build/
        /ci-scripts/

------------------------------------------------------------------------

# 10. CI/CD Requirements

-   Validate JSON schema on every commit.
-   Run canonical tests for every language.
-   Publish only when all pass.

------------------------------------------------------------------------

# 11. Versioning

List versions:

    YYYYMMDD.0
    YYYYMMDD.1

Repo releases: semantic versioning.

------------------------------------------------------------------------

# 12. Out-of-scope Enhancements

-   Hyphenated drugs
-   Multi‑word drugs
-   Locale‑specific rules
-   Plural handling

------------------------------------------------------------------------

# 13. Conclusion

This specification ensures fully deterministic Tallman case conversion
across languages.
