# Tall Man List Source Extracts

This directory contains the reviewed source extracts that are the **source of truth** for
the Tall Man list JSON files. The JSON files (`../AU.json`, `../NZ.json`, etc.) are
**generated** — do not edit them directly. Edit the CSV extracts here and then run the
build tool.

## Directory layout

```
sources/
  AU/           Australian ACSQHC list
  NZ/           New Zealand HQSC list
  FDA/          US FDA Name Differentiation Project
  ISMP-SUPP/    ISMP Table 2 (supplementary entries, not in FDA list)
```

Each authority directory contains:
- `meta.json` — authority metadata: name, citation, licence, source URLs, retrieved date,
  archived file SHA-256 checksum, and the extract filename.
- `<version>.csv` — the transcribed drug name list (see format below).
- The archived authority document itself (PDF/xlsx) where licensing permits.

## CSV format

Columns: `form`, `group`, `category`, `flags`, `page_ref`, `notes`

| Column | Description |
|--------|-------------|
| `form` | The Tall Man form **exactly as printed** in the authority document. Must contain at least one uppercase AND one lowercase letter (upper/lower rule). May include parenthetical synonym: `doSULepin (doTHiepin)` — build-lists will split and emit both if each passes the upper/lower rule. |
| `group` | LASA pair/group identifier (e.g. `predniSONE_prednisoLONE`). Preserves source grouping; used for review. Leave blank if not grouped. |
| `category` | Source table or drug class (e.g. `General`, `Oncology`, `Tyrosine kinase inhibitors`). |
| `flags` | Comma-separated flag codes (see below). |
| `page_ref` | Page number or section in the archived document. Helps re-verification. |
| `notes` | Free text. Often includes `year_added=YYYY` for NZ entries. |

### Flag codes

| Flag | Meaning |
|------|---------|
| `comparator` | Plain-text LASA partner with no TML form assigned. Documented here for traceability but **excluded from the TML output**. The intent of these entries was confirmed directly with ACSQHC and ISMP (see each authority's `CORRESPONDENCE.md`): they are deliberate context-only comparators, not always-lowercase TML forms, and input is returned unchanged at runtime. |
| `exception_rule` | Authority explicitly excluded this drug from TML application (e.g. NZ `*`-marked entries). Documented but **excluded from output**. |
| `discontinued` | Drug withdrawn from market in country of authority. Retained per source list; may be removed in a future revision. |
| `brand` | Brand name entry (not INN/generic). |
| `draft` | Entry is a draft (from old source version); must be verified against current authority document before sign-off. |

Entries are sorted casefold (case-insensitive alphabetically) within each CSV.

---

## Updating a list — step-by-step

### 1. Acquire the new authority document

Download the latest version into this authority's directory. Compute its SHA-256:

```powershell
# PowerShell
Get-FileHash national_mixed-case_lettering_list.pdf -Algorithm SHA256
```

Update `meta.json`:
- `document_version` (YYYYMMDD.N format)
- `document_date`
- `retrieved_date`
- `archived_file` (rename to include version, e.g. `national_mixed-case_lettering_list_2024-04.pdf`)
- `sha256`
- `extract_file` (new `<version>.csv` filename)
- `direct_download_url` if it changed

### 2. Transcribe the new CSV

Create `<new_version>.csv` by manually reading the authority document and entering
each drug name in the `form` column **exactly as printed** with its Tall Man capitalisation.

Fill in `group`, `category`, `page_ref` as you go. Use flags where applicable.

Sort rows by `form` (case-insensitive) before saving.

### 3. Cross-check (NZ and FDA only)

Where the authority publishes a machine-readable version (NZ: xlsx; FDA: HTML page),
run the cross-check helper to spot typos:

```bash
# NZ
cd tools/build-lists/crosscheck
npm install
node nz-crosscheck.js

# FDA (requires network)
node fda-crosscheck.js
```

Fix any capitalisation discrepancies by re-checking the source document. The CSV is
authoritative; the helper is for QA only.

### 4. Build and validate

From the repo root:

```bash
node tools/build-lists/build-lists.js
cd tools/validator && npm run validate
node tools/compile-lists/compile-lists.js
```

- Review the conflict log in `build-lists` output: conflicts mean AU/NZ/ISMP disagree on
  capitalisation for the same drug. Confirm the DEFAULT precedence resolution is correct.
- Fix any validator errors (schema, upper/lower rule, ASCII, sort order).

### 5. Review the diff

```bash
git diff tallman-lists/
```

This diff **is** the "diff against authoritative source" step required by issue #48.
Review it: does every added/changed/removed entry match the new authority document?

### 6. Clinical sign-off

A second reviewer confirms each changed form against the archived source PDF/xlsx.
This is the release gate for each list update.

### 7. Commit

```bash
git add tallman-lists/
git commit -m "feat(lists): update AU list to April 2024 version (ACSQHC)

Re-transcribed from national_mixed-case_lettering_list_2024-04.pdf.
Cross-checked via build-lists.js. N entries added, M removed.
Verified by: [name]"
```

---

## Adding a new authority (e.g. Canada, UK/BOPA, Spain)

1. Create a new subdirectory: `sources/<NEW_ID>/`
2. Download the authority document; create `meta.json` (see existing examples).
3. Transcribe `<version>.csv`.
4. Add the new authority ID to `build-lists.js` (the `loadSourceExtract` call section
   and any derivation logic for DEFAULT if the precedence order changes).
5. Follow steps 3–7 above.

---

## Licensing notes

| Authority | Licence | Notes |
|-----------|---------|-------|
| AU (ACSQHC) | CC BY-NC-ND 4.0 | Verbatim redistribution with attribution permitted, non-commercial only. No derivative works. |
| NZ (HQSC) | Not stated | Confirm with HQSC before publishing archived copy. |
| FDA | Public domain | US Government work; no restrictions. |
| ISMP | © ISMP | Internal reproduction with attribution permitted. **Other use (including publishing the PDF in a public repo) requires written permission from ISMP.** Consider storing citation + SHA-256 only rather than the binary. |
| ISMP Canada | © ISMP Canada | Same as ISMP above. |
| BOPA | Not stated | Confirm before publishing. |
| Spain (ISMP-España) | Not stated | Confirm before publishing. |

---

## Monitoring schedule

| Authority | Recommended check | Last update |
|-----------|-------------------|-------------|
| AU (ACSQHC) | Annually | April 2024 |
| NZ (HQSC) | Annually | October 2023 |
| FDA | After Name Differentiation Project announcements | June 2026 |
| ISMP | After periodic ISMP surveys / Medication Safety Alerts | January 2023 |
| ISMP Canada | Check ismp-canada.org (static since 2015) | 2015 |
| BOPA | Check bopa.org.uk (v1.0 since February 2022) | February 2022 |
| Spain (ISMP-España) | Check ismp-espana.org (static since 2011) | 2011 |
