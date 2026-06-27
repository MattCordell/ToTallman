using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using ToTallman;
using Xunit;

namespace ToTallman.Tests
{
    /// <summary>
    /// Unit tests for the C# ToTallman implementation.
    ///
    /// Two layers of coverage:
    ///  1. Explicit InlineData/Fact tests documenting core canonical behaviours.
    ///  2. A data-driven test that runs the full canonical suite (tests/canonical/*.json)
    ///     directly against the library, so `dotnet test` enforces the same 100% gate
    ///     as the cross-language test runner.
    /// </summary>
    public class TallmanConverterTests
    {
        // ---------------------------------------------------------------------
        // Layer 1: Explicit behaviour tests (no file IO).
        // ---------------------------------------------------------------------

        [Theory]
        // Basic whole-word replacement
        [InlineData("prednisone", "DEFAULT", "predniSONE")]
        // Case-insensitive matching (uppercase input still matches)
        [InlineData("PREDNISONE", "DEFAULT", "predniSONE")]
        // Punctuation is a word boundary and is preserved
        [InlineData("prednisone,", "DEFAULT", "predniSONE,")]
        // No substring matching: the drug name embedded in a larger token is left alone
        [InlineData("myprednisonetest", "DEFAULT", "myprednisonetest")]
        // Multi-word drug matched as a single entry
        [InlineData("ms contin", "DEFAULT", "MS Contin")]
        // Hyphenated drug
        [InlineData("solu-medrol", "DEFAULT", "SOLU-medrol")]
        // Hyphen forms a word boundary so the inner word still converts
        [InlineData("test-prednisone-test", "DEFAULT", "test-predniSONE-test")]
        // Unknown drug is returned unchanged
        [InlineData("aspirin", "DEFAULT", "aspirin")]
        // Surrounding whitespace is preserved exactly
        [InlineData("  prednisone  ", "DEFAULT", "  predniSONE  ")]
        // Empty string returns empty string
        [InlineData("", "DEFAULT", "")]
        public void Converts_As_Expected(string input, string listId, string expected)
        {
            Assert.Equal(expected, input.ToTallman(listId));
        }

        [Theory]
        // The same drug can be capitalised differently per list.
        [InlineData("vincristine", "AU", "vinCRISTine")]
        [InlineData("vincristine", "FDA", "vinCRIStine")]
        [InlineData("dopamine", "FDA", "DOPamine")]
        public void Respects_List_Selection(string input, string listId, string expected)
        {
            Assert.Equal(expected, input.ToTallman(listId));
        }

        [Fact]
        public void Null_Input_Returns_Empty_String()
        {
            string? input = null;
            Assert.Equal(string.Empty, input.ToTallman());
        }

        [Fact]
        public void Unknown_List_Throws_TallmanException()
        {
            Assert.Throws<TallmanException>(() => "prednisone".ToTallman("NOT_A_REAL_LIST"));
        }

        [Fact]
        public void Default_List_Is_DEFAULT()
        {
            // Calling without a listId must behave identically to passing "DEFAULT".
            Assert.Equal("prednisone".ToTallman("DEFAULT"), "prednisone".ToTallman());
        }

        [Fact]
        public void AvailableLists_Contains_Known_Ids()
        {
            IReadOnlySet<string> lists = TallmanConverter.AvailableLists;
            Assert.Contains("DEFAULT", lists);
            Assert.Contains("AU", lists);
            Assert.Contains("FDA", lists);
            Assert.Contains("ISMP", lists);
            Assert.Contains("NZ", lists);
        }

        [Fact]
        public void ListVersion_Returns_Version_String()
        {
            // Version strings are in YYYYMMDD.N format
            string version = TallmanConverter.ListVersion("DEFAULT");
            Assert.Matches(@"^\d{8}\.\d+$", version);
        }

