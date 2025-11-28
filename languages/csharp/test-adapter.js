// test-adapter.js
// Node.js adapter to bridge the canonical test runner to the C# implementation

const { execSync } = require('child_process');
const path = require('path');

// Determine the path to the compiled demo executable
// This assumes the demo has been built in Debug configuration
const exePath = path.join(__dirname, 'src', 'ToTallman.Demo', 'bin', 'Debug', 'net8.0', 'ToTallman.Demo.exe');

module.exports = {
    /**
     * Converts input text using the C# ToTallman implementation.
     * @param {string} input - The input string to convert
     * @param {string} listId - The Tallman list ID to use (DEFAULT, AU, FDA, ISMP, NZ)
     * @returns {string} The converted output with Tall Man lettering applied
     */
    toTallman: function(input, listId) {
        try {
            // Escape double quotes in input for command line
            const escapedInput = input.replace(/"/g, '\\"');

            // Build command: ToTallman.Demo.exe --input "text" --list "LIST_ID"
            const command = `"${exePath}" --input "${escapedInput}" --list "${listId}"`;

            // Execute C# program and capture output
            const result = execSync(command, {
                encoding: 'utf8',
                stdio: ['pipe', 'pipe', 'pipe'], // stdin, stdout, stderr
                maxBuffer: 10 * 1024 * 1024 // 10MB buffer
            });

            // Return result (already trimmed by C# program - no newline added)
            return result;
        }
        catch (error) {
            // If execution fails, throw error with details
            const stderr = error.stderr ? error.stderr.toString() : '';
            const stdout = error.stdout ? error.stdout.toString() : '';

            throw new Error(
                `C# execution failed:\n` +
                `Command: ${error.cmd || 'unknown'}\n` +
                `Exit code: ${error.status || 'unknown'}\n` +
                `Stdout: ${stdout}\n` +
                `Stderr: ${stderr}\n` +
                `Message: ${error.message}`
            );
        }
    }
};
