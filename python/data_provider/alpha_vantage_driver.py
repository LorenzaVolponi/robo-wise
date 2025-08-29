"""Alpha Vantage-backed data provider."""

from __future__ import annotations

import logging
import os
from datetime import datetime
from typing import List

import requests

from .base import DataProvider, OHLCV
from .cache import get_cache, get_ttl

logger = logging.getLogger(__name__)


class NoDataError(Exception):
    """Raised when no data is returned from Alpha Vantage."""


class AlphaVantageProvider(DataProvider):
    """Fetch market data using the Alpha Vantage REST API.

    Requires the ``ALPHAVANTAGE_API_KEY`` environment variable to be set.

    Raises:
        NoDataError: if the provider returns no rows for the requested period.
    """

    API_URL = "https://www.alphavantage.co/query"

    def __init__(self) -> None:
        api_key = os.getenv("ALPHAVANTAGE_API_KEY")
        if not api_key:
            raise RuntimeError(
                "Alpha Vantage access requires ALPHAVANTAGE_API_KEY to be set",
            )
        self.api_key = api_key
        self.session = requests.Session()

    def fetch_ohlcv(self, symbol: str, start: datetime, end: datetime) -> List[OHLCV]:
        """Fetch OHLCV data for *symbol* between *start* and *end*.

        Raises:
            NoDataError: if the provider returns no rows.
        """
        cache = get_cache()
        key = f"av:{symbol}:{start.isoformat()}:{end.isoformat()}"
        cached = cache.get(key)
        if cached is not None:
            return cached

        params = {
            "function": "TIME_SERIES_DAILY_ADJUSTED",
            "symbol": symbol,
            "outputsize": "full",
            "apikey": self.api_key,
        }
        try:
            resp = self.session.get(self.API_URL, params=params, timeout=30)
            resp.raise_for_status()
        except requests.HTTPError as exc:
            logger.error("Alpha Vantage request failed for %s: %s", symbol, exc)
            raise

        data = resp.json().get("Time Series (Daily)")
        if not data:
            raise NoDataError(f"No data returned for {symbol}")

        records: List[OHLCV] = []
        for date_str, row in data.items():
            ts = datetime.fromisoformat(date_str)
            if ts < start or ts > end:
                continue
            records.append(
                OHLCV(
                    timestamp=ts,
                    open=float(row["1. open"]),
                    high=float(row["2. high"]),
                    low=float(row["3. low"]),
                    close=float(row["4. close"]),
                    volume=int(row["6. volume"]),
                )
            )

        if not records:
            raise NoDataError(f"No data returned for {symbol} in range")

        records.sort(key=lambda r: r.timestamp)
        cache.set(key, records, get_ttl())
        return records


__all__ = ["AlphaVantageProvider", "NoDataError"]
