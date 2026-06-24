#!/usr/bin/env node
//
// nz-crosscheck.js
//
// Cross-check the manually transcribed NZ extract CSV against the
// machine-readable NZ xlsx. Reports discrepancies so a reviewer can
// spot transcription errors.
//
// Usage: node nz-crosscheck.js
//
// Requires: npm install xlsx (run once in this directory)
//
// The xlsx is the QA reference only -- the CSV is the source of truth.

'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..', '..');
const sourcesDir = path.join(rootDir, 'tallman-lists', 'sources');
const nzDir = path.join(sourcesDir, 'NZ');

// Load meta
const meta = JSON.parse(fs.readFileSync(path.join(nzDir, 'meta.json'), 'utf8'));
if (!meta.machine_readable_file) {
  console.error('No machine_readable_file in NZ/meta.json');
  process.exit(1);
}

const xlsxPath = path.join(nzDir, meta.machine_readable_file);
if (!fs.existsSync(xlsxPath)) {
  console.error(`xlsx not found: ${xlsxPath}`);
  process.exit(1);
}

// Load xlsx
let XLSX;
try {
  XLSX = require('xlsx');
} catch {
  console.error('xlsx package not found. Run: npm install xlsx  (in tools/build-lists/crosscheck)');
  process.exit(1);
}

const wb = XLSX.readFile(xlsxPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const xlsxRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

// Extract medicine names from xlsx (column 0, skip rows 0 and 1)
const xlsxForms = new Map(); // casefold -> original form
for (let i = 2; i < xlsxRows.length; i++) {
  const form = String(xlsxRows[i][0] || '').trim();
  if (!form) continue;
  // Strip footnote marker and footnote rows
  if (form.startsWith('*\t') || form.startsWith('* ')) continue;
  const clean = form.endsWith('*') ? form.slice(0, -1).trim() : form;
  if (clean.length < 2) continue;
  xlsxForms.set(clean.toLowerCase(), clean);
}

// Load CSV
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const rows = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const fields = line.split(',').map(f => f.trim());
    rows.push(fields);
  }
  if (!rows.length) return [];
  const headers = rows[0].map(h => h.toLowerCase());
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] || ''; });
    return obj;
  });
}

const csvPath = path.join(nzDir, meta.extract_file);
const csvRows = parseCSV(fs.readFileSync(csvPath, 'utf8'));
const csvForms = new Map(); // casefold -> row
for (const row of csvRows) {
  if (!row.form) continue;
  csvForms.set(row.form.toLowerCase(), row);
}

// Cross-check
let discrepancies = 0;

// 1. In xlsx but not in CSV
for (const [key, form] of xlsxForms.entries()) {
  if (!csvForms.has(key)) {
    console.log(`MISSING from CSV (in xlsx): "${form}"`);
    discrepancies++;
  }
}

// 2. In CSV but not in xlsx (could be intentional additions or typos)
for (const [key, row] of csvForms.entries()) {
  if (!xlsxForms.has(key)) {
    console.log(`EXTRA in CSV (not in xlsx): "${row.form}" -- verify intentional`);
    discrepancies++;
  }
}

// 3. Same casefold key but different capitalisation
for (const [key, csvRow] of csvForms.entries()) {
  const xlsxForm = xlsxForms.get(key);
  if (!xlsxForm) continue;
  if (csvRow.form !== xlsxForm) {
    console.log(`CAPITALISATION DIFF: CSV "${csvRow.form}" vs xlsx "${xlsxForm}"`);
    discrepancies++;
  }
}

if (discrepancies === 0) {
  console.log(`NZ cross-check passed: CSV matches xlsx (${csvForms.size} entries).`);
} else {
  console.log(`\nNZ cross-check: ${discrepancies} discrepancy(ies) found.`);
  process.exit(1);
}
