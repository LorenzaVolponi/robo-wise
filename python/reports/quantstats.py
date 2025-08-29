"""Utilities for generating QuantStats reports."""
from __future__ import annotations

from typing import Optional

import pandas as pd
import quantstats as qs
import tempfile


def generate_report(equity: pd.Series, benchmark: Optional[pd.Series] = None) -> str:
    """Return an HTML QuantStats report for the given equity curve.

    Parameters
    ----------
    equity : pd.Series
        Equity curve indexed by date.
    benchmark : pd.Series, optional
        Benchmark series aligned on the same index.

    Returns
    -------
    str
        HTML content produced by QuantStats.
    """
    qs.extend_pandas()
    with tempfile.NamedTemporaryFile(suffix=".html") as tmp:
        qs.reports.html(equity, benchmark=benchmark, output=tmp.name)
        tmp.seek(0)
        return tmp.read().decode("utf-8")
