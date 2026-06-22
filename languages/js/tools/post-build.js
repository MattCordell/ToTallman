'use strict';
// Drops package.json marker files into dist/cjs and dist/esm so Node.js
// module resolution treats each output tree with the correct module format.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

fs.writeFileSync(
  path.join(root, 'dist', 'cjs', 'package.json'),
  JSON.stringify({ type: 'commonjs' }) + '\n',
  'utf8',
);

fs.writeFileSync(
  path.join(root, 'dist', 'esm', 'package.json'),
  JSON.stringify({ type: 'module' }) + '\n',
  'utf8',
);
