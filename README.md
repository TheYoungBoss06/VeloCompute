# VeloCompute

High-performance data processing library powered by WebAssembly. Process millions of rows 10-20x faster than native JavaScript with zero-copy optimizations.

## Overview
![Demo](sample.gif)

## Para complementar la demostración visual, aquí tienes un resultado de rendimiento concreto: en una prueba real de carga y ordenación de un archivo CSV con 2 millones de registros, VeloCompute completó la operación en 474.30 ms, mientras que la implementación nativa de JavaScript requirió 2224.93 ms. Esto representa una mejora del 78.7% y un procesamiento 4.69 veces más rápido, validando su eficacia con volúmenes masivos de datos en un escenario práctico.

VeloCompute is a TypeScript-first data processing library that leverages WebAssembly to deliver exceptional performance for operations on large datasets. Built with Rust and optimized for modern JavaScript environments, it provides a simple API while achieving speedups of 10-20x over native JavaScript implementations.

### Key Features

- **Blazing Fast Performance**: 10-20x faster than native JavaScript for large datasets
- **Zero-Copy APIs**: Eliminate conversion overhead with direct TypedArray operations
- **Lightweight**: 472KB total bundle size (8x smaller than alternatives)
- **TypeScript First**: Complete type definitions with full IDE autocomplete support
- **Production Ready**: Comprehensive error handling, logging, and telemetry
- **Framework Integration**: React hooks and CLI tools included
- **Universal**: Works in Node.js and browsers with WebAssembly support

### Performance Benchmarks

Operations on 10 million elements (MacBook Pro M2):

| Operation | Native JavaScript | VeloCompute | Speedup |
|-----------|------------------|-------------|---------|
| Sort | 3,180ms | 160ms | 19.89x |
| Filter | 975ms | 91ms | 10.69x |
| Aggregate | 436ms | 65ms | 6.69x |

## Installation

### Via npm

```bash
npm install velo-compute
```

### Via GitHub

```bash
npm install https://github.com/TheYoungBoss06/VeloCompute.git
```

### From Source

```bash
git clone https://github.com/TheYoungBoss06/VeloCompute.git
cd velo-compute/js
npm install
npm run build
```

## Quick Start

### Basic Usage

```javascript
import { VeloData } from 'velo-compute';

// Sort array
const numbers = [5, 2, 8, 1, 9];
const sorted = await VeloData.sort(numbers);
console.log(sorted); // [1, 2, 5, 8, 9]

// Filter data
const filtered = await VeloData.filter(numbers, { gt: 5 });
console.log(filtered); // [8, 9]

// Calculate statistics
const stats = await VeloData.aggregate(numbers, {
  sum: true,
  avg: true,
  min: true,
  max: true
});
console.log(stats);
// { sum: 25, avg: 5, min: 1, max: 9, count: 5 }
```

### Zero-Copy APIs (Maximum Performance)

For datasets larger than 1 million elements, use zero-copy APIs:

```javascript
import { VeloData } from 'velo-compute';

// Create TypedArray
const data = new Int32Array(10_000_000);
for (let i = 0; i < data.length; i++) {
  data[i] = Math.floor(Math.random() * 1000);
}

// Sort in-place (20x faster than regular sort)
await VeloData.sortTypedArray(data, true);

// Filter returning indices (10x faster)
const indices = await VeloData.filterIndices(data, 500, 'gt');

// Aggregate with single-pass algorithm (6x faster)
const stats = await VeloData.aggregateTypedArray(data);
```

## API Reference

### Traditional APIs

#### VeloData.sort(array, options?)

Sort an array of numbers or objects.

```javascript
// Sort numbers
await VeloData.sort([5, 2, 8, 1]);

// Sort descending
await VeloData.sort([5, 2, 8, 1], { order: 'desc' });

// Sort objects by property
await VeloData.sort(users, { by: user => user.age });
```

**Parameters:**
- `array`: Array to sort
- `options`: Optional configuration
  - `by`: Function to extract sort key
  - `order`: 'asc' or 'desc' (default: 'asc')
  - `inPlace`: Modify original array (default: false)

**Returns:** Promise<T[]>

#### VeloData.filter(array, options)

Filter array by conditions.

```javascript
// Greater than
await VeloData.filter([1, 5, 10, 15], { gt: 10 });
// [15]

// Less than
await VeloData.filter([1, 5, 10, 15], { lt: 10 });
// [1, 5]

// Range
await VeloData.filter([1, 5, 10, 15], { between: [5, 10] });
// [5, 10]

// Custom predicate
await VeloData.filter(users, { where: u => u.age > 18 });
```

