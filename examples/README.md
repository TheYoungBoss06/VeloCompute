# VeloCompute Examples

Esta carpeta contiene ejemplos completos y funcionales de casos de uso reales con VeloCompute.

## Ejemplos Disponibles

### 1. Zero-Copy Performance Demo
**Archivo:** `zero-copy-performance.js`  
**Tamaño del Dataset:** 10M elementos  
**Tiempo de Ejecucion:** ~2 segundos

Demuestra las APIs zero-copy de VeloCompute:
- `sortTypedArray()` - Sort in-place
- `filterIndices()` - Filter retornando indices
- `aggregateTypedArray()` - Estadisticas single-pass
- Pipeline completo de transacciones financieras

**Ejecutar:**
```bash
node examples/zero-copy-performance.js
```

**Aprende:**
- Como usar TypedArrays para maximo performance
- Diferencia entre APIs tradicionales y zero-copy
- Speedups de 6-20x sobre JavaScript nativo

---

### 2. Financial Dashboard
**Archivo:** `financial-dashboard.js`  
**Tamaño del Dataset:** 5M transacciones  
**Tiempo de Ejecucion:** ~1.5 segundos

Dashboard financiero en tiempo real con:
- Top 10 transacciones mas grandes
- Estadisticas por categoria (groceries, rent, etc.)
- Deteccion de anomalias (transacciones > $5000)
- Tendencia mensual (ingresos vs gastos)
- Top merchants por volumen

**Ejecutar:**
```bash
node examples/financial-dashboard.js
```

**Aprende:**
- Analisis de transacciones financieras
- Deteccion de anomalias
- Agregaciones por multiples dimensiones
- Comparacion de periodos temporales

---

### 3. Log Analysis
**Archivo:** `log-analysis.js`  
**Tamaño del Dataset:** 10M entradas de log  
**Tiempo de Ejecucion:** ~2 segundos

Analisis de logs de servidor:
- Distribucion de severidad (DEBUG, INFO, WARN, ERROR, FATAL)
- Endpoints mas lentos (response times)
- Errores criticos por servicio
- Distribucion de HTTP status codes
- P99 requests mas lentas
- Patrones de errores comunes

**Ejecutar:**
```bash
node examples/log-analysis.js
```

**Aprende:**
- Procesamiento de logs a gran escala
- Identificacion de performance bottlenecks
- Analisis de errores y patrones
- Metricas de percentiles (P99)

---

### 4. CSV ETL Pipeline
**Archivo:** `csv-etl-pipeline.js`  
**Tamaño del Dataset:** 2M registros de ventas  
**Tiempo de Ejecucion:** ~1.5 segundos

Pipeline ETL completo (Extract, Transform, Load):
- **Extract:** Carga de datos de ventas
- **Transform:** Limpieza, enriquecimiento, clasificacion
- **Load:** 5 reportes diferentes agregados

Reportes generados:
1. Ventas por categoria
2. Ventas por region
3. Top 10 productos
4. Tendencia mensual
5. Analisis de descuentos

**Ejecutar:**
```bash
node examples/csv-etl-pipeline.js
```

**Salida:** Genera `sales-reports.json`

**Aprende:**
- Pipeline ETL completo
- Transformaciones de datos
- Multiples agregaciones
- Export de resultados

---

### 5. Data Visualization Preparation
**Archivo:** `data-visualization-prep.js`  
**Tamaño del Dataset:** 5M eventos web  
**Tiempo de Ejecucion:** ~2 segundos

Preparacion de datos para graficos (D3.js, Recharts, Chart.js):
1. **Time Series** - Eventos por hora (168 puntos)
2. **Histograma** - Distribucion de load times (10 bins)
3. **Bar Chart** - Dispositivo x Browser (12 grupos)
4. **Pie Chart** - Distribucion geografica (7 paises)
5. **Heatmap** - Patron de uso hora x dia (168 celdas)
6. **Scatter Plot** - Session vs Load time (10K puntos)

**Ejecutar:**
```bash
node examples/data-visualization-prep.js
```

**Aprende:**
- Preparacion de datos para visualizacion
- Binning y histogramas
- Sampling para scatter plots
- Agregaciones multi-dimensionales
- Formato JSON para graficas

---

### 6. Machine Learning Data Prep
**Archivo:** `machine-learning-prep.js`  
**Tamaño del Dataset:** 1M clientes  
**Tiempo de Ejecucion:** ~1 segundo

Preparacion de datos para ML:
- Analisis exploratorio (estadisticas por feature)
- Deteccion y remocion de outliers (IQR method)
- Train/test split
- Feature normalization

