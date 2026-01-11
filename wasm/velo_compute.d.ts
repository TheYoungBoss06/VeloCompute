/* tslint:disable */
/* eslint-disable */

export class AggregateResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  max(): number;
  min(): number;
  sum(): number;
  mean(): number;
  count(): number;
  std_dev(): number;
  variance(): number;
}

export class FilterContext {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Filter con multiples condiciones (AND)
   * Mas eficiente que multiples filters secuenciales
   */
  static filter_i32_multi(data: Int32Array, thresholds: Int32Array, operations: string[]): Int32Array;
  /**
   * Filter ultra-optimizado con SIMD para integers
   * Procesa hasta 4 elementos por iteracion
   */
  filter_i32_compare(data: Int32Array, threshold: number, operation: string): Int32Array;
  /**
   * Retornar indices en lugar de valores (para objetos)
   */
  filter_i32_indices(data: Int32Array, threshold: number, operation: string): Uint32Array;
  constructor();
}

export class GroupByAggregate {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Obtener counts por grupo
   */
  get_counts(): Float64Array;
  /**
   * Obtener numero de grupos
   */
  group_count(): number;
  /**
   * Obtener promedios por grupo
   */
  get_averages(): Float64Array;
  /**
   * Obtener std dev por grupo
   */
  get_std_devs(): Float64Array;
  /**
   * Obtener varianzas por grupo
   */
  get_variances(): Float64Array;
  /**
   * GroupBy con agregacion completa en un paso
   * keys: Array de keys de grupo (integers)
   * values: Array de valores a agregar (floats)
   */
  static groupby_aggregate_i32(keys: Int32Array, values: Float64Array): GroupByAggregate;
  constructor();
  /**
   * Obtener maximos por grupo
   */
  get_maxs(): Float64Array;
  /**
   * Obtener minimos por grupo
   */
  get_mins(): Float64Array;
  /**
   * Obtener sumas por grupo
   * Retorna vec plano [key1, sum1, key2, sum2, ...]
   */
  get_sums(): Float64Array;
}

export class GroupByResult {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Obtener indices para una key especifica
   */
  get_indices(key: number): Uint32Array | undefined;
  /**
   * Obtener numero de grupos
   */
  group_count(): number;
  /**
   * Obtener tamanos de grupos
   * Retorna vec plano [key1, size1, key2, size2, ...]
   */
  group_sizes(): Int32Array;
  /**
   * GroupBy para integers (IDs, categorias)
   * Retorna estructura con grupos
   */
  static groupby_i32(keys: Int32Array): GroupByResult;
  /**
   * Obtener keys unicas
   */
  unique_keys(): Int32Array;
  constructor();
  /**
   * Obtener indices de un grupo por índice
   */
  get_group(index: number): Uint32Array;
}

export class GroupByResultU32 {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  get_indices(key: number): Uint32Array | undefined;
  group_count(): number;
  unique_keys(): Uint32Array;
  get_group(index: number): Uint32Array;
}

export class HashJoin {
  free(): void;
  [Symbol.dispose](): void;
  constructor();
  /**
   * Join de integers (IDs, foreign keys)
   * Automaticamente elige build/probe side basado en tamano
   */
  static join_i32(left_keys: Int32Array, right_keys: Int32Array, join_type: JoinType): JoinResult;
}

export class JoinResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  add_left_only(left: number): void;
  add_right_only(right: number): void;
  get_left_nulls(): Uint8Array;
  get_right_nulls(): Uint8Array;
  get_left_indices(): Uint32Array;
  get_right_indices(): Uint32Array;
  static new(): JoinResult;
  size(): number;
  add_pair(left: number, right: number): void;
}

export enum JoinType {
  Inner = 0,
  Left = 1,
  Right = 2,
  Full = 3,
}

