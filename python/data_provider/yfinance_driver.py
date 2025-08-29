"""yfinance-backed data provider for educational use."""

from __future__ import annotations

import os
from datetime import datetime
from typing import List

try:
    import yfinance as yf
except Exception as exc:  # pragma: no cover - import error at runtime
    raise ImportError("yfinance is required for YFinanceProvider") from exc

from .base import DataProvider, OHLCV


class YFinanceProvider(DataProvider):
    """Fetch market data using the yfinance library."""

    def __init__(self) -> None:
        allow = os.getenv("ALLOW_YFINANCE", "false").lower() == "true"
        if not allow:
            raise RuntimeError(
                "yfinance access is disabled. Set ALLOW_YFINANCE=true for educational use only."
            )

    def fetch_ohlcv(self, symbol: str, start: datetime, end: datetime) -> List[OHLCV]:
        data = yf.download(symbol, start=start, end=end, progress=False)
        records: List[OHLCV] = []
        for ts, row in data.iterrows():
            records.append(
                OHLCV(
                    timestamp=ts.to_pydatetime(),
                    open=float(row["Open"]),
                    high=float(row["High"]),
                    low=float(row["Low"]),
                    close=float(row["Close"]),
                    volume=float(row["Volume"]),
                )
            )
        return records
