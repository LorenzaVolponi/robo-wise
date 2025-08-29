"""Data provider interface and implementations."""

from .base import DataProvider, OHLCV


def get_yfinance_provider():
    """Return the :class:`YFinanceProvider` class via a local import."""
    from .yfinance_driver import YFinanceProvider

    return YFinanceProvider


def get_alpha_vantage_provider():
    """Return the :class:`AlphaVantageProvider` class via a local import."""
    from .alpha_vantage_driver import AlphaVantageProvider

    return AlphaVantageProvider


__all__ = [
    "DataProvider",
    "OHLCV",
    "get_yfinance_provider",
    "get_alpha_vantage_provider",
]
