"""Abstract interface for fetching market data."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Protocol, List


@dataclass
class OHLCV:
    """Represents OHLCV data for a single time point."""

    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: int


class DataProvider(Protocol):
    """Protocol for data providers."""

    def fetch_ohlcv(self, symbol: str, start: datetime, end: datetime) -> List[OHLCV]:
        """Fetch OHLCV data for a symbol between start and end dates."""
        ...
