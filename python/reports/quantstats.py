from __future__ import annotations

from pathlib import Path
from typing import Dict, Optional

import pandas as pd
import quantstats as qs
import sqlite3

try:
    import pdfkit  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    pdfkit = None


qs.extend_pandas()


def generate_report(
    run_id: str,
    pnl: pd.Series,
    benchmark: Optional[pd.Series] = None,
    storage_dir: str = "artifacts",
    db_path: str = "reports.db",
) -> Dict[str, str]:
    """Build quantstats reports and register them.

    Parameters
    ----------
    run_id:
        Identifier for the run to associate generated artifacts.
    pnl:
        Pandas Series containing profit and loss values indexed by date.
    benchmark:
        Optional benchmark series for comparison.
    storage_dir:
        Directory used to persist generated artifacts.
    db_path:
        SQLite database file containing the ``reports`` table.
    Returns
    -------
    Dict[str, str]
        Mapping of format (``html``, ``pdf`` or ``png``) to stored URL.
    """

    out_dir = Path(storage_dir) / run_id
    out_dir.mkdir(parents=True, exist_ok=True)

    # HTML report
    html_path = out_dir / "report.html"
    qs.reports.html(pnl, benchmark=benchmark, output=str(html_path), title=f"Run {run_id}")

    # PDF version (best effort)
    pdf_path = out_dir / "report.pdf"
    if pdfkit is not None:
        try:
            pdfkit.from_file(str(html_path), str(pdf_path))
        except Exception:
            pdf_path = None
    else:  # pragma: no cover - pdfkit not installed
        pdf_path = None

    # Snapshot plot as PNG
    png_path = out_dir / "report.png"
    try:
        qs.plots.snapshot(pnl, benchmark=benchmark, title=f"Run {run_id}", savefig=str(png_path), show=False)
    except Exception:
        png_path = None

    # Persist metadata in database
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            run_id TEXT NOT NULL,
            format TEXT NOT NULL,
            url TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    records = []
    def register(path: Optional[Path], fmt: str):
        if path is not None and path.exists():
            records.append((run_id, fmt, str(path)))

    register(html_path, "html")
    register(pdf_path, "pdf")
    register(png_path, "png")

    if records:
        cur.executemany("INSERT INTO reports (run_id, format, url) VALUES (?,?,?)", records)
        conn.commit()
    conn.close()

    return {fmt: url for _, fmt, url in records}
