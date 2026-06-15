# ToTallman v2.0.0 - Project Plan

**Status**: In Progress
**Started**: 2025-11-27
**Technical Specification** `ToTallman Updated Specification.md`
**Target Completion**: ~11 weeks from start
**Current Phase**: Phase 3 - C# Implementation ✅ Complete | Next: Phase 4 - Multi-Language (Python → JS → Java)

---

## Phase 1: Foundation - Data Format & Validation ✅ (Week 1-2)

**Status**: ✅ **COMPLETE** (Completed: 2025-11-27)
**Objective**: Establish JSON schema and validation before any code changes.

### Tasks

- [x] Create Project Plan.md tracking document
- [x] Create `/tallman-lists/` directory structure
- [x] Create JSON schema at `/tallman-lists/schema.json`
  - Define structure: `{id, description, source, version, entries[]}`
  - Validation rules: non-empty entries, version format `YYYYMMDD.N`
  - Support multi-word entries (hyphenated drugs)
- [x] Convert existing lists to JSON with metadata:
  - [x] `DEFAULT.json` from `Tallmen.txt` (199 entries) ✓
  - [x] `AU.json` from `AU_2017.txt` (206 entries) ✓
  - [x] `FDA.json` from `FDA_2016.txt` (37 entries) ✓
  - [x] `ISMP.json` from `ISMP_2016.txt` (143 entries) ✓
  - [x] `NZ.json` from `NZ_2013.txt` (190 entries) ✓
- [x] Build validator tool at `/tools/validator/`
  - Node.js-based schema validator ✓
  - Check for duplicates (case-insensitive) ✓
  - Validate version format ✓
  - Generate manifest of list IDs ✓
- [x] Verify data integrity
  - Cross-reference with original .txt files ✓ (100% match)
  - Document special cases (hyphenated drugs) ✓

**Deliverables**:
- 5 JSON list files with metadata ✅
- JSON schema definition ✅
- Validator tool with documentation ✅
- Manifest.json with list metadata ✅

**Validation Results**:
- All 5 lists validated successfully
- 775 total unique entries across all lists
- No duplicates detected
- All version formats valid
- Entry counts match original files exactly

---

## Phase 2: Canonical Test Suite ✅ (Week 2-3)

**Status**: ✅ **COMPLETE** (Completed: 2025-11-27)
**Objective**: Create language-agnostic test cases for validation.

### Tasks

- [x] Design test data format
  - Test schema: `{description, input, listId, expected}` ✓
- [x] Create test cases in `/tests/canonical/`:
  - [x] `basic-replacement.json` (8 tests) ✓
  - [x] `case-insensitive.json` (7 tests) ✓
  - [x] `no-substring.json` (8 tests) ✓
  - [x] `punctuation.json` (9 tests) ✓
  - [x] `unicode-nfc.json` (6 tests) ✓
  - [x] `unicode-casefolding.json` (6 tests) ✓
  - [x] `multi-list.json` (11 tests) ✓
  - [x] `edge-cases.json` (15 tests) ✓
  - [x] `multi-word.json` (13 tests - hyphenated drugs) ✓
- [x] Document current behavior
  - Analyzed existing C# implementation ✓
  - Created `KNOWN-FAILURES.md` with detailed analysis ✓
- [x] Build test runner at `/tools/test-runner/` ✓

**Deliverables**:
- 83 canonical test cases ✅
- Test schema definition ✅
- Test runner framework ✅
- Baseline failure documentation ✅

**Test Suite Breakdown**:
- 9 test files covering all edge cases
- 83 total test cases
- 100% schema validation pass
- Comprehensive coverage: basic matching, case sensitivity, word boundaries, punctuation, Unicode, multi-list, edge cases, multi-word drugs

**Known Issues Documented**:
- Estimated 66% pass rate for current v1.x implementation
- Critical bug identified in list selection (line 89 of Tallman.cs)
- Major gaps: punctuation handling, multi-word drugs, Unicode normalization

---

## Phase 3: C# Refactored Implementation (Week 3-5)

**Status**: ✅ Complete — 100% canonical pass, native tests + performance guards in place (Updated: 2026-06-16)
**Objective**: Reimplement C# with canonical algorithm as reference.

