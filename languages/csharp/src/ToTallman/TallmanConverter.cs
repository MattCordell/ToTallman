using System.Collections.Generic;
using System.Text;

namespace ToTallman
{
    /// <summary>
    /// Provides methods to convert medication names to Tall Man lettering format.
    /// Tall Man lettering uses mixed case to highlight distinguishing characters
    /// in look-alike, sound-alike (LASA) drug names for medication safety.
    /// </summary>
    public static class TallmanConverter
    {
        /// <summary>
        /// Converts medication names in the input string to Tall Man lettering format.
        /// Uses the DEFAULT list by default.
        /// </summary>
        /// <param name="input">The input string containing medication names</param>
        /// <param name="listId">
        /// The Tall Man list to use. Defaults to "DEFAULT" — a 202-entry aggregate of FDA/ISMP, AU, and NZ
        /// sources, suitable when no specific jurisdiction is required.
        /// Other lists: AU (206 entries, Australian National), FDA (37 entries, US FDA),
        /// ISMP (143 entries, Institute for Safe Medication Practices), NZ (190 entries, New Zealand).
        /// See <see cref="AvailableLists"/> for the runtime set of valid IDs and
        /// <see cref="ListVersion"/> for provenance of each list.
        /// </param>
        /// <returns>The input string with medication names converted to Tall Man format</returns>
        /// <exception cref="TallmanException">If the specified list ID is not found</exception>
        /// <example>
        /// <code>
        /// string result = "Patient prescribed prednisone".ToTallman();
        /// // Returns: "Patient prescribed predniSONE"
        /// </code>
        /// </example>
        public static string ToTallman(this string? input, string listId = "DEFAULT")
        {
            // Handle null or empty input
            if (string.IsNullOrEmpty(input))
            {
                return string.Empty;
            }

            // Step 1: Normalize to Unicode NFC (Canonical Decomposition followed by Canonical Composition)
            // This ensures that decomposed characters (e.g., e + ́ ) match precomposed forms (é)
            string normalized = input.Normalize(NormalizationForm.FormC);

            // Step 2: Get the Tallman dictionary for the specified list.
            // GetList throws TallmanException if the listId is unknown.
            IReadOnlyDictionary<string, string> dictionary = EmbeddedTallmanLists.GetList(listId);

            // The multi-word lookahead (Step 3) never needs to consider more words than
            // the longest entry in this list contains. Bounding by this per-list cap keeps
            // the whole conversion linear in input length, instead of O(n^2) on long runs
            // of non-matching, separator-delimited tokens.
            int maxWords = EmbeddedTallmanLists.GetMaxWordCount(listId);

            // Step 3: Iterate character-by-character with greedy longest-match
            StringBuilder result = new StringBuilder(normalized.Length);
            int i = 0;

            while (i < normalized.Length)
            {
                // Check if current character is a letter or combining mark
                if (UnicodeHelpers.IsLetterOrMark(normalized, i))
                {
                    // Extract the word starting at current position
                    int wordStart = i;
                    i = ExtractWord(normalized, i, out string word);

                    // Try to find the longest matching pattern (greedy algorithm)
                    string? bestMatch = null;
                    int bestMatchEndIndex = i;

                    // First, try single-word match
                    string key = UnicodeHelpers.CaseFold(word);
                    if (dictionary.TryGetValue(key, out string? tallmanForm))
                    {
                        bestMatch = tallmanForm;
                        bestMatchEndIndex = i;
                    }

                    // Then, try multi-word matches (greedy lookahead for space/hyphen-separated
                    // patterns). Stop once the candidate reaches maxWords: a longer pattern can
                    // never match an entry in this list, so scanning on would be wasted work.
                    int lookAheadIndex = i;
                    int wordsInPattern = 1;
                    StringBuilder pattern = new StringBuilder(word);

                    while (wordsInPattern < maxWords &&
                           lookAheadIndex < normalized.Length &&
                           (normalized[lookAheadIndex] == ' ' || normalized[lookAheadIndex] == '-'))
                    {
                        char separator = normalized[lookAheadIndex];
                        pattern.Append(separator);
                        lookAheadIndex++;

                        // Check if there's a word after the separator
                        if (lookAheadIndex < normalized.Length && UnicodeHelpers.IsLetterOrMark(normalized, lookAheadIndex))
                        {
                            lookAheadIndex = ExtractWord(normalized, lookAheadIndex, out string nextWord);
                            pattern.Append(nextWord);
                            wordsInPattern++;

                            // Check if this longer pattern matches
                            string multiWordKey = UnicodeHelpers.CaseFold(pattern.ToString());
                            if (dictionary.TryGetValue(multiWordKey, out string? multiWordTallman))
                            {
                                // Found a longer match - use it (greedy)
                                bestMatch = multiWordTallman;
                                bestMatchEndIndex = lookAheadIndex;
                            }
                        }
                        else
                        {
                            // No word after separator, stop lookahead
                            break;
                        }
                    }

                    // Apply the best match found (or original word if no match)
                    if (bestMatch != null)
                    {
                        result.Append(bestMatch);
                        i = bestMatchEndIndex; // Advance past the entire matched pattern
                    }
                    else
                    {
                        result.Append(word);
                        // i already advanced by ExtractWord
                    }
                }
                else
                {
                    // Not a letter - copy character as-is (punctuation, whitespace, digit, etc.)
                    int charLength = UnicodeHelpers.GetCharLength(normalized, i);
                    if (charLength == 2)
                    {
                        // Surrogate pair
                        result.Append(normalized[i]);
                        result.Append(normalized[i + 1]);
                        i += 2;
                    }
                    else
                    {
                        result.Append(normalized[i]);
                        i++;
                    }
                }
            }

            return result.ToString();
        }

