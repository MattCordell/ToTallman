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

-   All input text is normalized to NFC before processing.
-   Word extraction uses Unicode letter + combining-mark categories
    (`\p{L}\p{M}`).
-   **Canonical fold**: the match key is `toLowerCase(NFC(word))`.
-   **ASCII-only entry constraint**: all Tall Man list entries must consist
    solely of ASCII characters (U+0000–U+007F). The list validator enforces
    this; any entry containing a non-ASCII character is a validation error.
    Within the ASCII range `toLowerCase` is identical to Unicode Default Case
    Folding, so the canonical fold is simultaneously simple and formally
    correct.
-   Match keys are derived once by the shared compiler and embedded in the
    compiled artifact. Every language runtime MUST apply `toLowerCase(NFC(word))`
    to the input word before dictionary lookup; this guarantees byte-identical
    output across all language implementations.

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

## 4.2 The DEFAULT List

The `DEFAULT` list is **derived deterministically** at build time from four
authority sources. It is not hand-curated. The derivation is implemented in
`tools/build-lists/build-lists.js`.

**Constituent sources (in precedence order):**

| Precedence | List ID | Authority |
|-----------|---------|-----------|
| 1 (highest) | `AU` | Australian Commission on Safety and Quality in Health Care (ACSQHC) |
| 2 | `ISMP` | ISMP combined (FDA base ∪ ISMP-SUPP); itself derived — see below |
| 3 | `NZ` | Health Quality & Safety Commission New Zealand (HQSC) |
| 4 (lowest) | `FDA` | US Food and Drug Administration |

**Rationale:**

- **AU first** — the project is Australia-focused; AU forms take priority in
  any conflict.
- **ISMP second over NZ** — ISMP is internationally recognised and a superset
  of the FDA list; NZ forms occasionally diverge from AU+ISMP on capitalisation
  of the same syllable.
- **FDA last** — the FDA base list is entirely subsumed by ISMP; it is included
  as an explicit fallback to allow per-entry provenance tracing.

**Conflict policy:** when two lists supply different capitalisation for the same
casefolded key, the higher-precedence form is used and the conflict is logged
by the builder. A casefold-key collision where both forms are identical is
silently accepted.

**ISMP derivation:** `ISMP = FDA ∪ ISMP-SUPP` (FDA base list merged with the
ISMP supplementary table). Where the same casefolded key appears in both, the
FDA form takes precedence (FDA is spread last in the merge Map).

**Version:** the DEFAULT list version is the lexicographic maximum of all
constituent source document versions, so it advances whenever any constituent
is updated.

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
