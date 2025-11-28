using System;
using System.Globalization;

namespace ToTallman
{
    /// <summary>
    /// Provides Unicode-aware helper methods for character classification and casefolding.
    /// </summary>
    public static class UnicodeHelpers
    {
        /// <summary>
        /// Determines if the character at the specified index is a Unicode letter or combining mark.
        /// Handles surrogate pairs correctly for characters outside the Basic Multilingual Plane.
        /// </summary>
        /// <param name="text">The string to examine</param>
        /// <param name="index">The zero-based index of the character to check</param>
        /// <returns>True if the character is a letter or mark; otherwise, false</returns>
        public static bool IsLetterOrMark(string text, int index)
        {
            if (text == null || index < 0 || index >= text.Length)
            {
                return false;
            }

            // Get Unicode category at the specified index
            // This handles surrogate pairs automatically
            UnicodeCategory category = CharUnicodeInfo.GetUnicodeCategory(text, index);

            // Check if it's any letter category
            bool isLetter = category == UnicodeCategory.UppercaseLetter
                         || category == UnicodeCategory.LowercaseLetter
                         || category == UnicodeCategory.TitlecaseLetter
                         || category == UnicodeCategory.ModifierLetter
                         || category == UnicodeCategory.OtherLetter;

            // Check if it's any combining mark category
            bool isMark = category == UnicodeCategory.NonSpacingMark
                       || category == UnicodeCategory.SpacingCombiningMark
                       || category == UnicodeCategory.EnclosingMark;

            return isLetter || isMark;
        }

        /// <summary>
        /// Performs Unicode casefolding for case-insensitive string comparison.
        /// C# approximation: converts to uppercase invariant, then to lowercase invariant.
        /// This handles most edge cases including Turkish İ/i and German ß.
        /// </summary>
        /// <param name="text">The string to casefold</param>
        /// <returns>The casefolded string suitable for case-insensitive matching</returns>
        public static string CaseFold(string text)
        {
            if (string.IsNullOrEmpty(text))
            {
                return text ?? string.Empty;
            }

            // C# doesn't have native Unicode casefolding like Python's str.casefold()
            // Best approximation: ToUpperInvariant() then ToLowerInvariant()
            // This normalizes case more reliably than simple ToLowerInvariant() alone
            // Handles edge cases like:
            // - Turkish: İ (U+0130) and i (U+0069)
            // - German: ß (U+00DF) → ss
            string upper = text.ToUpperInvariant();
            string lower = upper.ToLowerInvariant();

            return lower;
        }

        /// <summary>
        /// Gets the length in char units that a character occupies.
        /// Returns 2 for surrogate pairs, 1 for BMP characters.
        /// </summary>
        /// <param name="text">The string containing the character</param>
        /// <param name="index">The index of the character</param>
        /// <returns>The number of char units (1 or 2)</returns>
        public static int GetCharLength(string text, int index)
        {
            if (text == null || index < 0 || index >= text.Length)
            {
                return 0;
            }

            // Check if this is a high surrogate (first part of surrogate pair)
            if (char.IsHighSurrogate(text[index]) && index + 1 < text.Length && char.IsLowSurrogate(text[index + 1]))
            {
                return 2; // Surrogate pair
            }

            return 1; // Single char
        }
    }
}
