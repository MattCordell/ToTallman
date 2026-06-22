# ToTallman Java

Java implementation of the [ToTallman](https://github.com/MattCordell/ToTallman) Tall Man lettering library for medication safety.

## Features

- **Unicode-safe**: NFC normalization at input; word boundaries follow Unicode letter + combining-mark categories (`\p{L}\p{M}`).
- **Deterministic**: Character-by-character iteration (no regex); output is byte-identical to the C# and Python implementations.
- **Multi-word support**: Matches space-separated entries ("MS Contin") and hyphenated entries ("SOLU-medrol").
- **Build-time embedding**: Lists are compiled into `EmbeddedTallmanLists.java` at build time. Zero runtime I/O; no file loading in the distributed JAR.
- **Java 11+**: Uses only standard library (`java.text.Normalizer`, `Character.getType`, `Base64`). No ICU4J required.

## Quick Start

### Build

```bash
# From repo root — generate the embedded lists first if needed
node tools/compile-lists/compile-lists.js
node languages/java/tools/embed-lists.js

# Build and test
mvn -f languages/java/pom.xml verify
```

### Usage

```java
import com.totallman.TallmanConverter;

String result = TallmanConverter.toTallman("prednisone");          // "predniSONE"
String au     = TallmanConverter.toTallman("vincristine", "AU");   // "vinCRISTine"
String fda    = TallmanConverter.toTallman("vincristine", "FDA");  // "vinCRIStine"
String multi  = TallmanConverter.toTallman("ms contin");           // "MS Contin"
String hyphen = TallmanConverter.toTallman("solu-medrol");         // "SOLU-medrol"
```

## Build

### Prerequisites

- Java 11 or later
- Maven 3.8+
- Node.js 18+ (for the list compiler and canonical test harness)

### Steps

```bash
# 1. Compile the shared lists (if lists/*.json changed)
node tools/compile-lists/compile-lists.js

# 2. Regenerate the embedded Java class (if the compiled artifact changed)
node languages/java/tools/embed-lists.js

# 3. Build, format-check, and test
mvn -f languages/java/pom.xml verify

# 4. Run the canonical test suite (98 tests, shared harness)
npm ci --prefix tools/test-runner
node tools/test-runner/run-canonical-tests.js languages/java/test-adapter.js

# 5. Cross-language parity check (Java vs C# vs Python)
node tools/parity-check/run-parity-check.js
```

> **Note on Spotless + JDK 25+**: `google-java-format 1.24.0` uses internal javac APIs
> removed in JDK 25. The `spotless:check` goal works correctly on JDK 11 and 17 (the
> declared targets and CI JDKs). On JDK 25+ locally, skip it with
> `mvn verify -Dspotless.check.skip=true`.

## Architecture

### Algorithm (spec §7 + §3.4)

`TallmanConverter.toTallman(text, listId)` implements the canonical greedy longest-match:

1. **NFC-normalise** the whole input (`java.text.Normalizer.normalize(..., NFC)`).
2. **Look up the list**: `EmbeddedTallmanLists.getList(listId)` returns the casefold→canonical map; `getMaxWordCount(listId)` returns the lookahead cap.
3. **Character loop**: On a letter or combining mark, extract the contiguous word run, then try a single-word match first. Extend greedily over ` ` or `-` separators (bounded by `maxWords`) to catch multi-word/hyphenated entries; keep the longest match found. Non-letter characters are copied verbatim.

### Design decisions

| Concern | Approach |
|---|---|
| NFC normalisation | `java.text.Normalizer.normalize(text, Form.NFC)` |
| Canonical fold | `String.toLowerCase(Locale.ROOT)` — all list entries are ASCII (validator-enforced, spec §3.2), so this equals the spec-defined fold. Do **not** use ICU4J `UCharacter.foldCase()` — unnecessary and a heavy dependency. |
| Word detection | `Character.getType(codePoint)` — letters (UPPERCASE/LOWERCASE/TITLECASE/MODIFIER/OTHER_LETTER) and combining marks (NON_SPACING/COMBINING_SPACING/ENCLOSING_MARK). Iterates by **code point** to handle astral-plane characters correctly. |
| List embedding | `tools/embed-lists.js` (Node.js) reads the shared compiled artifact and emits `EmbeddedTallmanLists.java`. The generated file is **committed**; CI regenerates it and fails on any git diff (freshness check). |
| No regex | Character-by-character iteration per spec — regex replacement was the v1 bug. |
| CLI output | `System.setOut(new PrintStream(stdout, true, UTF_8))` ensures correct Unicode output on Windows (avoids CP1252 default). |

### Files

| File | Purpose |
|---|---|
| `src/main/java/com/totallman/TallmanConverter.java` | Public API; canonical algorithm |
| `src/main/java/com/totallman/UnicodeHelpers.java` | NFC, casefold, letter/mark detection |
| `src/main/java/com/totallman/TallmanException.java` | Unchecked exception for unknown list IDs |
| `src/main/java/com/totallman/EmbeddedTallmanLists.java` | **Generated** — embedded list data |
| `src/main/java/com/totallman/Cli.java` | CLI for the shared test harness |
| `tools/embed-lists.js` | Generator: compiled JSON → Java source |
| `test-adapter.js` | Node shim for the shared canonical harness |
| `src/test/java/com/totallman/TallmanConverterTest.java` | JUnit 5 unit tests |

## Testing

```bash
# Native JUnit tests (30 tests)
mvn -f languages/java/pom.xml test

# Canonical suite via shared harness (98 tests)
node tools/test-runner/run-canonical-tests.js languages/java/test-adapter.js

# Cross-language parity (Java == C# == Python for all 98 inputs)
node tools/parity-check/run-parity-check.js
```

**100% canonical pass rate**: 98/98 tests pass, output byte-identical to C# and Python.

## Available Lists

| ID | Description | Entries |
|---|---|---|
| DEFAULT | Combined list (ISMP + FDA derivation) | ~202 |
| AU | Australian National Tall Man Lettering List (2017) | ~206 |
| FDA | US Food and Drug Administration list (2016) | 37 |
| ISMP | Institute for Safe Medication Practices (2016) | ~143 |
| NZ | New Zealand Medicines and Medical Devices Safety Authority (2013) | ~190 |

```java
// List introspection
Set<String> ids = TallmanConverter.availableLists();   // {"DEFAULT", "AU", "FDA", "ISMP", "NZ"}
String ver       = TallmanConverter.listVersion("AU"); // "20171124.0"
```

## API Reference

```java
// Convert using DEFAULT list
public static String toTallman(String text)

// Convert using a specific list
public static String toTallman(String text, String listId)

// Available list IDs (unmodifiable)
public static Set<String> availableLists()

// Version string for a list
public static String listVersion(String listId)
```

`null` and empty input return `""`. Unknown `listId` throws `TallmanException`.

## Examples

```java
// Basic replacement (case-insensitive match)
TallmanConverter.toTallman("prednisone")          // "predniSONE"
TallmanConverter.toTallman("PREDNISONE")          // "predniSONE"

// No-substring matching
TallmanConverter.toTallman("myprednisonetest")    // "myprednisonetest" (unchanged)

// Multi-word (space-separated)
TallmanConverter.toTallman("ms contin")           // "MS Contin"
TallmanConverter.toTallman("MS CONTIN")           // "MS Contin"

// Hyphenated
TallmanConverter.toTallman("solu-medrol")         // "SOLU-medrol"

// Punctuation preserved
TallmanConverter.toTallman("prednisone,")         // "predniSONE,"

// Different lists — same drug, different Tall Man forms
TallmanConverter.toTallman("vincristine", "AU")   // "vinCRISTine"
TallmanConverter.toTallman("vincristine", "FDA")  // "vinCRIStine"

// Three-word NZ entry
TallmanConverter.toTallman(
    "methylprednisolone sodium succinate", "NZ")  // "methylprednisolone SODIUM SUCCINate"
```

## Performance

- **O(n) time**: The multi-word lookahead is bounded by the per-list `maxWords` cap (max 3), keeping conversion linear in input length.
- **Zero I/O**: List data is embedded at build time via the generated `EmbeddedTallmanLists.java`; the production JAR performs no file I/O.
- **No dependencies**: Pure Java standard library.

## References

- [ISMP Tall Man Lettering List](https://www.ismp.org/recommendations/tall-man-letters)
- [FDA Tall Man Lettering](https://www.fda.gov/drugs/medication-errors-related-cder-products/medication-errors-and-tall-man-letters)
- [Unicode Normalization Forms (UAX #15)](https://unicode.org/reports/tr15/)
