#!/usr/bin/env node
//
// build-lists.js
//
// Transforms reviewed source extracts (tallman-lists/sources/<AUTHORITY>/<version>.csv)
// into the build-ready list JSON files (tallman-lists/*.json) consumed by the existing
// validator and compile-lists pipeline.
//
// This is the single entry point for updating the Tall Man lists from authority sources.
// The JSON files emitted here are GENERATED -- do not edit them directly. Edit the
// source extracts (CSV + meta.json) instead, then re-run this script.
//
// Usage:
//   node tools/build-lists/build-lists.js [--dry-run]
//
// Sources consumed:
//   tallman-lists/sources/AU/         -> tallman-lists/AU.json
//   tallman-lists/sources/NZ/         -> tallman-lists/NZ.json
//   tallman-lists/sources/FDA/        -> tallman-lists/FDA.json
//   tallman-lists/sources/ISMP-SUPP/  -> (FDA ∪ ISMP-SUPP) -> tallman-lists/ISMP.json
//   Derived from above                -> tallman-lists/DEFAULT.json (AU>NZ>ISMP precedence)
//
// Provenance sidecar:
//   tallman-lists/compiled/provenance.json  (casefold key -> authority + version per list)
//
// Parenthetical policy:
//   Entries of the form "name (synonym)" are split. Each candidate must have at least one
//   uppercase AND one lowercase letter to be included; otherwise it is dropped with a warning.
//
// Upper/lower rule:
//   Every entry must contain at least one uppercase AND one lowercase letter. Violations
//   are build errors (not warnings).

'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..');
const listsDir = path.join(rootDir, 'tallman-lists');
const sourcesDir = path.join(listsDir, 'sources');
const outDir = path.join(listsDir, 'compiled');

const dryRun = process.argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// Shared utilities (kept consistent with compile-lists.js)
// ---------------------------------------------------------------------------

function casefoldKey(text) {
  return text.normalize('NFC').toLowerCase();
}

// DEFAULT precedence order: AU > ISMP > NZ > FDA (AU primary; ISMP over NZ; FDA explicit fallback)
const DEFAULT_PRECEDENCE = ['AU', 'ISMP', 'NZ', 'FDA'];

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const rows = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    // Minimal RFC 4180 parse (handles quoted fields with commas inside)
    const fields = [];
    let i = 0;
    while (i < line.length) {
      if (line[i] === '"') {
        let val = '';
        i++; // skip opening quote
        while (i < line.length) {
          if (line[i] === '"' && line[i + 1] === '"') {
            val += '"';
            i += 2;
          } else if (line[i] === '"') {
            i++; // skip closing quote
            break;
          } else {
            val += line[i++];
          }
        }
        fields.push(val);
        if (i < line.length && line[i] === ',') i++;
      } else {
        let j = line.indexOf(',', i);
        if (j === -1) j = line.length;
        fields.push(line.slice(i, j));
        i = j + 1;
      }
    }
    rows.push(fields);
  }
  if (rows.length === 0) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (row[idx] || '').trim(); });
    return obj;
  });
}

// ---------------------------------------------------------------------------
// Parenthetical handling: "doSULepin (doTHiepin)" -> ["doSULepin", "doTHiepin"]
// ---------------------------------------------------------------------------

function expandParentheticals(form) {
  const m = form.match(/^(.+?)\s+\((.+?)\)\s*$/);
  if (!m) return [form];
  return [m[1].trim(), m[2].trim()];
}

// ---------------------------------------------------------------------------
// Upper/lower rule
// ---------------------------------------------------------------------------

function hasUpperAndLower(s) {
  return /[A-Z]/.test(s) && /[a-z]/.test(s);
}

// ---------------------------------------------------------------------------
// ASCII check (matches validator constraint)
// ---------------------------------------------------------------------------

function isASCII(s) {
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 127) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Load a source extract and return validated entries with provenance
// ---------------------------------------------------------------------------

