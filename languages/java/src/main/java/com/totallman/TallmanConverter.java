package com.totallman;

import java.util.Map;
import java.util.Set;

/**
 * Converts medication names in text to Tall Man lettering.
 *
 * <p>Implements the canonical character-by-character greedy longest-match algorithm (spec §7).
 */
public final class TallmanConverter {

  private TallmanConverter() {}

  /**
   * Convert medication names in {@code text} to Tall Man lettering using the DEFAULT list.
   *
   * @param text the input string; null or empty returns {@code ""}
   * @return the input with recognised drug names in Tall Man form
   */
  public static String toTallman(String text) {
    return toTallman(text, "DEFAULT");
  }

  /**
   * Convert medication names in {@code text} to Tall Man lettering.
   *
   * @param text the input string; null or empty returns {@code ""}
   * @param listId the Tall Man list to use (DEFAULT, AU, FDA, ISMP, NZ)
   * @return the input with recognised drug names in Tall Man form
   * @throws TallmanException if {@code listId} is unknown
   */
  public static String toTallman(String text, String listId) {
    if (text == null || text.isEmpty()) {
      return "";
    }

    // Step 1 — NFC-normalise the whole input.
    String normalised = UnicodeHelpers.nfc(text);

    // Step 2 — look up the list (throws TallmanException for unknown listId).
    Map<String, String> dictionary = EmbeddedTallmanLists.getList(listId);
    int maxWords = EmbeddedTallmanLists.getMaxWordCount(listId);

    StringBuilder result = new StringBuilder(normalised.length());
    int i = 0;
    int n = normalised.length();

    while (i < n) {
      int cp = normalised.codePointAt(i);
      if (UnicodeHelpers.isLetterOrMark(cp)) {
        // Extract the contiguous letter/mark word.
        int wordStart = i;
        while (i < n && UnicodeHelpers.isLetterOrMark(normalised.codePointAt(i))) {
          i += Character.charCount(normalised.codePointAt(i));
        }
        String word = normalised.substring(wordStart, i);

        // Try single-word match first.
        String bestMatch = dictionary.get(UnicodeHelpers.caseFold(word));
        int bestEnd = i;

        // Greedy lookahead for multi-word / hyphenated entries (spec §3.4).
        int look = i;
        int wordsInPattern = 1;
        StringBuilder pattern = new StringBuilder(word);

        while (wordsInPattern < maxWords && look < n) {
          char sep = normalised.charAt(look);
          if (sep != ' ' && sep != '-') {
            break;
          }
          pattern.append(sep);
          look++;
          if (look < n && UnicodeHelpers.isLetterOrMark(normalised.codePointAt(look))) {
            int nextStart = look;
            while (look < n && UnicodeHelpers.isLetterOrMark(normalised.codePointAt(look))) {
              look += Character.charCount(normalised.codePointAt(look));
            }
            pattern.append(normalised, nextStart, look);
            wordsInPattern++;
            String multiMatch = dictionary.get(UnicodeHelpers.caseFold(pattern.toString()));
            if (multiMatch != null) {
              bestMatch = multiMatch;
              bestEnd = look;
            }
          } else {
            break;
          }
        }

        if (bestMatch != null) {
          result.append(bestMatch);
          i = bestEnd;
        } else {
          result.append(word);
        }
      } else {
        // Non-letter: copy verbatim (handles surrogates correctly via codePointAt).
        result.appendCodePoint(cp);
        i += Character.charCount(cp);
      }
    }

    return result.toString();
  }

  /**
   * Return the set of available Tall Man list IDs.
   *
   * @return an unmodifiable set of list IDs
   */
  public static Set<String> availableLists() {
    return EmbeddedTallmanLists.availableListIds();
  }

  /**
   * Return the version string for the given list.
   *
   * @param listId the list ID
   * @return the version string
   * @throws TallmanException if {@code listId} is unknown
   */
  public static String listVersion(String listId) {
    return EmbeddedTallmanLists.getVersion(listId);
  }
}
