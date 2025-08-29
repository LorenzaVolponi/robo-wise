// Utility functions for financial calculations

export interface PortfolioReturn {
  date: string;
  value: number;
  return: number;
  cumulativeReturn: number;
}

export interface PortfolioMetrics {
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  informationRatio: number;
  calmarRatio: number;
  var95: number;
  expectedShortfall: number;
  beta: number;
  alpha: number;
}

export interface Asset {
  symbol: string;
  weight: number;
  returns: number[];
  prices: number[];
}

/**
 * Calculate annualized return from total return and time period
 */
export function calculateAnnualizedReturn(totalReturn: number, years: number): number {
  return (Math.pow(1 + totalReturn / 100, 1 / years) - 1) * 100;
}

/**
 * Calculate volatility (annualized standard deviation)
 */
export function calculateVolatility(returns: number[]): number {
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  return Math.sqrt(variance * 252) * 100; // Annualized
}

/**
 * Calculate Sharpe Ratio
 */
export function calculateSharpeRatio(
  portfolioReturn: number, 
  volatility: number, 
  riskFreeRate: number = 10.5 // SELIC aproximada
): number {
  return (portfolioReturn - riskFreeRate) / volatility;
}

/**
 * Calculate Sortino Ratio (downside deviation only)
 */
export function calculateSortinoRatio(
  returns: number[], 
  riskFreeRate: number = 10.5
): number {
  const excessReturns = returns.map(r => r - riskFreeRate / 252);
  const downSideReturns = excessReturns.filter(r => r < 0);
  
  if (downSideReturns.length === 0) return 0;
  
  const meanExcessReturn = excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;
  const downsideVariance = downSideReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / downSideReturns.length;
  const downsideDeviation = Math.sqrt(downsideVariance * 252);
  
  return (meanExcessReturn * 252) / downsideDeviation;
}

/**
 * Calculate Maximum Drawdown
 */
export function calculateMaxDrawdown(prices: number[]): number {
  let maxDrawdown = 0;
  let peak = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > peak) {
      peak = prices[i];
    }
    
    const drawdown = (peak - prices[i]) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown * 100;
}

/**
 * Calculate Value at Risk (95% confidence)
 */
export function calculateVaR(returns: number[], confidence: number = 0.95): number {
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sortedReturns.length);
  return sortedReturns[index] * 100;
}

/**
 * Calculate Expected Shortfall (Conditional VaR)
 */
export function calculateExpectedShortfall(returns: number[], confidence: number = 0.95): number {
  const var95 = calculateVaR(returns, confidence) / 100;
  const tailReturns = returns.filter(r => r <= var95);
  
  if (tailReturns.length === 0) return var95 * 100;
  
  const avgTailReturn = tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;
  return avgTailReturn * 100;
}

/**
 * Calculate Beta relative to benchmark
 */
export function calculateBeta(portfolioReturns: number[], benchmarkReturns: number[]): number {
  const minLength = Math.min(portfolioReturns.length, benchmarkReturns.length);
  const portReturns = portfolioReturns.slice(0, minLength);
  const benchReturns = benchmarkReturns.slice(0, minLength);
  
  const benchMean = benchReturns.reduce((sum, r) => sum + r, 0) / benchReturns.length;
  const portMean = portReturns.reduce((sum, r) => sum + r, 0) / portReturns.length;
  
  let covariance = 0;
  let benchVariance = 0;
  
  for (let i = 0; i < minLength; i++) {
    const benchDiff = benchReturns[i] - benchMean;
    const portDiff = portReturns[i] - portMean;
    
    covariance += benchDiff * portDiff;
    benchVariance += benchDiff * benchDiff;
  }
  
  covariance /= (minLength - 1);
  benchVariance /= (minLength - 1);
  
  return benchVariance === 0 ? 0 : covariance / benchVariance;
}

/**
 * Calculate Alpha (Jensen's Alpha)
 */
export function calculateAlpha(
  portfolioReturn: number,
  benchmarkReturn: number,
  beta: number,
  riskFreeRate: number = 10.5
): number {
  return portfolioReturn - (riskFreeRate + beta * (benchmarkReturn - riskFreeRate));
}

/**
 * Calculate Information Ratio
 */