**🚨 CRITICAL GATE**: Must achieve 100% canonical test pass before Phase 4 — ✅ **MET (84/84)**

### Tasks

- [x] Create new directory structure at `/languages/csharp/`
- [x] Implement Unicode-safe algorithm
  - NFC normalization
  - Proper casefolding
  - Word boundary detection
  - Multi-word drug support (greedy longest-match lookahead)
- [x] Build-time list embedding
  - PowerShell script: `/languages/csharp/build/embed-lists.ps1`
  - Generate `EmbeddedTallmanLists.g.cs` (regenerated on every build)
- [x] Runtime API
  - `ToTallman(this string? input, string listId = "DEFAULT")`
- [x] Test adapter for canonical tests (Node adapter → Demo CLI; 84/84 pass)
- [x] Native C# unit tests (`ToTallman.Tests`: 102 tests, incl. data-driven canonical suite + perf guards)
- [x] Performance: multi-word lookahead bounded by per-list longest-entry word count (linear)

**Deliverables**:
- Clean v2.0.0 C# implementation ✅
- Build-time embedding script ✅
- 100% canonical test pass ✅ (84/84)
- Native C# test suite ✅ (102 tests: canonical + performance)
- Updated demo app ✅
- Migration notes (v1 → v2) — de-scoped (v1 was an unreleased prototype, no known consumers)

**Resolved (2026-06-16)**:
- Performance: lookahead now bounded by longest-entry word count (per-list cap) → linear. Verified by stopwatch tests (50k non-matching tokens ~120 ms; ~1.3 MB realistic text ~420 ms).
- Exception API: unknown list throws `TallmanException` directly; spec §6 updated to mandate a dedicated exception type per language.
- Migration notes: de-scoped (v1 unreleased prototype).

**Spec nit to reconcile**: §12 still lists multi-word / hyphenated drugs as "out-of-scope", yet they are implemented and tested. §12 should be updated to match.

---

## Phase 4: Multi-Language Implementation (Week 5-9)

**Status**: ⏸️ Blocked (awaiting Phase 3 completion)
**Objective**: Implement in Python, JavaScript/TypeScript, Java.

**Priority Order**: Python → JavaScript → Java (phased rollout)

### 4.1 Python Implementation (Week 5-6)
- [ ] Setup `/languages/python/` structure
- [ ] Implement algorithm using unicodedata
- [ ] Build-time embedding script
- [ ] pytest test adapter
- [ ] 100% canonical test pass
- [ ] PyPI package configuration

### 4.2 JavaScript Implementation (Week 6-7)
- [ ] Setup `/languages/js/` structure
- [ ] Implement algorithm with String.normalize
- [ ] Build-time embedding script
- [ ] Jest test adapter
- [ ] 100% canonical test pass
- [ ] npm package (CommonJS + ES modules)

### 4.3 Java Implementation (Week 7-9)
- [ ] Setup `/languages/java/` structure
- [ ] Implement algorithm with ICU4J
- [ ] Maven/Gradle build configuration
- [ ] JUnit test adapter
- [ ] 100% canonical test pass
- [ ] Maven Central package

**Deliverables**: Complete implementations for all 3 languages ❌

---

## Phase 5: CI/CD Pipeline (Week 9-10)

**Status**: ⏸️ Not Started
**Objective**: Automate validation across all languages.

### Tasks

- [ ] Create GitHub Actions workflows
  - CI: Validate + test all languages
  - Release: Auto-publish on tags
- [ ] Setup pre-commit hooks
  - JSON validation
  - Code formatting
  - Linting
- [ ] Cross-language validation
- [ ] Status badges in README

**Deliverables**:
- GitHub Actions workflows ❌
- Pre-commit configuration ❌
- Updated README with badges ❌

---

## Phase 6: Documentation & Release (Week 10-11)

**Status**: ⏸️ Not Started
**Objective**: Prepare for public release.

### Tasks

