import pandas as pd
import pytest
from backtesting import Strategy

from python.backtest import BacktestEngine, BacktestResult


class BuyAndHold(Strategy):
    def init(self):
        pass

    def next(self):
        if not self.position:
            self.buy()


def sample_data():
    """Return a small OHLCV dataset indexed by datetime.

    Using a :class:`~pandas.DatetimeIndex` mirrors real market data and avoids
    warnings from the ``backtesting`` library about non-datetime indices.
    """
    return pd.DataFrame(
        {
            "Open": [1, 2, 3, 4, 5],
            "High": [1, 2, 3, 4, 5],
            "Low": [1, 2, 3, 4, 5],
            "Close": [1, 2, 3, 4, 5],
            "Volume": [100, 100, 100, 100, 100],
        },
        index=pd.date_range("2020-01-01", periods=5, freq="D"),
    )


def test_backtest_engine_runs():
    engine = BacktestEngine(cash=1000)
    result = engine.run(sample_data(), BuyAndHold)
    assert isinstance(result, BacktestResult)
    assert isinstance(result.trades, pd.DataFrame)
    assert result.equity_curve.iloc[-1] > result.equity_curve.iloc[0]
