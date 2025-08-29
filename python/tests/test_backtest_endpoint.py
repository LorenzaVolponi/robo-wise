from datetime import date

import pandas as pd
from fastapi.testclient import TestClient

import api.backtest as backtest_module


def sample_df():
    return pd.DataFrame(
        {
            "Open": [1, 2, 3],
            "High": [1, 2, 3],
            "Low": [1, 2, 3],
            "Close": [1, 2, 3],
            "Adj Close": [1, 2, 3],
            "Volume": [100, 100, 100],
        },
        index=pd.date_range("2020-01-01", periods=3, freq="D"),
    )


def test_backtest_endpoint_success(mocker, monkeypatch):
    mocker.patch("yfinance.download", return_value=sample_df())
    monkeypatch.setenv("ALLOW_YFINANCE", "true")
    monkeypatch.setenv("PRICE_CACHE_BACKEND", "memory")
    monkeypatch.setenv("PRICE_CACHE_TTL", "60")
    client = TestClient(backtest_module.app)
    payload = {
        "tickers": ["AAPL"],
        "weights": [1.0],
        "start": "2020-01-01",
        "end": "2020-01-03",
        "rebalance": "monthly",
    }
    res = client.post("/", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "metrics" in data
    assert "report_html" in data
    assert data["metrics"]["dsr"] is not None


def test_backtest_endpoint_bad_weights():
    client = TestClient(backtest_module.app)
    payload = {
        "tickers": ["AAPL"],
        "weights": [0.5],
        "start": "2020-01-01",
        "end": "2020-01-03",
        "rebalance": "monthly",
    }
    res = client.post("/", json=payload)
    assert res.status_code == 422
