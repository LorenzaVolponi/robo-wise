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
    return pd.DataFrame(
        {
            "Open": [1, 2, 3, 4, 5],
            "High": [1, 2, 3, 4, 5],
            "Low": [1, 2, 3, 4, 5],
            "Close": [1, 2, 3, 4, 5],
            "Volume": [100, 100, 100, 100, 100],
        }
    )


def test_backtest_engine_runs():
    engine = BacktestEngine(cash=1000)
    result = engine.run(sample_data(), BuyAndHold)
    assert isinstance(result, BacktestResult)
    assert isinstance(result.trades, pd.DataFrame)
    assert result.equity_curve.iloc[-1] > result.equity_curve.iloc[0]