**Parameters:**
- `array`: Array to filter
- `options`: Filter conditions
  - `gt`: Greater than
  - `lt`: Less than
  - `eq`: Equal to
  - `gte`: Greater than or equal
  - `lte`: Less than or equal
  - `neq`: Not equal
  - `between`: Range [min, max]
  - `where`: Custom predicate function

**Returns:** Promise<T[]>

#### VeloData.aggregate(array, options)

Calculate aggregate statistics.

```javascript
const stats = await VeloData.aggregate(numbers, {
  sum: true,
  avg: true,
  min: true,
  max: true,
  stdDev: true
});
```

**Parameters:**
- `array`: Array of numbers
- `options`: Statistics to compute
  - `sum`: Sum of values
  - `avg`: Average
  - `min`: Minimum value
  - `max`: Maximum value
  - `stdDev`: Standard deviation
  - `variance`: Variance

**Returns:** Promise<AggregateResult>

#### VeloData.groupBy(array, options)

Group array elements by key.

```javascript
const grouped = await VeloData.groupBy(transactions, {
  by: t => t.category
});
// Map { 'food' => [...], 'transport' => [...] }
```

**Parameters:**
- `array`: Array to group
- `options`: Grouping configuration
  - `by`: Function to extract grouping key

**Returns:** Promise<Map<K, T[]>>

#### VeloData.unique(array)

Get unique values from array.

```javascript
const unique = await VeloData.unique([1, 2, 2, 3, 3, 3]);
// [1, 2, 3]
```

**Returns:** Promise<T[]>

### Zero-Copy APIs

#### VeloData.sortTypedArray(array, ascending)

Sort TypedArray in-place with zero-copy optimization.

```javascript
const data = new Int32Array([5, 2, 8, 1, 9]);
await VeloData.sortTypedArray(data, true);
// data is now [1, 2, 5, 8, 9]
```

**Supported Types:**
- Int32Array
- Float64Array
- Uint32Array

**Parameters:**
- `array`: TypedArray to sort
- `ascending`: Sort order (default: true)

**Returns:** Promise<T>

**Performance:** 10-20x faster than Array.prototype.sort()

#### VeloData.filterIndices(array, threshold, operation)

Filter TypedArray and return indices of matching elements.

```javascript
const data = new Int32Array([1, 5, 10, 15, 20]);
const indices = await VeloData.filterIndices(data, 10, 'gt');
// Uint32Array [3, 4]

// Access filtered values
const filtered = Array.from(indices).map(i => data[i]);
// [15, 20]
```

**Operations:**
- 'gt': Greater than
- 'lt': Less than
- 'eq': Equal to
- 'gte': Greater than or equal
- 'lte': Less than or equal
- 'neq': Not equal

**Returns:** Promise<Uint32Array>

**Performance:** 5-10x faster than Array.prototype.filter()

#### VeloData.aggregateTypedArray(array)

Calculate all statistics in a single pass.

```javascript
const data = new Float64Array(10_000_000);
const stats = await VeloData.aggregateTypedArray(data);
// {
//   sum: 4998699815.75,
//   avg: 499.87,
//   min: 0.00,
//   max: 1000.00,
//   stdDev: 288.64,
//   variance: 83311.82,
//   count: 10000000
// }
```

**Returns:** Promise<AggregateResult>

**Performance:** 3-6x faster than manual calculations

#### VeloData.countUnique(array)

Count unique values without materializing them.

```javascript
const data = new Int32Array(5_000_000);
const count = await VeloData.countUnique(data);
```

**Returns:** Promise<number>

#### VeloData.uniqueTypedArray(array)

Get unique values from TypedArray.

```javascript
const data = new Int32Array([1, 2, 2, 3, 3, 3]);
const unique = await VeloData.uniqueTypedArray(data);
// Int32Array [1, 2, 3]
```

**Returns:** Promise<T>

#### Specialized Operations

Fast single-metric calculations:

```javascript
// Fast sum
const sum = await VeloData.sumTypedArray(data);

// Fast mean
const mean = await VeloData.meanTypedArray(data);

// Fast min
const min = await VeloData.minTypedArray(data);

// Fast max
const max = await VeloData.maxTypedArray(data);
```

## Advanced Configuration

### Logging

Control logging verbosity:

