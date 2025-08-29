from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def cron_rebalance() -> dict[str, str]:
    """Placeholder for scheduled rebalance checks."""
    return {"status": "ok"}
