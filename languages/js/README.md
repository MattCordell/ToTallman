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
listVersion('DEFAULT'); // e.g. '20260612.0'
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

| ID | Description | Entries | Version |
|----|-------------|---------|---------|
| `DEFAULT` | Combined list (AU + ISMP + NZ + FDA) | 384 | 20260612.0 |
| `AU` | Australian National Tall Man Lettering List (ACSQHC) | 235 | 20240400.0 |
| `ISMP` | FDA + ISMP Tall Man Lettering Lists (combined) | 171 | 20260612.0 |
| `NZ` | Aotearoa New Zealand Tall Man Lettering List (HQSC) | 219 | 20231000.0 |
| `FDA` | US Food and Drug Administration Name Differentiation Project | 43 | 20260612.0 |

Current entry counts are always in [`tallman-lists/manifest.json`](../../tallman-lists/manifest.json).

## Error handling

An unknown `listId` throws a `TallmanError` (named subclass of `Error`):

```typescript
import { toTallman, TallmanError } from 'totallman';

try {
  toTallman('prednisone', 'UNKNOWN');
} catch (err) {
  if (err instanceof TallmanError) {
    console.error(err.message); // "Unknown Tallman list ID: 'UNKNOWN'. Available lists: AU, DEFAULT, ..."
  }
}
```

A null/empty string input always returns `""` without throwing.

## Development

> **Prerequisite:** Node.js 20.19+ (or 22.13+, or 24+) for the dev toolchain — eslint 10 drops Node 18. The published library itself still runs on Node 18+ (see `engines` in `package.json`).

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

# Canonical test suite (99/99)
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