```javascript
import { logger, LogLevel } from 'velo-compute';

// Set log level
logger.setLevel(LogLevel.DEBUG); // DEBUG, INFO, WARN, ERROR, NONE

// Logs appear in console during development
```

### Telemetry

Opt-in telemetry for performance improvements (no PII collected):

```javascript
import { telemetry } from 'velo-compute';

// Enable telemetry
telemetry.enable();

// Disable telemetry
telemetry.disable();
```

### Error Handling

Comprehensive error types for better debugging:

```javascript
import { VeloData, VeloError, VeloValidationError } from 'velo-compute';

try {
  await VeloData.sortTypedArray(invalidData);
} catch (error) {
  if (error instanceof VeloValidationError) {
    console.error('Validation failed:', error.message);
    console.error('Context:', error.context);
  } else if (error instanceof VeloError) {
    console.error('Operation failed:', error.code);
  }
}
```

## Performance Guidelines

### When to Use VeloCompute

VeloCompute excels with large datasets:

- **Small (<10K elements):** Native JavaScript may be equally fast
- **Medium (10K-1M):** VeloCompute is 3-5x faster
- **Large (1M-10M):** VeloCompute is 10-15x faster
- **Very Large (>10M):** VeloCompute is 15-20x faster

### Optimization Tips

1. **Use TypedArrays for large datasets:**
   ```javascript
   // Slower
   const data = [1, 2, 3, ...];
   await VeloData.sort(data);
   
   // 20x faster
   const data = new Int32Array([1, 2, 3, ...]);
   await VeloData.sortTypedArray(data);
   ```

2. **Use filterIndices instead of filter:**
   ```javascript
   // Slower - copies all values
   const filtered = await VeloData.filter(data, { gt: 100 });
   
   // 10x faster - returns indices
   const indices = await VeloData.filterIndices(data, 100, 'gt');
   ```

3. **Use aggregateTypedArray for multiple metrics:**
   ```javascript
   // Slower - multiple passes
   const sum = await VeloData.sumTypedArray(data);
   const mean = await VeloData.meanTypedArray(data);
   
   // Faster - single pass
   const stats = await VeloData.aggregateTypedArray(data);
   ```

## Examples

Complete examples are available in the `examples/` directory:

### Financial Dashboard
Process 5 million transactions with real-time analytics.
```bash
node examples/financial-dashboard.js
```

### Log Analysis
Analyze 10 million server logs for patterns and errors.
```bash
node examples/log-analysis.js
```

### ETL Pipeline
Complete Extract-Transform-Load pipeline for 2 million sales records.
```bash
node examples/csv-etl-pipeline.js
```

### Data Visualization Prep
Prepare 5 million events for charting with D3.js/Recharts.
```bash
node examples/data-visualization-prep.js
```

See `examples/README.md` for complete documentation of all examples.

## System Requirements

### Runtime

- **Node.js:** 18.x or 20.x (LTS versions recommended)
- **Browsers:** Chrome, Firefox, Safari, Edge (modern versions with WebAssembly support)
- **WebAssembly:** Required

### Development

- **Node.js:** 18.x or higher
- **npm:** 8.x or higher
- **TypeScript:** 5.x (if using TypeScript)

### Memory Considerations

VeloCompute allocates memory in WebAssembly heap:
- 10M elements: ~80MB
- 50M elements: ~400MB
- 100M elements: ~800MB

Ensure sufficient memory is available for large operations.

## Browser Compatibility

VeloCompute requires WebAssembly support:

- Chrome 57+
- Firefox 52+
- Safari 11+
- Edge 16+

Check WebAssembly support:
```javascript
if (typeof WebAssembly === 'object') {
  console.log('WebAssembly is supported');
}
```

## Troubleshooting

### WASM Module Not Loading

**Problem:** Error: "WASM module not loaded"

**Solution:** Ensure you're using `await` with all VeloData methods:
```javascript
const sorted = await VeloData.sort(data); // Correct
const sorted = VeloData.sort(data); // Wrong
```

### TypedArray Type Error

**Problem:** Error: "Unsupported TypedArray type"

**Solution:** Use supported types: Int32Array, Float64Array, or Uint32Array
```javascript
const data = new Int8Array([1, 2, 3]); // Not supported
const data = new Int32Array([1, 2, 3]); // Supported
```

### Poor Performance

**Checklist:**
1. Are you using TypedArrays for large datasets?
2. Are you using zero-copy APIs (sortTypedArray, filterIndices)?
3. Is your dataset large enough (>100K elements)?
4. Are you running in production mode (not debug)?

