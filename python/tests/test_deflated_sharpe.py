from __future__ import annotations

import pandas as pd
import pytest

from python.metrics.deflated_sharpe import deflated_sharpe_ratio


def test_deflated_sharpe_ratio_value():
    returns = pd.Series([0.01, 0.02, -0.01, 0.015])
    dsr = deflated_sharpe_ratio(returns)
    assert 0 <= dsr <= 1


def test_deflated_sharpe_ratio_multiple_trials():
    returns = pd.Series([0.01, -0.02, 0.015, -0.005, 0.005] * 20)
    dsr = deflated_sharpe_ratio(returns, trials=100)
    assert 0 <= dsr <= 1


def test_deflated_sharpe_ratio_requires_observations():
    with pytest.raises(ValueError):
        deflated_sharpe_ratio([0.01])
