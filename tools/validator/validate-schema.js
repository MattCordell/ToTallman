#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

function logSuccess(msg) {
  log(colors.green, `✓ ${msg}`);
}

function logError(msg) {
  log(colors.red, `✗ ${msg}`);
}

function logWarning(msg) {
  log(colors.yellow, `⚠ ${msg}`);
}

function logInfo(msg) {
  log(colors.blue, `ℹ ${msg}`);
}

// Paths
const rootDir = path.join(__dirname, '..', '..');
const schemaPath = path.join(rootDir, 'tallman-lists', 'schema.json');
const listsDir = path.join(rootDir, 'tallman-lists');

// Validation state
let hasErrors = false;
const manifest = [];

function main() {
  logInfo('ToTallman List Validator');
  logInfo('========================\n');

  // Check if schema exists
  if (!fs.existsSync(schemaPath)) {
    logError(`Schema file not found: ${schemaPath}`);
    process.exit(1);
  }

  // Load schema
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    logSuccess(`Loaded schema from: ${path.relative(rootDir, schemaPath)}`);
  } catch (error) {
    logError(`Failed to load schema: ${error.message}`);
    process.exit(1);
  }

  // Initialize AJV
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);

  // Find all JSON source lists in the tallman-lists directory.
  // Exclude schema.json and the generated manifest.json (which is this tool's own
  // output, not a source list) so the validator is idempotent on a fresh checkout.
  // This mirrors the same exclusion in tools/compile-lists/compile-lists.js.
  const jsonFiles = fs.readdirSync(listsDir)
    .filter(file => file.endsWith('.json') && file !== 'schema.json' && file !== 'manifest.json')
    .sort();

  if (jsonFiles.length === 0) {
    logWarning('No list files found to validate');
    process.exit(0);
  }

  logInfo(`\nFound ${jsonFiles.length} list file(s) to validate\n`);

  // Validate each file
  for (const file of jsonFiles) {
    validateFile(path.join(listsDir, file), validate);
  }

  // Generate manifest
  if (manifest.length > 0) {
    logInfo('\n--- List Manifest ---');
    manifest.forEach(item => {
      console.log(`  ${item.id}: ${item.entries} entries (v${item.version})`);
    });

    // Write manifest to file
    const manifestPath = path.join(listsDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    logSuccess(`\nManifest written to: ${path.relative(rootDir, manifestPath)}`);
  }

  // Exit with appropriate code
  if (hasErrors) {
    logError('\n❌ Validation failed with errors');
    process.exit(1);
  } else {
    logSuccess('\n✅ All validations passed!');
    process.exit(0);
  }
}

function validateFile(filePath, validate) {
  const fileName = path.basename(filePath);
  logInfo(`Validating: ${fileName}`);

  // Load file
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    logError(`  Failed to parse JSON: ${error.message}`);
    hasErrors = true;
    return;
  }

  // Validate against schema
  const valid = validate(data);
  if (!valid) {
    logError(`  Schema validation failed:`);
    validate.errors.forEach(error => {
      logError(`    ${error.instancePath} ${error.message}`);
    });
    hasErrors = true;
    return;
  }

  logSuccess(`  Schema validation passed`);

  // Additional validations
  validateEntries(data, fileName);
  validateVersion(data, fileName);

  // Add to manifest
  manifest.push({
    id: data.id,
    version: data.version,
    entries: data.entries.length,
    description: data.description
  });
}

function validateEntries(data, fileName) {
  // Check for duplicates (case-insensitive)
  const seen = new Map();
  const duplicates = [];

  for (let i = 0; i < data.entries.length; i++) {
    const entry = data.entries[i];
    const lowerEntry = entry.toLowerCase();

    if (seen.has(lowerEntry)) {
      duplicates.push({
        entry,
        indices: [seen.get(lowerEntry), i]
      });
    } else {
      seen.set(lowerEntry, i);
    }
  }

  if (duplicates.length > 0) {
    logError(`  Found ${duplicates.length} duplicate entry(ies):`);
    duplicates.forEach(dup => {
      logError(`    "${dup.entry}" at indices ${dup.indices.join(', ')}`);
    });
    hasErrors = true;
  } else {
    logSuccess(`  No duplicates found (${data.entries.length} unique entries)`);
  }

  // Check for empty entries
  const emptyEntries = data.entries.filter(e => !e || e.trim() === '');
  if (emptyEntries.length > 0) {
    logError(`  Found ${emptyEntries.length} empty entry(ies)`);
    hasErrors = true;
  }

  // ASCII-only constraint: entries must contain only ASCII characters (U+0000-U+007F).
  // Within ASCII, toLowerCase equals Unicode Default Case Folding, guaranteeing
  // identical casefold keys across all language runtimes. See spec section 3.2.
  const nonAsciiEntries = data.entries.filter(e => !/^[\x00-\x7F]*$/.test(e));
  if (nonAsciiEntries.length > 0) {
    logError(`  Found ${nonAsciiEntries.length} entry(ies) with non-ASCII characters (ASCII-only constraint, see spec 3.2):`);
    nonAsciiEntries.forEach(e => logError(`    "${e}"`));
    hasErrors = true;
  } else {
    logSuccess(`  All entries are ASCII-only`);
  }

  // Upper/lower rule: every Tall Man entry must highlight something by containing
  // at least one uppercase AND one lowercase letter.
  const noTMLEntries = data.entries.filter(e => !(/[A-Z]/.test(e) && /[a-z]/.test(e)));
  if (noTMLEntries.length > 0) {
    logError(`  Found ${noTMLEntries.length} entry(ies) without both uppercase and lowercase (upper/lower rule):`);
    noTMLEntries.forEach(e => logError(`    "${e}"`));
    hasErrors = true;
  } else {
    logSuccess(`  All entries satisfy upper/lower rule`);
  }

  // Sort order rule: entries must be casefold-sorted (toLowerCase order).
  // build-lists.js guarantees this; a violation means the file was hand-edited.
  const sorted = [...data.entries].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const unsortedIdx = data.entries.findIndex((e, i) => e !== sorted[i]);
  if (unsortedIdx !== -1) {
    logError(`  Entries are not casefold-sorted (first mismatch at index ${unsortedIdx}: "${data.entries[unsortedIdx]}" should be "${sorted[unsortedIdx]}")`);
    logError(`  Run tools/build-lists/build-lists.js to regenerate sorted output`);
    hasErrors = true;
  } else {
    logSuccess(`  Entries are casefold-sorted`);
  }
}

function validateVersion(data, fileName) {
  // Version format should be YYYYMMDD.N
  const versionRegex = /^\d{8}\.\d+$/;
  if (!versionRegex.test(data.version)) {
    logError(`  Invalid version format: "${data.version}" (expected YYYYMMDD.N)`);
    hasErrors = true;
    return;
  }

  // Validate date component
  const datePart = data.version.split('.')[0];
  const year = parseInt(datePart.substring(0, 4));
  const month = parseInt(datePart.substring(4, 6));
  const day = parseInt(datePart.substring(6, 8));

  const isValidDate =
    year >= 2000 && year <= 2100 &&
    month >= 1 && month <= 12 &&
    day >= 1 && day <= 31;

  if (!isValidDate) {
    logWarning(`  Version date component may be invalid: ${year}-${month}-${day}`);
  } else {
    logSuccess(`  Version format valid: ${data.version}`);
  }
}

// Run main function
main();
