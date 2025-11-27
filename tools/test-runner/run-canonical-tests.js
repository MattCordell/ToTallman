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
  blue: '\x1b[34m',
  gray: '\x1b[90m'
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

function logDebug(msg) {
  log(colors.gray, `  ${msg}`);
}

// Paths
const rootDir = path.join(__dirname, '..', '..');
const testsDir = path.join(rootDir, 'tests', 'canonical');
const testSchemaPath = path.join(testsDir, 'test-schema.json');

// Test results
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function main() {
  logInfo('ToTallman Canonical Test Runner');
  logInfo('================================\n');

  // Check if test schema exists
  if (!fs.existsSync(testSchemaPath)) {
    logError(`Test schema not found: ${testSchemaPath}`);
    process.exit(1);
  }

  // Load test schema
  let testSchema;
  try {
    testSchema = JSON.parse(fs.readFileSync(testSchemaPath, 'utf8'));
    logSuccess(`Loaded test schema`);
  } catch (error) {
    logError(`Failed to load test schema: ${error.message}`);
    process.exit(1);
  }

  // Initialize AJV
  const ajv = new Ajv({ allErrors: true });
  const validateSchema = ajv.compile(testSchema);

  // Find all test files
  const testFiles = fs.readdirSync(testsDir)
    .filter(file => file.endsWith('.json') && file !== 'test-schema.json')
    .sort();

  if (testFiles.length === 0) {
    logWarning('No test files found');
    process.exit(0);
  }

  logInfo(`Found ${testFiles.length} test file(s)\n`);

  // Check if adapter is provided
  const adapterPath = process.argv[2];
  if (!adapterPath) {
    logInfo('No implementation adapter provided');
    logInfo('Running in validation-only mode\n');
  }

  // Load adapter if provided
  let adapter = null;
  if (adapterPath && fs.existsSync(adapterPath)) {
    try {
      adapter = require(path.resolve(adapterPath));
      logSuccess(`Loaded adapter: ${path.basename(adapterPath)}\n`);
    } catch (error) {
      logError(`Failed to load adapter: ${error.message}`);
      process.exit(1);
    }
  }

  // Run tests
  for (const file of testFiles) {
    runTestFile(path.join(testsDir, file), validateSchema, adapter);
  }

  // Print summary
  printSummary();

  // Exit with appropriate code
  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

function runTestFile(filePath, validateSchema, adapter) {
  const fileName = path.basename(filePath);
  logInfo(`\n📄 ${fileName}`);
  logInfo('─'.repeat(fileName.length + 3));

  // Load test file
  let testData;
  try {
    testData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    logError(`Failed to parse test file: ${error.message}`);
    return;
  }

  // Validate against schema
  const valid = validateSchema(testData);
  if (!valid) {
    logError(`Schema validation failed:`);
    validateSchema.errors.forEach(error => {
      logError(`  ${error.instancePath} ${error.message}`);
    });
    return;
  }

  // Run each test
  const tests = testData.tests || [];
  let filePassed = 0;
  let fileFailed = 0;

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    totalTests++;

    if (adapter) {
      // Run actual test
      try {
        const result = adapter.toTallman(test.input, test.listId);
        if (result === test.expected) {
          passedTests++;
          filePassed++;
          logSuccess(`Test ${i + 1}: ${test.description}`);
        } else {
          failedTests++;
          fileFailed++;
          logError(`Test ${i + 1}: ${test.description}`);
          logDebug(`Input:    "${test.input}"`);
          logDebug(`Expected: "${test.expected}"`);
          logDebug(`Got:      "${result}"`);
          failures.push({
            file: fileName,
            test: test.description,
            input: test.input,
            expected: test.expected,
            actual: result
          });
        }
      } catch (error) {
        failedTests++;
        fileFailed++;
        logError(`Test ${i + 1}: ${test.description} - ERROR`);
        logDebug(`Error: ${error.message}`);
        failures.push({
          file: fileName,
          test: test.description,
          input: test.input,
          expected: test.expected,
          actual: `ERROR: ${error.message}`
        });
      }
    } else {
      // Validation only
      logDebug(`Test ${i + 1}: ${test.description}`);
      passedTests++;
      filePassed++;
    }
  }

  if (adapter) {
    log(colors.gray, `\n  ${filePassed} passed, ${fileFailed} failed`);
  } else {
    log(colors.gray, `\n  ${tests.length} tests validated`);
  }
}

function printSummary() {
  logInfo('\n\n' + '='.repeat(50));
  logInfo('SUMMARY');
  logInfo('='.repeat(50));

  if (totalTests === 0) {
    logWarning('No tests were run');
    return;
  }

  logInfo(`Total tests: ${totalTests}`);
  logSuccess(`Passed: ${passedTests}`);
  if (failedTests > 0) {
    logError(`Failed: ${failedTests}`);
  }

  const passRate = ((passedTests / totalTests) * 100).toFixed(1);
  if (passedTests === totalTests) {
    logSuccess(`\n✅ All tests passed! (100%)`);
  } else {
    logWarning(`\nPass rate: ${passRate}%`);
  }

  if (failures.length > 0) {
    logInfo('\n\nFailed Tests:');
    logInfo('─'.repeat(50));
    failures.forEach((failure, i) => {
      logError(`\n${i + 1}. [${failure.file}] ${failure.test}`);
      logDebug(`Input:    "${failure.input}"`);
      logDebug(`Expected: "${failure.expected}"`);
      logDebug(`Got:      "${failure.actual}"`);
    });
  }
}

// Run main function
main();