export class PivotTable {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  get_values(): Float64Array;
  get_col_keys(): Int32Array;
  get_row_keys(): Int32Array;
  /**
   * Pivot con promedio
   */
  static pivot_with_avg(row_indices: Int32Array, col_indices: Int32Array, values: Float64Array): PivotTable;
  /**
   * Pivot con max
   */
  static pivot_with_max(row_indices: Int32Array, col_indices: Int32Array, values: Float64Array): PivotTable;
  /**
   * Pivot con min
   */
  static pivot_with_min(row_indices: Int32Array, col_indices: Int32Array, values: Float64Array): PivotTable;
  /**
   * Crear pivot con suma como agregacion
   * row_indices: que fila pertenece cada valor
   * col_indices: que columna pertenece cada valor
   * values: valores a agregar
   */
  static pivot_with_sum(row_indices: Int32Array, col_indices: Int32Array, values: Float64Array): PivotTable;
  /**
   * Pivot con count
   */
  static pivot_with_count(row_indices: Int32Array, col_indices: Int32Array): PivotTable;
  n_cols(): number;
  n_rows(): number;
  /**
   * Obtener valor en posicion especifica
   */
  get_value(row_idx: number, col_idx: number): number;
}

export class Quartiles {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  q1(): number;
  q2(): number;
  q3(): number;
  iqr(): number;
}

export class SortMergeJoin {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Join usando merge si ambos arrays estan ordenados
   * Mas eficiente que hash join si data ya esta sorted
   */
  static join_sorted_i32(left_keys: Int32Array, right_keys: Int32Array): JoinResult;
}

export class StreamAggregator {
  free(): void;
  [Symbol.dispose](): void;
  get_std_dev(): number;
  get_variance(): number;
  constructor();
  reset(): void;
  /**
   * Actualizar con nuevo chunk de datos
   */
  update(chunk: Float64Array): void;
  get_max(): number;
  get_min(): number;
  get_sum(): number;
  get_mean(): number;
  get_count(): number;
}

export class StreamFilter {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Filtrar chunk y retornar valores que pasan
   */
  filter_chunk(chunk: Float64Array): Float64Array;
  get_filtered_count(): number;
  constructor(threshold: number, operation: string);
  reset(): void;
}

export class StreamProcessor {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Agregar chunk de datos al buffer
   */
  push_chunk(data: Float64Array): void;
  buffer_size(): number;
  /**
   * Procesar proximo chunk disponible
   * Retorna None si no hay suficientes datos
   */
  process_next(): Float64Array | undefined;
  processed_count(): number;
  constructor(chunk_size: number);
  /**
   * Obtener datos restantes (flush)
   */
  flush(): Float64Array;
  reset(): void;
}

export class UniqueContext {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Unique para integers preservando orden de primera aparicion
   */
  static unique_i32(data: Int32Array): Int32Array;
  /**
   * Unique adaptativo - elige la mejor estrategia automáticamente
   */
  static unique_i32_adaptive(data: Int32Array): Int32Array;
  /**
   * Unique optimizado para low cardinality
   * Usa linear scan si detecta pocos valores unicos
   */
  static unique_i32_fast_path(data: Int32Array, max_unique: number): Int32Array | undefined;
  /**
   * Unique con contador de ocurrencias
   * Retorna pares (valor, count)
   */
  static unique_i32_with_counts(data: Int32Array): Int32Array;
  constructor();
}

export class WindowContext {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Dense rank (sin gaps en ranking)
   */
  static dense_rank(values: Float64Array, partitions: Int32Array): Uint32Array;
  /**
   * Last value en la particion
   */
  static last_value(values: Float64Array, partitions: Int32Array): Float64Array;
  /**
   * Moving average con ventana deslizante
   * window_size: numero de elementos en la ventana
   */
  static moving_avg(values: Float64Array, window_size: number): Float64Array;
  /**
   * Moving sum con ventana deslizante
   */
  static moving_sum(values: Float64Array, window_size: number): Float64Array;
  /**
   * Row number (1, 2, 3... dentro de cada particion)
   */
  static row_number(partitions: Int32Array): Uint32Array;
  /**
   * First value en la particion
   */
  static first_value(values: Float64Array, partitions: Int32Array): Float64Array;
  /**
   * Running sum (cumulative sum) dentro de particiones
   * partitions: array de partition IDs, debe estar ordenado
   */
  static running_sum(values: Float64Array, partitions: Int32Array): Float64Array;
  /**
   * Lag - valor anterior en la particion
   * offset: cuantos valores atras mirar
   */
  static lag(values: Float64Array, partitions: Int32Array, offset: number): Float64Array;
  constructor();
  /**
   * Lead - valor siguiente en la particion
   */
  static lead(values: Float64Array, partitions: Int32Array, offset: number): Float64Array;
  /**
   * Rank dentro de particiones (valores iguales reciben mismo rank)
   * Asume que data esta ordenada por (partition, value desc)
   */
  static rank(values: Float64Array, partitions: Int32Array): Uint32Array;
}

