# VeloCompute - Documentation de Implementación

## Tabla de Contenidos

1. [Instalación en tu Proyecto](#instalación-en-tu-proyecto)
2. [Configuración Inicial](#configuración-inicial)
3. [Casos de Uso por Tipo de Proyecto](#casos-de-uso-por-tipo-de-proyecto)
4. [Ejemplos de Implementación](#ejemplos-de-implementación)
5. [Mejores Prácticas](#mejores-prácticas)
6. [Patrones Comunes](#patrones-comunes)
7. [Integración con Frameworks](#integración-con-frameworks)
8. [Troubleshooting](#troubleshooting)

---

## Instalación en tu Proyecto

### Paso 1: Instalar VeloCompute

```bash
# Via npm (recomendado)
npm install velo-compute

# Via yarn
yarn add velo-compute

# Via pnpm
pnpm add velo-compute
```

### Paso 2: Verificar Instalación

Crea un archivo de prueba `test-velo.js`:

```javascript
import { VeloData } from 'velo-compute';

async function test() {
  const data = [5, 2, 8, 1, 9];
  const sorted = await VeloData.sort(data);
  console.log('VeloCompute instalado correctamente:', sorted);
}

test().catch(console.error);
```

Ejecuta:
```bash
node test-velo.js
```

Si ves el resultado `[1, 2, 5, 8, 9]`, la instalación fue exitosa.

---

## Configuración Inicial

### Proyecto Node.js

#### 1. Configurar package.json

Asegúrate de tener soporte para ES modules:

```json
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "velo-compute": "^1.0.0"
  }
}
```

#### 2. Importar VeloCompute

```javascript
// Importación completa
import { VeloData } from 'velo-compute';

// Importaciones específicas
import { VeloData, logger, LogLevel } from 'velo-compute';
```

### Proyecto TypeScript

#### 1. Configurar tsconfig.json

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

#### 2. Usar con TypeScript

```typescript
import { VeloData } from 'velo-compute';

async function processData(): Promise<number[]> {
  const data: number[] = [5, 2, 8, 1, 9];
  const sorted: number[] = await VeloData.sort(data);
  return sorted;
}
```

### Proyecto Browser (HTML + JavaScript)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Mi App con VeloCompute</title>
</head>
<body>
  <h1>Procesamiento de Datos</h1>
  <div id="resultado"></div>

  <script type="module">
    import { VeloData } from './node_modules/velo-compute/dist/index.js';
    
    async function procesarDatos() {
      const datos = [5, 2, 8, 1, 9];
      const ordenados = await VeloData.sort(datos);
      
      document.getElementById('resultado').textContent = 
        'Datos ordenados: ' + JSON.stringify(ordenados);
    }
    
    procesarDatos();
  </script>
</body>
</html>
```

---

## Casos de Uso por Tipo de Proyecto

### 1. Aplicación de Analítica de Datos

**Escenario:** Dashboard que procesa millones de registros.

**Estructura del Proyecto:**
```
mi-dashboard/
├── src/
│   ├── data/
│   │   └── processor.js       # Usar VeloCompute aquí
│   ├── components/
│   └── utils/
├── package.json
└── index.js
```

**Implementación:**

```javascript
// src/data/processor.js
import { VeloData } from 'velo-compute';

export class DataProcessor {
  
  async procesarTransacciones(transacciones) {
    // 1. Filtrar transacciones válidas
    const validas = await VeloData.filter(transacciones, {
      where: t => t.monto > 0 && t.fecha != null
    });

    // 2. Ordenar por monto
    const ordenadas = await VeloData.sort(validas, {
      by: t => t.monto,
      order: 'desc'
    });

    // 3. Calcular estadísticas
    const montos = ordenadas.map(t => t.monto);
    const stats = await VeloData.aggregate(montos, {
      sum: true,
      avg: true,
      min: true,
      max: true
    });

    return { ordenadas, stats };
  }

  async obtenerTopN(datos, n = 10) {
    const ordenados = await VeloData.sort(datos, {
      by: d => d.valor,
      order: 'desc'
    });
    return ordenados.slice(0, n);
  }
}
```

**Uso:**
```javascript
// index.js
import { DataProcessor } from './src/data/processor.js';

const processor = new DataProcessor();
const transacciones = await cargarTransacciones();
const resultado = await processor.procesarTransacciones(transacciones);

console.log('Top 10:', await processor.obtenerTopN(transacciones));
```

### 2. API REST con Procesamiento de Datos

**Escenario:** API que procesa grandes volúmenes de datos.

**Estructura:**
```
mi-api/
├── src/
│   ├── routes/
│   │   └── analytics.js
│   ├── services/
│   │   └── data-service.js    # VeloCompute aquí
│   └── app.js
└── package.json
```

**Implementación:**

```javascript
// src/services/data-service.js
import { VeloData } from 'velo-compute';

export class DataService {
  
  async getTopProducts(sales, limit = 100) {
    // Agrupar por producto
    const grouped = await VeloData.groupBy(sales, {
      by: sale => sale.productId
    });

    // Calcular totales por producto
    const productTotals = [];
    for (const [productId, productSales] of grouped) {
      const total = productSales.reduce((sum, s) => sum + s.amount, 0);
      productTotals.push({ productId, total, count: productSales.length });
    }

    // Ordenar y limitar
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

**Ruta Express:**
```javascript
// src/routes/analytics.js
import express from 'express';
import { DataService } from '../services/data-service.js';

const router = express.Router();
const dataService = new DataService();

router.get('/top-products', async (req, res) => {
  try {
    const sales = await loadSalesData();
    const limit = parseInt(req.query.limit) || 100;
    
    const topProducts = await dataService.getTopProducts(sales, limit);
    
    res.json({
      success: true,
      data: topProducts,
      count: topProducts.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/sales-stats', async (req, res) => {
  try {
    const sales = await loadSalesData();
    const stats = await dataService.getSalesStatistics(sales);
    
    res.json({
      success: true,
      stats: {
        total: stats.sum,
        average: stats.avg,
        min: stats.min,
        max: stats.max,
        stdDev: stats.stdDev
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

### 3. Script de Procesamiento Batch

**Escenario:** Script que procesa archivos CSV grandes.

```javascript
// process-sales.js
import { VeloData } from 'velo-compute';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

async function processSalesFile(inputFile, outputFile) {
  console.log('Cargando archivo...');
  
  // 1. Cargar CSV
  const fileContent = fs.readFileSync(inputFile, 'utf-8');
  const records = parse(fileContent, { columns: true });
  
  console.log(`Procesando ${records.length} registros...`);
  
  // 2. Limpiar datos
  const cleanRecords = records.filter(r => 
    r.amount && parseFloat(r.amount) > 0
  );
  
  // 3. Convertir a TypedArray para máximo rendimiento
  const amounts = new Float64Array(
    cleanRecords.map(r => parseFloat(r.amount))
  );
  
  // 4. Ordenar
  await VeloData.sortTypedArray(amounts, false); // descendente
  
  // 5. Calcular estadísticas
  const stats = await VeloData.aggregateTypedArray(amounts);
  
  // 6. Generar reporte
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
  
  // 7. Guardar resultado
  fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
  
  console.log('Procesamiento completado!');
  console.log(`Total: $${stats.sum.toFixed(2)}`);
  console.log(`Promedio: $${stats.avg.toFixed(2)}`);
}

// Ejecutar
const inputFile = process.argv[2] || 'sales.csv';
const outputFile = process.argv[3] || 'report.json';

processSalesFile(inputFile, outputFile).catch(console.error);
```

**Uso:**
```bash
node process-sales.js datos.csv reporte.json
```

### 4. Aplicación en Tiempo Real

**Escenario:** Monitoreo de métricas en tiempo real.

```javascript
// real-time-monitor.js
import { VeloData } from 'velo-compute';

class RealTimeMonitor {
  constructor(windowSize = 1000) {
    this.windowSize = windowSize;
    this.dataWindow = [];
  }

  addDataPoint(value) {
    this.dataWindow.push(value);
    
    // Mantener solo últimos N puntos
    if (this.dataWindow.length > this.windowSize) {
      this.dataWindow.shift();
    }
  }

  async getCurrentStats() {
    if (this.dataWindow.length === 0) return null;
    
    const data = new Float64Array(this.dataWindow);
    return await VeloData.aggregateTypedArray(data);
  }

  async getTopValues(n = 10) {
    if (this.dataWindow.length === 0) return [];
    
    const sorted = await VeloData.sort([...this.dataWindow], {
      order: 'desc'
    });
    
    return sorted.slice(0, n);
  }

  async detectAnomalies(threshold = 2) {
    if (this.dataWindow.length < 10) return [];
    
    const stats = await this.getCurrentStats();
    const anomalies = [];
    
    for (let i = 0; i < this.dataWindow.length; i++) {
      const value = this.dataWindow[i];
      const zScore = Math.abs((value - stats.avg) / stats.stdDev);
      
      if (zScore > threshold) {
        anomalies.push({ index: i, value, zScore });
      }
    }
    
    return anomalies;
  }
}

// Uso
const monitor = new RealTimeMonitor(1000);

// Simular datos en tiempo real
setInterval(async () => {
  const value = Math.random() * 100;
  monitor.addDataPoint(value);
  
  const stats = await monitor.getCurrentStats();
  console.log('Stats actuales:', stats);
  
  const anomalies = await monitor.detectAnomalies();
  if (anomalies.length > 0) {
    console.log('Anomalías detectadas:', anomalies);
  }
}, 1000);
```

---

## Ejemplos de Implementación

### Ejemplo 1: Sistema de Reportes

```javascript
// report-generator.js
import { VeloData } from 'velo-compute';

class ReportGenerator {
  
  async generateSalesReport(sales) {
    const report = {};
    
    // Por categoría
    const byCategory = await VeloData.groupBy(sales, {
      by: s => s.category
    });
    
    report.categories = {};
    for (const [category, items] of byCategory) {
      const amounts = items.map(i => i.amount);
      const stats = await VeloData.aggregate(amounts, {
        sum: true,
        avg: true,
        count: true
      });
      
      report.categories[category] = {
        total: stats.sum,
        average: stats.avg,
        count: items.length
      };
    }
    
    // Por región
    const byRegion = await VeloData.groupBy(sales, {
      by: s => s.region
    });
    
    report.regions = {};
    for (const [region, items] of byRegion) {
      const total = items.reduce((sum, i) => sum + i.amount, 0);
      report.regions[region] = {
        total,
        count: items.length
      };
    }
    
    // Top 10 ventas
    const sorted = await VeloData.sort(sales, {
      by: s => s.amount,
      order: 'desc'
    });
    report.topSales = sorted.slice(0, 10);
    
    return report;
  }
}

export default ReportGenerator;
```

### Ejemplo 2: Procesador de Logs

```javascript
// log-processor.js
import { VeloData } from 'velo-compute';

class LogProcessor {
  
  async analyzeLogs(logs) {
    // Filtrar por severidad
    const errors = await VeloData.filter(logs, {
      where: log => log.level === 'ERROR' || log.level === 'FATAL'
    });
    
    // Agrupar errores por tipo
    const errorsByType = await VeloData.groupBy(errors, {
      by: e => e.errorType || 'UNKNOWN'
    });
    
    // Calcular response times
    const responseTimes = logs
      .filter(l => l.responseTime)
      .map(l => l.responseTime);
    
    const rtStats = await VeloData.aggregate(responseTimes, {
      avg: true,
      min: true,
      max: true
    });
    
    // Encontrar requests lentas (P95)
    const sorted = await VeloData.sort(responseTimes, {
      order: 'desc'
    });
    const p95Index = Math.floor(responseTimes.length * 0.05);
    const p95Threshold = sorted[p95Index];
    
    const slowRequests = await VeloData.filter(logs, {
      where: log => log.responseTime && log.responseTime >= p95Threshold
    });
    
    return {
      totalLogs: logs.length,
      errors: {
        count: errors.length,
        byType: Array.from(errorsByType.entries()).map(([type, items]) => ({
          type,
          count: items.length
        }))
      },
      performance: {
        avgResponseTime: rtStats.avg,
        minResponseTime: rtStats.min,
        maxResponseTime: rtStats.max,
        p95Threshold,
        slowRequestsCount: slowRequests.length
      }
    };
  }
}

export default LogProcessor;
```

---

## Mejores Prácticas

### 1. Usar TypedArrays para Datos Grandes

```javascript
// MAL - Lento para datasets grandes
async function processLargeArray(data) {
  return await VeloData.sort(data);
}

// BIEN - 20x más rápido
async function processLargeArray(data) {
  const typedData = new Int32Array(data);
  await VeloData.sortTypedArray(typedData);
  return Array.from(typedData);
}
```

### 2. Reutilizar TypedArrays

```javascript
// MAL - Crea nuevos arrays cada vez
async function processMultipleTimes(data) {
  for (let i = 0; i < 10; i++) {
    const typed = new Int32Array(data);
    await VeloData.sortTypedArray(typed);
  }
}

// BIEN - Reutiliza el TypedArray
async function processMultipleTimes(data) {
  const typed = new Int32Array(data);
  for (let i = 0; i < 10; i++) {
    await VeloData.sortTypedArray(typed);
  }
}
```

### 3. Batch Processing para Datasets Muy Grandes

```javascript
async function processBatches(largeDataset, batchSize = 1_000_000) {
  const results = [];
  
  for (let i = 0; i < largeDataset.length; i += batchSize) {
    const batch = largeDataset.slice(i, i + batchSize);
    const processed = await VeloData.sort(batch);
    results.push(...processed);
  }
  
  return results;
}
```

### 4. Manejo de Errores Apropiado

```javascript
import { VeloData, VeloValidationError } from 'velo-compute';

async function safeProcess(data) {
  try {
    // Validar entrada
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid input data');
    }
    
    const result = await VeloData.sort(data);
    return { success: true, data: result };
    
  } catch (error) {
    if (error instanceof VeloValidationError) {
      console.error('Validation error:', error.message);
      return { success: false, error: 'Invalid data format' };
    }
    
    console.error('Processing error:', error);
    return { success: false, error: error.message };
  }
}
```

### 5. Logging en Producción

```javascript
import { VeloData, logger, LogLevel } from 'velo-compute';

// Configurar en desarrollo
if (process.env.NODE_ENV === 'development') {
  logger.setLevel(LogLevel.DEBUG);
} else {
  logger.setLevel(LogLevel.WARN);
}

async function processWithLogging(data) {
  logger.info('processData', 'Starting processing', {
    size: data.length
  });
  
  const result = await VeloData.sort(data);
  
  logger.info('processData', 'Processing complete', {
    resultSize: result.length
  });
  
  return result;
}
```

---

## Patrones Comunes

### Patrón 1: Pipeline de Transformaciones

```javascript
async function dataPipeline(rawData) {
  // Paso 1: Limpiar
  const cleaned = await VeloData.filter(rawData, {
    where: d => d.value != null && d.value > 0
  });
  
  // Paso 2: Ordenar
  const sorted = await VeloData.sort(cleaned, {
    by: d => d.timestamp
  });
  
  // Paso 3: Agregar
  const grouped = await VeloData.groupBy(sorted, {
    by: d => d.category
  });
  
  // Paso 4: Calcular métricas
  const metrics = new Map();
  for (const [category, items] of grouped) {
    const values = items.map(i => i.value);
    const stats = await VeloData.aggregate(values, {
      sum: true,
      avg: true,
      count: true
    });
    metrics.set(category, stats);
  }
  
  return metrics;
}
```

### Patrón 2: Cache de Resultados

```javascript
class CachedProcessor {
  constructor() {
    this.cache = new Map();
  }
  
  getCacheKey(data, operation) {
    return `${operation}-${data.length}-${data[0]}-${data[data.length-1]}`;
  }
  
  async sort(data) {
    const key = this.getCacheKey(data, 'sort');
    
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const result = await VeloData.sort(data);
    this.cache.set(key, result);
    
    return result;
  }
  
  clearCache() {
    this.cache.clear();
  }
}
```

### Patrón 3: Worker Pool

```javascript
// Procesar en paralelo usando Workers
import { Worker } from 'worker_threads';

class WorkerPool {
  constructor(numWorkers = 4) {
    this.workers = [];
    for (let i = 0; i < numWorkers; i++) {
      this.workers.push(new Worker('./data-worker.js'));
    }
    this.currentWorker = 0;
  }
  
  async process(data) {
    const worker = this.workers[this.currentWorker];
    this.currentWorker = (this.currentWorker + 1) % this.workers.length;
    
    return new Promise((resolve, reject) => {
      worker.once('message', resolve);
      worker.once('error', reject);
      worker.postMessage({ data });
    });
  }
}

// data-worker.js
import { parentPort } from 'worker_threads';
import { VeloData } from 'velo-compute';

parentPort.on('message', async ({ data }) => {
  const result = await VeloData.sort(data);
  parentPort.postMessage(result);
});
```

---

## Integración con Frameworks

### React

```javascript
// useVeloData.js - Custom Hook
import { useState, useEffect } from 'react';
import { VeloData } from 'velo-compute';

export function useVeloSort(data, options) {
  const [sorted, setSorted] = useState(data);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    setLoading(true);
    VeloData.sort(data, options)
      .then(result => {
        setSorted(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Sort error:', error);
        setLoading(false);
      });
  }, [data, options]);
  
  return { sorted, loading };
}

// Uso en componente
function DataTable({ data }) {
  const { sorted, loading } = useVeloSort(data, { order: 'desc' });
  
  if (loading) return <div>Procesando datos...</div>;
  
  return (
    <table>
      <tbody>
        {sorted.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Vue.js

```javascript
// useVeloData.js - Composable
import { ref, watch } from 'vue';
import { VeloData } from 'velo-compute';

export function useVeloSort(data, options) {
  const sorted = ref([]);
  const loading = ref(false);
  
  watch([data, options], async ([newData, newOptions]) => {
    if (!newData || newData.length === 0) return;
    
    loading.value = true;
    try {
      sorted.value = await VeloData.sort(newData, newOptions);
    } catch (error) {
      console.error('Sort error:', error);
    } finally {
      loading.value = false;
    }
  }, { immediate: true });
  
  return { sorted, loading };
}

// Uso en componente
export default {
  setup(props) {
    const { sorted, loading } = useVeloSort(props.data, { order: 'desc' });
    
    return { sorted, loading };
  }
}
```

### Express.js

```javascript
// middleware/data-processor.js
import { VeloData } from 'velo-compute';

export function processDataMiddleware(options = {}) {
  return async (req, res, next) => {
    if (!req.body.data) {
      return res.status(400).json({ error: 'No data provided' });
    }
    
    try {
      const { operation = 'sort', params = {} } = options;
      
      let result;
      switch (operation) {
        case 'sort':
          result = await VeloData.sort(req.body.data, params);
          break;
        case 'filter':
          result = await VeloData.filter(req.body.data, params);
          break;
        case 'aggregate':
          result = await VeloData.aggregate(req.body.data, params);
          break;
        default:
          return res.status(400).json({ error: 'Invalid operation' });
      }
      
      req.processedData = result;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

// Uso
import express from 'express';
import { processDataMiddleware } from './middleware/data-processor.js';

const app = express();
app.use(express.json());

app.post('/api/sort', 
  processDataMiddleware({ operation: 'sort' }),
  (req, res) => {
    res.json({ data: req.processedData });
  }
);
```

---

## Troubleshooting

### Problema 1: WASM no carga

**Error:** "Failed to load WASM module"

**Solución:**
```javascript
// Asegúrate de usar await
const result = await VeloData.sort(data); // Correcto

// Verifica que el módulo WASM esté disponible
import { VeloData } from 'velo-compute';
console.log('VeloData loaded:', !!VeloData);
```

### Problema 2: Performance no mejora

**Diagnóstico:**
```javascript
// Medir performance
console.time('native');
data.sort((a, b) => a - b);
console.timeEnd('native');

console.time('velo');
await VeloData.sort(data);
console.timeEnd('velo');
```

**Soluciones:**
- Usa TypedArrays para datasets >100K
- Usa APIs zero-copy
- Verifica que el dataset sea lo suficientemente grande

### Problema 3: Errores de Tipo en TypeScript

**Solución:**
```typescript
// Asegúrate de tener los tipos correctos
import { VeloData, AggregateResult } from 'velo-compute';

const stats: AggregateResult = await VeloData.aggregate(data, {
  sum: true,
  avg: true
});
```

---

**Versión:** 1.0.0  
**Última Actualización:** 2026-01-11
