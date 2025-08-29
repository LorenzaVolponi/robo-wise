"""Utilities for computing the Deflated Sharpe Ratio."""
from __future__ import annotations

from math import sqrt
from typing import Union

import pandas as pd
from scipy.stats import norm


def deflated_sharpe_ratio(
    returns: Union[pd.Series, list],
    trials: int = 1,
) -> float:
    """Compute the Deflated Sharpe Ratio for a return series.

    Parameters
    ----------
    returns:
        Sequence of periodic returns.
    trials:
        Number of independent strategy variations that were tried. A higher
        value lowers the resulting probability. Defaults to ``1``.

    Returns
    -------
    float
        Probability that the observed Sharpe ratio is not a result of luck.
    """
    series = pd.Series(returns).dropna()
    n = series.shape[0]
    if n < 2:
        raise ValueError("deflated_sharpe_ratio requires at least two observations")

    sr = series.mean() / series.std(ddof=1) * sqrt(n)
    skew = series.skew()
    kurt = series.kurtosis()

    sr_adj = sr * (1 + skew * sr / 6 - (kurt - 3) * sr**2 / 24)
    var_sr = (1 - sr_adj**2) / (n - 1)
    sigma_sr = sqrt(var_sr)

    z = norm.ppf(1 - 1 / trials) if trials > 1 else 0.0
    sr_max = sr_adj + sigma_sr * z

    dsr = norm.cdf((sr - sr_max) / sigma_sr)
    return float(dsr)
