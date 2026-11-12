"""Small text and URL helpers shared by the pipeline."""

from __future__ import annotations

import re
import unicodedata
from urllib.parse import urlparse

_INVISIBLE = dict.fromkeys(map(ord, "​‌‍⁠﻿"), None)
_VALID_TLDS = {"in", "com", "org", "gov", "net", "info", "io", "edu"}
_SUFFIXES = [".gov.in", ".nic.in", ".ac.in", ".org.in", ".co.in", ".edu.in", ".com", ".org", ".gov", ".net", ".in"]
_URL_RE = re.compile(r"(https?://[^\s;,()]+|www\.[^\s;,()]+)", re.I)


# A UTF-8 lead byte read as cp1252 ("â", "ï", "Ã") followed by continuation bytes
# read as cp1252 ("€", "™", "»", "¿" ...). e.g. "â€™" -> "’", "ï»¿" -> BOM.
_MOJIBAKE_RE = re.compile("[Â-ô][\u0080-¿ŒœŠšŸŽž"
                          "ƒˆ˜–—‘-„†-•…‰"
                          "‹›€™]{1,3}")


def _decode_run(match: re.Match) -> str:
    run = match.group(0)
    try:
        return run.encode("cp1252").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return "" if run.startswith("â€") else run  # unrecoverable punctuation fragment


def fix_mojibake(value: str | None) -> str:
    """Repair UTF-8 text that was decoded as cp1252 somewhere upstream."""
    return _MOJIBAKE_RE.sub(_decode_run, value or "")


def clean_text(value: str | None) -> str:
    """Normalise unicode, drop invisible/replacement chars, collapse whitespace."""
    if not value:
        return ""
    text = unicodedata.normalize("NFKC", fix_mojibake(value)).translate(_INVISIBLE)
    text = text.replace("�", "")
    text = re.sub(r"\s+", " ", text).strip()
    # Drop quotes that wrap the whole string or are left unbalanced.
    if text.count('"') % 2 == 1 or (text.startswith('"') and text.endswith('"')):
        text = text.replace('"', "")
    return text.strip(" .")


def norm_key(value: str) -> str:
    """Lowercase key for keyword matching."""
    return re.sub(r"\s+", " ", clean_text(value).lower())


def _repair_host(host: str) -> str | None:
    """Cut words that were glued onto a hostname while scraping.

    e.g. 'sjd.kerala.gov.inwhere' -> 'sjd.kerala.gov.in', 'www.scsthub.in.for' -> 'www.scsthub.in'.
    Returns None when the host cannot be repaired.
    """
    host = host.lower().split(":")[0]
    if "." not in host:
        return None
    if host.rsplit(".", 1)[1] in _VALID_TLDS:
        return host
    best = None
    for suffix in _SUFFIXES:
        idx = host.rfind(suffix)
        if idx > 0:
            end = idx + len(suffix)
            if best is None or end > best:
                best = end
    return host[:best] if best else None


def extract_url(value: str | None) -> tuple[str | None, list[str]]:
    """Return (clean_url, issues) for a messy link cell."""
    issues: list[str] = []
    # Invisible chars mark where scraped junk was glued on, so turn them into
    # spaces (a URL boundary) instead of deleting them.
    text = clean_text(re.sub("[​‌‍⁠﻿]", " ", fix_mojibake(value)))
    if not text:
        return None, ["missing"]
    match = _URL_RE.search(text)
    if not match:
        return None, ["no_url_found"]
    if match.start() > 0 or len(_URL_RE.findall(text)) > 1:
        issues.append("extra_text_around_url")
    raw = match.group(0).rstrip(".")
    if not raw.lower().startswith("http"):
        raw = "https://" + raw
        issues.append("scheme_added")
    parsed = urlparse(raw)
    hostname = (parsed.hostname or "").lower()
    host = _repair_host(hostname)
    if host is None:
        return None, issues + ["broken_host"]
    if host != hostname:
        issues.append("host_repaired")
        # Anything after a repaired host was glued text, not a real path.
        return f"{parsed.scheme}://{host}/", issues
    netloc = f"{host}:{parsed.port}" if parsed.port else host
    return parsed._replace(netloc=netloc).geturl(), issues
