Aquí tienes la **traducción completa al inglés** del README que enviaste, manteniendo estructura, formato y sentido técnico:

---

# VeloCompute Examples

This folder contains complete and fully functional examples of real-world use cases with VeloCompute.

## Available Examples

### 1. Zero-Copy Performance Demo

**File:** `zero-copy-performance.js`
**Dataset Size:** 10M elements
**Execution Time:** ~2 seconds

Demonstrates VeloCompute zero-copy APIs:

* `sortTypedArray()` – In-place sorting
* `filterIndices()` – Filter returning indices
* `aggregateTypedArray()` – Single-pass statistics
* Complete financial transaction pipeline

**Run:**

```bash
node examples/zero-copy-performance.js
```

**Learn:**

* How to use TypedArrays for maximum performance
* Difference between traditional APIs and zero-copy
* 6–20x speedups over native JavaScript

---

### 2. Financial Dashboard

**File:** `financial-dashboard.js`
**Dataset Size:** 5M transactions
**Execution Time:** ~1.5 seconds

Real-time financial dashboard with:

* Top 10 largest transactions
* Statistics by category (groceries, rent, etc.)
* Anomaly detection (transactions > $5000)
* Monthly trend (income vs expenses)
* Top merchants by volume

**Run:**

```bash
node examples/financial-dashboard.js
```

**Learn:**

* Financial transaction analysis
* Anomaly detection
* Multi-dimensional aggregations
* Time period comparison

---

### 3. Log Analysis

**File:** `log-analysis.js`
**Dataset Size:** 10M log entries
**Execution Time:** ~2 seconds

Server log analysis:

* Severity distribution (DEBUG, INFO, WARN, ERROR, FATAL)
* Slowest endpoints (response times)
* Critical errors by service
* HTTP status code distribution
* P99 slowest requests
* Common error patterns

**Run:**

```bash
node examples/log-analysis.js
```

**Learn:**

* Large-scale log processing
* Performance bottleneck identification
* Error analysis and pattern detection
* Percentile metrics (P99)

---

### 4. CSV ETL Pipeline

**File:** `csv-etl-pipeline.js`
**Dataset Size:** 2M sales records
**Execution Time:** ~1.5 seconds

Complete ETL pipeline (Extract, Transform, Load):

* **Extract:** Load sales data
* **Transform:** Cleaning, enrichment, classification
* **Load:** 5 different aggregated reports

Generated reports:

1. Sales by category
2. Sales by region
3. Top 10 products
4. Monthly trend
5. Discount analysis

**Run:**

```bash
node examples/csv-etl-pipeline.js
```

**Output:** Generates `sales-reports.json`

**Learn:**

* Complete ETL pipeline
* Data transformations
* Multiple aggregations
* Exporting results

---

### 5. Data Visualization Preparation

**File:** `data-visualization-prep.js`
**Dataset Size:** 5M web events
**Execution Time:** ~2 seconds

Data preparation for charts (D3.js, Recharts, Chart.js):

1. **Time Series** – Events per hour (168 points)
2. **Histogram** – Load time distribution (10 bins)
3. **Bar Chart** – Device × Browser (12 groups)
4. **Pie Chart** – Geographic distribution (7 countries)
5. **Heatmap** – Usage pattern hour × day (168 cells)
6. **Scatter Plot** – Session vs load time (10K points)

**Run:**

```bash
node examples/data-visualization-prep.js
```

**Learn:**

* Data preparation for visualization
* Binning and histograms
* Sampling for scatter plots
* Multi-dimensional aggregations
* JSON formats for charts

---

### 6. Machine Learning Data Prep

**File:** `machine-learning-prep.js`
**Dataset Size:** 1M customers
**Execution Time:** ~1 second

ML data preparation:

* Exploratory analysis (statistics per feature)
* Outlier detection and removal (IQR method)
* Train/test split
* Feature normalization

**Run:**

```bash
node examples/machine-learning-prep.js
```

**Learn:**

