from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def cron_refresh() -> dict[str, str]:
    """Placeholder for daily price refresh."""
    return {"status": "ok"}
