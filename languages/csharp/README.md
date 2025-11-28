# ToTallman v2.0.0 - C# Implementation

Cross-language Tall Man lettering library for medication safety.

## Overview

This is the C# implementation of ToTallman, which converts medication names to Tall Man lettering format using mixed case (e.g., "predniSONE") to prevent medication errors by highlighting distinguishing characters in look-alike, sound-alike (LASA) drug names.

## Features

- ✅ **Unicode-safe**: Proper NFC normalization and casefolding
- ✅ **Character-by-character iteration**: No regex, deterministic behavior
- ✅ **Multi-word drug support**: Handles "MS Contin", "isopto CARpine"
- ✅ **Hyphenated drugs**: Supports "SOLU-medrol", "DEPO-medrol"
- ✅ **Multiple lists**: DEFAULT, AU, FDA, ISMP, NZ
- ✅ **Build-time embedding**: Zero runtime I/O, embedded dictionaries
- ✅ **100% test coverage**: Passes all 83 canonical tests

## Quick Start

### Installation

```bash
dotnet add package ToTallman
```

### Usage

```csharp
using ToTallman;

// Basic usage (DEFAULT list)
string result = "Patient prescribed prednisone".ToTallman();
// Returns: "Patient prescribed predniSONE"

// Specify a different list
string result = "Use dobutamine".ToTallman("FDA");
// Returns: "Use DOBUTamine"

// Multi-word drugs
string result = "Patient needs ms contin".ToTallman();
// Returns: "Patient needs MS Contin"

// Hyphenated drugs
string result = "Administer solu-medrol".ToTallman();
// Returns: "Administer SOLU-medrol"
```

## Building from Source

### Prerequisites

- .NET 8.0 SDK or later (LTS)
- PowerShell (for build-time list generation)

### Build Steps

```bash
# Clone repository
git clone https://github.com/your-repo/ToTallman
cd ToTallman/languages/csharp

# Build solution
dotnet build ToTallman.sln

# Run tests
dotnet test

# Run demo application
dotnet run --project src/ToTallman.Demo/ToTallman.Demo.csproj
```

### Build Process

The build process automatically:
1. Runs `build/embed-lists.ps1` to generate `EmbeddedTallmanLists.g.cs`
2. Applies NFC normalization and casefolding to all list entries
3. Embeds dictionaries into the compiled assembly (zero runtime I/O)

## Architecture

### Core Components

- **TallmanConverter.cs**: Main conversion logic with greedy longest-match algorithm
- **UnicodeHelpers.cs**: Unicode character classification and casefolding
- **EmbeddedTallmanLists.g.cs**: Auto-generated embedded dictionaries (created during build)
- **TallmanException.cs**: Custom exception for conversion errors

### Algorithm

The implementation uses a **greedy longest-match** algorithm:

1. Normalize input to Unicode NFC
2. Iterate character-by-character
3. When a letter is found:
   - Extract the word
   - Try single-word match
   - Try multi-word match (lookahead for space/hyphen-separated patterns)
   - Use the longest match found
4. Preserve all non-letter characters (punctuation, whitespace, numbers)

### Key Design Decisions

- **Structure-sensitive matching**: List entry "SOLU-medrol" (with hyphen) ONLY matches input "solu-medrol" (with hyphen), NOT "solumedrol" or "solu medrol"
- **Word boundaries**: Hyphens in input that aren't in the list entry act as boundaries
- **Case-insensitive**: Matching ignores case but preserves the Tallman capitalization from the list

## Testing

### Run Canonical Tests

```bash
cd ../../tools/test-runner
npm install
node run-canonical-tests.js ../../languages/csharp/test-adapter.js
```

Expected: 100% pass (83/83 tests)

### Run Unit Tests

```bash
cd languages/csharp
dotnet test tests/ToTallman.Tests/ToTallman.Tests.csproj
```

## Available Lists

| List ID | Description | Entries | Source |
|---------|-------------|---------|--------|
| DEFAULT | Aggregate from multiple sources | 199 | Combined |
| AU | Australian National List (2017) | 206 | Australian |
| FDA | US FDA/ISMP List (2016) | 37 | FDA |
| ISMP | ISMP List (2016) | 143 | ISMP |
| NZ | New Zealand List (2013) | 190 | New Zealand |

## API Reference

### Extension Methods

```csharp
public static string ToTallman(this string input, string listId = "DEFAULT")
```

**Parameters:**
- `input`: The string to convert (can be null)
- `listId`: The Tallman list to use (default: "DEFAULT")

**Returns:** The converted string with Tall Man lettering applied

**Exceptions:**
- `TallmanException`: If the list ID is not found

## Examples

### Basic Replacement
```csharp
"prednisone".ToTallman();           // → "predniSONE"
"PREDNISONE".ToTallman();           // → "predniSONE" (case-insensitive)
"prednisone!".ToTallman();          // → "predniSONE!" (punctuation preserved)
```

### Multi-Word Drugs
```csharp
"ms contin".ToTallman();            // → "MS Contin"
"isopto carpine".ToTallman();       // → "isopto CARpine"
```

### Hyphenated Drugs
```csharp
"solu-medrol".ToTallman();          // → "SOLU-medrol"
"depo-provera".ToTallman();         // → "depo-PROVERA"
```

### No Substring Replacement
```csharp
"amoxacillin-hydrate".ToTallman();  // → "amoxacillin-hydrate" (hyphen acts as boundary)
"myprednisonetest".ToTallman();     // → "myprednisonetest" (no word boundary)
```

### Different Lists
```csharp
"morphine".ToTallman("FDA");        // Uses FDA list
"morphine".ToTallman("AU");         // Uses Australian list
```

## Performance

- **Build-time embedding**: All dictionaries embedded at compile time
- **Zero runtime I/O**: No file loading or network calls
- **O(n) complexity**: Linear time, where n = input length
- **O(1) lookups**: Hash table lookups for drug names

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines.

## License

MIT License - see [LICENSE](../../LICENSE) for details.

## References

- [Tall Man Lettering](https://www.ismp.org/recommendations/tall-man-letters-list)
- [Medication Safety](https://www.fda.gov/drugs/medication-errors-related-cder-regulated-drug-products/tall-man-tall-man-lettering)
- [Unicode NFC Normalization](https://unicode.org/reports/tr15/)

## Support

- Issues: https://github.com/your-repo/ToTallman/issues
- Documentation: https://github.com/your-repo/ToTallman/wiki
