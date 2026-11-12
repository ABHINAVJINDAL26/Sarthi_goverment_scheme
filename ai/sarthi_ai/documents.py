"""Normalise the free-text `documents_required` column.

Raw cells are `;`-separated lists scraped from scheme pages. They contain the
nine standard documents plus hundreds of variants and sentence fragments
("required.", "Whom should I contact ..."). We:

1. map each piece to a canonical document type with regex rules,
2. keep leftover pieces only if they look like a document name,
3. merge near-duplicate leftovers with fuzzy matching (rapidfuzz).
"""

from __future__ import annotations

import re
from collections import Counter

from rapidfuzz import fuzz

from .taxonomy import DOCUMENT_HINT_WORDS, DOCUMENT_TYPES
from .text import clean_text

_COMPILED = [(name, [re.compile(p, re.I) for p in pats]) for name, pats in DOCUMENT_TYPES]
_HINT_RE = re.compile(r"\b(" + "|".join(DOCUMENT_HINT_WORDS) + r")", re.I)


def split_documents(cell: str | None) -> list[str]:
    return [p for p in (clean_text(x) for x in (cell or "").split(";")) if p]


def canonical_type(piece: str) -> str | None:
    for name, patterns in _COMPILED:
        if any(p.search(piece) for p in patterns):
            return name
    return None


def looks_like_document(piece: str) -> bool:
    """Heuristic filter for scraped fragments."""
    words = piece.split()
    if not 2 <= len(words) <= 14:
        return False
    if piece[0].islower() or piece[0] in "(/-,0123456789":
        return False
    if "?" in piece or piece.lower().startswith(("there are", "below", "whom", "the people", "status")):
        return False
    return bool(_HINT_RE.search(piece))


class DocumentNormalizer:
    """Fit on the whole column so near-duplicate leftovers share one name."""

    def __init__(self, threshold: int = 88):
        self.threshold = threshold
        self.alias: dict[str, str] = {}
        self.stats = Counter()

    def fit(self, cells: list[str]) -> "DocumentNormalizer":
        leftovers = Counter()
        for cell in cells:
            for piece in split_documents(cell):
                if canonical_type(piece) is None and looks_like_document(piece):
                    leftovers[piece.rstrip(".")] += 1
        # Greedy clustering: most frequent spelling becomes the cluster name.
        reps: list[str] = []
        for piece, _ in leftovers.most_common():
            match = next((r for r in reps if fuzz.token_sort_ratio(piece.lower(), r.lower()) >= self.threshold), None)
            if match:
                self.alias[piece] = match
            else:
                reps.append(piece)
                self.alias[piece] = piece
        return self

    def transform(self, cell: str | None) -> dict:
        standard: list[str] = []
        other: list[str] = []
        dropped = 0
        for piece in split_documents(cell):
            ctype = canonical_type(piece)
            if ctype:
                if ctype not in standard:
                    standard.append(ctype)
                self.stats["mapped"] += 1
                continue
            key = piece.rstrip(".")
            if key in self.alias:
                name = self.alias[key]
                if name not in other:
                    other.append(name)
                self.stats["kept_other"] += 1
            else:
                dropped += 1
                self.stats["dropped_fragment"] += 1
        return {"documents": standard, "other_documents": other, "dropped_fragments": dropped}
