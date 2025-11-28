using System;
using ToTallman;

namespace ToTallman.Demo
{
    class Program
    {
        static int Main(string[] args)
        {
            // CLI mode for canonical test adapter
            if (args.Length >= 2 && args[0] == "--input")
            {
                return RunCliMode(args);
            }

            // Interactive demo mode
            return RunInteractiveMode();
        }

        /// <summary>
        /// CLI mode for test adapter integration.
        /// Usage: ToTallman.Demo --input "text" [--list "LIST_ID"]
        /// </summary>
        static int RunCliMode(string[] args)
        {
            try
            {
                string input = args[1];
                string listId = "DEFAULT";

                // Check for optional --list parameter
                for (int i = 2; i < args.Length - 1; i++)
                {
                    if (args[i] == "--list")
                    {
                        listId = args[i + 1];
                        break;
                    }
                }

                // Convert using Tallman
                string result = input.ToTallman(listId);

                // Output result WITHOUT newline (test runner expects exact match)
                Console.Write(result);

                return 0; // Success
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error: {ex.Message}");
                return 1; // Failure
            }
        }

        /// <summary>
        /// Interactive demonstration mode.
        /// </summary>
        static int RunInteractiveMode()
        {
            Console.WriteLine("===========================================");
            Console.WriteLine("  ToTallman v2.0.0 - Medication Safety");
            Console.WriteLine("  Tall Man Lettering Converter");
            Console.WriteLine("===========================================");
            Console.WriteLine();

            // Demo examples
            DemoExample("Basic conversion", "Patient prescribed prednisone and prednisolone");
            DemoExample("Punctuation preservation", "Take prednisone, not prednisolone!");
            DemoExample("Case insensitive", "PREDNISONE is different from PREDNISOLONE");
            DemoExample("Multi-word drug", "Patient needs ms contin for pain management");
            DemoExample("Hyphenated drug", "Administer solu-medrol intravenously");
            DemoExample("Mixed example", "Use DOBUTamine, not DOPamine. Check solu-medrol dose.");

            Console.WriteLine();
            Console.WriteLine("===========================================");
            Console.WriteLine("  Interactive Mode");
            Console.WriteLine("===========================================");
            Console.WriteLine();
            Console.WriteLine("Enter medication text (or 'quit' to exit):");

            while (true)
            {
                Console.WriteLine();
                Console.Write("> ");
                string? input = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(input) || input.Trim().ToLowerInvariant() == "quit")
                {
                    break;
                }

                try
                {
                    string result = input.ToTallman();
                    Console.WriteLine($"→ {result}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }

            Console.WriteLine();
            Console.WriteLine("Thank you for using ToTallman!");
            return 0;
        }

        /// <summary>
        /// Demonstrates a Tallman conversion example.
        /// </summary>
        static void DemoExample(string title, string input)
        {
            Console.WriteLine($"[{title}]");
            Console.WriteLine($"  Input:  {input}");

            try
            {
                string result = input.ToTallman();
                Console.WriteLine($"  Output: {result}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  Error:  {ex.Message}");
            }

            Console.WriteLine();
        }
    }
}
