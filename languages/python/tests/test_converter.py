"""Unit tests for the totallman Python implementation.

These tests exercise the canonical algorithm directly (not via the Node adapter)
and mirror the coverage of the C# native test suite. All 98 canonical tests are
also run via the shared test runner (test-adapter.js); these tests focus on
unit-level and edge-case coverage.
"""

from __future__ import annotations

import pytest

from totallman import TallmanError, available_lists, list_version, to_tallman

# ---------------------------------------------------------------------------
# Null / empty / whitespace
# ---------------------------------------------------------------------------


def test_none_returns_empty() -> None:
    assert to_tallman(None) == ""


def test_empty_string_returns_empty() -> None:
    assert to_tallman("") == ""


def test_whitespace_only_unchanged() -> None:
    assert to_tallman("   ") == "   "


def test_newline_unchanged() -> None:
    assert to_tallman("\n") == "\n"


# ---------------------------------------------------------------------------
# Basic replacement
# ---------------------------------------------------------------------------


def test_single_drug_lowercase() -> None:
    assert to_tallman("prednisone") == "predniSONE"


def test_single_drug_uppercase() -> None:
    assert to_tallman("PREDNISONE") == "predniSONE"


def test_single_drug_mixed_case() -> None:
    assert to_tallman("PrEdNiSoNe") == "predniSONE"


def test_two_drugs_in_sentence() -> None:
    assert to_tallman("actonel and aldactone") == "actoNEL and alDACTONE"


def test_non_drug_word_unchanged() -> None:
    assert to_tallman("aspirin") == "aspirin"


# ---------------------------------------------------------------------------
# No-substring replacement
# ---------------------------------------------------------------------------


def test_no_prefix_match() -> None:
    assert to_tallman("myprednisonetest") == "myprednisonetest"


def test_no_suffix_match() -> None:
    assert to_tallman("testprednisone") == "testprednisone"


def test_standalone_matches_after_no_substring() -> None:
    result = to_tallman("myprednisonetest prednisone")
    assert result == "myprednisonetest predniSONE"


# ---------------------------------------------------------------------------
# Punctuation preservation
# ---------------------------------------------------------------------------


def test_trailing_comma() -> None:
    assert to_tallman("prednisone,") == "predniSONE,"


def test_sentence_with_comma() -> None:
    assert to_tallman("prednisone, actonel") == "predniSONE, actoNEL"


def test_trailing_period() -> None:
    assert to_tallman("prednisone.") == "predniSONE."


def test_exclamation() -> None:
    assert to_tallman("prednisone!") == "predniSONE!"


def test_no_space_comma_adjacency() -> None:
    assert to_tallman("prednisone,prednisone") == "predniSONE,predniSONE"


# ---------------------------------------------------------------------------
# Multi-word drugs
# ---------------------------------------------------------------------------


def test_space_separated_multi_word() -> None:
    assert to_tallman("ms contin") == "MS Contin"


def test_space_separated_case_insensitive() -> None:
    assert to_tallman("MS CONTIN") == "MS Contin"


def test_hyphenated_drug() -> None:
    assert to_tallman("solu-medrol") == "SOLU-medrol"


def test_hyphenated_case_insensitive() -> None:
    assert to_tallman("SOLU-MEDROL") == "SOLU-medrol"


def test_three_word_nz_entry() -> None:
    assert to_tallman("methylprednisolone sodium succinate", "NZ") == (
        "methylprednisolone SODIUM SUCCINate"
    )


def test_multi_word_in_sentence() -> None:
    assert to_tallman("give ms contin now") == "give MS Contin now"


def test_hyphen_as_boundary_not_multi_word() -> None:
    # "amoxacillin-hydrate" — hyphen links two words neither of which form a
    # multi-word entry; each word is checked independently and neither matches.
    assert to_tallman("amoxacillin-hydrate") == "amoxacillin-hydrate"


# ---------------------------------------------------------------------------
# Multiple lists
# ---------------------------------------------------------------------------


def test_default_list() -> None:
    assert to_tallman("prednisone", "DEFAULT") == "predniSONE"


def test_fda_list_vincristine() -> None:
    assert to_tallman("vincristine", "FDA") == "vinCRIStine"


def test_au_list_vincristine() -> None:
    assert to_tallman("vincristine", "AU") == "vinCRISTine"


def test_invalid_list_raises() -> None:
    with pytest.raises(TallmanError, match="UNKNOWN_LIST"):
        to_tallman("prednisone", "UNKNOWN_LIST")


def test_invalid_list_message_lists_available() -> None:
    with pytest.raises(TallmanError) as exc_info:
        to_tallman("prednisone", "BOGUS")
    msg = str(exc_info.value)
    assert "DEFAULT" in msg
    assert "AU" in msg


# ---------------------------------------------------------------------------
# Unicode
# ---------------------------------------------------------------------------


def test_nfc_normalization_surrounding_text() -> None:
    # Diacritics in surrounding text must not prevent ASCII drug matching.
    assert to_tallman("café prednisone naïve") == "café predniSONE naïve"


def test_drug_adjacent_to_digit() -> None:
    assert to_tallman("prednisone5mg") == "predniSONE5mg"


# ---------------------------------------------------------------------------
# Public API extras
# ---------------------------------------------------------------------------


def test_available_lists_contains_expected() -> None:
    ids = available_lists()
    assert {"DEFAULT", "AU", "FDA", "ISMP", "NZ"}.issubset(ids)


def test_list_version_returns_string() -> None:
    ver = list_version("DEFAULT")
    assert isinstance(ver, str)
    assert len(ver) > 0


def test_list_version_invalid_raises() -> None:
    with pytest.raises(TallmanError):
        list_version("BOGUS")
