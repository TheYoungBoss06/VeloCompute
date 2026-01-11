let wasmModule = null;
let wasmInitPromise = null;
export async function loadWasm() {
    if (wasmModule) {
        return wasmModule;
    }
    if (wasmInitPromise) {
        return wasmInitPromise;
    }
    wasmInitPromise = (async () => {
        try {
            // Dynamic import of WASM module
            const wasm = await import('../wasm/velo_compute.js');
            // For Node.js, we need to pass the wasm file path
            if (typeof process !== 'undefined' && process.versions && process.versions.node) {
                // Node.js environment
                const fs = await import('fs');
                const path = await import('path');
                const url = await import('url');
                const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
                const wasmPath = path.join(__dirname, '../wasm/velo_compute_bg.wasm');
                const wasmBuffer = fs.readFileSync(wasmPath);
                await wasm.default(wasmBuffer);
            }
            else {
                // Browser environment
                await wasm.default();
            }
            wasmModule = {
                // Fase 1: Sort
                sort_i32: wasm.sort_i32,
                sort_f64: wasm.sort_f64,
                sort_u32: wasm.sort_u32,
                sort_by_key_i32: wasm.sort_by_key_i32,
                sort_by_key_f64: wasm.sort_by_key_f64,
                // Fase 2: Filter
                FilterContext: wasm.FilterContext,
                filter_f64_range: wasm.filter_f64_range,
                filter_f64_compare: wasm.filter_f64_compare,
                filter_u32_compare: wasm.filter_u32_compare,
                // Fase 2: GroupBy
                GroupByResult: wasm.GroupByResult,
                GroupByAggregate: wasm.GroupByAggregate,
                groupby_sum_i32: wasm.groupby_sum_i32,
                groupby_count_i32: wasm.groupby_count_i32,
                // Fase 2: Unique
                UniqueContext: wasm.UniqueContext,
                unique_u32: wasm.unique_u32,
                unique_f64: wasm.unique_f64,
                unique_f64_with_counts: wasm.unique_f64_with_counts,
                count_unique_i32: wasm.count_unique_i32,
                count_unique_f64: wasm.count_unique_f64,
                unique_i32_adaptive: wasm.unique_i32_adaptive,
                // Fase 2: Aggregate
                aggregate_f64: wasm.aggregate_f64,
                aggregate_i32: wasm.aggregate_i32,
                sum_f64: wasm.sum_f64,
                sum_i32: wasm.sum_i32,
                mean_f64: wasm.mean_f64,
                mean_i32: wasm.mean_i32,
                min_f64: wasm.min_f64,
                max_f64: wasm.max_f64,
                min_i32: wasm.min_i32,
                max_i32: wasm.max_i32,
                weighted_mean: wasm.weighted_mean,
                percentile_f64: wasm.percentile_f64,
                median_f64: wasm.median_f64,
                quartiles_f64: wasm.quartiles_f64,
                // EXTREME PERFORMANCE: Specialized hyper-optimized functions
                filter_i32_gt_power2: wasm.filter_i32_gt_power2,
                filter_i32_gt_counting: wasm.filter_i32_gt_counting,
                sum_f64_kahan: wasm.sum_f64_kahan,
                aggregate_f64_hyper: wasm.aggregate_f64_hyper,
                // PHASE 3: Advanced operations
                // Join
                HashJoin: wasm.HashJoin,
                JoinType: wasm.JoinType,
                JoinResult: wasm.JoinResult,
                SortMergeJoin: wasm.SortMergeJoin,
                nested_loop_join_i32: wasm.nested_loop_join_i32,
                semi_join_i32: wasm.semi_join_i32,
                anti_join_i32: wasm.anti_join_i32,
                // Pivot
                PivotTable: wasm.PivotTable,
                // Window
                WindowContext: wasm.WindowContext,
                // Streaming
                StreamProcessor: wasm.StreamProcessor,
                StreamAggregator: wasm.StreamAggregator,
                StreamFilter: wasm.StreamFilter,
            };
            return wasmModule;
        }
        catch (error) {
            wasmInitPromise = null;
            throw new Error(`Failed to load WASM module: ${error}`);
        }
    })();
    return wasmInitPromise;
}
export function getWasmSync() {
    if (!wasmModule) {
        throw new Error('WASM module not loaded. Call loadWasm() first or use async methods.');
    }
    return wasmModule;
}
