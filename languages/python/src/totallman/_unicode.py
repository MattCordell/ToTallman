from __future__ import annotations

import unicodedata


def is_letter_or_mark(ch: str) -> bool:
    """Return True if ch is a Unicode letter (L*) or combining mark (M*)."""
    cat = unicodedata.category(ch)
    return cat[0] in ("L", "M")


def case_fold(text: str) -> str:
    """Return the canonical match key: NFC-normalized word lowercased.

    All list entries are ASCII-only (validator-enforced, spec §3.2), so
    str.lower() equals Unicode Default Case Folding for the full entry set.
    Do NOT use str.casefold() — it folds non-ASCII differently from the other
    runtimes (e.g. German ß → ss) and would diverge if the constraint relaxed.
    """
    return text.lower()
