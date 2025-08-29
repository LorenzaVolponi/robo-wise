import os
import json
import time
from typing import Dict, Any

try:
    from upstash_redis import Redis
except ImportError:  # pragma: no cover
    Redis = None

try:
    import requests
except ImportError:  # pragma: no cover
    requests = None

MAX_DURATION_MS = int(os.getenv("REBALANCE_MAX_MS", "9000"))


def _enqueue_to_qstash(payload: Dict[str, Any]) -> None:
    """Send the payload to Upstash QStash for asynchronous processing."""
    if not requests:
        return
    token = os.getenv("QSTASH_TOKEN")
    target_url = os.getenv("QSTASH_TARGET_URL")
    if not (token and target_url):
        return
    requests.post(
        "https://qstash.upstash.io/v1/publish",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={"url": target_url, "body": json.dumps(payload)},
        timeout=10,
    )


def handler(request: Dict[str, Any]) -> Dict[str, Any]:
    """Apply previously simulated rebalance orders.

    If execution is predicted to exceed ``MAX_DURATION_MS`` the request is
    enqueued to QStash instead of running synchronously.
    """
    start = time.time()

    orders = request.get("orders", [])
    # placeholder for applying trades to broker or exchange

    elapsed = (time.time() - start) * 1000
    if elapsed > MAX_DURATION_MS:
        _enqueue_to_qstash(request)
        return {"status": "enqueued"}

    # notify downstream services
    redis_url = os.getenv("UPSTASH_REDIS_URL")
    redis_token = os.getenv("UPSTASH_REDIS_TOKEN")
    if Redis and redis_url and redis_token and orders:
        redis = Redis.from_url(redis_url, token=redis_token)
        redis.publish("orders.applied", json.dumps(orders))

    return {"status": "applied", "orders": orders}
