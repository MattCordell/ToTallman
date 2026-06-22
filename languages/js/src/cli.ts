#!/usr/bin/env node
import { toTallman } from './converter.js';

function usage(): void {
  process.stderr.write(
    'Usage: totallman --input <text> [--list <listId>]\n' +
      '       totallman --input-base64 <b64> [--list <listId>]\n',
  );
}

function main(): void {
  const args = process.argv.slice(2);
  let input: string | undefined;
  let listId = 'DEFAULT';

  for (let i = 0; i < args.length - 1; i++) {
    switch (args[i]) {
      case '--input':
        input = args[i + 1];
        i++;
        break;
      case '--input-base64': {
        const raw = args[i + 1];
        if (raw === undefined) break;
        input = Buffer.from(raw, 'base64').toString('utf8');
        i++;
        break;
      }
      case '--list':
        listId = args[i + 1] ?? listId;
        i++;
        break;
    }
  }

  if (input === undefined) {
    usage();
    process.exit(1) as never;
  }

  try {
    const result = toTallman(input as string, listId);
    // No trailing newline — mirrors the Java/Python/C# CLI contract.
    process.stdout.write(result, 'utf8');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: ${msg}\n`);
    process.exit(1);
  }
}

main();
