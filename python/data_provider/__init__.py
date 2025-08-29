"""Data provider interface and implementations."""

from .base import DataProvider, OHLCV


def get_yfinance_provider():
    """Return the :class:`YFinanceProvider` class via a local import."""
    from .yfinance_driver import YFinanceProvider

    return YFinanceProvider


__all__ = ["DataProvider", "OHLCV", "get_yfinance_provider"]
