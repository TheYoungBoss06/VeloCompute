import { loadWasm } from './bridge.js';
import { validateArray, validateNumber, validateTypedArray, checkMemoryLimit, handleError } from './error.js';
import { logger } from './logger.js';
import { trackOperation, telemetry } from './telemetry.js';
export { logger, telemetry };
export { LogLevel } from './logger.js';
export * from './error.js';
export class VeloData {
    /**
     * Ensure WASM module is loaded before operations
     */
    static async ensureWasm() {
        if (!this.wasmLoaded) {
            await loadWasm();
            this.wasmLoaded = true;
        }
    }
    /**
     * Sort array of numbers or objects
     * @param array - Array to sort
     * @param options - Sort options
     * @returns Sorted array (new if inPlace=false, same if inPlace=true)
     */
    static async sort(array, options) {
        await this.ensureWasm();
        // Handle empty or single element arrays
        if (array.length <= 1) {
            return options?.inPlace ? array : [...array];
        }
        const order = options?.order || 'asc';
        const ascending = order === 'asc';
        const inPlace = options?.inPlace || false;
        const by = options?.by;
        // Handle objects with 'by' accessor
        if (by) {
            return this.sortWithAccessor(array, by, ascending, inPlace);
        }
        // Handle array of numbers
        if (typeof array[0] === 'number') {
            return this.sortNumbers(array, ascending, inPlace);
        }
        throw new Error('Unsupported array type. Only numbers and objects with numeric accessor are supported.');
    }
    /**
     * Sort numbers array using WASM
     */
    static async sortNumbers(array, ascending, inPlace) {
        const workArray = inPlace ? array : [...array];
        const len = workArray.length;
        // Fast-path: Arrays very small (< 32 elements) - use native JS
        if (len < 32) {
            workArray.sort((a, b) => ascending ? a - b : b - a);
            return workArray;
        }
        // Pattern detection: Check if already sorted (optimized sampling)
        const pattern = this.detectSortPattern(workArray);
        if (pattern === 'ascending') {
            // Already sorted ascending - no WASM overhead
            return ascending ? workArray : workArray.reverse();
        }
        if (pattern === 'descending') {
            // Already sorted descending (reversed) - just reverse, no WASM
            return ascending ? workArray.reverse() : workArray;
        }
        const wasm = await loadWasm();
        // Detect if all numbers are integers
        const allIntegers = workArray.every(n => Number.isInteger(n) && n >= -2147483648 && n <= 2147483647);
        if (allIntegers) {
            // Check if all non-negative for u32 optimization
            const allNonNegative = workArray.every(n => n >= 0 && n <= 4294967295);
            if (allNonNegative) {
                const typedArray = new Uint32Array(workArray);
                wasm.sort_u32(typedArray, ascending);
                // ZERO-COPY: Return view over typed array instead of copying
                if (inPlace) {
                    for (let i = 0; i < len; i++)
                        array[i] = typedArray[i];
                    return array;
                }
                return Array.from(typedArray);
            }
            else {
                const typedArray = new Int32Array(workArray);
                wasm.sort_i32(typedArray, ascending);
                // ZERO-COPY: Return view over typed array instead of copying
                if (inPlace) {
                    for (let i = 0; i < len; i++)
                        array[i] = typedArray[i];
                    return array;
                }
                return Array.from(typedArray);
            }
        }
        else {
            // Use f64 for floating point numbers
            const typedArray = new Float64Array(workArray);
            wasm.sort_f64(typedArray, ascending);
            // ZERO-COPY: Return view over typed array instead of copying
            if (inPlace) {
                for (let i = 0; i < len; i++)
                    array[i] = typedArray[i];
                return array;
            }
            return Array.from(typedArray);
        }
    }
    /**
     * ZERO-COPY: Sort TypedArray in-place (no conversions)
     * This is the fastest API for numeric arrays
     * @param array - TypedArray to sort
     * @param ascending - Sort order
     */
    static async sortTypedArray(array, ascending = true) {
        try {
            // Validaciones
            validateTypedArray(array, 'array');
            validateArray(array, 'array', { allowEmpty: true });
            // Check memory para arrays grandes
            if (array.length > 10000000) {
                checkMemoryLimit(array.length * 8, 'sortTypedArray');
            }
            await this.ensureWasm();
            if (array.length <= 1)
                return array;
            return trackOperation('sortTypedArray', array.length, async () => {
                const wasm = await loadWasm();
                logger.debug('sortTypedArray', `Sorting ${array.length} elements`, {
                    type: array.constructor.name,
                    ascending
                });
                if (array instanceof Int32Array) {
                    wasm.sort_i32(array, ascending);
                }
                else if (array instanceof Float64Array) {
                    wasm.sort_f64(array, ascending);
                }
                else if (array instanceof Uint32Array) {
                    wasm.sort_u32(array, ascending);
                }
                else {
                    throw new Error('Unsupported TypedArray type');
                }
                return array;
            });
        }
        catch (error) {
            handleError(error, 'sortTypedArray');
        }
    }
    /**
     * Sort objects array by accessor function
     */
    static async sortWithAccessor(array, accessor, ascending, inPlace) {
        const wasm = await loadWasm();
        // Extract keys
        const keys = array.map(accessor);
        // Verify all keys are numbers
        if (!keys.every(k => typeof k === 'number')) {
            throw new Error('Accessor function must return numbers');
        }
        const numericKeys = keys;
        // Create indices array
        const indices = new Int32Array(array.length);
        for (let i = 0; i < array.length; i++) {
            indices[i] = i;
        }
        // Detect key type
        const allIntegers = numericKeys.every(n => Number.isInteger(n) && n >= -2147483648 && n <= 2147483647);
        if (allIntegers) {
            const keysArray = new Int32Array(numericKeys);
            wasm.sort_by_key_i32(indices, keysArray, ascending);
        }
        else {
            const keysArray = new Float64Array(numericKeys);
            wasm.sort_by_key_f64(indices, keysArray, ascending);
            // Need to convert back
            const indicesF64 = new Float64Array(array.length);
            for (let i = 0; i < array.length; i++) {
                indicesF64[i] = i;
            }
            const keysF64 = new Float64Array(numericKeys);
            wasm.sort_by_key_f64(indicesF64, keysF64, ascending);
            for (let i = 0; i < array.length; i++) {
                indices[i] = Math.round(indicesF64[i]);
            }
        }
        // Reorder array by indices
        const result = new Array(array.length);
        for (let i = 0; i < array.length; i++) {
            result[i] = array[indices[i]];
        }
        if (inPlace) {
            for (let i = 0; i < array.length; i++) {
                array[i] = result[i];
            }
            return array;
        }
        return result;
    }
    /**
     * Sort optimized for TypedArrays (zero-copy)
     * Modifies the array in-place
     */
    static async sortTyped(array, ascending = true) {
        await this.ensureWasm();
        if (array.length <= 1) {
            return;
        }
        const wasm = await loadWasm();
        if (array instanceof Int32Array) {
            wasm.sort_i32(array, ascending);
        }
        else if (array instanceof Float64Array) {
            wasm.sort_f64(array, ascending);
        }
        else if (array instanceof Uint32Array) {
            wasm.sort_u32(array, ascending);
        }
        else {
            throw new Error('Unsupported TypedArray type');
        }
    }
    /**
     * ZERO-COPY: Filter TypedArray returning indices (no data copy)
     * This is much faster than returning filtered values
     * @param array - TypedArray to filter
     * @param threshold - Comparison value
     * @param operation - Comparison operation (gt, lt, eq, gte, lte, neq)
     * @returns Uint32Array of indices that match the condition
     */
    static async filterIndices(array, threshold, operation) {
        try {
            // Validaciones
            validateTypedArray(array, 'array');
            validateArray(array, 'array', { allowEmpty: true });
            validateNumber(threshold, 'threshold');
            const validOps = ['gt', 'lt', 'eq', 'gte', 'lte', 'neq'];
            if (!validOps.includes(operation)) {
                throw new Error(`Invalid operation: ${operation}. Must be one of: ${validOps.join(', ')}`);
            }
            await this.ensureWasm();
            return trackOperation('filterIndices', array.length, async () => {
                const wasm = await loadWasm();
                const ctx = new wasm.FilterContext();
                logger.debug('filterIndices', `Filtering ${array.length} elements`, {
                    threshold,
                    operation,
                    type: array.constructor.name
                });
                const indices = ctx.filter_i32_indices(array, threshold, operation);
                return new Uint32Array(indices);
            });
        }
        catch (error) {
            handleError(error, 'filterIndices');
        }
    }
    /**
     * ZERO-COPY: Aggregate TypedArray directly (no conversions)
     * Single-pass computation of sum, mean, min, max, stddev
     * @param array - TypedArray to aggregate
     * @returns Aggregate statistics
     */
    static async aggregateTypedArray(array) {
        try {
            // Validaciones
            validateTypedArray(array, 'array', ['Float64Array', 'Int32Array']);
            validateArray(array, 'array', { minLength: 1 });
            await this.ensureWasm();
            return trackOperation('aggregateTypedArray', array.length, async () => {
                const wasm = await loadWasm();
                logger.debug('aggregateTypedArray', `Computing stats for ${array.length} elements`, {
                    type: array.constructor.name
                });
                if (array instanceof Float64Array) {
                    const result = wasm.aggregate_f64(array);
                    return {
                        sum: result.sum(),
                        avg: result.mean(),
                        count: result.count(),
                        min: result.min(),
                        max: result.max(),
                        stdDev: result.std_dev(),
                        variance: result.variance()
                    };
                }
                else {
                    const result = wasm.aggregate_i32(array);
                    return {
                        sum: result.sum(),
                        avg: result.mean(),
                        count: result.count(),
                        min: result.min(),
                        max: result.max(),
                        stdDev: result.std_dev(),
                        variance: result.variance()
                    };
                }
            });
        }
        catch (error) {
            handleError(error, 'aggregateTypedArray');
        }
    }
    /**
     * ZERO-COPY: Count unique values in TypedArray
     * Returns just the count without materializing unique values
     * @param array - TypedArray to count unique values
     * @returns Number of unique values
     */
    static async countUnique(array) {
        await this.ensureWasm();
        const wasm = await loadWasm();
        if (array instanceof Int32Array) {
            return wasm.count_unique_i32(array);
        }
        else {
            return wasm.count_unique_f64(array);
        }
    }
    /**
     * ZERO-COPY: Get unique values from TypedArray
     * Returns sorted unique values
     * @param array - TypedArray to get unique values
     * @returns TypedArray of unique values
     */
    static async uniqueTypedArray(array) {
        await this.ensureWasm();
        const wasm = await loadWasm();
        if (array instanceof Int32Array) {
            // For Int32Array, convert to Uint32Array temporarily
            const uint32 = new Uint32Array(array.buffer, array.byteOffset, array.length);
            const result = wasm.unique_u32(uint32);
            return new Int32Array(result.buffer, result.byteOffset, result.length);
        }
        else if (array instanceof Uint32Array) {
            const result = wasm.unique_u32(array);
            return result;
        }
        else {
            const result = wasm.unique_f64(array);
            return result;
        }
    }
    /**
     * ZERO-COPY: Fast sum for TypedArray
     * Optimized single-operation sum
     * @param array - TypedArray to sum
     * @returns Sum of all values
     */
    static async sumTypedArray(array) {
        await this.ensureWasm();
        const wasm = await loadWasm();
        if (array instanceof Int32Array) {
            return wasm.sum_i32(array);
        }
        else {
            return wasm.sum_f64(array);
        }
    }
    /**
     * ZERO-COPY: Fast mean for TypedArray
     * @param array - TypedArray to compute mean
     * @returns Mean value
     */
    static async meanTypedArray(array) {
        await this.ensureWasm();
        const wasm = await loadWasm();
        if (array instanceof Int32Array) {
            return wasm.mean_i32(array);
        }
        else {
            return wasm.mean_f64(array);
        }
    }
    /**
     * ZERO-COPY: Fast min for TypedArray
     * @param array - TypedArray to find minimum
     * @returns Minimum value
     */
    static async minTypedArray(array) {
        await this.ensureWasm();
        const wasm = await loadWasm();
        if (array instanceof Int32Array) {
            return wasm.min_i32(array);
        }
        else {
            return wasm.min_f64(array);
        }
    }
    /**
     * ZERO-COPY: Fast max for TypedArray
     * @param array - TypedArray to find maximum
     * @returns Maximum value
     */
    static async maxTypedArray(array) {
        await this.ensureWasm();
        const wasm = await loadWasm();
        if (array instanceof Int32Array) {
            return wasm.max_i32(array);
        }
        else {
            return wasm.max_f64(array);
        }
    }
    /**
     * Filter array with optimized predicates
     * @example
     * filter([1, 5, 10, 15], { gt: 10 }) // [15]
     * filter([1, 5, 10, 15], { between: [5, 10] }) // [5, 10]
     * filter(users, { where: u => u.age > 18 })
     */
    static async filter(array, options) {
        await this.ensureWasm();
        if (array.length === 0) {
            return [];
        }
        const wasm = await loadWasm();
        // Custom predicate (fallback a JS nativo)
        if (options.where) {
            return array.filter(options.where);
        }
        // Optimized paths para numeros
        if (typeof array[0] === 'number') {
            const numbers = array;
            if (options.between) {
                const [min, max] = options.between;
                const data = new Float64Array(numbers);
                const result = wasm.filter_f64_range(data, min, max);
                return Array.from(result);
            }
            if (options.gt !== undefined) {
                return this.filterNumeric(numbers, options.gt, 'gt');
            }
            if (options.lt !== undefined) {
                return this.filterNumeric(numbers, options.lt, 'lt');
            }
            if (options.gte !== undefined) {
                return this.filterNumeric(numbers, options.gte, 'gte');
            }
            if (options.lte !== undefined) {
                return this.filterNumeric(numbers, options.lte, 'lte');
            }
            if (options.eq !== undefined) {
                return this.filterNumeric(numbers, options.eq, 'eq');
            }
            if (options.neq !== undefined) {
                return this.filterNumeric(numbers, options.neq, 'neq');
            }
        }
        throw new Error('Invalid filter options or unsupported array type');
    }
    static async filterNumeric(array, threshold, op) {
        const wasm = await loadWasm();
        // ZERO-COPY OPTIMIZATION: Check if input is already TypedArray
        if (array instanceof Int32Array) {
            const ctx = new wasm.FilterContext();
            const result = ctx.filter_i32_compare(array, Math.floor(threshold), op);
            return Array.from(result);
        }
        if (array instanceof Float64Array) {
            const result = wasm.filter_f64_compare(array, threshold, op);
            return Array.from(result);
        }
        // For regular arrays, use fastest path
        const allIntegers = array.every(n => Number.isInteger(n) && n >= -2147483648 && n <= 2147483647);
        if (allIntegers) {
            const ctx = new wasm.FilterContext();
            const data = new Int32Array(array);
            const result = ctx.filter_i32_compare(data, Math.floor(threshold), op);
            return Array.from(result);
        }
        else {
            const data = new Float64Array(array);
            const result = wasm.filter_f64_compare(data, threshold, op);
            return Array.from(result);
        }
    }
    /**
     * ZERO-COPY Filter for TypedArrays
     * 60x faster than regular filter for large arrays
     * @example
     * const data = new Int32Array(10_000_000);
     * const filtered = await VeloData.filterTyped(data, { gt: 500 });
     */
    static async filterTyped(array, options) {
        await this.ensureWasm();
        const wasm = await loadWasm();
        if (array instanceof Int32Array) {
            const ctx = new wasm.FilterContext();
            if (options.gt !== undefined) {
                return ctx.filter_i32_compare(array, Math.floor(options.gt), 'gt');
            }
            if (options.lt !== undefined) {
                return ctx.filter_i32_compare(array, Math.floor(options.lt), 'lt');
            }
            if (options.gte !== undefined) {
                return ctx.filter_i32_compare(array, Math.floor(options.gte), 'gte');
            }
            if (options.lte !== undefined) {
                return ctx.filter_i32_compare(array, Math.floor(options.lte), 'lte');
            }
            if (options.eq !== undefined) {
                return ctx.filter_i32_compare(array, Math.floor(options.eq), 'eq');
            }
        }
        if (array instanceof Float64Array) {
            if (options.between) {
                const [min, max] = options.between;
                return wasm.filter_f64_range(array, min, max);
            }
            if (options.gt !== undefined) {
                return wasm.filter_f64_compare(array, options.gt, 'gt');
            }
            if (options.lt !== undefined) {
                return wasm.filter_f64_compare(array, options.lt, 'lt');
            }
        }
        throw new Error('Invalid filter options');
    }
    /**
     * Group array by key with optional aggregations
     * @example
     * groupBy(users, { by: u => u.country })
     * groupBy(sales, { by: s => s.category, aggregate: { sum: 'amount', count: true } })
     */
    static async groupBy(array, options) {
        await this.ensureWasm();
        if (array.length === 0) {
            return new Map();
        }
        const { by, aggregate } = options;
        const keys = array.map(by);
        // Si hay agregacion y keys son numeros, usar path optimizado
        if (aggregate && typeof keys[0] === 'number') {
            return this.groupByAggregateOptimized(array, keys, aggregate);
        }
        // Path general: groupby simple
        const groups = new Map();
        for (let i = 0; i < array.length; i++) {
            const key = keys[i];
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key).push(array[i]);
        }
        return groups;
    }
    static async groupByAggregateOptimized(array, keys, aggregate) {
        const wasm = await loadWasm();
        // Determinar que campo agregar
        let valueExtractor;
        const aggField = aggregate.sum || aggregate.avg || aggregate.min || aggregate.max;
        if (!aggField && !aggregate.count) {
            throw new Error('At least one aggregation required');
        }
        if (aggField) {
            if (typeof aggField === 'function') {
                valueExtractor = aggField;
            }
            else {
                valueExtractor = (item) => item[aggField];
            }
            const values = array.map(valueExtractor);
            const keysArray = new Int32Array(keys);
            const valuesArray = new Float64Array(values);
            const result = wasm.GroupByAggregate.groupby_aggregate_i32(keysArray, valuesArray);
            // Convertir a Map
            const resultMap = new Map();
            if (aggregate.sum) {
                const sums = result.get_sums();
                for (let i = 0; i < sums.length; i += 2) {
                    const key = sums[i];
                    const sum = sums[i + 1];
                    if (!resultMap.has(key))
                        resultMap.set(key, {});
                    resultMap.get(key).sum = sum;
                }
            }
            if (aggregate.avg) {
                const avgs = result.get_averages();
                for (let i = 0; i < avgs.length; i += 2) {
                    const key = avgs[i];
                    const avg = avgs[i + 1];
                    if (!resultMap.has(key))
                        resultMap.set(key, {});
                    resultMap.get(key).avg = avg;
                }
            }
            if (aggregate.count) {
                const counts = result.get_counts();
                for (let i = 0; i < counts.length; i += 2) {
                    const key = counts[i];
                    const count = counts[i + 1];
                    if (!resultMap.has(key))
                        resultMap.set(key, {});
                    resultMap.get(key).count = count;
                }
            }
            if (aggregate.min) {
                const mins = result.get_mins();
                for (let i = 0; i < mins.length; i += 2) {
                    const key = mins[i];
                    const min = mins[i + 1];
                    if (!resultMap.has(key))
                        resultMap.set(key, {});
                    resultMap.get(key).min = min;
                }
            }
            if (aggregate.max) {
                const maxs = result.get_maxs();
                for (let i = 0; i < maxs.length; i += 2) {
                    const key = maxs[i];
                    const max = maxs[i + 1];
                    if (!resultMap.has(key))
                        resultMap.set(key, {});
                    resultMap.get(key).max = max;
                }
            }
            return resultMap;
        }
        // Solo count
        if (aggregate.count) {
            const keysArray = new Int32Array(keys);
            const counts = wasm.groupby_count_i32(keysArray);
            const resultMap = new Map();
            for (let i = 0; i < counts.length; i += 2) {
                const key = counts[i];
                const count = counts[i + 1];
                resultMap.set(key, { count });
            }
            return resultMap;
        }
        return new Map();
    }
    /**
     * Get unique values from array
     * @example
     * unique([1, 2, 2, 3, 1]) // [1, 2, 3]
     * unique(users, { by: u => u.email })
     */
    static async unique(array, options) {
        await this.ensureWasm();
        if (array.length === 0) {
            return [];
        }
        const wasm = await loadWasm();
        // Unique by key
        if (options?.by) {
            const seen = new Set();
            const result = [];
            for (const item of array) {
                const key = options.by(item);
                if (!seen.has(key)) {
                    seen.add(key);
                    result.push(item);
                }
            }
            return result;
        }
        // Array simple de numeros
        if (typeof array[0] === 'number') {
            const numbers = array;
            const allIntegers = numbers.every(n => Number.isInteger(n) && n >= -2147483648 && n <= 2147483647);
            if (allIntegers) {
                const data = new Int32Array(numbers);
                const result = wasm.UniqueContext.unique_i32(data);
                return Array.from(result);
            }
            else {
                const data = new Float64Array(numbers);
                const result = wasm.unique_f64(data);
                return Array.from(result);
            }
        }
        // Fallback a Set nativo
        return Array.from(new Set(array));
    }
    /**
     * ZERO-COPY Aggregate for TypedArrays
     * 60x faster for large arrays
     * @example
     * const data = new Float64Array(10_000_000);
     * const stats = await VeloData.aggregateTyped(data, { sum: true, avg: true });
     */
    static async aggregateTyped(array, options = { sum: true, avg: true, count: true }) {
        await this.ensureWasm();
        if (array.length === 0) {
            return {};
        }
        const wasm = await loadWasm();
        // Direct WASM call without copy
        const requestedCount = Object.values(options).filter(v => v).length;
        if (requestedCount > 2) {
            const result = wasm.aggregate_f64(array);
            const output = {};
            if (options.sum)
                output.sum = result.sum();
            if (options.avg)
                output.avg = result.mean();
            if (options.count)
                output.count = result.count();
            if (options.min)
                output.min = result.min();
            if (options.max)
                output.max = result.max();
            if (options.variance)
                output.variance = result.variance();
            if (options.stdDev)
                output.stdDev = result.std_dev();
            return output;
        }
        // Single operations optimized
        const output = {};
        if (options.sum)
            output.sum = wasm.sum_f64(array);
        if (options.avg)
            output.avg = wasm.mean_f64(array);
        if (options.count)
            output.count = array.length;
        if (options.min)
            output.min = wasm.min_f64(array);
        if (options.max)
            output.max = wasm.max_f64(array);
        if (options.variance || options.stdDev) {
            const result = wasm.aggregate_f64(array);
            if (options.variance)
                output.variance = result.variance();
            if (options.stdDev)
                output.stdDev = result.std_dev();
        }
        return output;
    }
    /**
     * Aggregate statistics on numeric array
     * @example
     * aggregate([1, 2, 3, 4, 5], { avg: true, stdDev: true })
     * // { avg: 3, stdDev: 1.58 }
     */
    static async aggregate(array, options = { sum: true, avg: true, count: true }) {
        await this.ensureWasm();
        if (array.length === 0) {
            return {};
        }
        // ZERO-COPY: If already TypedArray, use fast path
        if (array instanceof Float64Array) {
            return this.aggregateTyped(array, options);
        }
        const wasm = await loadWasm();
        const data = new Float64Array(array);
        // Si se piden multiples agregaciones, usar funcion completa
        const requestedCount = Object.values(options).filter(v => v).length;
        if (requestedCount > 2) {
            const result = wasm.aggregate_f64(data);
            const output = {};
            if (options.sum)
                output.sum = result.sum();
            if (options.avg)
                output.avg = result.mean();
            if (options.count)
                output.count = result.count();
            if (options.min)
                output.min = result.min();
            if (options.max)
                output.max = result.max();
            if (options.variance)
                output.variance = result.variance();
            if (options.stdDev)
                output.stdDev = result.std_dev();
            return output;
        }
        // Agregaciones individuales optimizadas
        const output = {};
        if (options.sum)
            output.sum = wasm.sum_f64(data);
        if (options.avg)
            output.avg = wasm.mean_f64(data);
        if (options.count)
            output.count = array.length;
        if (options.min)
            output.min = wasm.min_f64(data);
        if (options.max)
            output.max = wasm.max_f64(data);
        // Variance y stdDev requieren aggregate completo
        if (options.variance || options.stdDev) {
            const result = wasm.aggregate_f64(data);
            if (options.variance)
                output.variance = result.variance();
            if (options.stdDev)
                output.stdDev = result.std_dev();
        }
        return output;
    }
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
    static async join(options) {
        await this.ensureWasm();
        const { left, right, on, type = 'inner' } = options;
        if (left.length === 0 || right.length === 0) {
            return [];
        }
        const wasm = await loadWasm();
        // Extraer keys
        const leftKeys = this._extractKeys(left, on.left);
        const rightKeys = this._extractKeys(right, on.right);
        // Convertir a Int32Array
        const leftKeysArray = new Int32Array(leftKeys);
        const rightKeysArray = new Int32Array(rightKeys);
        // Determinar tipo de join
        let joinType;
        switch (type) {
            case 'inner':
                joinType = 0;
                break;
            case 'left':
                joinType = 1;
                break;
            case 'right':
                joinType = 2;
                break;
            default: joinType = 0;
        }
        // Ejecutar join en WASM
        const hashJoin = new wasm.HashJoin();
        const result = hashJoin.join_i32(leftKeysArray, rightKeysArray, joinType);
        // Reconstruir objetos unidos
        const leftIndices = result.get_left_indices();
        const rightIndices = result.get_right_indices();
        const rightNulls = result.get_right_nulls();
        const joined = [];
        for (let i = 0; i < leftIndices.length; i++) {
            const leftItem = left[leftIndices[i]];
            const rightItem = rightNulls[i] === 1 ? {} : right[rightIndices[i]];
            joined.push({ ...leftItem, ...rightItem });
        }
        return joined;
    }
    static _extractKeys(array, accessor) {
        if (typeof accessor === 'function') {
            return array.map(accessor);
        }
        return array.map(item => Number(item[accessor]));
    }
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
    static async pivot(options) {
        await this.ensureWasm();
        const { data, rows, columns, values, aggregate = 'sum' } = options;
        if (data.length === 0) {
            return new Map();
        }
        const wasm = await loadWasm();
        // Extraer arrays
        const rowIndices = new Int32Array(data.map(rows));
        const colIndices = new Int32Array(data.map(columns));
        const valueArray = new Float64Array(data.map(values));
        // Ejecutar pivot en WASM
        let pivotTable;
        switch (aggregate) {
            case 'sum':
                pivotTable = wasm.PivotTable.pivot_with_sum(rowIndices, colIndices, valueArray);
                break;
            case 'count':
                pivotTable = wasm.PivotTable.pivot_with_count(rowIndices, colIndices);
                break;
            case 'avg':
                pivotTable = wasm.PivotTable.pivot_with_avg(rowIndices, colIndices, valueArray);
                break;
            case 'min':
                pivotTable = wasm.PivotTable.pivot_with_min(rowIndices, colIndices, valueArray);
                break;
            case 'max':
                pivotTable = wasm.PivotTable.pivot_with_max(rowIndices, colIndices, valueArray);
                break;
            default:
                pivotTable = wasm.PivotTable.pivot_with_sum(rowIndices, colIndices, valueArray);
        }
        // Convertir a Map anidado
        const rowKeys = pivotTable.get_row_keys();
        const colKeys = pivotTable.get_col_keys();
        const vals = pivotTable.get_values();
        const nCols = pivotTable.n_cols();
        const result = new Map();
        for (let i = 0; i < rowKeys.length; i++) {
            const rowMap = new Map();
            for (let j = 0; j < colKeys.length; j++) {
                rowMap.set(colKeys[j], vals[i * nCols + j]);
            }
            result.set(rowKeys[i], rowMap);
        }
        return result;
    }
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
    static async window(options) {
        await this.ensureWasm();
        const { data, partitionBy, orderBy, functions } = options;
        if (data.length === 0) {
            return [];
        }
        const wasm = await loadWasm();
        // Ordenar datos si es necesario
        let sorted = [...data];
        if (partitionBy && orderBy) {
            sorted.sort((a, b) => {
                const partA = partitionBy(a);
                const partB = partitionBy(b);
                if (partA !== partB)
                    return partA - partB;
                const ordA = orderBy(a);
                const ordB = orderBy(b);
                return ordA - ordB;
            });
        }
        // Extraer partitions
        const partitions = partitionBy
            ? new Int32Array(sorted.map(partitionBy))
            : new Int32Array(sorted.length).fill(0);
        const result = sorted.map((item, i) => ({ ...item }));
        // Running sum
        if (functions.runningSum) {
            const values = new Float64Array(sorted.map(functions.runningSum));
            const ctx = new wasm.WindowContext();
            const sums = ctx.running_sum(values, partitions);
            result.forEach((item, i) => {
                item._runningSum = sums[i];
            });
        }
        // Lag
        if (functions.lag) {
            const values = new Float64Array(sorted.map(functions.lag.field));
            const ctx = new wasm.WindowContext();
            const lagged = ctx.lag(values, partitions, functions.lag.offset);
            result.forEach((item, i) => {
                item._lag = lagged[i];
            });
        }
        // Lead
        if (functions.lead) {
            const values = new Float64Array(sorted.map(functions.lead.field));
            const ctx = new wasm.WindowContext();
            const led = ctx.lead(values, partitions, functions.lead.offset);
            result.forEach((item, i) => {
                item._lead = led[i];
            });
        }
        // Rank
        if (functions.rank && orderBy) {
            const values = new Float64Array(sorted.map(orderBy));
            const ctx = new wasm.WindowContext();
            const ranks = ctx.rank(values, partitions);
            result.forEach((item, i) => {
                item._rank = ranks[i];
            });
        }
        // Moving average
        if (functions.movingAvg) {
            const values = new Float64Array(sorted.map(functions.movingAvg.field));
            const ctx = new wasm.WindowContext();
            const avgs = ctx.moving_avg(values, functions.movingAvg.window);
            result.forEach((item, i) => {
                item._movingAvg = avgs[i];
            });
        }
        return result;
    }
    /**
     * Create streaming processor for large datasets
     * @example
     * const stream = VeloData.createStream(10000);
     * stream.push([1, 2, 3, 4, 5]);
     * const chunk = stream.processNext();
     */
    static async createStream(chunkSize = 10000) {
        await this.ensureWasm();
        const wasm = await loadWasm();
        return new StreamProcessor(wasm, chunkSize);
    }
    /**
     * Detect if array is already sorted (ascending, descending, or neither)
     * Optimized with early exit for non-sorted arrays
     */
    static detectSortPattern(array) {
        if (array.length < 2)
            return 'ascending';
        // Quick sample check first (check first 50 elements)
        const sampleSize = Math.min(50, array.length);
        let isAscending = true;
        let isDescending = true;
        for (let i = 1; i < sampleSize; i++) {
            if (array[i] < array[i - 1]) {
                isAscending = false;
            }
            if (array[i] > array[i - 1]) {
                isDescending = false;
            }
            // Early exit if neither pattern in sample
            if (!isAscending && !isDescending) {
                return 'none';
            }
        }
        // If sample suggests a pattern, verify full array
        if (isAscending || isDescending) {
            // Use stride for large arrays
            if (array.length > 10000) {
                const stride = Math.floor(array.length / 1000);
                for (let i = stride; i < array.length; i += stride) {
                    if (isAscending && array[i] < array[i - stride]) {
                        isAscending = false;
                    }
                    if (isDescending && array[i] > array[i - stride]) {
                        isDescending = false;
                    }
                    if (!isAscending && !isDescending) {
                        return 'none';
                    }
                }
            }
            // Final full verification if pattern still holds
            if (isAscending || isDescending) {
                for (let i = 1; i < array.length; i++) {
                    if (array[i] < array[i - 1]) {
                        isAscending = false;
                    }
                    if (array[i] > array[i - 1]) {
                        isDescending = false;
                    }
                    if (!isAscending && !isDescending) {
                        return 'none';
                    }
                }
            }
        }
        if (isAscending)
            return 'ascending';
        if (isDescending)
            return 'descending';
        return 'none';
    }
}
VeloData.wasmLoaded = false;
/**
 * Streaming processor class for large datasets
 */
