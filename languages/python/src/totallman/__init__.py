"""ToTallman — Tall Man lettering library for medication safety.

Converts medication names to mixed-case Tall Man lettering (e.g. predniSONE)
to highlight distinguishing characters in look-alike, sound-alike drug names.
"""

from __future__ import annotations

from totallman._embedded_lists import AVAILABLE_LIST_IDS, get_version
from totallman.converter import to_tallman
from totallman.exceptions import TallmanError

__all__ = [
    "to_tallman",
    "available_lists",
    "list_version",
    "TallmanError",
]

__version__ = "2.0.0"


def available_lists() -> frozenset[str]:
    """Return the set of valid Tall Man list IDs (e.g. DEFAULT, AU, FDA, ISMP, NZ)."""
    return frozenset(AVAILABLE_LIST_IDS)


def list_version(list_id: str) -> str:
    """Return the version string (YYYYMMDD.N) for the given list.

    Raises TallmanError for an unknown list_id.
    """
    return get_version(list_id)
