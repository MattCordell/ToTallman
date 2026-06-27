#!/usr/bin/env node
//
// fda-crosscheck.js
//
// Cross-check the manually transcribed FDA extract CSV against the live
// FDA Name Differentiation Project web page. Reports discrepancies.
//
// Usage: node fda-crosscheck.js
//
// Requires: npm install node-fetch (run once in this directory)
// Node 18+ has built-in fetch -- no install needed.
//
// The live page is the QA reference only -- the CSV is the source of truth.

'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..', '..');
const sourcesDir = path.join(rootDir, 'tallman-lists', 'sources');
const fdaDir = path.join(sourcesDir, 'FDA');

const FDA_URL = 'https://www.fda.gov/drugs/medication-errors-related-cder-regulated-drug-products/fda-name-differentiation-project';

const { casefoldKey, parseCSV } = require('../lib/util');

// Load meta + CSV
const meta = JSON.parse(fs.readFileSync(path.join(fdaDir, 'meta.json'), 'utf8'));

const csvPath = path.join(fdaDir, meta.extract_file);
const csvRows = parseCSV(fs.readFileSync(csvPath, 'utf8'));
const csvForms = new Map(); // casefold -> original form
for (const row of csvRows) {
  if (!row.form) continue;
  csvForms.set(casefoldKey(row.form), row.form);
}

// Fetch and parse FDA page
async function fetchFDAForms() {
  console.log(`Fetching ${FDA_URL} ...`);
  let html;
  try {
    const res = await fetch(FDA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    console.error(`Failed to fetch FDA page: ${err.message}`);
    console.error('Cannot complete cross-check without network access.');
    process.exit(2);
  }

  // Extract drug names from the TML column (second column in the table)
  // Pattern: cells containing mixed-case TML forms like "acetoHEXAMIDE"
  const forms = new Map();
  // Match table cell content; split on '/' for paired entries
  const tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let m;
  while ((m = tdPattern.exec(html)) !== null) {
    // Strip HTML tags iteratively so nested/malformed markup (e.g. <<script>>) cannot survive
    let cell = m[1];
    let prev;
    do { prev = cell; cell = cell.replace(/<[^>]*>/g, ''); } while (cell !== prev);
    cell = cell.trim();
    if (!cell) continue;
    // Split on ' / ' to get individual names
    const parts = cell.split(/\s*\/\s*/);
    for (const part of parts) {
      const name = part.trim();
      // TML forms: have at least one uppercase and one lowercase, only letters
      if (/[A-Z]/.test(name) && /[a-z]/.test(name) && /^[A-Za-z-]+$/.test(name) && name.length > 3) {
        forms.set(casefoldKey(name), name);
      }
    }
  }
  return forms;
}

(async () => {
  const liveForms = await fetchFDAForms();
  console.log(`FDA live page: ${liveForms.size} TML forms detected`);
  console.log(`CSV: ${csvForms.size} entries\n`);

  let discrepancies = 0;

  // In live page but not CSV
  for (const [key, form] of liveForms.entries()) {
    if (!csvForms.has(key)) {
      console.log(`MISSING from CSV (live page has): "${form}"`);
      discrepancies++;
    }
  }

  // In CSV but not live page
  for (const [key, form] of csvForms.entries()) {
    if (!liveForms.has(key)) {
      console.log(`EXTRA in CSV (not on live page): "${form}" -- may be discontinued; verify`);
      discrepancies++;
    }
  }

  // Capitalisation differences
  for (const [key, csvForm] of csvForms.entries()) {
    const liveForm = liveForms.get(key);
    if (!liveForm) continue;
    if (csvForm !== liveForm) {
      console.log(`CAPITALISATION DIFF: CSV "${csvForm}" vs live "${liveForm}"`);
      discrepancies++;
    }
  }

  if (discrepancies === 0) {
    console.log(`FDA cross-check passed: CSV matches live page (${csvForms.size} entries).`);
  } else {
    console.log(`\nFDA cross-check: ${discrepancies} discrepancy(ies) found.`);
    process.exit(1);
  }
})();