/**
 * Agregacion completa en un solo paso usando algoritmo de Welford
 * ULTRA-OPTIMIZADO con loop unrolling y procesamiento paralelo
 */
export function aggregate_f64(data: Float64Array): AggregateResult;

/**
 * Hyper-optimized aggregate that computes everything in one pass
 * Uses pipelined accumulators for maximum throughput
 */
export function aggregate_f64_hyper(data: Float64Array): Float64Array;

/**
 * Agregacion para i32 (mas rapido que f64)
 */
export function aggregate_i32(data: Int32Array): AggregateResult;

/**
 * Anti-join (retorna left indices que NO tienen match)
 */
export function anti_join_i32(left_keys: Int32Array, right_keys: Int32Array): Uint32Array;

export function count_unique_f64(data: Float64Array): number;

/**
 * Contar valores unicos sin retornar los valores
 * Mas rapido cuando solo necesitas el count
 */
export function count_unique_i32(data: Int32Array): number;

/**
 * Deteccion de cardinalidad mediante sampling
 * Util para decidir que algoritmo usar
 */
export function estimate_cardinality_i32(data: Int32Array, sample_size: number): number;

/**
 * Filter floats con comparacion simple
 */
export function filter_f64_compare(data: Float64Array, threshold: number, operation: string): Float64Array;

/**
 * Filter especializado para floats con range
 */
export function filter_f64_range(data: Float64Array, min: number, max: number): Float64Array;

/**
 * Specialized filter using counting (when few values pass)
 * Extremely fast for low selectivity filters
 */
export function filter_i32_gt_counting(data: Int32Array, threshold: number): Int32Array;

/**
 * Specialized ultra-fast filter for power-of-2 thresholds
 * Uses bit operations instead of comparisons
 */
export function filter_i32_gt_power2(data: Int32Array, threshold_log2: number): Int32Array;

/**
 * Filter u32 (para IDs, categorias)
 */
export function filter_u32_compare(data: Uint32Array, threshold: number, operation: string): Uint32Array;

/**
 * GroupBy con count solamente (mas rapido)
 */
export function groupby_count_i32(keys: Int32Array): Int32Array;

/**
 * GroupBy con agregacion solo de suma (optimizado)
 */
export function groupby_sum_i32(keys: Int32Array, values: Float64Array): Float64Array;

/**
 * GroupBy para u32 (optimizado para IDs y categorías)
 */
export function groupby_u32(keys: Uint32Array): GroupByResultU32;

/**
 * GroupBy para u32 (IDs no negativos)
 */
export function groupby_u32_simple(keys: Uint32Array): Uint32Array;

export function init(): void;

export function max_f64(data: Float64Array): number;

export function max_i32(data: Int32Array): number;

/**
 * Mean ultra-optimizado con vectorizacion
 */
export function mean_f64(data: Float64Array): number;

export function mean_i32(data: Int32Array): number;

/**
 * Mediana (percentil 0.5)
 */
export function median_f64(data: Float64Array): number;

/**
 * Min/Max optimizados
 */
export function min_f64(data: Float64Array): number;

export function min_i32(data: Int32Array): number;

/**
 * Nested loop join (fallback para casos complejos) - O(n*m)
 * Solo usar cuando hash join no es posible
 */
export function nested_loop_join_i32(left_keys: Int32Array, right_keys: Int32Array): JoinResult;

/**
 * Percentiles (requiere ordenamiento)
 * p debe estar entre 0.0 y 1.0
 */
export function percentile_f64(data: Float64Array, p: number): number;

export function quartiles_f64(data: Float64Array): Quartiles;

/**
 * Semi-join (solo retorna left indices que tienen match)
 * Mas eficiente que full join si solo necesitas saber que matched
 */
