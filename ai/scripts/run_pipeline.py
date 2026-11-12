"""Clean the raw scheme CSV and write JSON + review files to ai/output/.

Usage (from the repo root):
    python ai/scripts/run_pipeline.py
    python ai/scripts/run_pipeline.py --as-of 2026-11-13 --stale-days 365
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sarthi_ai.pipeline import (  # noqa: E402
    FRONTEND_JSON, OUTPUT_DIR, RAW_CSV, run, write_frontend_json, write_outputs,
)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--input", type=Path, default=RAW_CSV)
    parser.add_argument("--output-dir", type=Path, default=OUTPUT_DIR)
    parser.add_argument("--as-of", type=date.fromisoformat, default=None,
                        help="Reference date for staleness/deadlines (default: today)")
    parser.add_argument("--stale-days", type=int, default=365)
    parser.add_argument("--frontend-json", type=Path, default=FRONTEND_JSON,
                        help="Compact file the website loads (default: public/data/schemes.json)")
    args = parser.parse_args()

    result = run(args.input, as_of=args.as_of, stale_days=args.stale_days)
    for path in write_outputs(result, args.output_dir):
        print("wrote", path)
    print("wrote", write_frontend_json(result, args.frontend_json))
    m = result.metrics
    print(json.dumps({k: m[k] for k in ("rows", "category_changed", "category_source", "category_evaluation")}, indent=2))


if __name__ == "__main__":
    main()
