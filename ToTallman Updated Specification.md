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
-   The canonical match key is `casefold(NFC(text))`, where `casefold` is
    Unicode default (full) case folding. Keys are derived once by the shared
    compiler; every language runtime MUST fold input the same way so a word
    matches identically across languages. All current entries are ASCII/Latin,
    for which `toLowerCase` equals this folding; adding non-ASCII entries would
    require a full case-folding implementation in the compiler and in every
    runtime.

## 3.3 Replacement Rules

-   Replace entire token if the casefolded NFC form matches (see 3.2).
-   Use the canonical Tallman form from the JSON list.
-   Never replace substrings inside larger words.

## 3.4 Multi-word and Hyphenated Entries

-   Entries may contain multiple words separated by spaces or hyphens
    (e.g. `MS Contin`, `SOLU-medrol`, `methylprednisolone SODIUM SUCCINate`).
-   Matching is greedy longest-match: the longest list entry that matches
    starting at the current word wins.
-   The lookahead is bounded by the longest entry (in words) in the
    selected list, keeping conversion linear in input length.

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

Processing is split into one shared, language-agnostic stage and a thin
per-language stage, so the semantic steps happen exactly once and every
language embeds identical data.

**Shared compiler** (`/tools/compile-lists/`):

1.  Validate all JSON files against the schema.
2.  NFC-normalize each entry and derive its casefold match key (once).
3.  Compute each list's longest-entry word count (the multi-word lookahead cap).
4.  Emit one versioned canonical artifact,
    `tallman-lists/compiled/lists.compiled.json`
    (`{ list: { version, description, maxWords, entries: { key: form } } }`).

**Per-language emitters** (e.g. `/languages/csharp/tools/`):

5.  Read the compiled artifact and serialize it into the language's native
    embedded structure (C# `Dictionary`, Python `dict`, JS object, Java `Map`).
    These emitters do formatting only - no normalization or key derivation -
    so cross-language output stays byte-identical.

The validator additionally generates a manifest of available list IDs.

------------------------------------------------------------------------

# 6. Runtime API Requirements

    ToTallman(text: string, listId?: string = "DEFAULT") -> string

Behaviour: - DEFAULT list used when omitted. - Null input returns `""`.
- Throw a clear, **dedicated library exception** (NOT a generic argument
exception) when `listId` is invalid. The message must name the offending
`listId` and list the available list IDs.

For cross-language parity, each implementation uses its own dedicated
exception type:

  Language       Exception type
  -------------- ------------------
  C#             `TallmanException`
  Python         `TallmanError`
  JavaScript/TS  `TallmanError`
  Java           `TallmanException`

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

The pseudocode above shows single-word matching. Multi-word and hyphenated
entries (section 3.4) extend the inner match with a greedy, length-bounded
lookahead, omitted here for clarity.

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

## 8.6 Multi-word and Hyphenated

  Input           Expect
  --------------- ---------------
  `ms contin`     `MS Contin`
  `solu-medrol`   `SOLU-medrol`

------------------------------------------------------------------------

# 9. Directory Structure

    /tallman-lists/*.json              (source of truth)
    /tallman-lists/compiled/           (generated canonical artifact)
    /spec/TECHNICAL-SPEC.md
    /tests/canonical/*
    /tools/validator/
    /tools/compile-lists/              (shared, language-agnostic compiler)

    /languages/
        /csharp/
            /tools/                    (thin C# emitter)
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

(Multi-word and hyphenated drugs were originally listed here but are now
implemented; see section 3.4.)

-   Locale‑specific rules
-   Plural handling

------------------------------------------------------------------------

# 13. Conclusion

This specification ensures fully deterministic Tallman case conversion
across languages.
