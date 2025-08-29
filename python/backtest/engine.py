from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol, Optional
import pandas as pd


class Strategy(Protocol):
    """Minimal strategy interface for the backtest engine."""

    def entries(self, data: pd.DataFrame) -> pd.Series:
        """Return a boolean Series of entry signals."""

    def exits(self, data: pd.DataFrame) -> pd.Series:
        """Return a boolean Series of exit signals."""


@dataclass
class CostModel:
    """Simple cost model supporting commissions and slippage."""

    commission: float = 0.0  # flat commission per trade
    slippage: float = 0.0    # proportion of trade value

    def calculate(self, price: float, size: float) -> float:
        return self.commission + price * size * self.slippage


@dataclass
class RiskModel:
    """Risk constraints limiting portfolio exposure."""

    max_exposure: float = 1.0        # fraction of equity that can be invested
    drawdown_stop: Optional[float] = None  # maximum allowed drawdown fraction
    allocation_limit: float = 1.0    # fraction of equity per trade

    def check_drawdown(self, equity_curve: pd.Series) -> bool:
        if self.drawdown_stop is None:
            return True
        peak = equity_curve.cummax()
        drawdown = (equity_curve - peak) / peak
        return drawdown.min() >= -self.drawdown_stop


@dataclass
class BacktestResult:
    pnl: pd.Series
    equity_curve: pd.Series
    trades: pd.DataFrame


class BacktestAdapter(Protocol):
    """Adapter interface for specific backtesting libraries."""

    def run(
        self,
        strategy: Strategy,
        data: pd.DataFrame,
        cost_model: CostModel,
        risk_model: RiskModel,
        init_cash: float = 100.0,
    ) -> BacktestResult:
        ...


class BacktestEngine:
    """High level engine delegating execution to a library adapter."""

    def __init__(self, data: pd.DataFrame, adapter: BacktestAdapter, *, init_cash: float = 100.0):
        self.data = data
        self.adapter = adapter
        self.init_cash = init_cash

    def run(
        self,
        strategy: Strategy,
        cost_model: CostModel | None = None,
        risk_model: RiskModel | None = None,
    ) -> BacktestResult:
        cost_model = cost_model or CostModel()
        risk_model = risk_model or RiskModel()
        result = self.adapter.run(strategy, self.data, cost_model, risk_model, self.init_cash)
        # Apply drawdown stop if necessary
        if not risk_model.check_drawdown(result.equity_curve):
            dd = (result.equity_curve / result.equity_curve.cummax()) - 1
            stop_idx = dd[dd < -risk_model.drawdown_stop].index[0]
            result.pnl = result.pnl.loc[:stop_idx]
            result.equity_curve = result.equity_curve.loc[:stop_idx]
            result.trades = result.trades[result.trades["exit_idx"] <= stop_idx]
        return result
