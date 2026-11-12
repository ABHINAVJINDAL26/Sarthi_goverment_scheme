# Sarthi AI / Data Science

Offline AI and data-science work for Sarthi. It needs **no backend**: Python scripts produce clean JSON files
that the React app can read today and the future Node.js + Express backend can load later.

## Folder layout

```text
ai/
├── data/
│   ├── raw/sarthi_master_schemes.csv     # scraped master list (750 schemes) - do not edit by hand
│   └── labels/                           # hand-labelled samples used to measure accuracy
│       ├── category_gold.csv             #   dev sample (82) - used while writing the rules
│       └── category_holdout.csv          #   holdout sample (44) - labelled after the rules were frozen
├── sarthi_ai/                            # the Python package
│   ├── taxonomy.py                       # categories, keyword rules, document types, state hints (edit here)
│   ├── text.py                           # unicode/mojibake repair, URL repair
│   ├── documents.py                      # document-name normalisation + fuzzy merge
│   ├── categories.py                     # keyword rules + TF-IDF/LogReg classifier
│   ├── clean.py                          # row cleaning: ages, income, states, deadlines, flags
│   └── pipeline.py                       # runs everything, writes outputs
├── scripts/run_pipeline.py               # command-line entry point
├── notebooks/01_data_quality_report.ipynb  # data analysis report with charts
├── tests/test_pipeline.py                # unit tests
└── output/                               # generated - re-create with the pipeline
    ├── schemes_clean.json                # clean scheme records (for frontend / backend)
    ├── document_types.json               # canonical documents + how many schemes need each
    ├── category_review.csv               # changed/uncertain categories for human review
    └── metrics.json                      # pipeline statistics + accuracy
```

## Setup and run

From the repo root (Python 3.11+):

```bash
pip install -r ai/requirements.txt

python ai/scripts/run_pipeline.py --as-of 2026-11-13   # regenerate ai/output/
python -m unittest discover -s ai/tests -v              # run tests
jupyter lab ai/notebooks/01_data_quality_report.ipynb   # open the report
```

Pass a fixed `--as-of` date when you commit outputs, so re-running does not create noisy diffs for teammates.

## What the pipeline fixes

| Problem in the raw CSV | Fix | Count |
|---|---|---|
| Wrong category (e.g. widow-marriage help under Agriculture) | Keyword rules, then ML classifier, then original label | 243 changed |
| State schemes tagged "Central" | State detected from scheme name or portal domain | 260 state schemes |
| 1,022 messy document strings | 21 standard types + fuzzy-merged extras; scraped fragments dropped | 579 fragments dropped |
| Construction-worker board schemes tagged "student" | Occupation set to `construction_worker` | 73 |
| Broken text (`Minister’s` stored as `Ministerâ€™s`) | Mojibake repair | 41 names |
| URLs with glued words (`sjd.kerala.gov.inwhere`) | Host repair | 16 links |
| `age_min` > `age_max` | Set to null (UNKNOWN), flagged | 4 |
| Verified date older than 365 days | `is_stale: true` | 548 |

Nothing is silently invented: impossible values become `null` (the rule engine treats them as UNKNOWN) and
every change is listed in the record's `quality_flags`.

## Category accuracy (hand-labelled samples)

| | dev sample (n=82) | **holdout (n=44)** |
|---|---|---|
| Original CSV labels | 57.3% | **47.7%** |
| Keyword rules only | 97.6% | 81.8% |
| ML model only (TF-IDF + Logistic Regression) | 96.3% | 84.1% |
| Final pipeline | 97.6% | **84.1%** |

Quote the **holdout** numbers. The dev sample was seen while writing the rules, so its numbers are optimistic.
The labels were drafted from scheme names only; please verify them (and fill in `reviewer_decision` in
`output/category_review.csv`) before using these numbers in the final report.

## Output record (`schemes_clean.json`)

```json
{
  "id": "SCH_0001",
  "name": "Stand-Up India",
  "category": "Business & Entrepreneurship",
  "categories": ["Business & Entrepreneurship"],
  "scope": "central",                 // "central" or "state"
  "states": [],                       // empty = all India
  "age_min": 18, "age_max": null,     // null = no rule / unknown
  "gender": null,                     // null = all, or "female"
  "income_max": null,
  "caste_categories": ["SC", "ST"],   // empty = all
  "occupations": [],                  // empty = any
  "requires_bpl": false,
  "requires_disability": false,
  "documents": ["Aadhaar Card", "Bank Passbook / Account Details", "..."],
  "other_documents": ["..."],
  "deadline_type": "date",            // "ongoing" | "date" | "relative"
  "deadline_date": "2025-03-31",
  "deadline_text": null,
  "application_url": "https://www.standupmitra.in",
  "source_url": "https://www.myscheme.gov.in/schemes/sui",
  "myscheme_slug": "sui",
  "last_verified_date": "2026-10-17",
  "is_stale": false,
  "quality_flags": ["application_link_scheme_added", "generic_state_list", "deadline_passed", "..."]
}
```

## Next AI tasks (planned)

1. Semantic search in Hindi/English/Hinglish: multilingual embeddings precomputed here, query embedded in the
   browser with Transformers.js.
2. Rule engine + match ranking in shared TypeScript (reusable by the Express backend).
3. "Fill this field to unlock N more schemes" (profile completeness, spec F2).
4. Similar-scheme recommendations.
5. F8 document check prototype with Tesseract.js (patent candidate - keep it out of public repos until the
   patent decision).