* EDA (Exploratory Data Analysis)
* Outlier detection
* ML preprocessing
* Feature engineering

---

### 7. Financial Analysis (Existing)

**File:** `financial-analysis.js`
**Dataset Size:** Variable

Financial analysis with multiple operations.

---

### 8. Real-time Dashboard (Existing)

**File:** `realtime-dashboard.js`
**Dataset Size:** Variable

Real-time dashboard with live updates.

---

### 9. CSV Processing (Existing)

**File:** `csv-processing.js`
**Dataset Size:** Variable

Basic CSV file processing.

---

## Performance Comparison

| Example             | Dataset | Native JS | VeloCompute | Speedup |
| ------------------- | ------- | --------- | ----------- | ------- |
| Zero-Copy Demo      | 10M     | ~15s      | ~2s         | 7–8x    |
| Financial Dashboard | 5M      | ~20s      | ~1.5s       | 13x     |
| Log Analysis        | 10M     | ~30s      | ~2s         | 15x     |
| CSV ETL             | 2M      | ~15s      | ~1.5s       | 10x     |
| Visualization Prep  | 5M      | ~25s      | ~2s         | 12x     |
| ML Data Prep        | 1M      | ~8s       | ~1s         | 8x      |

**Average: 10–12x faster than native JavaScript**

---

## Requirements

All examples require:

* Node.js 18+ or 20+
* VeloCompute installed (`npm install velo-compute`)
* ES6 module support

---

## How to Run All Examples

```bash
# From the project root
cd examples

# Run one by one
node zero-copy-performance.js
node financial-dashboard.js
node log-analysis.js
node csv-etl-pipeline.js
node data-visualization-prep.js
node machine-learning-prep.js

# Or create a script to run all
for file in *.js; do
  echo "Running $file..."
  node "$file"
  echo ""
done
```

---

## Use Cases by Industry

### Finance

* `financial-dashboard.js` – Transaction analysis
* `csv-etl-pipeline.js` – Sales processing

### DevOps / SRE

* `log-analysis.js` – Server log analysis

### Data Science / ML

* `machine-learning-prep.js` – ML preprocessing
* `data-visualization-prep.js` – Chart preparation

### Business Intelligence

* `financial-dashboard.js` – KPIs and metrics
* `csv-etl-pipeline.js` – Automated reports

### Web Analytics

* `data-visualization-prep.js` – Web event analysis

---

## Customization

Each example can be customized:

1. **Change dataset size:**

   ```javascript
   const numRecords = 1_000_000; // Adjust as needed
   ```

2. **Modify aggregations:**

   ```javascript
   const stats = await VeloData.aggregateTypedArray(data);
   // Use only required metrics
   ```

3. **Adjust filters:**

   ```javascript
   const filtered = await VeloData.filter(data, {
     where: item => item.value > customThreshold
   });
   ```

---

## Performance Tips

To get maximum performance:

1. **Use TypedArrays when possible:**

   ```javascript
   const data = new Float64Array(1_000_000);
   await VeloData.sortTypedArray(data); // Faster
   ```

2. **Use filterIndices instead of filter:**

   ```javascript
   const indices = await VeloData.filterIndices(data, threshold, 'gt');
   // Faster than copying values
   ```

3. **Process in batches for huge datasets:**

   ```javascript
   const batchSize = 1_000_000;
   for (let i = 0; i < data.length; i += batchSize) {
     const batch = data.slice(i, i + batchSize);
     await processBatch(batch);
   }
   ```

---

## Contributing More Examples

If you have an interesting use case:

1. Fork the repository
2. Create your example in `examples/`
3. Follow the format of existing examples
4. Add documentation to this README
5. Create a Pull Request

---

## Support

If you have questions about the examples:

* GitHub Issues: [https://github.com/theyoungboss06/velo-compute/issues](https://github.com/theyoungboss06/velo-compute/issues)
* [DOCUMENTATION](../DOCUMENTATION.md)
* Twitter: @velocompute

---

## License

All examples are released under the same MIT license as VeloCompute.
=