export function semi_join_i32(left_keys: Int32Array, right_keys: Int32Array): Uint32Array;

/**
 * Sort data array by corresponding keys array (f64 version)
 */
export function sort_by_key_f64(data: Float64Array, keys: Float64Array, ascending: boolean): void;

/**
 * Sort data array by corresponding keys array
 * This is used for sorting objects by a numeric property
 */
export function sort_by_key_i32(data: Int32Array, keys: Int32Array, ascending: boolean): void;

/**
 * Sort f64 array using pdqsort (Pattern-Defeating Quicksort)
 * PDQ sort is cache-friendly and handles various patterns efficiently
 */
export function sort_f64(data: Float64Array, ascending: boolean): void;

/**
 * Sort i32 array using optimized radix sort
 * For integers, radix sort provides O(n*k) complexity which is faster than O(n log n)
 */
export function sort_i32(data: Int32Array, ascending: boolean): void;

/**
 * Sort u32 array using optimized radix sort
 */
export function sort_u32(data: Uint32Array, ascending: boolean): void;

/**
 * Sum ultra-optimizado con loop unrolling y pipelining
 */
export function sum_f64(data: Float64Array): number;

/**
 * Specialized sum using Kahan summation for extreme precision
 * Prevents floating-point error accumulation
 */
export function sum_f64_kahan(data: Float64Array): number;

export function sum_i32(data: Int32Array): number;

/**
 * Unique para floats
 * Maneja NaN correctamente comparando representacion de bits
 */
export function unique_f64(data: Float64Array): Float64Array;

/**
 * Unique con counts para floats
 */
export function unique_f64_with_counts(data: Float64Array): Float64Array;

/**
 * Unique adaptativo: elige el mejor algoritmo automaticamente
 */
export function unique_i32_adaptive(data: Int32Array): Int32Array;

/**
 * Unique para u32 (IDs, categorias)
 */
export function unique_u32(data: Uint32Array): Uint32Array;

/**
 * Media ponderada
 */
