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
        /// Returns the canonical match key for a word: ToUpperInvariant then ToLowerInvariant.
        /// All list entries are constrained to ASCII characters (see spec section 3.2), so this
        /// is equivalent to Unicode Default Case Folding for the full entry set. The two-step
        /// approach is retained as a defensive pattern but produces the same result as
        /// ToLowerInvariant alone for all ASCII input.
        /// </summary>
        /// <param name="text">The NFC-normalized word to fold</param>
        /// <returns>The casefolded key for dictionary lookup</returns>
        public static string CaseFold(string text)
        {
            if (string.IsNullOrEmpty(text))
            {
                return text ?? string.Empty;
            }

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
