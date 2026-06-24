'use strict';

const { toTallman } = require('totallman');

const sample = 'Prescribe vincristine and vinblastine carefully; prednisone requires monitoring.';
const text = process.argv.slice(2).join(' ') || sample;

console.log(`Input:   ${text}`);
console.log(`DEFAULT: ${toTallman(text)}`);
console.log(`AU:      ${toTallman(text, 'AU')}`);
