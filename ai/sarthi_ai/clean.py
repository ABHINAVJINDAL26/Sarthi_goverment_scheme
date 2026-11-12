"""Row-level cleaning of the raw scheme CSV into typed records.

Each function returns clean values plus quality flags. Flags never silently
"fix" eligibility rules: when a value is impossible we drop it to null
(-> UNKNOWN in the rule engine) and record why.
"""

from __future__ import annotations

import re
from datetime import date
from urllib.parse import urlparse

from .taxonomy import GENERIC_URLS, INDIAN_STATES, STATE_DOMAIN_HINTS, STATE_NAME_HINTS
from .text import clean_text, extract_url, norm_key

# Building & Other Construction Workers Welfare Board, e.g. HBOCWWB, APB&OCWWB, A.B.O.C.W.W.B, PBAOCWWB
_BOCW_RE = re.compile(
    r"b[\s.&]*a?[\s.]*o[\s.]*c[\s.]*w[\s.]*w[\s.]*b|bocw|construction worker|building and other construction", re.I
)
_EDU_HINT_RE = re.compile(r"scholar|student|educat|school|college|fellow|chhatravriti|coaching|stud", re.I)


def _to_int(value: str) -> int | None:
    value = (value or "").strip()
    if not value:
        return None
    try:
        return int(float(value))
    except ValueError:
        return None


def _split(value: str) -> list[str]:
    return [clean_text(x) for x in (value or "").split(",") if clean_text(x)]


def parse_age(row: dict, flags: list[str]) -> tuple[int | None, int | None]:
    lo, hi = _to_int(row["age_min"]), _to_int(row["age_max"])
    if lo is not None and hi is not None and lo > hi:
        flags.append("age_range_invalid")
        return None, None
    for v in (lo, hi):
        if v is not None and not 0 <= v <= 120:
            flags.append("age_out_of_range")
            return None, None
    return lo, hi


def parse_income(row: dict, flags: list[str]) -> int | None:
    income = _to_int(row["income_max"])
    if income is not None and income < 30000:
        # e.g. 4000: very likely a monthly limit, not annual. Keep but flag.
        flags.append("income_possibly_monthly")
    return income


def parse_list_field(value: str, any_token: str) -> list[str]:
    """'All' / 'Any' -> [] which means "no restriction"."""
    items = _split(value)
    return [] if not items or any(i.lower() == any_token for i in items) else items


def infer_state(name: str, urls: list[str | None]) -> tuple[str | None, str | None]:
    key = norm_key(name)
    for state in INDIAN_STATES:
        if re.search(r"(?<![a-z])" + re.escape(state.lower()) + r"(?![a-z])", key):
            return state, "name"
    for hint, state in STATE_NAME_HINTS.items():
        if hint in key:
            return state, "name"
    for url in urls:
        host = urlparse(url).netloc if url else ""
        for hint, state in STATE_DOMAIN_HINTS.items():
            if hint in host:
                return state, "url"
    return None, None


def parse_geography(row: dict, name: str, urls: list[str | None], flags: list[str]) -> dict:
    raw_states = _split(row["applicable_states"])
    state, source = infer_state(name, urls)
    if state:
        if raw_states == ["Central"] or "Central" in raw_states:
            flags.append("state_scheme_tagged_central")
        return {"scope": "state", "states": [state], "state_inferred_from": source}
    if len(raw_states) > 1:
        flags.append("generic_state_list")
    return {"scope": "central", "states": [], "state_inferred_from": None}


def parse_deadline(value: str, as_of: date, flags: list[str]) -> dict:
    text = clean_text(value)
    if not text or text.lower() == "ongoing":
        return {"deadline_type": "ongoing", "deadline_date": None, "deadline_text": None}
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", text):
        d = date.fromisoformat(text)
        if d < as_of:
            flags.append("deadline_passed")
        return {"deadline_type": "date", "deadline_date": text, "deadline_text": None}
    # e.g. "within six months from the date of death" -> relative to a life event
    return {"deadline_type": "relative", "deadline_date": None, "deadline_text": text}


def parse_occupations(row: dict, name: str, urls: list[str | None], category_raw: str, flags: list[str]) -> list[str]:
    occupations = [o.lower() for o in parse_list_field(row["occupations"], "any")]
    hosts = " ".join(urlparse(u).netloc for u in urls if u)
    if _BOCW_RE.search(name) or "bocw" in hosts:
        # Construction-worker welfare board schemes: the raw occupation tags
        # (often "student") are scraping noise.
        if occupations != ["construction_worker"]:
            flags.append("occupation_fixed_construction_worker")
        return ["construction_worker"]
    if occupations == ["student"] and not _EDU_HINT_RE.search(name) and category_raw != "Education & Learning":
        flags.append("occupation_student_suspect")
    return occupations


def myscheme_slug(url: str | None) -> str | None:
    if url and "myscheme.gov.in/schemes/" in url:
        return url.rstrip("/").rsplit("/", 1)[-1] or None
    return None


def clean_row(row: dict, as_of: date, stale_days: int) -> dict:
    flags: list[str] = []
    name = clean_text(row["scheme_name"])
    if name != row["scheme_name"].strip():
        flags.append("name_text_cleaned")

    app_url, app_issues = extract_url(row["application_link"])
    src_url, src_issues = extract_url(row["source_url"])
    flags += [f"application_link_{i}" for i in app_issues] + [f"source_url_{i}" for i in src_issues]
    if src_url in GENERIC_URLS:
        flags.append("source_url_generic")
    if app_url in GENERIC_URLS:
        flags.append("application_link_generic")

    age_min, age_max = parse_age(row, flags)
    verified = date.fromisoformat(row["last_verified_date"].strip())
    is_stale = (as_of - verified).days > stale_days
    if is_stale:
        flags.append("stale_verification")

    record = {
        "id": row["scheme_id"].strip(),
        "name": name,
        "category_original": clean_text(row["category"]),
        **parse_geography(row, name, [src_url, app_url], flags),
        "applicable_states_raw": clean_text(row["applicable_states"]),
        "age_min": age_min,
        "age_max": age_max,
        "gender": None if row["gender"].strip().lower() == "all" else row["gender"].strip().lower(),
        "income_max": parse_income(row, flags),
        "caste_categories": parse_list_field(row["caste_categories"], "all"),
        "occupations": parse_occupations(row, name, [src_url, app_url], clean_text(row["category"]), flags),
        "requires_bpl": row["is_bpl_required"].strip().lower() == "true",
        "requires_disability": row["is_disabled_required"].strip().lower() == "true",
        **parse_deadline(row["deadline"], as_of, flags),
        "application_url": app_url,
        "source_url": src_url,
        "myscheme_slug": myscheme_slug(src_url),
        "last_verified_date": verified.isoformat(),
        "is_stale": is_stale,
    }
    record["quality_flags"] = flags
    return record
