"""Simple caching utilities for price data."""

from __future__ import annotations

import os
import pickle
import time
from typing import Any, Dict, Optional, Tuple

try:  # Optional Redis dependency
    import redis
except Exception:  # pragma: no cover - missing optional dependency
    redis = None  # type: ignore


class Cache:
    """Minimal cache interface."""

    def get(self, key: str) -> Any:  # pragma: no cover - interface definition
        raise NotImplementedError

    def set(self, key: str, value: Any, ttl: int) -> None:  # pragma: no cover
        raise NotImplementedError


class MemoryCache(Cache):
    """In-memory dictionary-based cache."""

    def __init__(self) -> None:
        self._store: Dict[str, Tuple[float, Any]] = {}

    def get(self, key: str) -> Any:
        entry = self._store.get(key)
        if not entry:
            return None
        exp, value = entry
        if exp < time.time():
            self._store.pop(key, None)
            return None
        return value

    def set(self, key: str, value: Any, ttl: int) -> None:
        self._store[key] = (time.time() + ttl, value)


class RedisCache(Cache):
    """Redis-backed cache."""

    def __init__(self, url: str) -> None:
        if redis is None:  # pragma: no cover - optional backend
            raise ImportError("redis backend requires redis-py to be installed")
        self.client = redis.from_url(url)

    def get(self, key: str) -> Any:
        value = self.client.get(key)
        if value is None:
            return None
        return pickle.loads(value)

    def set(self, key: str, value: Any, ttl: int) -> None:
        self.client.setex(key, ttl, pickle.dumps(value))


_CACHE: Optional[Cache] = None
_BACKEND = os.getenv("PRICE_CACHE_BACKEND", "memory").lower()
_TTL = int(os.getenv("PRICE_CACHE_TTL", "3600"))


def get_cache() -> Cache:
    """Return a configured cache instance."""

    global _CACHE
    if _CACHE is None:
        if _BACKEND == "redis":
            url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
            _CACHE = RedisCache(url)
        else:
            _CACHE = MemoryCache()
    return _CACHE


def get_ttl() -> int:
    """Return the default TTL for cached items."""

    return _TTL

