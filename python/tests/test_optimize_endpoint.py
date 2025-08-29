from datetime import datetime

from fastapi.testclient import TestClient

from api.optimize import app
from python.data_provider.base import OHLCV
from python.data_provider import NoDataError


class DummyProvider:
    prices = {
        "AAA": [10.0, 11.0, 12.0],
        "BBB": [20.0, 18.0, 19.0],
    }

    def fetch_ohlcv(self, symbol: str, start: datetime, end: datetime):
        return [
            OHLCV(
                timestamp=datetime(2020, 1, 1 + i),
                open=price,
                high=price,
                low=price,
                close=price,
                volume=1_000,
            )
            for i, price in enumerate(self.prices[symbol])
        ]


def test_optimize_success(mocker):
    mocker.patch("api.optimize.get_yfinance_provider", return_value=DummyProvider)
    client = TestClient(app)
    resp = client.post(
        "/",
        json={
            "tickers": ["AAA", "BBB"],
            "start": "2020-01-01",
            "end": "2020-01-03",
            "max_single": 0.6,
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert set(data["weights"].keys()) == {"AAA", "BBB"}
    assert abs(sum(data["weights"].values()) - 1) < 1e-6
    assert all(w <= 0.6 + 1e-6 for w in data["weights"].values())
    assert "sharpe_ratio" in data


def test_optimize_no_data(mocker):
    class FailingProvider:
        def fetch_ohlcv(self, symbol: str, start: datetime, end: datetime):
            raise NoDataError("no data")

    mocker.patch("api.optimize.get_yfinance_provider", return_value=FailingProvider)
    client = TestClient(app)
    resp = client.post(
        "/",
        json={"tickers": ["AAA"], "start": "2020-01-01", "end": "2020-01-03"},
    )
    assert resp.status_code == 400
