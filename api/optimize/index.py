from http.server import BaseHTTPRequestHandler
import json
import os
from typing import List, Tuple, Optional, Dict, Any

import pandas as pd
import yfinance as yf
from pydantic import BaseModel, Field, ValidationError
from supabase import create_client, Client
from pypfopt import (EfficientFrontier, risk_models, expected_returns,
                     BlackLittermanModel, HRPOpt)


class DataProvider:
    """Simple data provider using yfinance."""

    def fetch_prices(self, tickers: List[str]) -> pd.DataFrame:
        data = yf.download(tickers, period="5y")['Adj Close']
        if isinstance(data, pd.Series):
            data = data.to_frame()
        return data.dropna()

    def fetch_benchmark(self, ticker: str = "SPY") -> pd.Series:
        data = yf.download(ticker, period="5y")['Adj Close']
        return data.dropna()


class OptimizeRequest(BaseModel):
    tickers: List[str]
    bounds: Tuple[float, float] = (0.0, 1.0)
    constraints: Optional[Dict[str, Tuple[float, float]]] = None
    method: str = Field(
        "mean_variance",
        pattern="^(mean_variance|black_litterman|hrp)$",
        description="Optimization method",
    )


class handler(BaseHTTPRequestHandler):
    """Vercel serverless function entrypoint."""

    def _send_json(self, status: int, payload: Dict[str, Any]):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode())

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(content_length)
        idempotency_key = self.headers.get("Idempotency-Key")

        if not idempotency_key:
            self._send_json(400, {"error": "Missing Idempotency-Key header"})
            return

        try:
            body = json.loads(raw_body)
            req = OptimizeRequest(**body)
        except (json.JSONDecodeError, ValidationError) as e:
            self._send_json(400, {"error": str(e)})
            return

        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
        if not supabase_url or not supabase_key:
            self._send_json(500, {"error": "Supabase credentials not configured"})
            return
        supabase: Client = create_client(supabase_url, supabase_key)

        existing = (
            supabase.table("runs")
            .select("id, rationale")
            .eq("idempotency_key", idempotency_key)
            .execute()
        )
        if existing.data:
            run = existing.data[0]
            metrics = (
                supabase.table("run_metrics")
                .select("metric, value")
                .eq("run_id", run["id"])
                .execute()
            )
            self._send_json(200, {"run": run, "metrics": metrics.data})
            return

        provider = DataProvider()
        prices = provider.fetch_prices(req.tickers)
        benchmark = provider.fetch_benchmark()  # Ensure benchmark retrieval

        weights: Dict[str, float] = {}
        performance: Dict[str, float]

        if req.method == "mean_variance":
            mu = expected_returns.mean_historical_return(prices)
            S = risk_models.sample_cov(prices)
            ef = EfficientFrontier(mu, S, weight_bounds=req.bounds)
            if req.constraints:
                for ticker, (lo, hi) in req.constraints.items():
                    idx = req.tickers.index(ticker)
                    ef.add_constraint(lambda w, i=idx, l=lo: w[i] >= l)
                    ef.add_constraint(lambda w, i=idx, u=hi: w[i] <= u)
            weights = ef.max_sharpe()
            perf = ef.portfolio_performance()
            performance = {
                "expected_return": perf[0],
                "volatility": perf[1],
                "sharpe": perf[2],
            }
        elif req.method == "black_litterman":
            S = risk_models.sample_cov(prices)
            market_ret = expected_returns.mean_historical_return(benchmark.to_frame())
            bl = BlackLittermanModel(S, pi=market_ret)
            ret, cov = bl.bl_returns(), bl.bl_cov()
            ef = EfficientFrontier(ret, cov, weight_bounds=req.bounds)
            weights = ef.max_sharpe()
            perf = ef.portfolio_performance()
            performance = {
                "expected_return": perf[0],
                "volatility": perf[1],
                "sharpe": perf[2],
            }
        else:  # HRP
            hrp = HRPOpt(prices)
            if req.constraints:
                for ticker, (lo, hi) in req.constraints.items():
                    hrp.bounds[ticker] = (lo, hi)
            weights = hrp.optimize()
            perf = hrp.portfolio_performance()
            performance = {
                "expected_return": perf[0],
                "volatility": perf[1],
                "sharpe": perf[2],
            }

        rationale = {"method": req.method, "performance": performance}

        run = (
            supabase.table("runs")
            .insert({"idempotency_key": idempotency_key, "rationale": json.dumps(rationale)})
            .execute()
            .data[0]
        )

        metrics_payload = {**{f"weight:{k}": v for k, v in weights.items()}, **performance}
        for metric, value in metrics_payload.items():
            supabase.table("run_metrics").insert({"run_id": run["id"], "metric": metric, "value": value}).execute()

        self._send_json(200, {"weights": weights, "performance": performance, "run_id": run["id"]})
