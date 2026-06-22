package com.totallman;

import java.text.Normalizer;
import java.util.Locale;

/** Unicode utilities for the canonical ToTallman algorithm. */
final class UnicodeHelpers {

  private UnicodeHelpers() {}

  /** Normalize text to Unicode NFC form. */
  static String nfc(String text) {
    return Normalizer.normalize(text, Normalizer.Form.NFC);
  }

  /**
   * Return the canonical match key for a word.
   *
   * <p>All list entries are ASCII-only (validator-enforced, spec §3.2), so {@code
   * toLowerCase(Locale.ROOT)} equals Unicode Default Case Folding for the full entry set. ICU4J is
   * not required.
   */
  static String caseFold(String text) {
    return text.toLowerCase(Locale.ROOT);
  }

  /**
   * Return true if the code point is a Unicode letter (L*) or combining mark (M*), matching the
   * canonical word-boundary definition in spec §7.
   */
  static boolean isLetterOrMark(int codePoint) {
    int type = Character.getType(codePoint);
    return type == Character.UPPERCASE_LETTER
        || type == Character.LOWERCASE_LETTER
        || type == Character.TITLECASE_LETTER
        || type == Character.MODIFIER_LETTER
        || type == Character.OTHER_LETTER
        || type == Character.NON_SPACING_MARK
        || type == Character.COMBINING_SPACING_MARK
        || type == Character.ENCLOSING_MARK;
  }
}
