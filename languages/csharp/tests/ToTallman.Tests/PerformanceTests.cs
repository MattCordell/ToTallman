using System.Diagnostics;
using System.Text;
using ToTallman;
using Xunit;
using Xunit.Abstractions;

namespace ToTallman.Tests
{
    /// <summary>
    /// Lightweight performance guards. These are NOT micro-benchmarks — the time
    /// budgets are deliberately generous. Their job is to fail loudly if conversion
    /// ever regresses to non-linear behaviour (e.g. an unbounded multi-word lookahead
    /// going O(n^2) on long runs of separator-delimited tokens).
    /// </summary>
    public class PerformanceTests
    {
        private readonly ITestOutputHelper _output;

        public PerformanceTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public void Pathological_LongTokenRun_StaysLinear()
        {
            // Worst case for the multi-word lookahead: tens of thousands of short,
            // space-separated tokens that never match. Unbounded, this is O(n^2) and
            // would take many seconds; bounded by the per-list cap it is milliseconds.
            const int tokenCount = 50_000;
            StringBuilder builder = new StringBuilder(tokenCount * 4);
            for (int n = 0; n < tokenCount; n++)
            {
                if (n > 0)
                {
                    builder.Append(' ');
                }

                builder.Append("xyz");
            }

            string input = builder.ToString();

            Stopwatch sw = Stopwatch.StartNew();
            string result = input.ToTallman("DEFAULT");
            sw.Stop();

            _output.WriteLine($"{tokenCount:N0} non-matching tokens converted in {sw.ElapsedMilliseconds} ms");

            // No token matches, so the output must be identical to the input.
            Assert.Equal(input, result);

            // Generous ceiling: a linear scan finishes in well under this; a quadratic one would not.
            Assert.True(
                sw.ElapsedMilliseconds < 3000,
                $"Conversion took {sw.ElapsedMilliseconds} ms for {tokenCount} tokens — possible non-linear regression.");
        }

        [Fact]
        public void Throughput_LargeRealisticText()
        {
            // ~1.8 MB of realistic prose containing single-word, hyphenated and multi-word drugs.
            const string paragraph =
                "Patient was prescribed prednisone and prednisolone, then switched to " +
                "ms contin for pain. Administer solu-medrol intravenously; do not confuse " +
                "dopamine with dobutamine. ";
            const int repeats = 8_000;

            StringBuilder builder = new StringBuilder(paragraph.Length * repeats);
            for (int n = 0; n < repeats; n++)
            {
                builder.Append(paragraph);
            }

            string input = builder.ToString();

            Stopwatch sw = Stopwatch.StartNew();
            string result = input.ToTallman("DEFAULT");
            sw.Stop();

            double megabytes = input.Length / (1024.0 * 1024.0);
            _output.WriteLine($"Converted {megabytes:F2} MB in {sw.ElapsedMilliseconds} ms");

            // Confirm conversion actually happened across single-word and multi-word entries.
            Assert.Contains("predniSONE", result);
            Assert.Contains("MS Contin", result);
            Assert.Contains("SOLU-medrol", result);

            Assert.True(
                sw.ElapsedMilliseconds < 3000,
                $"Conversion took {sw.ElapsedMilliseconds} ms for {megabytes:F2} MB — possible performance regression.");
        }
    }
}
