"""Category correction: transparent keyword rules + an ML classifier.

The raw `category` column is noisy (e.g. widow-marriage help filed under
Agriculture). We combine two signals:

* Keyword rules (high precision, explainable) -> `rule_categories`.
* A TF-IDF + Logistic Regression classifier trained on the rows the rules
  label confidently (weak supervision). It fills in schemes the rules miss.

Decision order for the primary category:
  rule match  >  confident model prediction  >  original label.
Everything that changes is recorded so a reviewer can audit it.
"""

from __future__ import annotations

import re

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import FeatureUnion, Pipeline

from .taxonomy import CATEGORIES, CATEGORY_RULES
from .text import norm_key

_COMPILED = [(cat, [re.compile(r"(?<![a-z])" + p) for p in pats]) for cat, pats in CATEGORY_RULES]


def rule_categories(name: str) -> list[str]:
    """All categories whose keywords appear in the name, in priority order."""
    key = norm_key(name)
    return [cat for cat, patterns in _COMPILED if any(p.search(key) for p in patterns)]


def build_model() -> Pipeline:
    features = FeatureUnion([
        ("word", TfidfVectorizer(analyzer="word", ngram_range=(1, 2), min_df=1, sublinear_tf=True)),
        ("char", TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5), min_df=2, sublinear_tf=True)),
    ])
    clf = LogisticRegression(max_iter=2000, C=4.0, class_weight="balanced")
    return Pipeline([("features", features), ("clf", clf)])


def model_text(row: dict) -> str:
    """Text the classifier sees: name plus a few structured hints."""
    parts = [row["name"], " ".join(row.get("occupations", [])), " ".join(row.get("documents", []))]
    return norm_key(" | ".join(p for p in parts if p))


class CategoryCorrector:
    def __init__(self, min_confidence: float = 0.55, random_state: int = 42):
        self.min_confidence = min_confidence
        self.random_state = random_state
        self.model: Pipeline | None = None

    def fit(self, rows: list[dict]) -> "CategoryCorrector":
        train = [r for r in rows if r["rule_categories"]]
        texts = [model_text(r) for r in train]
        labels = [r["rule_categories"][0] for r in train]
        self.model = build_model()
        self.model.set_params(clf__random_state=self.random_state)
        self.model.fit(texts, labels)
        return self

    def predict(self, rows: list[dict]) -> list[tuple[str, float]]:
        assert self.model is not None, "call fit() first"
        probs = self.model.predict_proba([model_text(r) for r in rows])
        classes = self.model.classes_
        best = np.argmax(probs, axis=1)
        return [(str(classes[i]), float(p[i])) for i, p in zip(best, probs)]

    def decide(self, row: dict, prediction: tuple[str, float]) -> dict:
        model_cat, confidence = prediction
        original = row["category_original"]
        if row["rule_categories"]:
            primary, source = row["rule_categories"][0], "rule"
        elif confidence >= self.min_confidence:
            primary, source = model_cat, "model"
        else:
            primary, source = original, "original"
        categories = list(dict.fromkeys([primary, *row["rule_categories"]]))
        return {
            "category": primary,
            "categories": categories,
            "category_source": source,
            "category_model_prediction": model_cat,
            "category_model_confidence": round(confidence, 3),
            "category_changed": primary != original,
        }


assert all(cat in CATEGORIES for cat, _ in CATEGORY_RULES)
