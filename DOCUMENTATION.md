Aquí tienes la **traducción completa al inglés**, manteniendo **estructura, formato técnico y ejemplos intactos** (lista para README / documentación profesional):

---

# VeloCompute – Implementation Documentation

## Table of Contents

1. [Installation in Your Project](/README.md)

---

## Installation in Your Project

### Step 1: Install VeloCompute

```bash
# Via npm (recommended)
npm install velo-compute

# Via yarn
yarn add velo-compute

# Via pnpm
pnpm add velo-compute
```

### Step 2: Verify Installation

Create a test file `test-velo.js`:

```javascript
import { VeloData } from 'velo-compute';

async function test() {
  const data = [5, 2, 8, 1, 9];
  const sorted = await VeloData.sort(data);
  console.log('VeloCompute installed correctly:', sorted);
}

test().catch(console.error);
```

Run:

```bash
node test-velo.js
```

If you see `[1, 2, 5, 8, 9]`, the installation was successful.

---

## Initial Configuration

### Node.js Project

#### 1. Configure package.json

Ensure ES module support:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "velo-compute": "^1.0.0"
  }
}
```

#### 2. Import VeloCompute

```javascript
// Full import
import { VeloData } from 'velo-compute';

// Specific imports
import { VeloData, logger, LogLevel } from 'velo-compute';
```

---

### TypeScript Project

#### 1. Configure tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "types": ["node"]
  }
}
```

#### 2. Using with TypeScript

```typescript
import { VeloData } from 'velo-compute';

async function processData(): Promise<number[]> {
  const data: number[] = [5, 2, 8, 1, 9];
  const sorted: number[] = await VeloData.sort(data);
  return sorted;
}
```

---

### Browser Project (HTML + JavaScript)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App with VeloCompute</title>
</head>
<body>
  <h1>Data Processing</h1>
  <div id="result"></div>

  <script type="module">
    import { VeloData } from './node_modules/velo-compute/dist/index.js';
    
    async function processData() {
      const data = [5, 2, 8, 1, 9];
      const sorted = await VeloData.sort(data);
      
      document.getElementById('result').textContent =
        'Sorted data: ' + JSON.stringify(sorted);
    }
    
    processData();
  </script>
</body>
</html>
```

---

## Use Cases by Project Type

### 1. Data Analytics Application

**Scenario:** Dashboard processing millions of records.

**Project Structure:**

```
my-dashboard/
├── src/
│   ├── data/
│   │   └── processor.js       # Use VeloCompute here
│   ├── components/
│   └── utils/
├── package.json
└── index.js
```

**Implementation:**

```javascript
// src/data/processor.js
import { VeloData } from 'velo-compute';

export class DataProcessor {

  async processTransactions(transactions) {
    // 1. Filter valid transactions
    const valid = await VeloData.filter(transactions, {
      where: t => t.amount > 0 && t.date != null
    });

    // 2. Sort by amount
    const sorted = await VeloData.sort(valid, {
      by: t => t.amount,
      order: 'desc'
    });

    // 3. Compute statistics
    const amounts = sorted.map(t => t.amount);
    const stats = await VeloData.aggregate(amounts, {
      sum: true,
      avg: true,
      min: true,
      max: true
    });

    return { sorted, stats };
  }

  async getTopN(data, n = 10) {
    const sorted = await VeloData.sort(data, {
      by: d => d.value,
      order: 'desc'
    });
    return sorted.slice(0, n);
  }
}
```

---

### 2. REST API with Data Processing

**Scenario:** API processing large data volumes.

```javascript
// src/services/data-service.js
import { VeloData } from 'velo-compute';

export class DataService {

  async getTopProducts(sales, limit = 100) {
    const grouped = await VeloData.groupBy(sales, {
      by: sale => sale.productId
    });

    const productTotals = [];
    for (const [productId, productSales] of grouped) {
      const total = productSales.reduce((sum, s) => sum + s.amount, 0);
      productTotals.push({ productId, total, count: productSales.length });
    }

    const sorted = await VeloData.sort(productTotals, {
      by: p => p.total,
      order: 'desc'
    });

    return sorted.slice(0, limit);
  }

  async getSalesStatistics(sales) {
    const amounts = new Float64Array(sales.map(s => s.amount));
    return await VeloData.aggregateTypedArray(amounts);
  }
}
```

---

### 3. Batch Processing Script

```javascript
// process-sales.js
import { VeloData } from 'velo-compute';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

async function processSalesFile(inputFile, outputFile) {
  console.log('Loading file...');

  const fileContent = fs.readFileSync(inputFile, 'utf-8');
  const records = parse(fileContent, { columns: true });

  const cleanRecords = records.filter(r =>
    r.amount && parseFloat(r.amount) > 0
  );

  const amounts = new Float64Array(
    cleanRecords.map(r => parseFloat(r.amount))
  );

  await VeloData.sortTypedArray(amounts, false);
  const stats = await VeloData.aggregateTypedArray(amounts);

  const report = {
    totalRecords: records.length,
    validRecords: cleanRecords.length,
    statistics: {
      total: stats.sum,
      average: stats.avg,
      median: amounts[Math.floor(amounts.length / 2)],
      min: stats.min,
      max: stats.max,
      stdDev: stats.stdDev
    },
    top10: Array.from(amounts.slice(0, 10))
  };

  fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
  console.log('Processing completed!');
}
```

---

## Best Practices

### 1. Use TypedArrays for Large Datasets

```javascript
// BAD
await VeloData.sort(data);

// GOOD (up to 20x faster)
const typed = new Int32Array(data);
await VeloData.sortTypedArray(typed);
```

---

### 2. Reuse TypedArrays

```javascript
const typed = new Int32Array(data);
for (let i = 0; i < 10; i++) {
  await VeloData.sortTypedArray(typed);
}
```

---

### 3. Batch Processing for Huge Datasets

```javascript
async function processBatches(dataset, batchSize = 1_000_000) {
  for (let i = 0; i < dataset.length; i += batchSize) {
    const batch = dataset.slice(i, i + batchSize);
    await VeloData.sort(batch);
  }
}
```

---

## Framework Integration

### React

```javascript
import { useState, useEffect } from 'react';
import { VeloData } from 'velo-compute';

export function useVeloSort(data) {
  const [sorted, setSorted] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    VeloData.sort(data)
      .then(setSorted)
      .finally(() => setLoading(false));
  }, [data]);

  return { sorted, loading };
}
```

---

### Vue.js

```javascript
import { ref, watch } from 'vue';
import { VeloData } from 'velo-compute';

export function useVeloSort(data) {
  const sorted = ref([]);
  watch(data, async () => {
    sorted.value = await VeloData.sort(data.value);
  });
  return { sorted };
}
```

---

## Troubleshooting

### Issue 1: WASM Does Not Load

**Solution:**

```javascript
await VeloData.sort(data);
```

---

### Issue 2: No Performance Improvement

**Tips:**

* Use TypedArrays
* Use zero-copy APIs
* Ensure dataset is large enough (>100K)

---

### Issue 3: Type Errors in TypeScript

```typescript
import { AggregateResult } from 'velo-compute';
```

---

**Version:** 1.0.0