        [Fact]
        public void ListVersion_Throws_For_Unknown_List()
        {
            var ex = Assert.Throws<TallmanException>(() => TallmanConverter.ListVersion("NOT_A_REAL_LIST"));
            Assert.Equal("Unknown Tallman list ID: 'NOT_A_REAL_LIST'. Available lists: AU, DEFAULT, FDA, ISMP, NZ.", ex.Message);
        }

        [Fact]
        public void TryToTallman_Returns_True_And_Converts_For_Known_List()
        {
            bool ok = "prednisone".TryToTallman("DEFAULT", out string result);
            Assert.True(ok);
            Assert.Equal("predniSONE", result);
        }

        [Fact]
        public void TryToTallman_Returns_False_For_Unknown_List()
        {
            bool ok = "prednisone".TryToTallman("NOT_A_REAL_LIST", out string result);
            Assert.False(ok);
            Assert.Equal(string.Empty, result);
        }

        [Fact]
        public void TryToTallman_Default_Overload_Uses_DEFAULT_List()
        {
            bool ok = "prednisone".TryToTallman(out string result);
            Assert.True(ok);
            Assert.Equal("predniSONE", result);
        }

        // ---------------------------------------------------------------------
        // Layer 2: Data-driven canonical suite.
        // ---------------------------------------------------------------------

        [Theory]
        [MemberData(nameof(CanonicalCases))]
        public void Canonical_Suite_Passes(string file, string description, string? input, string listId, string expected)
        {
            string actual = input.ToTallman(listId);

            Assert.True(
                expected == actual,
                $"[{file}] {description}" + Environment.NewLine +
                $"  input:    {Quote(input)}" + Environment.NewLine +
                $"  expected: {Quote(expected)}" + Environment.NewLine +
                $"  actual:   {Quote(actual)}");
        }

        public static IEnumerable<object?[]> CanonicalCases()
        {
            string canonicalDir = FindCanonicalDir();
            JsonSerializerOptions options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            foreach (string file in Directory.GetFiles(canonicalDir, "*.json").OrderBy(f => f, StringComparer.Ordinal))
            {
                string name = Path.GetFileName(file);
                if (string.Equals(name, "test-schema.json", StringComparison.Ordinal))
                {
                    continue;
                }

                CanonicalTestFile? parsed = JsonSerializer.Deserialize<CanonicalTestFile>(File.ReadAllText(file), options);
                if (parsed?.Tests == null)
                {
                    continue;
                }

                foreach (CanonicalTestCase test in parsed.Tests)
                {
                    yield return new object?[]
                    {
                        name,
                        test.Description ?? string.Empty,
                        test.Input,
                        string.IsNullOrEmpty(test.ListId) ? "DEFAULT" : test.ListId,
                        test.Expected ?? string.Empty
                    };
                }
            }
        }

        /// <summary>
        /// Walks up from the test assembly location to find the repo's tests/canonical directory.
        /// </summary>
        private static string FindCanonicalDir()
        {
            DirectoryInfo? dir = new DirectoryInfo(AppContext.BaseDirectory);
            while (dir != null)
            {
                string candidate = Path.Combine(dir.FullName, "tests", "canonical");
                if (Directory.Exists(candidate) &&
                    File.Exists(Path.Combine(candidate, "test-schema.json")))
                {
                    return candidate;
                }

                dir = dir.Parent;
            }

            throw new DirectoryNotFoundException(
                "Could not locate the tests/canonical directory by walking up from " + AppContext.BaseDirectory);
        }

        private static string Quote(string? value)
        {
            if (value == null)
            {
                return "<null>";
            }

            return "\"" + value.Replace("\n", "\\n").Replace("\t", "\\t") + "\"";
        }

        private sealed class CanonicalTestFile
        {
            public List<CanonicalTestCase>? Tests { get; set; }
        }

        private sealed class CanonicalTestCase
        {
            public string? Description { get; set; }
            public string? Input { get; set; }
            public string? ListId { get; set; }
            public string? Expected { get; set; }
        }
    }
}
