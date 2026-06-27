#!/usr/bin/env node
import { toTallman } from './converter.js';

function usage(): void {
  process.stderr.write(
    'Usage: totallman --input <text> [--list <listId>]\n' +
      '       totallman --input-base64 <b64> [--list <listId>]\n',
  );
}

// Validates standard base64 (RFC 4648 §4). Node's Buffer.from silently accepts
// invalid characters; this check ensures malformed input fails loudly.
const BASE64_RE =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})?$/;

function main(): void {
  const args = process.argv.slice(2);
  let input: string | undefined;
  let listId = 'DEFAULT';

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--input': {
        const val = args[i + 1];
        if (val === undefined) {
          process.stderr.write('Error: --input requires a value\n');
          process.exit(1);
        }
        input = val;
        i++;
        break;
      }
      case '--input-base64': {
        const raw = args[i + 1];
        if (raw === undefined) {
          process.stderr.write('Error: --input-base64 requires a value\n');
          process.exit(1);
        }
        if (!BASE64_RE.test(raw)) {
          process.stderr.write('Error: invalid base64 input\n');
          process.exit(1);
        }
        input = Buffer.from(raw, 'base64').toString('utf8');
        i++;
        break;
      }
      case '--list': {
        const val = args[i + 1];
        if (val === undefined) {
          process.stderr.write('Error: --list requires a value\n');
          process.exit(1);
        }
        listId = val;
        i++;
        break;
      }
    }
  }

  if (input === undefined) {
    usage();
    process.exit(1);
  }

  try {
    const result = toTallman(input, listId);
    // No trailing newline — mirrors the Java/Python/C# CLI contract.
    process.stdout.write(result, 'utf8');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: ${msg}\n`);
    process.exit(1);
  }
}

main();
