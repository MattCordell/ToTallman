package com.totallman;

import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * CLI entry point for the shared canonical test harness.
 *
 * <p>Usage: {@code java -jar totallman.jar [--input-base64 <b64> | --input <text>] [--list <ID>]}
 *
 * <p>Output is written to stdout with no trailing newline. Exit 0 on success, 1 on error.
 */
public final class Cli {

  private Cli() {}

  public static void main(String[] args) throws Exception {
    // Force stdout to UTF-8 regardless of the platform default encoding (e.g. Windows CP1252).
    System.setOut(new PrintStream(System.out, true, StandardCharsets.UTF_8));

    String input = null;
    String listId = "DEFAULT";

    for (int i = 0; i < args.length; i++) {
      switch (args[i]) {
        case "--input-base64":
          if (i + 1 >= args.length) {
            System.err.println("Error: --input-base64 requires a value.");
            System.exit(1);
          }
          try {
            byte[] decoded = Base64.getDecoder().decode(args[i + 1]);
            input = new String(decoded, StandardCharsets.UTF_8);
          } catch (IllegalArgumentException e) {
            System.err.println("Error: invalid base64 input: " + e.getMessage());
            System.exit(1);
          }
          i++;
          break;
        case "--input":
          if (i + 1 >= args.length) {
            System.err.println("Error: --input requires a value.");
            System.exit(1);
          }
          input = args[i + 1];
          i++;
          break;
        case "--list":
          if (i + 1 >= args.length) {
            System.err.println("Error: --list requires a value.");
            System.exit(1);
          }
          listId = args[i + 1];
          i++;
          break;
        default:
          break;
      }
    }

    if (input == null) {
      System.err.println("Error: --input or --input-base64 is required.");
      System.exit(1);
    }

    try {
      String result = TallmanConverter.toTallman(input, listId);
      // No trailing newline — matches the C# and Python adapter contract.
      System.out.print(result);
    } catch (TallmanException e) {
      System.err.println("Error: " + e.getMessage());
      System.exit(1);
    }
  }
}
