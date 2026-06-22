'use strict';
// Test adapter for the shared canonical test runner and parity check.
// Shells out to the Python CLI using the same base64 contract as the C# adapter.
//
// The Python package must be installed in the active environment before running:
//   pip install -e languages/python
//
// The runner invokes:
//   node tools/test-runner/run-canonical-tests.js languages/python/test-adapter.js
//
// The parity check auto-discovers this file and calls toTallman() for every
// canonical test input, comparing results byte-for-byte against the C# adapter.

const { execSync } = require('child_process');
const path = require('path');

// Allow PYTHON env-var override so CI can pin a specific interpreter.
const pythonExe = process.env.PYTHON || 'python';

module.exports = {
    toTallman: function (input, listId) {
        try {
            // Base64-encode the input to safely transport newlines, quotes, and
            // arbitrary Unicode through a command-line argument.
            const base64Input = Buffer.from(input, 'utf8').toString('base64');

            const command = `${pythonExe} -m totallman --input-base64 "${base64Input}" --list "${listId}"`;

            const result = execSync(command, {
                encoding: 'buffer',    // receive raw bytes
                stdio: ['pipe', 'pipe', 'pipe'],
                maxBuffer: 10 * 1024 * 1024,
            });

            // Decode as UTF-8; the CLI writes no trailing newline.
            return result.toString('utf8');
        } catch (error) {
            const stderr = error.stderr ? error.stderr.toString() : '';
            const stdout = error.stdout ? error.stdout.toString() : '';
            throw new Error(
                `Python execution failed:\n` +
                `Command: ${error.cmd || 'unknown'}\n` +
                `Exit code: ${error.status || 'unknown'}\n` +
                `Stdout: ${stdout}\n` +
                `Stderr: ${stderr}\n` +
                `Message: ${error.message}`
            );
        }
    }
};
