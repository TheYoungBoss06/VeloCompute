import type { SortOptions, TypedArrayType } from './types.js';
import { logger } from './logger.js';
import { telemetry } from './telemetry.js';
export type { SortOptions, TypedArrayType };
export { logger, telemetry };
export { LogLevel } from './logger.js';
export * from './error.js';
export interface FilterOptions<T> {
    where?: (item: T) => boolean;
    gt?: number;
    lt?: number;
    eq?: number;
    gte?: number;
    lte?: number;
    neq?: number;
    between?: [number, number];
}
export interface GroupByOptions<T, K> {
    by: (item: T) => K;
    aggregate?: {
        sum?: keyof T | ((item: T) => number);
        avg?: keyof T | ((item: T) => number);
        count?: boolean;
        min?: keyof T | ((item: T) => number);
        max?: keyof T | ((item: T) => number);
    };
}
export interface AggregateOptions {
    sum?: boolean;
    avg?: boolean;
    count?: boolean;
    min?: boolean;
    max?: boolean;
    stdDev?: boolean;
    variance?: boolean;
}
export interface AggregateResult {
    sum?: number;
    avg?: number;
    count?: number;
    min?: number;
    max?: number;
    stdDev?: number;
    variance?: number;
}
export interface JoinOptions<L, R> {
    left: L[];
    right: R[];
    on: {
        left: keyof L | ((item: L) => number);
        right: keyof R | ((item: R) => number);
    };
    type?: 'inner' | 'left' | 'right';
}
export interface PivotOptions<T> {
    data: T[];
    rows: (item: T) => number;
    columns: (item: T) => number;
    values: (item: T) => number;
    aggregate?: 'sum' | 'count' | 'avg' | 'min' | 'max';
}
export interface WindowOptions<T> {
    data: T[];
    partitionBy?: (item: T) => number;
    orderBy?: (item: T) => number;
    functions: {
        runningSum?: (item: T) => number;
        lag?: {
            field: (item: T) => number;
            offset: number;
        };
        lead?: {
            field: (item: T) => number;
            offset: number;
        };
        rank?: boolean;
        movingAvg?: {
            field: (item: T) => number;
            window: number;
        };
    };
}
export declare class VeloData {
    private static wasmLoaded;
    /**
     * Ensure WASM module is loaded before operations
     */
    private static ensureWasm;
    /**
     * Sort array of numbers or objects
     * @param array - Array to sort
     * @param options - Sort options
     * @returns Sorted array (new if inPlace=false, same if inPlace=true)
     */
    static sort<T>(array: T[], options?: SortOptions<T>): Promise<T[]>;
    /**
     * Sort numbers array using WASM
     */
    private static sortNumbers;
    /**
     * ZERO-COPY: Sort TypedArray in-place (no conversions)
     * This is the fastest API for numeric arrays
     * @param array - TypedArray to sort
     * @param ascending - Sort order
     */
    static sortTypedArray<T extends Int32Array | Float64Array | Uint32Array>(array: T, ascending?: boolean): Promise<T>;
    /**
     * Sort objects array by accessor function
     */
    private static sortWithAccessor;
    /**
     * Sort optimized for TypedArrays (zero-copy)
     * Modifies the array in-place
     */
    static sortTyped(array: TypedArrayType, ascending?: boolean): Promise<void>;
    /**
     * ZERO-COPY: Filter TypedArray returning indices (no data copy)
     * This is much faster than returning filtered values
     * @param array - TypedArray to filter
     * @param threshold - Comparison value
     * @param operation - Comparison operation (gt, lt, eq, gte, lte, neq)
     * @returns Uint32Array of indices that match the condition
     */
    static filterIndices(array: Int32Array | Float64Array | Uint32Array, threshold: number, operation: string): Promise<Uint32Array>;
    /**
     * ZERO-COPY: Aggregate TypedArray directly (no conversions)
     * Single-pass computation of sum, mean, min, max, stddev
     * @param array - TypedArray to aggregate
     * @returns Aggregate statistics
     */
    static aggregateTypedArray(array: Float64Array | Int32Array): Promise<AggregateResult>;
    /**
     * ZERO-COPY: Count unique values in TypedArray
     * Returns just the count without materializing unique values
     * @param array - TypedArray to count unique values
     * @returns Number of unique values
     */
    static countUnique(array: Int32Array | Float64Array): Promise<number>;
    /**
     * ZERO-COPY: Get unique values from TypedArray
     * Returns sorted unique values
     * @param array - TypedArray to get unique values
     * @returns TypedArray of unique values
     */
    static uniqueTypedArray<T extends Int32Array | Float64Array | Uint32Array>(array: T): Promise<T>;
    /**
     * ZERO-COPY: Fast sum for TypedArray
     * Optimized single-operation sum
     * @param array - TypedArray to sum
     * @returns Sum of all values
     */
    static sumTypedArray(array: Int32Array | Float64Array): Promise<number>;
    /**
     * ZERO-COPY: Fast mean for TypedArray
     * @param array - TypedArray to compute mean
     * @returns Mean value
     */
    static meanTypedArray(array: Int32Array | Float64Array): Promise<number>;
    /**
     * ZERO-COPY: Fast min for TypedArray
     * @param array - TypedArray to find minimum
     * @returns Minimum value
     */
    static minTypedArray(array: Int32Array | Float64Array): Promise<number>;
    /**
     * ZERO-COPY: Fast max for TypedArray
     * @param array - TypedArray to find maximum
     * @returns Maximum value
     */
    static maxTypedArray(array: Int32Array | Float64Array): Promise<number>;
    /**
     * Filter array with optimized predicates
     * @example
     * filter([1, 5, 10, 15], { gt: 10 }) // [15]
     * filter([1, 5, 10, 15], { between: [5, 10] }) // [5, 10]
     * filter(users, { where: u => u.age > 18 })
     */
    static filter<T>(array: T[], options: FilterOptions<T>): Promise<T[]>;
    private static filterNumeric;
    /**
     * ZERO-COPY Filter for TypedArrays
     * 60x faster than regular filter for large arrays
     * @example
     * const data = new Int32Array(10_000_000);
     * const filtered = await VeloData.filterTyped(data, { gt: 500 });
     */
    static filterTyped(array: Int32Array | Float64Array, options: FilterOptions<number>): Promise<Int32Array | Float64Array>;
    /**
     * Group array by key with optional aggregations
     * @example
     * groupBy(users, { by: u => u.country })
     * groupBy(sales, { by: s => s.category, aggregate: { sum: 'amount', count: true } })
     */
    static groupBy<T, K extends string | number>(array: T[], options: GroupByOptions<T, K>): Promise<Map<K, T[] | any>>;
    private static groupByAggregateOptimized;
    /**
     * Get unique values from array
     * @example
     * unique([1, 2, 2, 3, 1]) // [1, 2, 3]
     * unique(users, { by: u => u.email })
     */
    static unique<T>(array: T[], options?: {
        by?: (item: T) => any;
    }): Promise<T[]>;
    /**
     * ZERO-COPY Aggregate for TypedArrays
     * 60x faster for large arrays
     * @example
     * const data = new Float64Array(10_000_000);
     * const stats = await VeloData.aggregateTyped(data, { sum: true, avg: true });
     */
    static aggregateTyped(array: Float64Array, options?: AggregateOptions): Promise<AggregateResult>;
    /**
     * Aggregate statistics on numeric array
     * @example
     * aggregate([1, 2, 3, 4, 5], { avg: true, stdDev: true })
     * // { avg: 3, stdDev: 1.58 }
     */
    static aggregate(array: number[] | Float64Array, options?: AggregateOptions): Promise<AggregateResult>;
    /**
     * Join two arrays on matching keys
     * @example
     * join({
     *   left: orders,
     *   right: customers,
     *   on: { left: 'customerId', right: 'id' },
     *   type: 'inner'
     * })
     */
    static join<L, R>(options: JoinOptions<L, R>): Promise<Array<L & R>>;
    private static _extractKeys;
    /**
     * Create pivot table with aggregation
     * @example
     * pivot({
     *   data: sales,
     *   rows: s => s.product,
     *   columns: s => s.month,
     *   values: s => s.revenue,
     *   aggregate: 'sum'
     * })
     */
    static pivot<T>(options: PivotOptions<T>): Promise<Map<number, Map<number, number>>>;
    /**
     * Window functions over partitioned and ordered data
     * @example
     * window({
     *   data: transactions,
     *   partitionBy: t => t.accountId,
     *   orderBy: t => t.date,
     *   functions: {
     *     runningSum: t => t.amount,
     *     lag: { field: t => t.amount, offset: 1 }
     *   }
     * })
     */
    static window<T>(options: WindowOptions<T>): Promise<T[]>;
    /**
     * Create streaming processor for large datasets
     * @example
     * const stream = VeloData.createStream(10000);
     * stream.push([1, 2, 3, 4, 5]);
     * const chunk = stream.processNext();
     */
    static createStream(chunkSize?: number): Promise<StreamProcessor>;
    /**
     * Detect if array is already sorted (ascending, descending, or neither)
     * Optimized with early exit for non-sorted arrays
     */
    private static detectSortPattern;
}
/**
 * Streaming processor class for large datasets
 */
export declare class StreamProcessor {
    private processor;
    private wasm;
    constructor(wasm: any, chunkSize: number);
    /**
     * Push data to stream buffer
     */
    push(data: number[]): void;
    /**
     * Process next chunk
     */
    processNext(): number[] | null;
    /**
     * Flush remaining data
     */
    flush(): number[];
    /**
     * Get count of processed items
     */
    getProcessedCount(): number;
    /**
     * Create aggregator for streaming stats
     */
    aggregate(): Promise<AggregateResult>;
}
export default VeloData;
export declare const sort: typeof VeloData.sort, sortTyped: typeof VeloData.sortTyped, filter: typeof VeloData.filter, filterTyped: typeof VeloData.filterTyped, groupBy: typeof VeloData.groupBy, unique: typeof VeloData.unique, aggregate: typeof VeloData.aggregate, aggregateTyped: typeof VeloData.aggregateTyped, join: typeof VeloData.join, pivot: typeof VeloData.pivot, windowFn: typeof VeloData.window, createStream: typeof VeloData.createStream;
export * from './ultra-fast.js';
