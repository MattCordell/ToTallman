# totallman — JavaScript/TypeScript

Tall Man lettering for medication safety. Converts drug names to their Tall Man form (e.g. `prednisone` → `predniSONE`) using the canonical ToTallman algorithm.

## Installation

```sh
npm install totallman
```

## Usage

### ESM (TypeScript / bundler)

```typescript
import { toTallman, availableLists, listVersion } from 'totallman';

toTallman('prednisone');          // 'predniSONE'
toTallman('PREDNISONE');          // 'predniSONE'  — case-insensitive matching
toTallman('give prednisone now'); // 'give predniSONE now'
toTallman('SOLU-medrol');         // 'SOLU-medrol' — DEFAULT list (hyphenated)

toTallman('prednisone', 'FDA');   // 'predniSONE'  — explicit list
toTallman('DOBUTamine', 'FDA');   // 'DOBUTamine'  — already in Tall Man form

availableLists(); // ['AU', 'DEFAULT', 'FDA', 'ISMP', 'NZ']
listVersion('DEFAULT'); // e.g. '20180819.0'
```

### CommonJS

```javascript
const { toTallman } = require('totallman');

console.log(toTallman('prednisone')); // 'predniSONE'
```

### CLI

```sh
npx totallman --input "prednisone"
# predniSONE

npx totallman --input "prednisone" --list FDA
# predniSONE

npx totallman --input-base64 "cHJlZG5pc29uZQ==" --list DEFAULT
# predniSONE
```

## Available lists

| ID | Description |
|----|-------------|
| `DEFAULT` | Combined default list |
| `AU` | Australian National Tall Man Lettering List |
| `FDA` | US FDA Tall Man Lettering List |
| `ISMP` | ISMP Recommended Tall Man Lettering List |
| `NZ` | New Zealand Tall Man Lettering List |

## Error handling

An unknown `listId` throws a `TallmanError` (named subclass of `Error`):

```typescript
import { toTallman, TallmanError } from 'totallman';

try {
  toTallman('prednisone', 'UNKNOWN');
} catch (err) {
  if (err instanceof TallmanError) {
    console.error(err.message); // "Unknown list ID: 'UNKNOWN'. Available: AU, DEFAULT, ..."
  }
}
```

A null/empty string input always returns `""` without throwing.

## Development

```sh
# In languages/js/

npm install

# Regenerate embedded lists (after changing tallman-lists/*.json)
node tools/embed-lists.js

# Build (CJS + ESM)
npm run build

# Lint, format check, type check
npm run lint
npm run format:check
npm run typecheck

# Native unit tests
npm test

# Canonical test suite (98/98)
npm run test:canonical
```

## Algorithm

Implements the canonical ToTallman algorithm from `spec/TECHNICAL-SPEC.md` section 7:

1. Unicode NFC normalisation
2. Character-by-character iteration (surrogate-safe)
3. Canonical fold: `toLowerCase(NFC(word))` — locale-independent
4. Whole-word matching only (no substring matches)
5. Greedy multi-word lookahead bounded by per-list `maxWords`
6. Lists embedded at build time — zero runtime I/O

See the [spec](../../spec/TECHNICAL-SPEC.md) for full details.
