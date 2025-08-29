from __future__ import annotations

import importlib
from datetime import datetime

import pandas as pd
import pytest

from python.data_provider import OHLCV, get_yfinance_provider


@pytest.fixture()
def provider(monkeypatch):
    monkeypatch.setenv("ALLOW_YFINANCE", "true")
    monkeypatch.setenv("PRICE_CACHE_BACKEND", "memory")
    monkeypatch.setenv("PRICE_CACHE_TTL", "60")
    import python.data_provider.cache as cache_module

    importlib.reload(cache_module)
    Provider = get_yfinance_provider()
    return Provider()


def test_fetch_ohlcv_returns_records(provider, mocker):
    df = pd.DataFrame(
        {
            "Open": [1.0],
            "High": [1.5],
            "Low": [0.5],
            "Close": [1.2],
            "Volume": [1000],
        },
        index=[pd.Timestamp("2020-01-01")],
    )
    mocker.patch("python.data_provider.yfinance_driver.yf.download", return_value=df)

    data = provider.fetch_ohlcv(
        "AAPL", datetime(2020, 1, 1), datetime(2020, 1, 2)
    )

    assert len(data) == 1
    record = data[0]
    assert isinstance(record, OHLCV)
    assert isinstance(record.volume, int)
    assert record.volume == 1000


def test_fetch_ohlcv_empty_raises(provider, mocker):
    df = pd.DataFrame(columns=["Open", "High", "Low", "Close", "Volume"])
    mocker.patch("python.data_provider.yfinance_driver.yf.download", return_value=df)
    from python.data_provider.yfinance_driver import NoDataError

    with pytest.raises(NoDataError):
        provider.fetch_ohlcv("AAPL", datetime(2020, 1, 1), datetime(2020, 1, 2))


def test_fetch_ohlcv_uses_cache(provider, mocker):
    df = pd.DataFrame(
        {
            "Open": [1.0],
            "High": [1.5],
            "Low": [0.5],
            "Close": [1.2],
            "Volume": [1000],
        },
        index=[pd.Timestamp("2020-01-01")],
    )
    download = mocker.patch(
        "python.data_provider.yfinance_driver.yf.download", return_value=df
    )

    provider.fetch_ohlcv("AAPL", datetime(2020, 1, 1), datetime(2020, 1, 2))
    provider.fetch_ohlcv("AAPL", datetime(2020, 1, 1), datetime(2020, 1, 2))

    assert download.call_count == 1

