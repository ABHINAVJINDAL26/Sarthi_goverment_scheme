"""End-to-end cleaning pipeline: raw CSV -> clean records + reports."""

from __future__ import annotations

import csv
import json
from collections import Counter
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path

from sklearn.metrics import accuracy_score, f1_score

from .categories import CategoryCorrector, rule_categories
from .clean import clean_row
from .documents import DocumentNormalizer

AI_DIR = Path(__file__).resolve().parents[1]
RAW_CSV = AI_DIR / "data" / "raw" / "sarthi_master_schemes.csv"
LABEL_SETS = {
    # Sample used while writing the keyword rules (optimistic estimate).
    "dev_sample": AI_DIR / "data" / "labels" / "category_gold.csv",
    # Fresh sample labelled after the rules were frozen (honest estimate).
    "holdout_sample": AI_DIR / "data" / "labels" / "category_holdout.csv",
}
OUTPUT_DIR = AI_DIR / "output"


@dataclass
class PipelineResult:
    records: list[dict]
    metrics: dict
    document_types: list[dict]
    raw_rows: list[dict] = field(repr=False, default_factory=list)


def load_csv(path: Path) -> list[dict]:
    with open(path, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def evaluate_categories(records: list[dict], gold_path: Path) -> dict:
    if not gold_path.exists():
        return {}
    gold = {r["scheme_id"]: r["gold_category"] for r in load_csv(gold_path)}
    rows = [r for r in records if r["id"] in gold]
    y = [gold[r["id"]] for r in rows]

    def score(pred: list[str]) -> dict:
        return {
            "accuracy": round(accuracy_score(y, pred), 3),
            "macro_f1": round(f1_score(y, pred, average="macro", zero_division=0), 3),
        }

    rules_only = [r["rule_categories"][0] if r["rule_categories"] else r["category_original"] for r in rows]
    return {
        "gold_size": len(rows),
        "original_labels": score([r["category_original"] for r in rows]),
        "rules_then_original": score(rules_only),
        "model_only": score([r["category_model_prediction"] for r in rows]),
        "final_pipeline": score([r["category"] for r in rows]),
    }


def run(input_csv: Path = RAW_CSV, as_of: date | None = None, stale_days: int = 365,
        label_sets: dict[str, Path] = LABEL_SETS) -> PipelineResult:
    as_of = as_of or date.today()
    raw = load_csv(input_csv)
    records = [clean_row(row, as_of, stale_days) for row in raw]

    docs = DocumentNormalizer().fit([row["documents_required"] for row in raw])
    for rec, row in zip(records, raw):
        rec.update(docs.transform(row["documents_required"]))
        if rec["dropped_fragments"]:
            rec["quality_flags"].append("documents_had_fragments")
        rec["rule_categories"] = rule_categories(rec["name"])

    corrector = CategoryCorrector().fit(records)
    for rec, pred in zip(records, corrector.predict(records)):
        rec.update(corrector.decide(rec, pred))
        if rec["category_changed"]:
            rec["quality_flags"].append(f"category_fixed_by_{rec['category_source']}")
        if rec["category_source"] == "original" and rec["category_model_prediction"] != rec["category_original"]:
            rec["quality_flags"].append("category_needs_review")

    doc_counts = Counter(d for r in records for d in r["documents"])
    other_counts = Counter(d for r in records for d in r["other_documents"])
    document_types = (
        [{"name": n, "standard": True, "scheme_count": c} for n, c in doc_counts.most_common()]
        + [{"name": n, "standard": False, "scheme_count": c} for n, c in other_counts.most_common()]
    )

    raw_doc_strings = {p.strip() for row in raw for p in row["documents_required"].split(";") if p.strip()}
    flag_counts = Counter(f for r in records for f in r["quality_flags"])
    metrics = {
        "as_of": as_of.isoformat(),
        "rows": len(records),
        "category_before": dict(Counter(r["category_original"] for r in records).most_common()),
        "category_after": dict(Counter(r["category"] for r in records).most_common()),
        "category_source": dict(Counter(r["category_source"] for r in records)),
        "category_changed": sum(r["category_changed"] for r in records),
        "category_evaluation": {
            **{name: evaluate_categories(records, path) for name, path in label_sets.items()},
            "note": "Labels were drafted from scheme names and should be verified by the team.",
        },
        "documents": {
            "raw_distinct_strings": len(raw_doc_strings),
            "standard_types": len(doc_counts),
            "other_types_after_merge": len(other_counts),
            **dict(docs.stats),
        },
        "scope": dict(Counter(r["scope"] for r in records)),
        "states_inferred": dict(Counter(r["states"][0] for r in records if r["states"]).most_common()),
        "missing_rule_fields": {
            f: sum(r[f] is None for r in records) for f in ("age_min", "age_max", "income_max", "gender")
        },
        "quality_flags": dict(flag_counts.most_common()),
        "rows_without_flags": sum(not r["quality_flags"] for r in records),
    }
    return PipelineResult(records, metrics, document_types, raw)


# Fields shipped to the frontend / future Express API (debug fields stay in the review CSV).
PUBLIC_FIELDS = [
    "id", "name", "category", "categories", "scope", "states", "age_min", "age_max", "gender",
    "income_max", "caste_categories", "occupations", "requires_bpl", "requires_disability",
    "documents", "other_documents", "deadline_type", "deadline_date", "deadline_text",
    "application_url", "source_url", "myscheme_slug", "last_verified_date", "is_stale", "quality_flags",
]

REVIEW_FIELDS = [
    "id", "name", "category_original", "category", "category_source", "category_model_prediction",
    "category_model_confidence", "rule_categories", "quality_flags",
]


def write_outputs(result: PipelineResult, out_dir: Path = OUTPUT_DIR) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    paths = []

    def dump(name: str, data) -> None:
        path = out_dir / name
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        paths.append(path)

    dump("schemes_clean.json", [{k: r[k] for k in PUBLIC_FIELDS} for r in result.records])
    dump("document_types.json", result.document_types)
    dump("metrics.json", result.metrics)

    review = [r for r in result.records if r["category_changed"] or "category_needs_review" in r["quality_flags"]]
    path = out_dir / "category_review.csv"
    with open(path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=REVIEW_FIELDS + ["reviewer_decision"])
        writer.writeheader()
        for r in review:
            writer.writerow({
                **{k: r[k] for k in REVIEW_FIELDS},
                "rule_categories": "; ".join(r["rule_categories"]),
                "quality_flags": "; ".join(r["quality_flags"]),
                "reviewer_decision": "",
            })
    paths.append(path)
    return paths