export function weighted_mean(values: Float64Array, weights: Float64Array): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_aggregateresult_free: (a: number, b: number) => void;
  readonly __wbg_filtercontext_free: (a: number, b: number) => void;
  readonly __wbg_groupbyaggregate_free: (a: number, b: number) => void;
  readonly __wbg_groupbyresult_free: (a: number, b: number) => void;
  readonly __wbg_hashjoin_free: (a: number, b: number) => void;
  readonly __wbg_joinresult_free: (a: number, b: number) => void;
  readonly __wbg_pivottable_free: (a: number, b: number) => void;
  readonly __wbg_quartiles_free: (a: number, b: number) => void;
  readonly __wbg_sortmergejoin_free: (a: number, b: number) => void;
  readonly __wbg_streamfilter_free: (a: number, b: number) => void;
  readonly __wbg_streamprocessor_free: (a: number, b: number) => void;
  readonly __wbg_uniquecontext_free: (a: number, b: number) => void;
  readonly aggregate_f64: (a: number, b: number) => [number, number, number];
  readonly aggregate_f64_hyper: (a: number, b: number) => [number, number];
  readonly aggregate_i32: (a: number, b: number) => [number, number, number];
  readonly aggregateresult_count: (a: number) => number;
  readonly aggregateresult_max: (a: number) => number;
  readonly aggregateresult_mean: (a: number) => number;
  readonly aggregateresult_min: (a: number) => number;
  readonly aggregateresult_std_dev: (a: number) => number;
  readonly aggregateresult_sum: (a: number) => number;
  readonly aggregateresult_variance: (a: number) => number;
  readonly anti_join_i32: (a: number, b: number, c: number, d: number) => [number, number];
  readonly count_unique_f64: (a: number, b: number) => number;
  readonly count_unique_i32: (a: number, b: number) => number;
  readonly estimate_cardinality_i32: (a: number, b: number, c: number) => number;
  readonly filter_f64_compare: (a: number, b: number, c: number, d: number, e: number) => [number, number, number, number];
  readonly filter_f64_range: (a: number, b: number, c: number, d: number) => [number, number];
  readonly filter_i32_gt_counting: (a: number, b: number, c: number) => [number, number];
  readonly filter_i32_gt_power2: (a: number, b: number, c: number) => [number, number];
  readonly filter_u32_compare: (a: number, b: number, c: number, d: number, e: number) => [number, number, number, number];
  readonly filtercontext_filter_i32_compare: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number, number];
  readonly filtercontext_filter_i32_indices: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number, number];
  readonly filtercontext_filter_i32_multi: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number, number];
  readonly filtercontext_new: () => number;
  readonly groupby_count_i32: (a: number, b: number) => [number, number];
  readonly groupby_sum_i32: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly groupby_u32: (a: number, b: number) => number;
  readonly groupby_u32_simple: (a: number, b: number) => [number, number];
  readonly groupbyaggregate_get_averages: (a: number) => [number, number];
  readonly groupbyaggregate_get_counts: (a: number) => [number, number];
  readonly groupbyaggregate_get_maxs: (a: number) => [number, number];
  readonly groupbyaggregate_get_mins: (a: number) => [number, number];
  readonly groupbyaggregate_get_std_devs: (a: number) => [number, number];
  readonly groupbyaggregate_get_sums: (a: number) => [number, number];
  readonly groupbyaggregate_get_variances: (a: number) => [number, number];
  readonly groupbyaggregate_group_count: (a: number) => number;
  readonly groupbyaggregate_groupby_aggregate_i32: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly groupbyaggregate_new: () => number;
  readonly groupbyresult_get_group: (a: number, b: number) => [number, number];
  readonly groupbyresult_get_indices: (a: number, b: number) => [number, number];
  readonly groupbyresult_group_sizes: (a: number) => [number, number];
  readonly groupbyresult_groupby_i32: (a: number, b: number) => [number, number, number];
  readonly groupbyresult_new: () => number;
  readonly groupbyresult_unique_keys: (a: number) => [number, number];
  readonly hashjoin_join_i32: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly hashjoin_new: () => number;
  readonly joinresult_add_left_only: (a: number, b: number) => void;
  readonly joinresult_add_pair: (a: number, b: number, c: number) => void;
  readonly joinresult_add_right_only: (a: number, b: number) => void;
  readonly joinresult_get_left_indices: (a: number) => [number, number];
  readonly joinresult_get_left_nulls: (a: number) => [number, number];
  readonly joinresult_get_right_indices: (a: number) => [number, number];
  readonly joinresult_get_right_nulls: (a: number) => [number, number];
  readonly joinresult_new: () => number;
  readonly joinresult_size: (a: number) => number;
  readonly max_f64: (a: number, b: number) => number;
  readonly max_i32: (a: number, b: number) => number;
  readonly mean_f64: (a: number, b: number) => number;
  readonly mean_i32: (a: number, b: number) => number;
  readonly median_f64: (a: number, b: number) => [number, number, number];
  readonly min_f64: (a: number, b: number) => number;
  readonly min_i32: (a: number, b: number) => number;
  readonly nested_loop_join_i32: (a: number, b: number, c: number, d: number) => number;
  readonly percentile_f64: (a: number, b: number, c: number) => [number, number, number];
  readonly pivottable_get_col_keys: (a: number) => [number, number];
  readonly pivottable_get_row_keys: (a: number) => [number, number];
  readonly pivottable_get_value: (a: number, b: number, c: number) => number;
  readonly pivottable_get_values: (a: number) => [number, number];
  readonly pivottable_n_cols: (a: number) => number;
  readonly pivottable_n_rows: (a: number) => number;
  readonly pivottable_pivot_with_avg: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
  readonly pivottable_pivot_with_count: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly pivottable_pivot_with_max: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
  readonly pivottable_pivot_with_min: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
  readonly pivottable_pivot_with_sum: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number];
  readonly quartiles_f64: (a: number, b: number) => [number, number, number];
  readonly quartiles_iqr: (a: number) => number;
  readonly semi_join_i32: (a: number, b: number, c: number, d: number) => [number, number];
  readonly sort_by_key_f64: (a: number, b: number, c: any, d: number, e: number, f: number) => [number, number];
  readonly sort_by_key_i32: (a: number, b: number, c: any, d: number, e: number, f: number) => [number, number];
  readonly sort_f64: (a: number, b: number, c: any, d: number) => [number, number];
  readonly sort_i32: (a: number, b: number, c: any, d: number) => [number, number];
  readonly sort_u32: (a: number, b: number, c: any, d: number) => [number, number];
  readonly sortmergejoin_join_sorted_i32: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly streamaggregator_get_std_dev: (a: number) => number;
  readonly streamaggregator_get_variance: (a: number) => number;
  readonly streamaggregator_new: () => number;
  readonly streamaggregator_reset: (a: number) => void;
  readonly streamaggregator_update: (a: number, b: number, c: number) => void;
  readonly streamfilter_filter_chunk: (a: number, b: number, c: number) => [number, number];
  readonly streamfilter_get_filtered_count: (a: number) => number;
  readonly streamfilter_new: (a: number, b: number, c: number) => number;
  readonly streamfilter_reset: (a: number) => void;
  readonly streamprocessor_buffer_size: (a: number) => number;
  readonly streamprocessor_flush: (a: number) => [number, number];
  readonly streamprocessor_new: (a: number) => number;
  readonly streamprocessor_process_next: (a: number) => [number, number];
  readonly streamprocessor_processed_count: (a: number) => number;
  readonly streamprocessor_push_chunk: (a: number, b: number, c: number) => void;
  readonly streamprocessor_reset: (a: number) => void;
  readonly sum_f64: (a: number, b: number) => number;
  readonly sum_f64_kahan: (a: number, b: number) => number;
  readonly sum_i32: (a: number, b: number) => number;
  readonly unique_f64: (a: number, b: number) => [number, number];
  readonly unique_f64_with_counts: (a: number, b: number) => [number, number];
  readonly unique_i32_adaptive: (a: number, b: number) => [number, number];
  readonly unique_u32: (a: number, b: number) => [number, number];
  readonly uniquecontext_new: () => number;
  readonly uniquecontext_unique_i32: (a: number, b: number) => [number, number];
  readonly uniquecontext_unique_i32_adaptive: (a: number, b: number) => [number, number];
  readonly uniquecontext_unique_i32_fast_path: (a: number, b: number, c: number) => [number, number];
  readonly weighted_mean: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly windowcontext_dense_rank: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly windowcontext_first_value: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly windowcontext_lag: (a: number, b: number, c: number, d: number, e: number) => [number, number, number, number];
  readonly windowcontext_last_value: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly windowcontext_lead: (a: number, b: number, c: number, d: number, e: number) => [number, number, number, number];
  readonly windowcontext_moving_avg: (a: number, b: number, c: number) => [number, number, number, number];
  readonly windowcontext_moving_sum: (a: number, b: number, c: number) => [number, number, number, number];
  readonly windowcontext_rank: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly windowcontext_row_number: (a: number, b: number) => [number, number];
  readonly windowcontext_running_sum: (a: number, b: number, c: number, d: number) => [number, number, number, number];
  readonly windowcontext_new: () => number;
  readonly uniquecontext_unique_i32_with_counts: (a: number, b: number) => [number, number];
  readonly groupbyresult_group_count: (a: number) => number;
  readonly groupbyresultu32_group_count: (a: number) => number;
  readonly quartiles_q1: (a: number) => number;
  readonly quartiles_q2: (a: number) => number;
  readonly quartiles_q3: (a: number) => number;
  readonly streamaggregator_get_count: (a: number) => number;
  readonly streamaggregator_get_max: (a: number) => number;
  readonly streamaggregator_get_mean: (a: number) => number;
  readonly streamaggregator_get_min: (a: number) => number;
  readonly streamaggregator_get_sum: (a: number) => number;
  readonly __wbg_streamaggregator_free: (a: number, b: number) => void;
  readonly __wbg_windowcontext_free: (a: number, b: number) => void;
  readonly groupbyresultu32_unique_keys: (a: number) => [number, number];
  readonly groupbyresultu32_get_indices: (a: number, b: number) => [number, number];
  readonly groupbyresultu32_get_group: (a: number, b: number) => [number, number];
  readonly __wbg_groupbyresultu32_free: (a: number, b: number) => void;
  readonly init: () => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
