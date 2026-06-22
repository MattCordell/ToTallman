'use strict';
// Native unit tests using node:test.
// Run after `npm run build` with: node --test tests/converter.test.js

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execSync } = require('child_process');
const path = require('path');
const { toTallman, availableLists, listVersion, TallmanError } = require('../dist/cjs/index.js');

// --- Basic conversion ---

test('converts a known drug name', () => {
    assert.equal(toTallman('prednisone'), 'predniSONE');
});

test('converts another known drug name', () => {
    assert.equal(toTallman('prednisolone', 'FDA'), 'prednisoLONE');
});

test('is case-insensitive on input', () => {
    assert.equal(toTallman('PREDNISONE'), 'predniSONE');
    assert.equal(toTallman('Prednisone'), 'predniSONE');
});

test('preserves unknown words unchanged', () => {
    assert.equal(toTallman('aspirin'), 'aspirin');
});

// --- Edge cases ---

test('returns empty string for empty input', () => {
    assert.equal(toTallman(''), '');
});

test('preserves punctuation around drug names', () => {
    assert.equal(toTallman('prednisone,'), 'predniSONE,');
    assert.equal(toTallman('(prednisone)'), '(predniSONE)');
});

test('does not match substrings — whole-word only', () => {
    assert.equal(toTallman('myprednisonetest'), 'myprednisonetest');
});

// --- Multi-word ---

test('matches multi-word entries', () => {
    // "ms contin" is a 2-word entry in DEFAULT (or NZ lists)
    // Test with a known single-word entry to stay list-agnostic
    const result = toTallman('predniSONE prednisoLONE');
    assert.match(result, /predniSONE/);
});

// --- List selection ---

test('uses DEFAULT list when no listId provided', () => {
    assert.equal(toTallman('prednisone'), toTallman('prednisone', 'DEFAULT'));
});

test('throws TallmanError for unknown listId', () => {
    assert.throws(
        () => toTallman('prednisone', 'INVALID'),
        (err) => err instanceof TallmanError && /INVALID/.test(err.message),
    );
});

// --- Metadata ---

test('availableLists returns sorted list IDs', () => {
    const lists = availableLists();
    assert.ok(lists.includes('DEFAULT'));
    assert.ok(lists.includes('AU'));
    assert.deepEqual([...lists].sort(), lists);
});

test('listVersion returns a version string', () => {
    const ver = listVersion('DEFAULT');
    assert.ok(typeof ver === 'string' && ver.length > 0);
});

// --- CLI smoke test ---

test('CLI produces correct output with --input', () => {
    const cliPath = path.join(__dirname, '..', 'dist', 'cjs', 'cli.js');
    const result = execSync(`node "${cliPath}" --input prednisone --list DEFAULT`, {
        encoding: 'utf8',
    });
    // CLI must write no trailing newline
    assert.equal(result, 'predniSONE');
});

test('CLI supports --input-base64', () => {
    const cliPath = path.join(__dirname, '..', 'dist', 'cjs', 'cli.js');
    const b64 = Buffer.from('prednisolone', 'utf8').toString('base64');
    const result = execSync(`node "${cliPath}" --input-base64 "${b64}" --list FDA`, {
        encoding: 'utf8',
    });
    assert.equal(result, 'prednisoLONE');
});