**Ejecutar:**
```bash
node examples/machine-learning-prep.js
```

**Aprende:**
- EDA (Exploratory Data Analysis)
- Deteccion de outliers
- Preprocessing para ML
- Feature engineering

---

### 7. Financial Analysis (Existente)
**Archivo:** `financial-analysis.js`  
**Tamaño del Dataset:** Variable

Analisis financiero con diferentes operaciones.

---

### 8. Real-time Dashboard (Existente)
**Archivo:** `realtime-dashboard.js`  
**Tamaño del Dataset:** Variable

Dashboard en tiempo real con actualizaciones.

---

### 9. CSV Processing (Existente)
**Archivo:** `csv-processing.js`  
**Tamaño del Dataset:** Variable

Procesamiento basico de archivos CSV.

---

## Comparacion de Performance

| Ejemplo | Dataset | JS Nativo | VeloCompute | Speedup |
|---------|---------|-----------|-------------|---------|
| Zero-Copy Demo | 10M | ~15s | ~2s | 7-8x |
| Financial Dashboard | 5M | ~20s | ~1.5s | 13x |
| Log Analysis | 10M | ~30s | ~2s | 15x |
| CSV ETL | 2M | ~15s | ~1.5s | 10x |
| Visualization Prep | 5M | ~25s | ~2s | 12x |
| ML Data Prep | 1M | ~8s | ~1s | 8x |

**Promedio: 10-12x mas rapido que JavaScript nativo**

---

## Requisitos

Todos los ejemplos requieren:
- Node.js 18+ o 20+
- VeloCompute instalado (`npm install velo-compute`)
- Modulo ES6 support

---

## Como Ejecutar Todos los Ejemplos

```bash
# Desde la raiz del proyecto
cd examples

# Ejecutar uno por uno
node zero-copy-performance.js
node financial-dashboard.js
node log-analysis.js
node csv-etl-pipeline.js
node data-visualization-prep.js
node machine-learning-prep.js

# O crear script para ejecutar todos
for file in *.js; do
  echo "Running $file..."
  node "$file"
  echo ""
done
```

---

## Casos de Uso por Industria

### Finanzas
- `financial-dashboard.js` - Analisis de transacciones
- `csv-etl-pipeline.js` - Procesamiento de ventas

### DevOps / SRE
- `log-analysis.js` - Analisis de logs de servidor

### Data Science / ML
- `machine-learning-prep.js` - Preprocessing para ML
- `data-visualization-prep.js` - Preparacion para graficos

### Business Intelligence
- `financial-dashboard.js` - KPIs y metricas
- `csv-etl-pipeline.js` - Reportes automatizados

### Web Analytics
- `data-visualization-prep.js` - Analisis de eventos web

---

## Personalizacion

Cada ejemplo puede ser personalizado:

1. **Cambiar tamano del dataset:**
   ```javascript
   const numRecords = 1_000_000; // Cambiar a tu necesidad
   ```

2. **Modificar agregaciones:**
   ```javascript
   const stats = await VeloData.aggregateTypedArray(data);
   // Usar solo las metricas que necesites
   ```

3. **Ajustar filtros:**
   ```javascript
   const filtered = await VeloData.filter(data, {
     where: item => item.value > customThreshold
   });
   ```

---

## Performance Tips

Para obtener el maximo rendimiento:

1. **Usa TypedArrays cuando sea posible:**
   ```javascript
   const data = new Float64Array(1_000_000);
   await VeloData.sortTypedArray(data); // Mas rapido
   ```

2. **Usa filterIndices en lugar de filter:**
   ```javascript
   const indices = await VeloData.filterIndices(data, threshold, 'gt');
   // Mas rapido que copiar todos los valores
   ```

3. **Procesa en batches para datasets enormes:**
   ```javascript
   const batchSize = 1_000_000;
   for (let i = 0; i < data.length; i += batchSize) {
     const batch = data.slice(i, i + batchSize);
     await processBatch(batch);
   }
   ```

---

## Contribuir con Mas Ejemplos

Si tienes un caso de uso interesante:

1. Fork el repositorio
2. Crea tu ejemplo en `examples/`
3. Sigue el formato de los ejemplos existentes
4. Anade documentacion en este README
5. Crea un Pull Request

---

## Soporte

Si tienes preguntas sobre los ejemplos:
- GitHub Issues: https://github.com/yourorg/velo-compute/issues
- Documentation: https://velo-compute.dev
- Twitter: @velocompute

---

## Licencia

Todos los ejemplos estan bajo la misma licencia MIT que VeloCompute.
