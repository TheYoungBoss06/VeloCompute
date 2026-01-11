/**
 * Example: Financial Market Data Analysis
 * 
 * Use case: Analyze tick data, calculate indicators, find patterns
 * Performance: 3-6x faster for large historical datasets
 */

import { VeloData } from 'velo-compute';

/**
 * Generate simulated market tick data
 */
function generateTickData(count) {
  const ticks = new Float64Array(count);
  let price = 100;
  
  for (let i = 0; i < count; i++) {
    // Random walk with drift
    price += (Math.random() - 0.48) * 0.5;
    ticks[i] = Math.max(50, Math.min(150, price));
  }
  
  return ticks;
}

/**
 * Calculate Simple Moving Average (SMA)
 */
async function calculateSMA(prices, period) {
  const sma = new Float64Array(prices.length - period + 1);
  
  for (let i = 0; i <= prices.length - period; i++) {
    const window = prices.subarray(i, i + period);
    const stats = await VeloData.aggregateTyped(window, { avg: true });
    sma[i] = stats.avg;
  }
  
  return sma;
}

/**
 * Find trading signals (price crosses above/below SMA)
 */
async function findTradingSignals(prices, sma) {
  const signals = [];
  
  for (let i = 1; i < sma.length; i++) {
    const prevPrice = prices[i - 1];
    const currPrice = prices[i];
    const prevSMA = sma[i - 1];
    const currSMA = sma[i];
    
    // Bullish crossover
    if (prevPrice < prevSMA && currPrice > currSMA) {
      signals.push({ index: i, type: 'BUY', price: currPrice });
    }
    // Bearish crossover
    else if (prevPrice > prevSMA && currPrice < currSMA) {
      signals.push({ index: i, type: 'SELL', price: currPrice });
    }
  }
  
  return signals;
}

async function runFinancialAnalysis() {
  console.log('=== Financial Market Analysis ===\n');
  
  // Generate 10M ticks (typical day of high-frequency data)
  console.log('Generating market data (10M ticks)...');
  const tickData = generateTickData(10_000_000);
  console.log(`Generated ${tickData.length.toLocaleString()} ticks\n`);
  
  // ===== ANALYSIS 1: Market Statistics =====
  console.log('ANALYSIS 1: Daily market statistics');
  
  let start = performance.now();
  // Native JS
  let sum = 0, min = Infinity, max = -Infinity;
  for (let i = 0; i < tickData.length; i++) {
    const p = tickData[i];
    sum += p;
    if (p < min) min = p;
    if (p > max) max = p;
  }
  const nativeAvg = sum / tickData.length;
  const nativeTime = performance.now() - start;
  
  start = performance.now();
  // VeloCompute
  const veloStats = await VeloData.aggregateTyped(tickData, {
    avg: true,
    min: true,
    max: true,
    stdDev: true
  });
  const veloTime = performance.now() - start;
  
  console.log(`  Native JS: ${nativeTime.toFixed(0)}ms`);
  console.log(`  VeloCompute: ${veloTime.toFixed(0)}ms`);
  console.log(`  Speedup: ${(nativeTime / veloTime).toFixed(2)}x`);
  console.log(`\n  Daily Stats:`);
  console.log(`    Open: $${tickData[0].toFixed(2)}`);
  console.log(`    Close: $${tickData[tickData.length - 1].toFixed(2)}`);
  console.log(`    High: $${veloStats.max.toFixed(2)}`);
  console.log(`    Low: $${veloStats.min.toFixed(2)}`);
  console.log(`    Average: $${veloStats.avg.toFixed(2)}`);
  console.log(`    Volatility: $${veloStats.stdDev.toFixed(2)}\n`);
  
  // ===== ANALYSIS 2: Moving Average Calculation =====
  console.log('ANALYSIS 2: Calculate 200-period SMA');
  
  start = performance.now();
  const sma200 = await calculateSMA(tickData, 200);
  const smaTime = performance.now() - start;
  
  console.log(`  Calculation time: ${smaTime.toFixed(0)}ms`);
  console.log(`  SMA points: ${sma200.length.toLocaleString()}`);
  console.log(`  Current SMA: $${sma200[sma200.length - 1].toFixed(2)}\n`);
  
  // ===== ANALYSIS 3: Find Trading Signals =====
  console.log('ANALYSIS 3: Find crossover signals');
  
  start = performance.now();
  const signals = await findTradingSignals(tickData, sma200);
  const signalTime = performance.now() - start;
  
  console.log(`  Detection time: ${signalTime.toFixed(0)}ms`);
  console.log(`  Signals found: ${signals.length}`);
  
  // Show last 5 signals
  console.log(`\n  Last 5 signals:`);
  signals.slice(-5).forEach((sig, i) => {
    console.log(`    ${sig.type} at tick ${sig.index.toLocaleString()}: $${sig.price.toFixed(2)}`);
  });
  
  // ===== ANALYSIS 4: Filter Extreme Moves =====
  console.log('\nANALYSIS 4: Find extreme price moves');
  
  const threshold = veloStats.avg + 2 * veloStats.stdDev;
  
  start = performance.now();
  // Native JS
  const nativeExtremes = Array.from(tickData).filter(p => p > threshold);
  const nativeExtremesTime = performance.now() - start;
  
  start = performance.now();
  // VeloCompute
  const veloExtremes = await VeloData.filterTyped(tickData, { gt: threshold });
  const veloExtremesTime = performance.now() - start;
  
  console.log(`  Native JS: ${nativeExtremesTime.toFixed(0)}ms`);
  console.log(`  VeloCompute: ${veloExtremesTime.toFixed(0)}ms`);
  console.log(`  Speedup: ${(nativeExtremesTime / veloExtremesTime).toFixed(2)}x`);
  console.log(`  Extreme moves: ${veloExtremes.length} (${(veloExtremes.length / tickData.length * 100).toFixed(2)}%)\n`);
  
  // ===== TOTAL ANALYSIS TIME =====
  const totalAnalysisTime = nativeTime + veloTime + smaTime + signalTime + veloExtremesTime;
  
  console.log('TOTAL ANALYSIS TIME');
  console.log(`  Complete analysis: ${totalAnalysisTime.toFixed(0)}ms`);
  console.log(`  ${(totalAnalysisTime / 1000).toFixed(2)} seconds for 10M ticks`);
  console.log(`\n💡 VeloCompute enables:`);
  console.log(`   - Real-time analysis of high-frequency data`);
  console.log(`   - Interactive backtesting`);
  console.log(`   - Fast indicator calculations`);
  console.log(`   - Responsive trading dashboards\n`);
}

runFinancialAnalysis().catch(console.error);