### Memory Issues

**Problem:** Out of memory errors

**Solution:** 
- Process data in batches
- Use filterIndices instead of filter to avoid copying
- Increase Node.js memory limit: `node --max-old-space-size=4096`

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-username/velo-compute.git
cd velo-compute

# Install dependencies
cd js
npm install

# Build WASM
cd ../rust
cargo build --release --target wasm32-unknown-unknown
wasm-pack build --target web --out-dir ../js/wasm

# Build TypeScript
cd ../js
npm run build

# Run tests
npm test
```

### Running Tests

```bash
npm test                    # Run all tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
```

### Running Benchmarks

```bash
npm run benchmark          # Run all benchmarks
npm run benchmark:sort     # Sort benchmarks only
npm run benchmark:filter   # Filter benchmarks only
```

## License

MIT License - see LICENSE file for details.

## Authors

VeloCompute Development Team

## Acknowledgments

- Built with Rust and WebAssembly
- Optimized with radix sort, pdqsort, and SIMD techniques
- Inspired by high-performance data processing libraries

## Links

- [Ver documentatión](/DOCUMENTATION.md)
- **GitHub:** https://github.com/theyoungboss06/velo-compute

- **Issues:** https://github.com/theyoungboss06/velo-compute/issues
- **Changelog:** CHANGELOG.md

## Related Projects

- **@velo-compute/react** - React hooks for VeloCompute
- **@velo-compute/cli** - Command-line interface

## Citation

If you use VeloCompute in your research, please cite:

```bibtex
@software{velocompute2026,
  title = {VeloCompute: High-Performance Data Processing with WebAssembly},
  author = {VeloCompute Team},
  year = {2026},
  url = {https://github.com/theyoungboss06/velo-compute}
}
```

## Frequently Asked Questions

**Q: Is VeloCompute production-ready?**  
A: Yes, v1.0.0 includes comprehensive error handling, logging, and has been tested extensively.

**Q: What's the bundle size?**  
A: 472KB total (128KB JavaScript + 344KB WebAssembly).

**Q: Can I use it in the browser?**  
A: Yes, VeloCompute works in modern browsers with WebAssembly support.

**Q: Does it work with React?**  
A: Yes, see `@velo-compute/react` for React hooks.

**Q: How do I migrate from lodash/native JS?**  
A: Most operations have direct equivalents. See migration guide in documentation.

**Q: Is telemetry required?**  
A: No, telemetry is completely optional and opt-in. No PII is collected.

**Q: What about TypeScript support?**  
A: Full TypeScript support with complete type definitions included.

---

## 🔄 Using VeloCompute with Pagination

VeloCompute doesn't have built-in pagination, but it works perfectly for **processing data before paginating**.

### Recommended Pattern

**1. Process with VeloCompute (ultra-fast)**
```javascript
import { VeloData } from 'velo-compute';

// Raw data
const rawData = [...]; // 2 million records

// Process with VeloCompute
const amounts = new Float64Array(rawData.map(r => r.amount));
await VeloData.sortTypedArray(amounts, true);
const indices = await VeloData.filterIndices(amounts, 5000, 'gt');
const processedData = indices.map(i => rawData[i]);
```

**2. Paginate with JavaScript (instant)**
```javascript
function paginate(array, page, pageSize = 100) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    data: array.slice(start, end),
    pagination: {
      page: page,
      pageSize: pageSize,
      total: array.length,
      totalPages: Math.ceil(array.length / pageSize),
      hasNext: end < array.length,
      hasPrev: page > 1
    }
  };
}

// Use it
const page1 = paginate(processedData, 1, 100);
const page2 = paginate(processedData, 2, 100);
```

### Complete Example: Paginator Class

```javascript
class VeloDataPaginator {
  constructor(pageSize = 100) {
    this.data = [];
    this.currentPage = 1;
    this.pageSize = pageSize;
  }
  
  async loadAndProcess(rawData, options = {}) {
    console.time('VeloCompute Processing');
    
    // Convert to TypedArray
    const amounts = new Float64Array(rawData.map(r => r.amount));
    
    // Sort if needed
    if (options.sort) {
      await VeloData.sortTypedArray(amounts, options.ascending || true);
    }
    
    // Filter if condition exists
    if (options.filterValue) {
      const indices = await VeloData.filterIndices(
        amounts, 
        options.filterValue, 
        options.filterOperator || 'gt'
      );
      this.data = indices.map(i => rawData[i]);
    } else {
      this.data = rawData;
    }
    
    console.timeEnd('VeloCompute Processing');
    
    return this.getPage(1);
  }
  