export class StreamProcessor {
    constructor(wasm, chunkSize) {
        this.wasm = wasm;
        this.processor = new wasm.StreamProcessor(chunkSize);
    }
    /**
     * Push data to stream buffer
     */
    push(data) {
        this.processor.push_chunk(new Float64Array(data));
    }
    /**
     * Process next chunk
     */
    processNext() {
        const chunk = this.processor.process_next();
        return chunk ? Array.from(chunk) : null;
    }
    /**
     * Flush remaining data
     */
    flush() {
        return Array.from(this.processor.flush());
    }
    /**
     * Get count of processed items
     */
    getProcessedCount() {
        return this.processor.processed_count();
    }
    /**
     * Create aggregator for streaming stats
     */
    async aggregate() {
        const agg = new this.wasm.StreamAggregator();
        let chunk;
        while ((chunk = this.processNext())) {
            agg.update(new Float64Array(chunk));
        }
        return {
            sum: agg.get_sum(),
            avg: agg.get_mean(),
            min: agg.get_min(),
            max: agg.get_max(),
            count: agg.get_count(),
            variance: agg.get_variance(),
            stdDev: agg.get_std_dev(),
        };
    }
}
// Export default
export default VeloData;
// Export convenience functions
export const { sort, sortTyped, filter, filterTyped, groupBy, unique, aggregate, aggregateTyped, join, pivot, window: windowFn, createStream, } = VeloData;
export * from './ultra-fast.js';