function loadSourceExtract(authorityId) {
  const authorityDir = path.join(sourcesDir, authorityId);

  if (!fs.existsSync(authorityDir)) {
    throw new Error(`Source directory not found: ${authorityDir}`);
  }

  const meta = JSON.parse(fs.readFileSync(path.join(authorityDir, 'meta.json'), 'utf8'));
  const csvFile = path.join(authorityDir, meta.extract_file);

  if (!fs.existsSync(csvFile)) {
    throw new Error(`Extract CSV not found: ${csvFile}`);
  }

  const rows = parseCSV(fs.readFileSync(csvFile, 'utf8'));

  const entries = new Map(); // casefold key -> { form, group, category, flags, authorityId, version }
  const errors = [];
  const warnings = [];

  for (const row of rows) {
    const rawForm = row.form;
    if (!rawForm) continue;

    // Expand parentheticals
    const candidates = expandParentheticals(rawForm);

    // Skip entries flagged as comparator (plain LASA partner, no TML form)
    // or exception_rule (source authority explicitly excluded from TML application)
    const entryFlags = row.flags || '';
    if (entryFlags.includes('comparator') || entryFlags.includes('exception_rule')) continue;

    for (const candidate of candidates) {
      if (candidate.length === 0) continue;

      // ASCII check
      if (!isASCII(candidate)) {
        errors.push(`[${authorityId}] Non-ASCII entry: "${candidate}" (from "${rawForm}")`);
        continue;
      }

      // Upper/lower rule
      if (!hasUpperAndLower(candidate)) {
        if (candidates.length > 1 && candidate === candidates[1]) {
          // Parenthetical expansion produced an all-lower synonym (e.g. "cysteamine") -- skip silently
          warnings.push(`[${authorityId}] Parenthetical expansion "${candidate}" (from "${rawForm}") has no TML capitalisation -- dropped`);
        } else {
          errors.push(`[${authorityId}] Entry "${candidate}" must have at least one uppercase AND one lowercase letter (upper/lower rule)`);
        }
        continue;
      }

      const key = casefoldKey(candidate);

      if (entries.has(key)) {
        const existing = entries.get(key);
        if (existing.form !== candidate) {
          errors.push(`[${authorityId}] Casefold collision: "${candidate}" vs existing "${existing.form}" (key "${key}")`);
        }
        // exact duplicate -- silently ignore the second occurrence
        continue;
      }

      entries.set(key, {
        form: candidate,
        group: row.group || '',
        category: row.category || '',
        flags: row.flags || '',
        notes: row.notes || '',
        authorityId,
        version: meta.document_version,
      });
    }
  }

  return { meta, entries, errors, warnings };
}

// ---------------------------------------------------------------------------
// Emit one JSON list file
// ---------------------------------------------------------------------------

function buildListJSON(id, description, sourceVersion, entries) {
  // entries: Map<casefold key, { form, ... }>
  // Sort by casefold key for stable diffs
  const sortedKeys = [...entries.keys()].sort((a, b) => a.localeCompare(b));
  const entryForms = sortedKeys.map(k => entries.get(k).form);

  return {
    id,
    description,
    source: 'Generated by tools/build-lists/build-lists.js from tallman-lists/sources/. See sources/<AUTHORITY>/meta.json for authority provenance.',
    version: sourceVersion,
    entries: entryForms,
  };
}

// ---------------------------------------------------------------------------
// Derive DEFAULT from AU + NZ + ISMP (precedence: AU > NZ > ISMP)
// ---------------------------------------------------------------------------

function deriveDefault(extractedMaps) {
  // extractedMaps: { AU: Map, NZ: Map, ISMP: Map }
  // Precedence: for a casefold collision, the earlier authority wins.
  // Conflicts (same key, different form) are logged.

  const merged = new Map(); // casefold key -> { form, authorityId, version, conflictsWith }
  const conflicts = [];

  for (const authorityId of DEFAULT_PRECEDENCE) {
    const src = extractedMaps[authorityId];
    if (!src) continue;

    for (const [key, entry] of src.entries()) {
      if (merged.has(key)) {
        const winner = merged.get(key);
        if (winner.form !== entry.form) {
          conflicts.push({
            key,
            winner: winner.form,
            winnerAuthority: winner.authorityId,
            loser: entry.form,
            loserAuthority: authorityId,
          });
        }
        // Lower-precedence entry -- skip
        continue;
      }
      merged.set(key, { form: entry.form, authorityId, version: entry.version });
    }
  }

  return { merged, conflicts };
}