- [ ] Update repository README
- [ ] Move spec to `/spec/TECHNICAL-SPEC.md`
- [ ] Create `MIGRATION-v1-to-v2.md`
- [ ] Create example applications for each language
- [ ] Create `CONTRIBUTING.md`
- [x] Archive old implementation to `/archive/v1/`
- [ ] Finalize this Project Plan

**Deliverables**:
- Comprehensive documentation ❌
- Multi-language examples ❌
- Migration guide ❌
- Contribution guidelines ❌

---

## Overall Progress

| Phase | Status | Progress |
|-------|--------|----------|
| 1. Foundation | ✅ Complete | 100% |
| 2. Canonical Tests | ✅ Complete | 100% |
| 3. C# Implementation | ✅ Complete | 100% |
| 4. Multi-Language | ⏸️ Blocked | 0% |
| 5. CI/CD | ⏸️ Not Started | 0% |
| 6. Documentation | ⏸️ Not Started | 0% |

**Overall Project Progress**: 50% (3 of 6 phases complete; Phase 3 done, 100% canonical pass)

---

## Success Metrics

### Technical
- [ ] 100% canonical test pass rate (all languages)
- [ ] Byte-identical output across all languages
- [ ] All CI builds green (GitHub Actions)
- [ ] Multi-word drug support validated

### User-Facing
- [ ] v1 → v2 migration notes complete
- [ ] 3+ example applications
- [ ] Documentation complete for all languages

### Project Health
- [ ] <2 hour full CI pipeline
- [ ] <1 day to add new Tallman list
- [ ] Zero-touch releases via GitHub Actions

---

## Notes

- **Migration Strategy**: Clean break to v2.0.0, no backward compatibility
- **Critical Gate**: Phase 3 C# must achieve 100% test pass before Phase 4
- **Post-Launch**: This tracking will migrate to GitHub Issues

---

## Recent Activity

### 2026-06-16
- ✅ **Phase 3 (C#) completed.**
  - Unknown-list error now throws `TallmanException` directly (generator + converter); spec §6 updated to mandate a dedicated exception type per language.
  - Fixed a latent O(n²) in the multi-word lookahead: now bounded by each list's longest-entry word count (FDA 1, NZ 3, others 2). Verified linear via stopwatch tests.
  - Added performance guards to `ToTallman.Tests` (now 102 tests). Canonical suite still 84/84.
  - Migration notes (v1 → v2) de-scoped — v1 was an unreleased prototype.

### 2026-06-15
- 🟡 **Phase 3 (C#) found to be near complete** — Project Plan was stale (had listed it as Not Started).
  - C# v2 implementation (`TallmanConverter`, `UnicodeHelpers`, `TallmanException`) builds clean; build-time list embedding working.
  - Fixed 2 bad canonical tests (test/data bugs, not code): `cefalexin` expectation in `multi-word.json`; repointed `vincristine` test from ISMP (no such entry) to FDA in `multi-list.json`.
  - Canonical suite now **84/84 (100%)** via the Node test runner.
  - Added native C# unit tests (`ToTallman.Tests`): **100 tests pass** (16 explicit + 84 data-driven canonical) — `dotnet test` now enforces the canonical gate.
  - Remaining for #12: performance project + v1→v2 migration notes; reconcile unknown-list exception type vs spec.

### 2025-11-27
- ✅ **Phase 1 Complete**: Foundation - Data Format & Validation
  - Created JSON schema with full validation rules
  - Converted all 5 lists to JSON format (775 total entries)
  - Built validator tool with duplicate detection
  - Generated manifest.json
  - All validations passed (100% data integrity)
- ✅ **Phase 2 Complete**: Canonical Test Suite
  - Created 83 comprehensive test cases across 9 test files
  - Built language-agnostic test runner framework
  - Documented known failures of v1.x implementation
  - Identified critical bugs in current code
  - 100% test schema validation passed
- 📁 Created directory structure: `/tallman-lists/`, `/tools/validator/`, `/tests/canonical/`, `/tools/test-runner/`
- 📄 Files created: Test schema, 9 test files (83 tests), KNOWN-FAILURES.md, test runner
- 🛠️ Tools created: validate-schema.js, run-canonical-tests.js with full documentation

**Last Updated**: 2026-06-16
