from __future__ import annotations

from datetime import date
from typing import List, Dict

import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, conlist
from pypfopt import EfficientFrontier, expected_returns, risk_models

from python.data_provider import get_yfinance_provider, NoDataError

app = FastAPI()


class OptimizeRequest(BaseModel):
    tickers: conlist(str, min_length=1, max_length=10)
    start: date
    end: date
    max_single: float | None = Field(default=None, gt=0, le=1)


class OptimizeResponse(BaseModel):
    weights: Dict[str, float]
    expected_annual_return: float
    annual_volatility: float
    sharpe_ratio: float


@app.post("/", response_model=OptimizeResponse)
def optimize(req: OptimizeRequest) -> OptimizeResponse:
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
    if prices.empty:
        raise HTTPException(status_code=400, detail="no overlapping price data")

    mu = expected_returns.mean_historical_return(prices)
    cov = risk_models.sample_cov(prices)
    bounds = (0, req.max_single) if req.max_single is not None else (0, 1)

    ef = EfficientFrontier(mu, cov, weight_bounds=bounds)
    try:
        ef.max_sharpe()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    weights = {k: float(v) for k, v in ef.clean_weights().items()}
    ret, vol, sharpe = ef.portfolio_performance()
    return OptimizeResponse(
        weights=weights,
        expected_annual_return=ret,
        annual_volatility=vol,
        sharpe_ratio=sharpe,
    )