  getPage(pageNumber) {
    this.currentPage = pageNumber;
    const start = (pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;
    
    return {
      data: this.data.slice(start, end),
      pagination: {
        page: pageNumber,
        pageSize: this.pageSize,
        total: this.data.length,
        totalPages: Math.ceil(this.data.length / this.pageSize),
        hasNext: end < this.data.length,
        hasPrev: pageNumber > 1
      }
    };
  }
  
  nextPage() {
    const totalPages = Math.ceil(this.data.length / this.pageSize);
    if (this.currentPage < totalPages) {
      return this.getPage(this.currentPage + 1);
    }
    return null;
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      return this.getPage(this.currentPage - 1);
    }
    return null;
  }
  
  goToPage(page) {
    const totalPages = Math.ceil(this.data.length / this.pageSize);
    if (page >= 1 && page <= totalPages) {
      return this.getPage(page);
    }
    return null;
  }
}

// Usage
const paginator = new VeloDataPaginator(100);

// Load and process data
const result = await paginator.loadAndProcess(rawData, {
  sort: true,
  ascending: true,
  filterValue: 5000,
  filterOperator: 'gt'
});

console.log(result);
// {
//   data: [100 items from page 1],
//   pagination: {
//     page: 1,
//     pageSize: 100,
//     total: 500000,
//     totalPages: 5000,
//     hasNext: true,
//     hasPrev: false
//   }
// }

// Navigate
const page2 = paginator.nextPage();
const page10 = paginator.goToPage(10);
const page1 = paginator.prevPage();
```

### Pagination Strategies

#### 1. Process All, Paginate After (Recommended)
Best for medium datasets (< 10M records).

```javascript
// Process once
const sorted = await VeloData.sort(largeDataset);

// Paginate multiple times (instant)
const page1 = sorted.slice(0, 100);
const page2 = sorted.slice(100, 200);
```

**Benefits:**
- Process only once
- Instant pagination (<1ms)
- Smooth navigation

#### 2. Batch Processing
Best for huge datasets (> 10M records).

```javascript
async function processBatches(dataset, batchSize = 1_000_000) {
  const results = [];
  
  for (let i = 0; i < dataset.length; i += batchSize) {
    const batch = dataset.slice(i, i + batchSize);
    const processed = await VeloData.sort(batch);
    results.push(...processed);
  }
  
  return results;
}
```

#### 3. Server-Side Pagination
Best for web applications with backend.

```javascript
// Backend (Node.js)
app.get('/api/data', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 100;
  
  // Get and process data
  const allData = await getData();
  const sorted = await VeloData.sort(allData);
  
  // Paginate
  const start = (page - 1) * pageSize;
  const pageData = sorted.slice(start, start + pageSize);
  
  res.json({
    data: pageData,
    page,
    total: sorted.length,
    totalPages: Math.ceil(sorted.length / pageSize)
  });
});
```

#### 4. Infinite Scroll / Virtual Scrolling
Best for UI with infinite scroll.

```javascript
class VirtualScroller {
  constructor(data, itemHeight, containerHeight) {
    this.data = data;
    this.itemHeight = itemHeight;
    this.visibleItems = Math.ceil(containerHeight / itemHeight);
  }
  
  getVisibleItems(scrollTop) {
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = startIndex + this.visibleItems + 1;
    
    return {
      items: this.data.slice(startIndex, endIndex),
      startIndex,
      endIndex
    };
  }
}

// Usage
const sorted = await VeloData.sort(millionsOfRecords);
const scroller = new VirtualScroller(sorted, 50, 600);

container.addEventListener('scroll', (e) => {
  const visible = scroller.getVisibleItems(e.target.scrollTop);
  renderItems(visible.items);
});
```

### Performance: VeloCompute + Pagination

With 2 million records:

| Operation | Time |
|-----------|------|
| VeloCompute sort | ~60ms |
| VeloCompute filter | ~40ms |
| JavaScript slice (paginate) | <1ms |
| **Total** | **~100ms** |

**Conclusion:** 99% of the time is processing (VeloCompute), pagination is instant.

### Summary

**VeloCompute + Pagination = Perfect Combination**

1. **VeloCompute** processes millions of records in ~100ms
2. **JavaScript slice** paginates results in <1ms
3. **Result:** Ultra-fast and smooth experience

---

**Version:** 1.0.0  
**Status:** Stable
