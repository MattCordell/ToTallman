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

test('matches space-separated multi-word entry', () => {
    assert.equal(toTallman('ms contin'), 'MS Contin');
});

test('matches hyphenated multi-word entry', () => {
    assert.equal(toTallman('solu-medrol'), 'SOLU-medrol');
});

// --- Prototype-chain safety ---
// Plain object literals inherit Object.prototype, so without Object.hasOwn guards
// words like "constructor" would resolve to functions rather than undefined.

test('word matching against Object.prototype key is safe (no prototype leak)', () => {
    // 'constructor' casefolds to 'constructor' — must not match Object.prototype.constructor
    assert.equal(toTallman('I am the constructor of medicine'), 'I am the constructor of medicine');
});

test('throws TallmanError for listId matching Object.prototype key (toString)', () => {
    assert.throws(
        () => toTallman('prednisone', 'toString'),
        (err) => err instanceof TallmanError && /toString/.test(err.message),
    );
});

test('throws TallmanError for listId matching Object.prototype key (constructor)', () => {
    assert.throws(
        () => toTallman('prednisone', 'constructor'),
        (err) => err instanceof TallmanError && /constructor/.test(err.message),
    );
});

// --- List selection ---

test('uses DEFAULT list when no listId provided', () => {
    assert.equal(toTallman('prednisone'), toTallman('prednisone', 'DEFAULT'));
});

test('throws TallmanError for unknown listId', () => {
    assert.throws(
        () => toTallman('prednisone', 'INVALID'),
        (err) =>
            err instanceof TallmanError &&
            err.message === "Unknown Tallman list ID: 'INVALID'. Available lists: AU, DEFAULT, FDA, ISMP, NZ.",
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
