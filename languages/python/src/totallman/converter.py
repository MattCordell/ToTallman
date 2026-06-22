from __future__ import annotations

import unicodedata

from totallman._embedded_lists import get_list, get_max_word_count
from totallman._unicode import case_fold, is_letter_or_mark


def to_tallman(text: str | None, list_id: str = "DEFAULT") -> str:
    """Convert medication names in *text* to Tall Man lettering.

    Implements the canonical character-by-character greedy longest-match
    algorithm (spec §7). Raises TallmanError for an unknown list_id.

    Args:
        text: The input string. None or empty string returns "".
        list_id: Tall Man list to use. Defaults to "DEFAULT".

    Returns:
        The input string with recognised drug names converted to Tall Man form.
    """
    if not text:
        return ""

    # Step 1 — NFC-normalise the whole input.
    normalised = unicodedata.normalize("NFC", text)

    # Step 2 — look up the list (raises TallmanError for unknown list_id).
    dictionary = get_list(list_id)
    max_words = get_max_word_count(list_id)

    result: list[str] = []
    chars = normalised
    n = len(chars)
    i = 0

    while i < n:
        if is_letter_or_mark(chars[i]):
            # Extract the word (contiguous letters/marks).
            word, i = _extract_word(chars, i, n)

            # Try single-word match first.
            best_match: str | None = dictionary.get(case_fold(word))
            best_end = i

            # Greedy lookahead for multi-word / hyphenated entries.
            look = i
            words_in_pattern = 1
            pattern = word

            while words_in_pattern < max_words and look < n and chars[look] in (" ", "-"):
                sep = chars[look]
                look += 1
                if look < n and is_letter_or_mark(chars[look]):
                    next_word, look = _extract_word(chars, look, n)
                    pattern = pattern + sep + next_word
                    words_in_pattern += 1
                    multi_match = dictionary.get(case_fold(pattern))
                    if multi_match is not None:
                        best_match = multi_match
                        best_end = look
                else:
                    break

            if best_match is not None:
                result.append(best_match)
                i = best_end
            else:
                result.append(word)
                # i already advanced by _extract_word
        else:
            result.append(chars[i])
            i += 1

    return "".join(result)


def _extract_word(text: str, start: int, n: int) -> tuple[str, int]:
    """Return (word, end_index) for the letter/mark run beginning at start."""
    i = start
    while i < n and is_letter_or_mark(text[i]):
        i += 1
    return text[start:i], i
