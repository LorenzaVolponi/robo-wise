from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def health() -> dict[str, str]:
    """Simple healthcheck endpoint."""
    return {"status": "ok"}
