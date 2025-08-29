from __future__ import annotations

import pandas as pd
from dataclasses import dataclass
from typing import Any
from backtesting import Backtest, Strategy as BTStrategy

from ..engine import Strategy, CostModel, RiskModel, BacktestResult


@dataclass
class BacktestingPyAdapter:
    """Adapter translating a strategy to the `backtesting.py` library."""

    def run(
        self,
        strategy: Strategy,
        data: pd.DataFrame,
        cost_model: CostModel,
        risk_model: RiskModel,
        init_cash: float = 100.0,
    ) -> BacktestResult:
        # Pre-compute signals
        entries = strategy.entries(data)
        exits = strategy.exits(data)
        df = data.copy()
        df["entries"] = entries
        df["exits"] = exits

        class _Strategy(BTStrategy):
            def init(self):
                pass

            def next(self):
                i = int(self.data.index[-1])
                price = self.data.Close[-1]
                if self.data.entries[-1] and not self.position:
                    size = min(risk_model.max_exposure, risk_model.allocation_limit)
                    self.buy(size=size)
                elif self.data.exits[-1] and self.position:
                    self.position.close()

        bt = Backtest(
            df,
            _Strategy,
            cash=init_cash,
            commission=0.0,
            trade_on_close=True,
            exclusive_orders=True,
        )
        stats = bt.run()
        trades = stats._trades
        # Apply costs and risk constraints manually
        pnl_series = pd.Series(0.0, index=df.index, dtype=float)
        equity_curve = pd.Series(float(init_cash), index=df.index, dtype=float)
        cash = init_cash
        trade_records = []
        for _, t in trades.iterrows():
            cost = cost_model.calculate(t.EntryPrice, t.Size)
            pnl = t.PnL - cost
            exit_bar = int(t.ExitBar)
            pnl_series.iloc[exit_bar] += pnl
            cash += pnl
            equity_curve.iloc[exit_bar:] = cash
            trade_records.append(
                {
                    "entry_idx": int(t.EntryBar),
                    "exit_idx": exit_bar,
                    "pnl": pnl,
                }
            )
        trades_df = pd.DataFrame(trade_records)
        return BacktestResult(pnl_series, equity_curve, trades_df)
