from __future__ import annotations

from datetime import date
from typing import List
from uuid import uuid4
import math

import pandas as pd
import quantstats as qs
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, conlist, model_validator

from python.data_provider import get_yfinance_provider, NoDataError
from python.metrics.deflated_sharpe import deflated_sharpe_ratio
from python.reports.quantstats import generate_report

app = FastAPI()


class BacktestRequest(BaseModel):
    tickers: conlist(str, min_length=1, max_length=10)
    weights: conlist(float, min_length=1)
    start: date
    end: date
    rebalance: str = Field("monthly", pattern="^(monthly|quarterly|yearly)$")

    @model_validator(mode="after")
    def check_inputs(self) -> "BacktestRequest":
        if len(self.tickers) != len(self.weights):
            raise ValueError("tickers and weights must be same length")
        if abs(sum(self.weights) - 1.0) > 1e-6:
            raise ValueError("weights must sum to 1")
        if (self.end - self.start).days > 5 * 365:
            raise ValueError("period exceeds 5 years")
        return self


class MetricResponse(BaseModel):
    annual_return: float
    annual_vol: float
    sharpe: float
    sortino: float
    max_drawdown: float
    dsr: float


class BacktestResponse(BaseModel):
    run_id: str
    metrics: MetricResponse
    report_html: str


@app.post("/", response_model=BacktestResponse)
def run_backtest(req: BacktestRequest) -> BacktestResponse:
    provider_cls = get_yfinance_provider()
    provider = provider_cls()
    frames: List[pd.Series] = []
    for ticker in req.tickers:
        try:
            rows = provider.fetch_ohlcv(ticker, req.start, req.end)
        except NoDataError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        frame = pd.DataFrame([r.__dict__ for r in rows]).set_index("timestamp")
        frame.index.name = "date"
        frames.append(frame["close"].rename(ticker))
    prices = pd.concat(frames, axis=1).dropna()
    returns = prices.pct_change().dropna()
    portfolio_returns = (returns * req.weights).sum(axis=1)
    equity = (1 + portfolio_returns).cumprod()

    qs.extend_pandas()

    def _safe(value: float) -> float:
        return value if math.isfinite(value) else 0.0

    annual_return = _safe(qs.stats.cagr(equity))
    annual_vol = _safe(qs.stats.volatility(portfolio_returns))
    sharpe = _safe(qs.stats.sharpe(portfolio_returns))
    sortino = _safe(qs.stats.sortino(portfolio_returns))
    max_drawdown = _safe(qs.stats.max_drawdown(equity))
    dsr = _safe(deflated_sharpe_ratio(portfolio_returns))
    report_html = generate_report(equity)

    metrics = MetricResponse(
        annual_return=annual_return,
        annual_vol=annual_vol,
        sharpe=sharpe,
        sortino=sortino,
        max_drawdown=max_drawdown,
        dsr=dsr,
    )
    return BacktestResponse(run_id=str(uuid4()), metrics=metrics, report_html=report_html)
