from dataclasses import dataclass
from typing import Type

import pandas as pd
from backtesting import Backtest, Strategy


@dataclass
class BacktestResult:
    """Container for results of a backtest run."""
    equity_curve: pd.Series
    trades: pd.DataFrame


class BacktestEngine:
    """Simple wrapper around the `backtesting` library.

    Parameters
    ----------
    cash : float, optional
        Starting capital, by default 10000.
    commission : float, optional
        Commission rate per trade, by default 0.0.
    """

    def __init__(self, cash: float = 10_000, commission: float = 0.0):
        self.cash = cash
        self.commission = commission

    def run(self, data: pd.DataFrame, strategy: Type[Strategy], **kwargs) -> BacktestResult:
        """Execute a backtest using the provided strategy.

        Parameters
        ----------
        data : pd.DataFrame
            Price data with columns Open, High, Low, Close, Volume.
        strategy : Type[Strategy]
            Strategy class following the `backtesting` library interface.
        **kwargs : dict
            Additional arguments passed to `Backtest`.

        Returns
        -------
        BacktestResult
            Equity curve and trade list produced by the simulation.
        """

        # Ensure open positions are closed at the end of the simulation so that
        # statistics such as profit and trade count remain consistent.
        kwargs.setdefault("finalize_trades", True)

        bt = Backtest(
            data,
            strategy,
            cash=self.cash,
            commission=self.commission,
            **kwargs,
        )
        stats = bt.run()
        return BacktestResult(equity_curve=stats['_equity_curve']['Equity'], trades=stats['_trades'])
