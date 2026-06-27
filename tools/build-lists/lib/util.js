'use strict';

// Canonical casefold key: NFC-normalize then lowercase.
// Matches compile-lists.js and spec §3.2. All entries are ASCII-only
// (validator-enforced), so toLowerCase is identical to Unicode Default Case
// Folding within that range.
function casefoldKey(text) {
  return text.normalize('NFC').toLowerCase();
}

// Minimal RFC 4180 CSV parser with quote-aware field handling.
// Handles quoted fields (including embedded commas and doubled-quote escapes).
function parseCSV(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const rows = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const fields = [];
    let i = 0;
    while (i < line.length) {
      if (line[i] === '"') {
        let val = '';
        i++; // skip opening quote
        while (i < line.length) {
          if (line[i] === '"' && line[i + 1] === '"') {
            val += '"';
            i += 2;
          } else if (line[i] === '"') {
            i++; // skip closing quote
            break;
          } else {
            val += line[i++];
          }
        }
        fields.push(val);
        if (i < line.length && line[i] === ',') i++;
      } else {
        let j = line.indexOf(',', i);
        if (j === -1) j = line.length;
        fields.push(line.slice(i, j));
        i = j + 1;
      }
    }
    rows.push(fields);
  }
  if (rows.length === 0) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (row[idx] || '').trim(); });
    return obj;
  });
}

module.exports = { casefoldKey, parseCSV };
