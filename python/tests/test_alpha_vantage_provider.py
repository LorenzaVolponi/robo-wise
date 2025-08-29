import os
from datetime import datetime

import pytest

from python.data_provider.alpha_vantage_driver import (
    AlphaVantageProvider,
    NoDataError,
)


class DummyResponse:
    def __init__(self, payload):
        self._payload = payload

    def raise_for_status(self) -> None:  # pragma: no cover - no-op
        return None

    def json(self):  # pragma: no cover - simple wrapper
        return self._payload


@pytest.fixture(autouse=True)
def _set_api_key(monkeypatch):
    monkeypatch.setenv("ALPHAVANTAGE_API_KEY", "demo")


def test_fetch_ohlcv_success(mocker):
    sample = {
        "Time Series (Daily)": {
            "2024-01-02": {
                "1. open": "1",
                "2. high": "2",
                "3. low": "0.5",
                "4. close": "1.5",
                "6. volume": "100",
            }
        }
    }
    mocker.patch(
        "python.data_provider.alpha_vantage_driver.requests.Session.get",
        return_value=DummyResponse(sample),
    )

    provider = AlphaVantageProvider()
    data = provider.fetch_ohlcv(
        "IBM", datetime(2024, 1, 1), datetime(2024, 1, 3)
    )

    assert len(data) == 1
    rec = data[0]
    assert rec.open == 1.0
    assert rec.high == 2.0
    assert rec.volume == 100


def test_fetch_ohlcv_no_data(mocker):
    sample = {"Time Series (Daily)": {}}
    mocker.patch(
        "python.data_provider.alpha_vantage_driver.requests.Session.get",
        return_value=DummyResponse(sample),
    )

    provider = AlphaVantageProvider()
    with pytest.raises(NoDataError):
        provider.fetch_ohlcv(
            "EMPTY", datetime(2024, 1, 1), datetime(2024, 1, 3)
        )
