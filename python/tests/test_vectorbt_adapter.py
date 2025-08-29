import pandas as pd
import pytest

from backtest.engine import BacktestEngine, CostModel
from backtest.adapters.vectorbt import VectorBTAdapter


class SimpleStrategy:
    def entries(self, data: pd.DataFrame) -> pd.Series:
        return pd.Series([False, True, False, False, False], index=data.index)

    def exits(self, data: pd.DataFrame) -> pd.Series:
        return pd.Series([False, False, False, True, False], index=data.index)


def price_data() -> pd.DataFrame:
    return pd.DataFrame({"Close": [1, 2, 3, 4, 5]})


def test_vectorbt_adapter_basic():
    data = price_data()
    engine = BacktestEngine(data, VectorBTAdapter(), init_cash=100)
    result = engine.run(SimpleStrategy(), cost_model=CostModel(commission=0.1))
    assert result.trades.shape[0] == 1
    assert result.trades["pnl"].iloc[0] == pytest.approx(1.9)
    assert result.equity_curve.iloc[-1] == pytest.approx(101.9)
