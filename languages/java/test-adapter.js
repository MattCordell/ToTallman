'use strict';
// Test adapter for the shared canonical test runner and parity check.
// Shells out to the Java CLI using the same base64 contract as the C# and Python adapters.
//
// The Java CLI jar must be built before running:
//   mvn -f languages/java/pom.xml package
//
// The runner invokes:
//   node tools/test-runner/run-canonical-tests.js languages/java/test-adapter.js
//
// The parity check auto-discovers this file and calls toTallman() for every
// canonical test input, comparing results byte-for-byte against the other adapters.

const { execSync } = require('child_process');
const path = require('path');

// Allow override via environment for CI flexibility.
const javaExe = process.env.JAVA || 'java';
const jarPath =
    process.env.TOTALLMAN_JAR ||
    path.join(__dirname, 'target', 'totallman-2.0.0-cli.jar');

module.exports = {
    toTallman: function (input, listId) {
        try {
            // Base64-encode the input to safely transport newlines, quotes, and
            // arbitrary Unicode through a command-line argument.
            const base64Input = Buffer.from(input, 'utf8').toString('base64');

            const command = `${javaExe} -jar "${jarPath}" --input-base64 "${base64Input}" --list "${listId}"`;

            const result = execSync(command, {
                encoding: 'buffer', // receive raw bytes
                stdio: ['pipe', 'pipe', 'pipe'],
                maxBuffer: 10 * 1024 * 1024,
            });

            // Decode as UTF-8; the CLI writes no trailing newline.
            return result.toString('utf8');
        } catch (error) {
            const stderr = error.stderr ? error.stderr.toString() : '';
            const stdout = error.stdout ? error.stdout.toString() : '';
            throw new Error(
                `Java execution failed:\n` +
                    `Command: ${error.cmd || 'unknown'}\n` +
                    `Exit code: ${error.status || 'unknown'}\n` +
                    `Stdout: ${stdout}\n` +
                    `Stderr: ${stderr}\n` +
                    `Message: ${error.message}`
            );
        }
    },
};