        /// <summary>
        /// The set of available Tall Man list IDs (e.g. DEFAULT, AU, FDA, ISMP, NZ).
        /// </summary>
        public static IReadOnlySet<string> AvailableLists => EmbeddedTallmanLists.AvailableListIds;

        /// <summary>
        /// Returns the version string (YYYYMMDD.N) of the specified Tall Man list.
        /// Useful for auditing which list version produced a given conversion result.
        /// </summary>
        /// <param name="listId">The list ID (DEFAULT, AU, FDA, ISMP, NZ)</param>
        /// <returns>The version string in YYYYMMDD.N format</returns>
        /// <exception cref="TallmanException">If the specified list ID is not found</exception>
        public static string ListVersion(string listId) => EmbeddedTallmanLists.GetVersion(listId);

        /// <summary>
        /// Tries to convert medication names to Tall Man lettering using the DEFAULT list.
        /// Returns false instead of throwing if the list ID is not found.
        /// </summary>
        /// <param name="input">The input string containing medication names</param>
        /// <param name="result">The converted string, or empty string if conversion failed</param>
        /// <returns>True if conversion succeeded; false if the list ID is not found</returns>
        public static bool TryToTallman(this string? input, out string result) =>
            input.TryToTallman("DEFAULT", out result);

        /// <summary>
        /// Tries to convert medication names to Tall Man lettering using the specified list.
        /// Returns false instead of throwing if the list ID is not found.
        /// </summary>
        /// <param name="input">The input string containing medication names</param>
        /// <param name="listId">The Tallman list to use (DEFAULT, AU, FDA, ISMP, NZ)</param>
        /// <param name="result">The converted string, or empty string if conversion failed</param>
        /// <returns>True if conversion succeeded; false if the list ID is not found</returns>
        public static bool TryToTallman(this string? input, string listId, out string result)
        {
            if (!EmbeddedTallmanLists.HasList(listId))
            {
                result = string.Empty;
                return false;
            }
            result = input.ToTallman(listId);
            return true;
        }

        /// <summary>
        /// Extracts a contiguous sequence of letters and combining marks starting at the specified index.
        /// </summary>
        /// <param name="text">The text to extract from</param>
        /// <param name="startIndex">The starting index</param>
        /// <param name="word">The extracted word</param>
        /// <returns>The index after the last character of the word</returns>
        private static int ExtractWord(string text, int startIndex, out string word)
        {
            int i = startIndex;
            StringBuilder wordBuilder = new StringBuilder();

            while (i < text.Length && UnicodeHelpers.IsLetterOrMark(text, i))
            {
                int charLength = UnicodeHelpers.GetCharLength(text, i);
                if (charLength == 2)
                {
                    // Surrogate pair
                    wordBuilder.Append(text[i]);
                    wordBuilder.Append(text[i + 1]);
                    i += 2;
                }
                else
                {
                    wordBuilder.Append(text[i]);
                    i++;
                }
            }

            word = wordBuilder.ToString();
            return i;
        }
    }
}
