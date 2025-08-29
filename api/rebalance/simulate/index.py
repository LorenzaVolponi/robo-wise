import os
import json
from datetime import datetime
from typing import Dict, List, Any

try:
    from supabase import create_client, Client
except ImportError:  # pragma: no cover - dependency may not be installed during tests
    create_client = None
    Client = None

try:
    from upstash_redis import Redis
except ImportError:  # pragma: no cover
    Redis = None


def _lot_sized(quantity: float, lot: float) -> float:
    """Round quantity down to the nearest lot size."""
    if lot <= 0:
        return quantity
    return int(quantity / lot) * lot


def handler(request: Dict[str, Any]) -> Dict[str, Any]:
    """Simulate a portfolio rebalance using tolerance bands and lot sizing.

    Parameters
    ----------
    request: dict
        Expected to contain ``portfolio`` (current holdings), ``targets``
        (target weights), ``tolerance`` (band width as decimal), and
        ``lot`` (minimum tradable unit).
    """
    portfolio: Dict[str, float] = request.get("portfolio", {})
    targets: Dict[str, float] = request.get("targets", {})
    tolerance: float = request.get("tolerance", 0.05)
    lot: float = request.get("lot", 1)

    orders: List[Dict[str, Any]] = []
    for symbol, target in targets.items():
        current = portfolio.get(symbol, 0.0)
        diff = target - current
        # only trade when outside the tolerance band
        if target == 0:
            continue
        band = abs(diff) / target
        if band >= tolerance:
            qty = _lot_sized(diff, lot)
            if qty:
                orders.append({"symbol": symbol, "quantity": qty})

    # persist the simulated orders
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if create_client and url and key and orders:
        client: Client = create_client(url, key)
        client.table("orders_sim").insert({
            "created_at": datetime.utcnow().isoformat(),
            "orders": orders,
        }).execute()

    # emit an event for downstream consumers
    redis_url = os.getenv("UPSTASH_REDIS_URL")
    redis_token = os.getenv("UPSTASH_REDIS_TOKEN")
    if Redis and redis_url and redis_token and orders:
        redis = Redis.from_url(redis_url, token=redis_token)
        redis.publish("orders.simulated", json.dumps(orders))

    return {"orders": orders}
