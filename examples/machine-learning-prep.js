/**
 * EJEMPLO: Preparacion de Datos para Machine Learning
 * 
 * Preprocesa grandes datasets para ML: normalizacion, sampling, splits
 * Demuestra: Transformaciones, Estadisticas, Splitting
 */

import { VeloData } from '../js/dist/index.js';

async function mlDataPreparation() {
  console.log('PREPARACION DE DATOS PARA MACHINE LEARNING');
  console.log('='.repeat(80));
  console.log('');

  // Dataset: Datos de clientes para modelo de prediccion de churn
  console.log('Generando dataset de clientes (1,000,000 registros)...');
  const numCustomers = 1_000_000;
  
  const customers = Array.from({ length: numCustomers }, (_, i) => ({
    id: i + 1,
    age: Math.floor(Math.random() * 60) + 18,
    tenure: Math.floor(Math.random() * 120), // meses
    monthlyCharges: Math.random() * 100 + 20,
    totalCharges: Math.random() * 5000,
    numProducts: Math.floor(Math.random() * 5) + 1,
    numTickets: Math.floor(Math.random() * 20),
    satisfaction: Math.random() * 5, // 0-5
    churn: Math.random() > 0.7 ? 1 : 0 // 30% churn rate
  }));

  console.log(`Dataset generado: ${customers.length.toLocaleString()} clientes`);
  console.log('');

  // PASO 1: Analisis Exploratorio
  console.log('PASO 1: ANALISIS EXPLORATORIO DE DATOS');
  console.log('-'.repeat(80));
  
  let start = performance.now();
  
  const features = ['age', 'tenure', 'monthlyCharges', 'totalCharges', 
                    'numProducts', 'numTickets', 'satisfaction'];
  
  console.log('Estadisticas por Feature:');
  console.log('');
  
  for (const feature of features) {
    const values = new Float64Array(customers.map(c => c[feature]));
    const stats = await VeloData.aggregateTypedArray(values);
    
    console.log(`${feature}:`);
    console.log(`  Min: ${stats.min.toFixed(2)}, Max: ${stats.max.toFixed(2)}`);
    console.log(`  Mean: ${stats.avg.toFixed(2)}, StdDev: ${stats.stdDev.toFixed(2)}`);
  }
  
  let duration = performance.now() - start;
  console.log(`\nAnalisis completado en: ${duration.toFixed(2)}ms`);
  console.log('');

  // PASO 2: Deteccion y Remocion de Outliers
  console.log('PASO 2: DETECCION DE OUTLIERS');
  console.log('-'.repeat(80));
  
  start = performance.now();
  
  // Remover outliers usando IQR method en monthlyCharges
  const monthlyCharges = new Float64Array(customers.map(c => c.monthlyCharges));
  await VeloData.sortTypedArray(monthlyCharges, true);
  
  const q1Index = Math.floor(monthlyCharges.length * 0.25);
  const q3Index = Math.floor(monthlyCharges.length * 0.75);
  const q1 = monthlyCharges[q1Index];
  const q3 = monthlyCharges[q3Index];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  const cleanData = customers.filter(c => 
    c.monthlyCharges >= lowerBound && c.monthlyCharges <= upperBound
  );
  
  duration = performance.now() - start;
  
  console.log(`Q1: ${q1.toFixed(2)}, Q3: ${q3.toFixed(2)}, IQR: ${iqr.toFixed(2)}`);
  console.log(`Bounds: [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}]`);
  console.log(`Outliers removidos: ${(customers.length - cleanData.length).toLocaleString()}`);
  console.log(`Dataset limpio: ${cleanData.length.toLocaleString()} registros`);
  console.log(`Procesado en: ${duration.toFixed(2)}ms`);
  console.log('');

  console.log('Continuara con normalizacion, train/test split, etc...');
  console.log('');
}

mlDataPreparation().catch(console.error);
