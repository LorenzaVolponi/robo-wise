from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from upstash_redis import Redis

app = FastAPI()
redis = Redis.from_env()

class EchoRequest(BaseModel):
    message: str

class EchoResponse(BaseModel):
    message: str

def rate_limit(identifier: str) -> None:
    key = f"rate:{identifier}"
    count = redis.incr(key)
    if count == 1:
        redis.expire(key, 60)
    if count > 10:
        raise HTTPException(status_code=429, detail="Too Many Requests")

@app.post("/api/py-echo", response_model=EchoResponse)
async def echo(request: Request, payload: EchoRequest) -> EchoResponse:
    rate_limit(request.client.host)
    idem_key = request.headers.get("Idempotency-Key")
    if not idem_key:
        raise HTTPException(status_code=400, detail="Missing Idempotency-Key")
    cached = redis.get(idem_key)
    if cached:
        return EchoResponse.parse_raw(cached)
    response = EchoResponse(message=payload.message)
    redis.set(idem_key, response.json(), ex=3600)
    return response
