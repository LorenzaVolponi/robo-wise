interface ProviderConfig {
  name: string;
  baseUrl: string;
}

const providers: Record<string, ProviderConfig> = {
  yfinance: { name: "yfinance", baseUrl: "https://query1.finance.yahoo.com" },
  polygon: { name: "Polygon", baseUrl: "https://api.polygon.io" },
  alphaVantage: { name: "Alpha Vantage", baseUrl: "https://www.alphavantage.co" },
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch market data with retry and jitter backoff.
 * The data provider can be switched using the VITE_DATA_PROVIDER flag.
 */
export async function fetchMarketData<T = unknown>(endpoint: string, retries = 3): Promise<T> {
  const flag = (import.meta.env.VITE_DATA_PROVIDER || "yfinance").toString();
  const provider = providers[flag] || providers.yfinance;
  const url = provider.baseUrl + endpoint;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return (await res.json()) as T;
    } catch (err) {
      const jitter = Math.random() * 1000;
      await sleep(Math.pow(2, attempt) * 500 + jitter);
    }
  }
  throw new Error("Failed to fetch market data");
}
