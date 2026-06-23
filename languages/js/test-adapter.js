'use strict';
// Test adapter for the shared canonical test runner and parity check.
// Imports the built CJS module in-process — no subprocess needed because the
// shared harness (tools/test-runner, tools/parity-check) is already Node.js.
//
// Prerequisites: run `npm run build` in languages/js before using this adapter.
//
// The runner invokes:
//   node tools/test-runner/run-canonical-tests.js languages/js/test-adapter.js
//
// The parity check auto-discovers this file and calls toTallman() for every
// canonical test input, comparing results byte-for-byte against other adapters.

const { toTallman } = require('./dist/cjs/index.js');

module.exports = {
    toTallman: function (input, listId) {
        return toTallman(input, listId);
    },
};
