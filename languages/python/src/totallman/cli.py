from __future__ import annotations

import argparse
import base64
import sys

from totallman.converter import to_tallman
from totallman.exceptions import TallmanError


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="totallman",
        description="Convert medication names to Tall Man lettering.",
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--input", metavar="TEXT", help="Input text (direct)")
    group.add_argument(
        "--input-base64",
        metavar="B64",
        dest="input_base64",
        help="Input text as UTF-8 Base64 (handles newlines and special chars)",
    )
    parser.add_argument(
        "--list",
        metavar="LIST_ID",
        default="DEFAULT",
        help="Tall Man list to use (default: DEFAULT)",
    )
    args = parser.parse_args()

    if args.input_base64 is not None:
        try:
            text = base64.b64decode(args.input_base64).decode("utf-8")
        except Exception as exc:
            print(f"Error decoding base64 input: {exc}", file=sys.stderr)
            return 1
    else:
        text = args.input

    try:
        result = to_tallman(text, args.list)
    except TallmanError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    # Write UTF-8 bytes to stdout buffer with NO trailing newline, matching
    # the C# CLI contract (test adapter reads stdout verbatim).
    sys.stdout.buffer.write(result.encode("utf-8"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
