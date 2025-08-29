"""yfinance-backed data provider for educational use."""

from __future__ import annotations

import logging
import os
from datetime import datetime
from typing import List
from urllib.error import HTTPError

try:  # pragma: no cover - import error at runtime
    import yfinance as yf
except Exception as exc:  # pragma: no cover - import error at runtime
    raise ImportError("yfinance is required for YFinanceProvider") from exc

from .base import DataProvider, OHLCV, NoDataError
from .cache import get_cache, get_ttl

logger = logging.getLogger(__name__)


class YFinanceProvider(DataProvider):
    """Fetch market data using the yfinance library.

    Raises:
        NoDataError: if no data is returned for the requested period.
    """

    def __init__(self) -> None:
        allow = os.getenv("ALLOW_YFINANCE", "false").lower() == "true"
        if not allow:
            raise RuntimeError(
                "yfinance access is disabled. Set ALLOW_YFINANCE=true for educational use only.",
            )

    def fetch_ohlcv(self, symbol: str, start: datetime, end: datetime) -> List[OHLCV]:
        """Fetch OHLCV data for *symbol* between *start* and *end*.

        Raises:
            NoDataError: if the provider returns no rows.
        """

        cache = get_cache()
        key = f"{symbol}:{start.isoformat()}:{end.isoformat()}"
        cached = cache.get(key)
        if cached is not None:
            return cached

        try:
            data = yf.download(symbol, start=start, end=end, progress=False)
        except (HTTPError, ValueError) as exc:
            logger.error("yfinance download failed for %s: %s", symbol, exc)
            raise

        if data.empty:
            raise NoDataError(f"No data returned for {symbol}")

        records: List[OHLCV] = []
        for ts, row in data.iterrows():
            records.append(
                OHLCV(
                    timestamp=ts.to_pydatetime(),
                    open=float(row["Open"]),
                    high=float(row["High"]),
                    low=float(row["Low"]),
                    close=float(row["Close"]),
                    volume=int(row["Volume"]),
                )
            )

        cache.set(key, records, get_ttl())
        return records


__all__ = ["YFinanceProvider", "NoDataError"]

