from pathlib import Path
import sqlite3

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, RedirectResponse

app = FastAPI()

DB_PATH = Path("reports.db")


@app.get("/api/runs/{run_id}/report")
def get_report(run_id: str, format: str = "html"):
    """Return a generated report or redirect to its stored URL."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "SELECT url FROM reports WHERE run_id=? AND format=? ORDER BY id DESC LIMIT 1",
        (run_id, format),
    )
    row = cur.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Report not found")

    url = row[0]
    if url.startswith("http://") or url.startswith("https://"):
        return RedirectResponse(url)

    file_path = Path(url)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File missing")

    media_type = {
        "html": "text/html",
        "pdf": "application/pdf",
        "png": "image/png",
    }.get(format, "application/octet-stream")

    return FileResponse(file_path, media_type=media_type, filename=file_path.name)
