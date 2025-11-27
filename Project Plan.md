# ToTallman v2.0.0 - Project Plan

**Status**: In Progress
**Started**: 2025-11-27
**Target Completion**: ~11 weeks from start
**Current Phase**: Phase 1 - Complete ✅ | Next: Phase 2 - Canonical Tests

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

## Phase 2: Canonical Test Suite (Week 2-3)

**Status**: ⏸️ Not Started
**Objective**: Create language-agnostic test cases for validation.

### Tasks

- [ ] Design test data format
  - Test schema: `{description, input, listId, expected}`
- [ ] Create test cases in `/tests/canonical/`:
  - [ ] `basic-replacement.json`
  - [ ] `case-insensitive.json`
  - [ ] `no-substring.json`
  - [ ] `punctuation.json`
  - [ ] `unicode-nfc.json`
  - [ ] `unicode-casefolding.json`
  - [ ] `multi-list.json`
  - [ ] `edge-cases.json`
  - [ ] `multi-word.json` (hyphenated drugs)
- [ ] Document current behavior
  - Run existing C# against tests
  - Create `KNOWN-FAILURES.md`
- [ ] Build test runner at `/tools/test-runner/`

**Deliverables**:
- ~100+ canonical test cases ❌
- Test schema definition ❌
- Test runner framework ❌
- Baseline failure documentation ❌

---

## Phase 3: C# Refactored Implementation (Week 3-5)

**Status**: ⏸️ Not Started
**Objective**: Reimplement C# with canonical algorithm as reference.

**🚨 CRITICAL GATE**: Must achieve 100% canonical test pass before Phase 4

### Tasks

- [ ] Create new directory structure at `/languages/csharp/`
- [ ] Implement Unicode-safe algorithm
  - NFC normalization
  - Proper casefolding
  - Word boundary detection
  - Multi-word drug support
- [ ] Build-time list embedding
  - PowerShell script: `/languages/csharp/build/embed-lists.ps1`
  - Generate `EmbeddedTallmanLists.g.cs`
- [ ] Runtime API
  - `ToTallman(this string input, string listId = "DEFAULT")`
- [ ] Test adapter for canonical tests
- [ ] Validation & performance testing

**Deliverables**:
- Clean v2.0.0 C# implementation ❌
- Build-time embedding script ❌
- 100% canonical test pass ❌
- Updated demo/performance apps ❌
- Migration notes ❌

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
- [ ] Archive old implementation to `/archive/v1/`
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
| 2. Canonical Tests | ⏸️ Not Started | 0% |
| 3. C# Implementation | ⏸️ Not Started | 0% |
| 4. Multi-Language | ⏸️ Blocked | 0% |
| 5. CI/CD | ⏸️ Not Started | 0% |
| 6. Documentation | ⏸️ Not Started | 0% |

**Overall Project Progress**: 17% (1 of 6 phases complete)

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

### 2025-11-27
- ✅ **Phase 1 Complete**: Foundation - Data Format & Validation
  - Created JSON schema with full validation rules
  - Converted all 5 lists to JSON format (775 total entries)
  - Built validator tool with duplicate detection
  - Generated manifest.json
  - All validations passed (100% data integrity)
- 📁 Created directory structure: `/tallman-lists/`, `/tools/validator/`
- 📄 Files created: schema.json, AU.json, DEFAULT.json, FDA.json, ISMP.json, NZ.json, manifest.json
- 🛠️ Tools created: validate-schema.js with full documentation

**Last Updated**: 2025-11-27
