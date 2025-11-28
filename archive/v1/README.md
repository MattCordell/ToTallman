# ToTallman v1.x Archive

**Archived**: 2025-11-28
**Reason**: Superseded by v2.0.0 multi-language implementation

## What's Here

This directory contains the complete v1.x C# implementation of ToTallman:
- **ToTallman/** - Main library (.NET Standard 1.0)
- **DemoApp1/** - Demo console application (.NET Core 2.0)
- **Tests_ToTallman/** - MSTest unit tests (.NET Core 2.1)
- **PerformanceMetrics/** - Performance testing app (.NET Core 1.0)
- **SourceReferences/** - Original source .txt files and PDFs
- **ToTallman.sln** - Visual Studio 2017 solution
- **.travis.yml** - Travis CI configuration

## Why Archived

The v1.x implementation had several critical limitations:
- Regex-based algorithm with bugs (see `/tests/canonical/KNOWN-FAILURES.md`)
- Only 66% canonical test pass rate (55/83 tests)
- No Unicode NFC normalization
- Cannot handle multi-word drugs (e.g., "MS Contin")
- Space-splitting algorithm breaks on punctuation
- Critical bug on line 89: always uses DEFAULT list regardless of parameter

For detailed analysis, see: `/tests/canonical/KNOWN-FAILURES.md`

## v2.0.0 Replacement

The new implementation:
- Follows canonical algorithm specification (character-by-character iteration)
- Multi-language support (C#, Python, JavaScript, Java)
- 100% test pass requirement (83/83 canonical tests)
- Build-time JSON embedding (no runtime I/O)
- Unicode NFC normalization and proper casefolding
- Located in: `/languages/` directory structure

## Build Instructions (Historical)

To build the archived v1.x implementation:
```bash
cd archive/v1
dotnet build ToTallman.sln
```

**Note**: This is for historical reference only. Do not use v1.x implementation for new projects.
