#!/usr/bin/env node
//
// run-parity-check.js
//
// Cross-language output parity check for the ToTallman canonical test suite.
//
// Discovers all language adapters (languages/*/test-adapter.js), runs every
// canonical test input through each, and asserts all adapters produce identical
// output for every input/listId pair.
//
// Exit codes:
//   0 - All adapters agree (or fewer than 2 adapters found - parity deferred)
//   1 - Parity failure: at least one adapter produced different output
//
// NOTE: This tool tests already-built artifacts. It does NOT rebuild from
// source before comparing. In CI the language jobs rebuild each implementation
// and the parity job re-verifies the compiled artifact before running this
// script. When running locally, build each language first:
//   dotnet build languages/csharp/ToTallman.sln -c Debug
//   pip install -e languages/python
//   node languages/java/tools/embed-lists.js && mvn -f languages/java/pom.xml package -DskipTests
//   npm ci && npm run build  (in languages/js/)

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', '..');
const languagesDir = path.join(rootDir, 'languages');
const testsDir = path.join(rootDir, 'tests', 'canonical');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

function logSuccess(msg) { log(colors.green, `✓ ${msg}`); }
function logError(msg) { log(colors.red, `✗ ${msg}`); }
function logWarning(msg) { log(colors.yellow, `⚠ ${msg}`); }
function logInfo(msg) { log(colors.blue, `ℹ ${msg}`); }
function logGray(msg) { log(colors.gray, `  ${msg}`); }

function discoverAdapters() {
  if (!fs.existsSync(languagesDir)) {
    return [];
  }

  const adapters = [];
  const languageDirs = fs.readdirSync(languagesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  for (const lang of languageDirs) {
    const adapterPath = path.join(languagesDir, lang, 'test-adapter.js');
    if (fs.existsSync(adapterPath)) {
      adapters.push({ lang, adapterPath });
    }
  }

  return adapters;
}

function loadTestCases() {
  const testFiles = fs.readdirSync(testsDir)
    .filter(f => f.endsWith('.json') && f !== 'test-schema.json')
    .sort();

  const cases = [];
  for (const file of testFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(testsDir, file), 'utf8'));
    for (const test of (data.tests || [])) {
      cases.push({ file, description: test.description, input: test.input, listId: test.listId });
    }
  }

  return cases;
}

function main() {
  logInfo('ToTallman Cross-Language Parity Check');
  logInfo('======================================\n');

  const adapterDefs = discoverAdapters();
  logInfo(`Discovered ${adapterDefs.length} adapter(s):`);
  for (const { lang } of adapterDefs) {
    logGray(`languages/${lang}/test-adapter.js`);
  }
  console.log();

  if (adapterDefs.length === 0) {
    logWarning('No adapters found. Parity check skipped.');
    process.exit(0);
  }

  if (adapterDefs.length === 1) {
    logWarning(`Only 1 adapter found (${adapterDefs[0].lang}). Cross-language comparison deferred until 2+ adapters exist.`);
    logSuccess('Parity check passed (single-adapter; no cross-comparison needed).');
    process.exit(0);
  }

  // Load adapters
  const adapters = [];
  for (const { lang, adapterPath } of adapterDefs) {
    try {
      const adapter = require(adapterPath);
      adapters.push({ lang, adapter });
      logSuccess(`Loaded adapter: ${lang}`);
    } catch (err) {
      logError(`Failed to load adapter for ${lang}: ${err.message}`);
      process.exit(1);
    }
  }
  console.log();

  // Load canonical test cases
  const cases = loadTestCases();
  logInfo(`Running ${cases.length} test cases across ${adapters.length} adapters...\n`);

  let failures = 0;

  for (const testCase of cases) {
    const results = [];
    for (const { lang, adapter } of adapters) {
      try {
        const output = adapter.toTallman(testCase.input, testCase.listId);
        results.push({ lang, output, error: null });
      } catch (err) {
        results.push({ lang, output: null, error: err.message });
      }
    }

    // Compare all results against the first (reference) adapter
    const reference = results[0];
    const allAgree = results.every(
      r => r.output === reference.output && r.error === reference.error
    );

    if (!allAgree) {
      failures++;
      logError(`PARITY MISMATCH [${testCase.file}]: ${testCase.description}`);
      logGray(`Input:  "${testCase.input}"  (listId: ${testCase.listId})`);
      for (const { lang, output, error } of results) {
        const value = error ? `ERROR: ${error}` : `"${output}"`;
        logGray(`  ${lang}: ${value}`);
      }
      console.log();
    }
  }

  // Summary
  console.log();
  logInfo('='.repeat(50));
  if (failures === 0) {
    logSuccess(`All ${cases.length} test cases match across ${adapters.length} adapters.`);
    logSuccess('✅ Parity check passed!');
    process.exit(0);
  } else {
    logError(`${failures} parity mismatch(es) across ${cases.length} test cases.`);
    logError('❌ Parity check FAILED.');
    process.exit(1);
  }
}

main();
