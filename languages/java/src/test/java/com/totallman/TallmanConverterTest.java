package com.totallman;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import org.junit.jupiter.api.Test;

/** Unit tests for TallmanConverter. */
class TallmanConverterTest {

  // --- null / empty / whitespace ---

  @Test
  void nullReturnsEmpty() {
    assertEquals("", TallmanConverter.toTallman(null));
  }

  @Test
  void emptyStringReturnsEmpty() {
    assertEquals("", TallmanConverter.toTallman(""));
  }

  @Test
  void whitespaceOnlyReturnsWhitespace() {
    assertEquals("   ", TallmanConverter.toTallman("   "));
  }

  // --- basic replacement ---

  @Test
  void singleDrugLowercase() {
    assertEquals("predniSONE", TallmanConverter.toTallman("prednisone"));
  }

  @Test
  void singleDrugUppercase() {
    assertEquals("predniSONE", TallmanConverter.toTallman("PREDNISONE"));
  }

  @Test
  void singleDrugMixedCase() {
    assertEquals("predniSONE", TallmanConverter.toTallman("PredniSONE"));
  }

  @Test
  void multipleDrugsInSentence() {
    // Both are in the FDA list
    assertEquals(
        "predniSONE and prednisoLONE",
        TallmanConverter.toTallman("prednisone and prednisolone", "FDA"));
  }

  // --- no-substring replacement ---

  @Test
  void noSubstringMatchAtStart() {
    assertEquals("myprednisonetest", TallmanConverter.toTallman("myprednisonetest"));
  }

  @Test
  void noSubstringMatchEmbedded() {
    assertEquals("testprednisonetest", TallmanConverter.toTallman("testprednisonetest"));
  }

  // --- punctuation preservation ---

  @Test
  void drugFollowedByComma() {
    // Both are in the FDA list
    assertEquals(
        "predniSONE, prednisoLONE", TallmanConverter.toTallman("prednisone, prednisolone", "FDA"));
  }

  @Test
  void drugFollowedByPeriod() {
    assertEquals("predniSONE.", TallmanConverter.toTallman("prednisone."));
  }

  @Test
  void drugFollowedByColon() {
    assertEquals("predniSONE:", TallmanConverter.toTallman("prednisone:"));
  }

  @Test
  void drugFollowedByParenthesis() {
    assertEquals("(predniSONE)", TallmanConverter.toTallman("(prednisone)"));
  }

  @Test
  void drugInMixedPunctuation() {
    // Both are in the FDA list
    assertEquals(
        "predniSONE; prednisoLONE!",
        TallmanConverter.toTallman("prednisone; prednisolone!", "FDA"));
  }

  // --- multi-word drugs ---

  @Test
  void spaceSeparatedMultiWord() {
    assertEquals("MS Contin", TallmanConverter.toTallman("ms contin"));
  }

  @Test
  void spaceSeparatedMultiWordUppercase() {
    assertEquals("MS Contin", TallmanConverter.toTallman("MS CONTIN"));
  }

  @Test
  void hyphenatedDrug() {
    assertEquals("SOLU-medrol", TallmanConverter.toTallman("solu-medrol"));
  }

  @Test
  void hyphenatedDrugInSentence() {
    assertEquals("give SOLU-medrol now", TallmanConverter.toTallman("give solu-medrol now"));
  }

  @Test
  void hyphenatedDrugAsWordBoundary() {
    assertEquals("test-predniSONE-test", TallmanConverter.toTallman("test-prednisone-test"));
  }

  @Test
  void threeWordNzEntry() {
    assertEquals(
        "methylprednisolone SODIUM SUCCINate",
        TallmanConverter.toTallman("methylprednisolone sodium succinate", "NZ"));
  }

  @Test
  void multiWordNotSubstringMatch() {
    // "amoxicillin-hydrate" is not a list entry; each word tried independently
    assertEquals("amoxicillin-hydrate", TallmanConverter.toTallman("amoxicillin-hydrate"));
  }

  // --- multiple lists ---

  @Test
  void defaultList() {
    assertEquals("predniSONE", TallmanConverter.toTallman("prednisone", "DEFAULT"));
  }

  @Test
  void fdaListVincristine() {
    assertEquals("vinCRIStine", TallmanConverter.toTallman("vincristine", "FDA"));
  }

  @Test
  void auListVincristine() {
    assertEquals("vinCRISTine", TallmanConverter.toTallman("vincristine", "AU"));
  }

  @Test
  void ismpList() {
    assertEquals("ALPRAZolam", TallmanConverter.toTallman("alprazolam", "ISMP"));
  }

  // --- Unicode ---

  @Test
  void nfcNormalizationInSurroundingText() {
    // Diacritics in surrounding text must not prevent ASCII drug matching.
    assertEquals("café predniSONE naïve", TallmanConverter.toTallman("café prednisone naïve"));
  }

  @Test
  void decomposedNfcInputNormalized() {
    // Drug in text containing combining characters must still match after NFC normalization.
    String input = "café prednisone"; // precomposed é
    String result = TallmanConverter.toTallman(input);
    assertTrue(result.contains("predniSONE"), "Expected predniSONE in: " + result);
  }

  // --- public API extras ---

  @Test
  void unknownListThrows() {
    TallmanException ex =
        assertThrows(
            TallmanException.class, () -> TallmanConverter.toTallman("prednisone", "UNKNOWN"));
    assertEquals(
        "Unknown Tallman list ID: 'UNKNOWN'. Available lists: AU, DEFAULT, FDA, ISMP, NZ.",
        ex.getMessage());
  }

  @Test
  void availableListsContainsExpected() {
    Set<String> ids = TallmanConverter.availableLists();
    assertTrue(ids.contains("DEFAULT"));
    assertTrue(ids.contains("AU"));
    assertTrue(ids.contains("FDA"));
    assertTrue(ids.contains("ISMP"));
    assertTrue(ids.contains("NZ"));
  }

  @Test
  void listVersionReturnsNonEmpty() {
    String ver = TallmanConverter.listVersion("DEFAULT");
    assertTrue(ver != null && !ver.isEmpty());
  }
}
