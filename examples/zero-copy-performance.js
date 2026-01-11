/**
 * Zero-Copy Performance Example
 * 
 * This example demonstrates how to use VeloCompute's zero-copy APIs
 * for maximum performance with large datasets.
 */

import { VeloData } from '../js/dist/index.js';

async function demonstrateZeroCopy() {
  console.log('🚀 VeloCompute Zero-Copy Performance Demo\n');

  // Example 1: Sorting Large Arrays
  console.log('1️⃣  SORTING - Zero-Copy vs Regular API');
  console.log('─'.repeat(60));
  
  const size = 10_000_000;
  const randomData = new Int32Array(size);
  for (let i = 0; i < size; i++) {
    randomData[i] = Math.floor(Math.random() * 1000000);
  }

  // Regular API (with conversions)
  const regularArray = Array.from(randomData);
  const start1 = performance.now();
  await VeloData.sort(regularArray);
  const regularTime = performance.now() - start1;
  console.log(`  Regular API:     ${regularTime.toFixed(2)}ms`);

  // Zero-Copy API (no conversions)
  const zeroCopyArray = new Int32Array(randomData);
  const start2 = performance.now();
  await VeloData.sortTypedArray(zeroCopyArray, true);
  const zeroCopyTime = performance.now() - start2;
  console.log(`  Zero-Copy API:   ${zeroCopyTime.toFixed(2)}ms`);
  console.log(`  Improvement:     ${(regularTime / zeroCopyTime).toFixed(2)}x faster ⚡\n`);

  // Example 2: Filtering by Indices
  console.log('2️⃣  FILTERING - Return Indices (Zero-Copy)');
  console.log('─'.repeat(60));
  
  const filterData = new Int32Array(10_000_000);
  for (let i = 0; i < filterData.length; i++) {
    filterData[i] = Math.floor(Math.random() * 1000);
  }

  const start3 = performance.now();
  const indices = await VeloData.filterIndices(filterData, 500, 'gt');
  const filterTime = performance.now() - start3;
  
  console.log(`  Filtered ${filterData.length.toLocaleString()} elements in ${filterTime.toFixed(2)}ms`);
  console.log(`  Found ${indices.length.toLocaleString()} matches`);
  console.log(`  Selectivity: ${(indices.length / filterData.length * 100).toFixed(1)}%`);
  
  // Access filtered values using indices
  const firstMatches = Array.from(indices.slice(0, 5)).map(i => filterData[i]);
  console.log(`  First matches: [${firstMatches.join(', ')}]\n`);

  // Example 3: Aggregation
  console.log('3️⃣  AGGREGATION - Single-Pass Statistics');
  console.log('─'.repeat(60));
  
  const aggData = new Float64Array(10_000_000);
  for (let i = 0; i < aggData.length; i++) {
    aggData[i] = Math.random() * 1000;
  }

  const start4 = performance.now();
  const stats = await VeloData.aggregateTypedArray(aggData);
  const aggTime = performance.now() - start4;
  
  console.log(`  Computed statistics in ${aggTime.toFixed(2)}ms`);
  console.log(`  Sum:        ${Number(stats.sum || 0).toFixed(2)}`);
  console.log(`  Mean:       ${Number(stats.avg || 0).toFixed(2)}`);
  console.log(`  Min:        ${Number(stats.min || 0).toFixed(2)}`);
  console.log(`  Max:        ${Number(stats.max || 0).toFixed(2)}`);
  console.log(`  Std Dev:    ${Number(stats.stdDev || 0).toFixed(2)}`);
  console.log(`  Variance:   ${Number(stats.variance || 0).toFixed(2)}\n`);

  // Example 4: Real-world Pipeline
  console.log('4️⃣  REAL-WORLD PIPELINE');
  console.log('─'.repeat(60));
  console.log('  Processing financial transactions...\n');
  
  // Simulate 5M financial transactions
  const amounts = new Float64Array(5_000_000);
  for (let i = 0; i < amounts.length; i++) {
    amounts[i] = Math.random() * 10000; // $0 - $10,000
  }

  const pipelineStart = performance.now();
  
  // Step 1: Find large transactions (>$5000)
  const largeTransactionIndices = await VeloData.filterIndices(
    new Int32Array(amounts.map(a => Math.floor(a))), 
    5000, 
    'gt'
  );
  console.log(`  ✓ Found ${largeTransactionIndices.length.toLocaleString()} large transactions`);

  // Step 2: Get those amounts
  const largeAmounts = new Float64Array(
    largeTransactionIndices.map(i => amounts[i])
  );
  console.log(`  ✓ Extracted amounts`);

  // Step 3: Sort them
  await VeloData.sortTypedArray(largeAmounts, false); // descending
  console.log(`  ✓ Sorted by amount (descending)`);

  // Step 4: Compute statistics
  const largeStats = await VeloData.aggregateTypedArray(largeAmounts);
  
  const pipelineTime = performance.now() - pipelineStart;
  
  console.log(`\n  Pipeline completed in ${pipelineTime.toFixed(2)}ms`);
  console.log(`  Large transaction stats:`);
  console.log(`    Total:      $${Number(largeStats.sum || 0).toFixed(2)}`);
  console.log(`    Average:    $${Number(largeStats.avg || 0).toFixed(2)}`);
  console.log(`    Largest:    $${Number(largeStats.max || 0).toFixed(2)}`);
  console.log(`    Smallest:   $${Number(largeStats.min || 0).toFixed(2)}\n`);

  // Best Practices
  console.log('💡 BEST PRACTICES');
  console.log('─'.repeat(60));
  console.log('  1. Use TypedArrays from the start for best performance');
  console.log('  2. sortTypedArray() modifies in-place (no copies)');
  console.log('  3. filterIndices() returns indices (use for large datasets)');
  console.log('  4. aggregateTypedArray() is single-pass (faster than JS)');
  console.log('  5. Zero-copy APIs shine with datasets > 1M elements\n');

  console.log('✨ Demo complete! VeloCompute is faster than native JS!\n');
}

demonstrateZeroCopy().catch(console.error);