// ---------------------------------------------------------------------------
// Build provenance sidecar
// ---------------------------------------------------------------------------

function buildProvenance(listId, entries) {
  // Returns map: casefold key -> { form, authority, version }
  const prov = {};
  for (const [key, entry] of entries.entries()) {
    prov[key] = {
      form: entry.form,
      authority: entry.authorityId,
      version: entry.version,
    };
  }
  return prov;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const allErrors = [];
  const allWarnings = [];

  // 1. Load all source extracts
  console.log('Loading source extracts...');
  const extracted = {};
  for (const authorityId of ['AU', 'NZ', 'FDA', 'ISMP-SUPP']) {
    process.stdout.write(`  ${authorityId}... `);
    const result = loadSourceExtract(authorityId);
    extracted[authorityId] = result;
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
    console.log(`${result.entries.size} entries (${result.errors.length} errors, ${result.warnings.length} warnings)`);
  }

  // Bail on errors before going further
  if (allErrors.length > 0) {
    console.error('\nBuild errors:');
    allErrors.forEach(e => console.error('  ' + e));
    process.exit(1);
  }

  allWarnings.forEach(w => console.warn('  WARN: ' + w));

  // 2. Derive ISMP = FDA + ISMP-SUPP
  console.log('\nDeriving ISMP (FDA + ISMP-SUPP)...');
  const ismpEntries = new Map([
    ...extracted['ISMP-SUPP'].entries,
    ...extracted['FDA'].entries,
  ]);
  // Check for casefold collisions between FDA and ISMP-SUPP
  for (const [key, fdaEntry] of extracted['FDA'].entries.entries()) {
    const suppEntry = extracted['ISMP-SUPP'].entries.get(key);
    if (suppEntry && suppEntry.form !== fdaEntry.form) {
      allErrors.push(`ISMP derivation: FDA "${fdaEntry.form}" vs ISMP-SUPP "${suppEntry.form}" (key "${key}") -- FDA takes precedence (spread last in Map)`);
      // FDA wins: spread last in the Map, so its value overwrites any ISMP-SUPP form for the same key
    }
  }
  console.log(`  ISMP: ${ismpEntries.size} entries`);

  // 3. Derive DEFAULT (AU > ISMP > NZ > FDA)
  console.log('Deriving DEFAULT (AU > ISMP > NZ > FDA)...');
  const { merged: defaultEntries, conflicts } = deriveDefault({
    AU: extracted['AU'].entries,
    ISMP: ismpEntries,
    NZ: extracted['NZ'].entries,
    FDA: extracted['FDA'].entries,
  });
  if (conflicts.length > 0) {
    console.warn(`  ${conflicts.length} capitalisation conflict(s) -- sources disagree on form:`);
    conflicts.forEach(c => {
      console.warn(`    "${c.key}": ${c.winnerAuthority} "${c.winner}" wins over ${c.loserAuthority} "${c.loser}"`);
    });
  }
  console.log(`  DEFAULT: ${defaultEntries.size} entries`);

  if (allErrors.length > 0) {
    console.error('\nBuild errors (post-derivation):');
    allErrors.forEach(e => console.error('  ' + e));
    process.exit(1);
  }

  // 4. Build JSON objects
  // Derived ISMP version = lexicographic max(FDA, ISMP-SUPP); reused by the
  // ISMP list and as DEFAULT's effective ISMP constituent (spec 4.2).
  const ismpVersion = [
    extracted['FDA'].meta.document_version,
    extracted['ISMP-SUPP'].meta.document_version,
  ].sort().reverse()[0];
  const listOutputs = [
    {
      id: 'AU',
      description: 'Australian National Mixed-Case Lettering List (ACSQHC)',
      version: extracted['AU'].meta.document_version,
      entries: extracted['AU'].entries,
    },
    {
      id: 'NZ',
      description: 'Aotearoa New Zealand Tall Man Lettering List (HQSC)',
      version: extracted['NZ'].meta.document_version,
      entries: extracted['NZ'].entries,
    },
    {
      id: 'FDA',
      description: 'FDA Name Differentiation Project List (US FDA)',
      version: extracted['FDA'].meta.document_version,
      entries: extracted['FDA'].entries,
    },
    {
      id: 'ISMP',
      description: 'FDA and ISMP Lists of Look-Alike Drug Names (ISMP combined)',
      version: ismpVersion,
      entries: ismpEntries,
    },
    {
      id: 'DEFAULT',
      // "Sources:" reports the true source-document versions for provenance
      // tracing (so each one resolves to a real authority document); the
      // version field above carries the derived lexicographic max separately.
      description: `Default Tall Man list (AU+ISMP+NZ+FDA, precedence AU>ISMP>NZ>FDA). Sources: AU ${extracted['AU'].meta.document_version}, ISMP ${extracted['ISMP-SUPP'].meta.document_version}, NZ ${extracted['NZ'].meta.document_version}, FDA ${extracted['FDA'].meta.document_version}.`,
      // Version = lexicographic max of all four effective constituents merged
      // into DEFAULT (AU, derived ISMP, NZ, FDA), per spec 4.2 -- so it advances
      // whenever any constituent (including FDA or the derived ISMP) updates.
      version: [
        extracted['AU'].meta.document_version,
        ismpVersion,
        extracted['NZ'].meta.document_version,
        extracted['FDA'].meta.document_version,
      ].sort().reverse()[0],
      entries: defaultEntries,
    },
  ];

  // 4b. Invariant (spec 4.2): DEFAULT version == lexicographic max of all four
  // effective constituents merged into DEFAULT (AU, derived ISMP, NZ, FDA), so a
  // bare FDA/ISMP refresh can never silently leave DEFAULT stale. Guards against
  // a future edit dropping a constituent from the version computation.
  const defaultList = listOutputs.find(l => l.id === 'DEFAULT');
  const ismpList = listOutputs.find(l => l.id === 'ISMP');
  const expectedDefaultVersion = [
    extracted['AU'].meta.document_version,
    ismpList.version,
    extracted['NZ'].meta.document_version,
    extracted['FDA'].meta.document_version,
  ].sort().reverse()[0];
  if (defaultList.version !== expectedDefaultVersion) {
    console.error(
      `\nBuild invariant violated: DEFAULT version "${defaultList.version}" != ` +
      `lexicographic max of {AU, ISMP, NZ, FDA} = "${expectedDefaultVersion}" (spec 4.2).`);
    process.exit(1);
  }

  // 5. Build provenance sidecar
  const provenance = {};
  for (const { id, entries } of listOutputs) {
    provenance[id] = buildProvenance(id, entries);
  }

  // 6. Write outputs
  if (dryRun) {
    console.log('\n--dry-run: no files written');
    listOutputs.forEach(({ id, entries }) =>
      console.log(`  ${id}.json would have ${entries.size} entries`));
    return;
  }

  console.log('\nWriting list JSON files...');
  for (const { id, description, version, entries } of listOutputs) {
    const json = buildListJSON(id, description, version, entries);
    const outPath = path.join(listsDir, `${id}.json`);
    fs.writeFileSync(outPath, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log(`  Wrote ${path.relative(rootDir, outPath)} (${entries.size} entries)`);
  }

  // Write provenance sidecar
  fs.mkdirSync(outDir, { recursive: true });
  const provPath = path.join(outDir, 'provenance.json');
  fs.writeFileSync(provPath, JSON.stringify({
    _comment: 'GENERATED by tools/build-lists. Maps (listId, casefold key) -> authority + version.',
    provenance,
  }, null, 2) + '\n', 'utf8');
  console.log(`  Wrote ${path.relative(rootDir, provPath)}`);

  // Summary of conflicts for the log
  if (conflicts.length > 0) {
    console.log(`\nConflict log (${conflicts.length} capitalisation disagreements resolved by precedence):`);
    conflicts.forEach(c => {
      console.log(`  DEFAULT["${c.key}"]: ${c.winnerAuthority}="${c.winner}" (over ${c.loserAuthority}="${c.loser}")`);
    });
  }

  console.log('\nDone. Run tools/validator next to confirm schema and rules.');
}

main();