export function calculateInformationRatio(
  portfolioReturns: number[],
  benchmarkReturns: number[]
): number {
  const minLength = Math.min(portfolioReturns.length, benchmarkReturns.length);
  const activeReturns = [];
  
  for (let i = 0; i < minLength; i++) {
    activeReturns.push(portfolioReturns[i] - benchmarkReturns[i]);
  }
  
  const meanActiveReturn = activeReturns.reduce((sum, r) => sum + r, 0) / activeReturns.length;
  const trackingError = calculateVolatility(activeReturns) / 100;
  
  return trackingError === 0 ? 0 : meanActiveReturn / trackingError;
}

/**
 * Calculate Calmar Ratio
 */
export function calculateCalmarRatio(annualizedReturn: number, maxDrawdown: number): number {
  return maxDrawdown === 0 ? 0 : annualizedReturn / Math.abs(maxDrawdown);
}

/**
 * Generate comprehensive portfolio metrics
 */
export function calculatePortfolioMetrics(
  returns: number[],
  prices: number[],
  benchmarkReturns?: number[],
  years: number = 3
): PortfolioMetrics {
  const totalReturn = ((prices[prices.length - 1] / prices[0]) - 1) * 100;
  const annualizedReturn = calculateAnnualizedReturn(totalReturn, years);
  const volatility = calculateVolatility(returns);
  const sharpeRatio = calculateSharpeRatio(annualizedReturn, volatility);
  const sortinoRatio = calculateSortinoRatio(returns);
  const maxDrawdown = calculateMaxDrawdown(prices);
  const var95 = calculateVaR(returns);
  const expectedShortfall = calculateExpectedShortfall(returns);
  const calmarRatio = calculateCalmarRatio(annualizedReturn, maxDrawdown);
  
  let beta = 1;
  let alpha = 0;
  let informationRatio = 0;
  
  if (benchmarkReturns) {
    beta = calculateBeta(returns, benchmarkReturns);
    const benchmarkTotalReturn = calculateAnnualizedReturn(
      ((benchmarkReturns[benchmarkReturns.length - 1] / benchmarkReturns[0]) - 1) * 100,
      years
    );
    alpha = calculateAlpha(annualizedReturn, benchmarkTotalReturn, beta);
    informationRatio = calculateInformationRatio(returns, benchmarkReturns);
  }
  
  return {
    totalReturn,
    annualizedReturn,
    volatility,
    sharpeRatio,
    sortinoRatio,
    maxDrawdown,
    informationRatio,
    calmarRatio,
    var95,
    expectedShortfall,
    beta,
    alpha
  };
}

/**
 * Calculate correlation between two return series
 */
export function calculateCorrelation(returns1: number[], returns2: number[]): number {
  const minLength = Math.min(returns1.length, returns2.length);
  const r1 = returns1.slice(0, minLength);
  const r2 = returns2.slice(0, minLength);
  
  const mean1 = r1.reduce((sum, r) => sum + r, 0) / r1.length;
  const mean2 = r2.reduce((sum, r) => sum + r, 0) / r2.length;
  
  let numerator = 0;
  let sum1Sq = 0;
  let sum2Sq = 0;
  
  for (let i = 0; i < minLength; i++) {
    const diff1 = r1[i] - mean1;
    const diff2 = r2[i] - mean2;
    
    numerator += diff1 * diff2;
    sum1Sq += diff1 * diff1;
    sum2Sq += diff2 * diff2;
  }
  
  const denominator = Math.sqrt(sum1Sq * sum2Sq);
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Calculate portfolio weights optimization bounds
 */
export function calculateRebalancingBounds(
  currentWeights: number[],
  targetWeights: number[],
  tolerance: number = 0.05
): Array<{ symbol: string; current: number; target: number; needsRebalancing: boolean }> {
  return currentWeights.map((current, index) => ({
    symbol: `Asset${index + 1}`,
    current,
    target: targetWeights[index],
    needsRebalancing: Math.abs(current - targetWeights[index]) > tolerance
  }));
}

/**
 * Mock data generators for development
 */
export function generateMockReturns(days: number, annualVol: number = 0.2, drift: number = 0.1): number[] {
  const returns = [];
  const dailyVol = annualVol / Math.sqrt(252);
  const dailyDrift = drift / 252;
  
  for (let i = 0; i < days; i++) {
    const randomReturn = (Math.random() - 0.5) * 2 * dailyVol + dailyDrift;
    returns.push(randomReturn);
  }
  
  return returns;
}

export function generateMockPrices(returns: number[], startPrice: number = 100): number[] {
  const prices = [startPrice];
  
  for (let i = 0; i < returns.length; i++) {
    const newPrice = prices[prices.length - 1] * (1 + returns[i]);
    prices.push(newPrice);
  }
  
  return prices;
}