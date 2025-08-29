from __future__ import annotations

import pandas as pd
from dataclasses import dataclass
import vectorbt as vbt

from ..engine import Strategy, CostModel, RiskModel, BacktestResult


@dataclass
class VectorBTAdapter:
    """Adapter translating a strategy to the `vectorbt` library."""

    def run(
        self,
        strategy: Strategy,
        data: pd.DataFrame,
        cost_model: CostModel,
        risk_model: RiskModel,
        init_cash: float = 100.0,
    ) -> BacktestResult:
        price = data["Close"] if "Close" in data else data.squeeze()
        entries = strategy.entries(data)
        exits = strategy.exits(data)
        size = min(risk_model.max_exposure, risk_model.allocation_limit)
        pf = vbt.Portfolio.from_signals(
            price,
            entries,
            exits,
            init_cash=init_cash,
            fees=0.0,
            slippage=0.0,
            size=size,
        )
        records = pf.trades.records
        pnl_series = pd.Series(0.0, index=price.index, dtype=float)
        equity_curve = pd.Series(float(init_cash), index=price.index, dtype=float)
        cash = init_cash
        trade_records = []
        for r in records.itertuples():
            entry_idx = int(r.entry_idx)
            exit_idx = int(r.exit_idx)
            size = r.size
            entry_price = r.entry_price
            pnl = r.pnl - cost_model.calculate(entry_price, size)
            pnl_series.iloc[exit_idx] += pnl
            cash += pnl
            equity_curve.iloc[exit_idx:] = cash
            trade_records.append({"entry_idx": entry_idx, "exit_idx": exit_idx, "pnl": pnl})
        trades_df = pd.DataFrame(trade_records)
        return BacktestResult(pnl_series, equity_curve, trades_df)
