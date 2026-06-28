# Contributing to ToTallman

Thank you for your interest in contributing. ToTallman is a cross-language Tall Man lettering library for medication safety, and correctness matters — Tall Man lettering is a clinical safety intervention.

Start by reading:
- [README.md](README.md) — project overview and quick start
- [spec/TECHNICAL-SPEC.md](spec/TECHNICAL-SPEC.md) — canonical algorithm and design decisions
- [GitHub issues](https://github.com/MattCordell/ToTallman/issues) — current work and priorities

## Branch and PR Workflow

- Work on a dedicated branch: `issue/N-short-description` (e.g. `issue/42-add-ca-list`)
- Open a pull request against `master`
- CI must be fully green before merge — all language test suites, linting, and format checks must pass

## Testing Requirements

**100% canonical pass rate is required** for all four language implementations.

### Run the canonical test suite

```bash
# From repo root — requires Node.js
cd tools/test-runner
npm install
cd ../..

# Test each language
node tools/test-runner/run-canonical-tests.js languages/csharp/test-adapter.js
node tools/test-runner/run-canonical-tests.js languages/python/test-adapter.js
node tools/test-runner/run-canonical-tests.js languages/js/test-adapter.js
node tools/test-runner/run-canonical-tests.js languages/java/test-adapter.js
```

Exit code 0 = 100% pass; exit code 1 = failures detected.

### Run native language tests

```bash
# C#
dotnet test languages/csharp/ToTallman.sln

# Python
cd languages/python && python -m pytest tests/

# JavaScript
cd languages/js && npm test

# Java
mvn -f languages/java/pom.xml test
```

### Run cross-language parity check

```bash
# Verifies all four implementations produce byte-identical output
node tools/parity-check/run-parity-check.js
```

## Adding or Updating Tall Man Lists

Tall Man lists have clinical implications — any additions or changes must be traceable to an authoritative source document.

### Pipeline overview

```
tallman-lists/sources/<LIST>/      (upstream CSV + correspondence)
    ↓  tools/build-lists/          (derives DEFAULT; resolves parenthetical synonyms)
tallman-lists/*.json               (source of truth — the authority JSON lists)
    ↓  tools/compile-lists/        (NFC, casefold keys, maxWords — shared semantics)
tallman-lists/compiled/lists.compiled.json
    ↓  languages/*/tools/          (per-language thin emitter — formatting only)
    EmbeddedTallmanLists.*         (generated; committed for C# and Java)
```

### Steps to add or update a list

1. **Source material**: obtain the authoritative document and add it to `tallman-lists/sources/<LIST>/`. Record any correspondence with the authority in a `CORRESPONDENCE.md` file there.

2. **Update the source CSV** in `tallman-lists/sources/<LIST>/` following the format described in [`tallman-lists/sources/README.md`](tallman-lists/sources/README.md).

3. **Rebuild the JSON lists**:
   ```bash
   node tools/build-lists/build-lists.js
   ```

4. **Validate**:
   ```bash
   cd tools/validator && npm install && npm run validate
   ```
   This regenerates `tallman-lists/manifest.json` and exits 0 on success.

5. **Recompile the shared artifact**:
   ```bash
   node tools/compile-lists/compile-lists.js
   ```

6. **Regenerate embedded lists** for each language:
   ```bash
   # C# (PowerShell)
   pwsh languages/csharp/tools/generate-embedded.ps1

   # Python
   python languages/python/tools/embed_lists.py

   # JavaScript
   node languages/js/tools/embed-lists.js

   # Java
   node languages/java/tools/embed-lists.js
   ```

7. **Run all tests** — 100% canonical pass required in every language.

8. **Do not hardcode entry counts in documentation.** Refer readers to `tallman-lists/manifest.json` or the `AvailableLists`/`ListVersion` API — counts change when lists are updated.

### List entry rules

- Entries must be ASCII-only (the validator enforces this).
- Entries must contain at least one uppercase and one lowercase letter (Tall Man capitalisation).
- Parenthetical synonyms (`doSULepin (doTHiepin)`) are split into standalone entries by `build-lists.js` — see spec §5.1.
- Authority correspondence records in `tallman-lists/sources/` provide traceability for edge-case decisions.

## IDE Setup (C# — fresh clone)

`EmbeddedTallmanLists.g.cs` is generated at build time and is not committed. On a fresh clone, opening the C# project in an editor before building will show red squiggles in `TallmanConverter.cs` (CS0103 — generated symbols not yet visible). Run `dotnet build` once to generate the file and resolve them:

```bash
dotnet build languages/csharp/ToTallman.sln
```

This is harmless and expected — it is not a code error.

## Code Style

Per-language standards are listed in [CLAUDE.md](CLAUDE.md#standards):

| Language | Standard |
|----------|----------|
| C# / .NET | Microsoft .NET conventions + EditorConfig + Roslyn analyzers |
| Python | Black + Ruff + Pydantic type hints + PEP 8 |
| JavaScript / TypeScript | TypeScript-eslint Recommended + Prettier + strict TypeScript |
| Java | Google Java Style + Spotless auto-formatter |

> **Java + JDK 25+**: `google-java-format 1.24` uses internal javac APIs removed in JDK 25.
> The Spotless check works correctly on JDK 11 and 17 (the CI targets).
> On JDK 25+ locally, skip it with `mvn verify -Dspotless.check.skip=true` and manually
> verify 2-space indentation and 100-character line width before pushing.

## Adding a New Language Implementation

1. Read `spec/TECHNICAL-SPEC.md` in full, especially §§3, 5, 6, and 7.
2. Use the shared compiled artifact (`tallman-lists/compiled/lists.compiled.json`) — write a thin emitter, not a reimplementation of the compiler.
3. Implement the canonical algorithm exactly: NFC → character loop → `toLowerCase(NFC(word))` fold → dictionary lookup.
4. Write a `test-adapter.js` compatible with the shared canonical test harness.
5. Achieve 100% canonical pass before opening a PR.
6. Add a cross-language parity check to `tools/parity-check/`.

## Reporting Issues

Open an issue at <https://github.com/MattCordell/ToTallman/issues>. For clinical correctness concerns (wrong Tall Man capitalisation, missing drug name), please cite the authoritative source document.
