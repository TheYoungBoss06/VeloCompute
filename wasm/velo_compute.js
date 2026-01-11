let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

let cachedInt32ArrayMemory0 = null;
function getInt32ArrayMemory0() {
    if (cachedInt32ArrayMemory0 === null || cachedInt32ArrayMemory0.byteLength === 0) {
        cachedInt32ArrayMemory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64ArrayMemory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

const AggregateResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_aggregateresult_free(ptr >>> 0, 1));

const FilterContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_filtercontext_free(ptr >>> 0, 1));

const GroupByAggregateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_groupbyaggregate_free(ptr >>> 0, 1));

const GroupByResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_groupbyresult_free(ptr >>> 0, 1));

const GroupByResultU32Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_groupbyresultu32_free(ptr >>> 0, 1));

const HashJoinFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hashjoin_free(ptr >>> 0, 1));

const JoinResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_joinresult_free(ptr >>> 0, 1));

const PivotTableFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pivottable_free(ptr >>> 0, 1));

const QuartilesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_quartiles_free(ptr >>> 0, 1));

const SortMergeJoinFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sortmergejoin_free(ptr >>> 0, 1));

const StreamAggregatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_streamaggregator_free(ptr >>> 0, 1));

const StreamFilterFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_streamfilter_free(ptr >>> 0, 1));

const StreamProcessorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_streamprocessor_free(ptr >>> 0, 1));

const UniqueContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_uniquecontext_free(ptr >>> 0, 1));

const WindowContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_windowcontext_free(ptr >>> 0, 1));

/**
 * Resultado de agregacion completa
 */
export class AggregateResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AggregateResult.prototype);
        obj.__wbg_ptr = ptr;
        AggregateResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AggregateResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_aggregateresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    max() {
        const ret = wasm.aggregateresult_max(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    min() {
        const ret = wasm.aggregateresult_min(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    sum() {
        const ret = wasm.aggregateresult_sum(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    mean() {
        const ret = wasm.aggregateresult_mean(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    count() {
        const ret = wasm.aggregateresult_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    std_dev() {
        const ret = wasm.aggregateresult_std_dev(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    variance() {
        const ret = wasm.aggregateresult_variance(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) AggregateResult.prototype[Symbol.dispose] = AggregateResult.prototype.free;

/**
 * Filter ultra-optimizado con SIMD y vectorizacion
 * Procesa 4 elementos simultaneamente cuando es posible
 */
export class FilterContext {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FilterContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_filtercontext_free(ptr, 0);
    }
    /**
     * Filter con multiples condiciones (AND)
     * Mas eficiente que multiples filters secuenciales
     * @param {Int32Array} data
     * @param {Int32Array} thresholds
     * @param {string[]} operations
     * @returns {Int32Array}
     */
    static filter_i32_multi(data, thresholds, operations) {
        const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(thresholds, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayJsValueToWasm0(operations, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.filtercontext_filter_i32_multi(ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v4 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v4;
    }
    /**
     * Filter ultra-optimizado con SIMD para integers
     * Procesa hasta 4 elementos por iteracion
     * @param {Int32Array} data
     * @param {number} threshold
     * @param {string} operation
     * @returns {Int32Array}
     */
    filter_i32_compare(data, threshold, operation) {
        const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(operation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.filtercontext_filter_i32_compare(this.__wbg_ptr, ptr0, len0, threshold, ptr1, len1);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v3;
    }
    /**
     * Retornar indices en lugar de valores (para objetos)
     * @param {Int32Array} data
     * @param {number} threshold
     * @param {string} operation
     * @returns {Uint32Array}
     */
    filter_i32_indices(data, threshold, operation) {
        const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(operation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.filtercontext_filter_i32_indices(this.__wbg_ptr, ptr0, len0, threshold, ptr1, len1);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v3;
    }
    constructor() {
        const ret = wasm.filtercontext_new();
        this.__wbg_ptr = ret >>> 0;
        FilterContextFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}
if (Symbol.dispose) FilterContext.prototype[Symbol.dispose] = FilterContext.prototype.free;

/**
 * GroupBy con agregaciones integradas (un solo paso)
 * Mucho mas eficiente que groupby + agregar despues
 */
export class GroupByAggregate {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GroupByAggregate.prototype);
        obj.__wbg_ptr = ptr;
        GroupByAggregateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GroupByAggregateFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_groupbyaggregate_free(ptr, 0);
    }
    /**
     * Obtener counts por grupo
     * @returns {Float64Array}
     */
    get_counts() {
        const ret = wasm.groupbyaggregate_get_counts(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Obtener numero de grupos
     * @returns {number}
     */
    group_count() {
        const ret = wasm.groupbyaggregate_group_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Obtener promedios por grupo
     * @returns {Float64Array}
     */
    get_averages() {
        const ret = wasm.groupbyaggregate_get_averages(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Obtener std dev por grupo
     * @returns {Float64Array}
     */
    get_std_devs() {
        const ret = wasm.groupbyaggregate_get_std_devs(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Obtener varianzas por grupo
     * @returns {Float64Array}
     */
    get_variances() {
        const ret = wasm.groupbyaggregate_get_variances(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * GroupBy con agregacion completa en un paso
     * keys: Array de keys de grupo (integers)
     * values: Array de valores a agregar (floats)
     * @param {Int32Array} keys
     * @param {Float64Array} values
     * @returns {GroupByAggregate}
     */
    static groupby_aggregate_i32(keys, values) {
        const ptr0 = passArray32ToWasm0(keys, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.groupbyaggregate_groupby_aggregate_i32(ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return GroupByAggregate.__wrap(ret[0]);
    }
    constructor() {
        const ret = wasm.groupbyaggregate_new();
        this.__wbg_ptr = ret >>> 0;
        GroupByAggregateFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Obtener maximos por grupo
     * @returns {Float64Array}
     */
    get_maxs() {
        const ret = wasm.groupbyaggregate_get_maxs(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Obtener minimos por grupo
     * @returns {Float64Array}
     */
    get_mins() {
        const ret = wasm.groupbyaggregate_get_mins(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * Obtener sumas por grupo
     * Retorna vec plano [key1, sum1, key2, sum2, ...]
     * @returns {Float64Array}
     */
    get_sums() {
        const ret = wasm.groupbyaggregate_get_sums(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
}
if (Symbol.dispose) GroupByAggregate.prototype[Symbol.dispose] = GroupByAggregate.prototype.free;

/**
 * Resultado de GroupBy simple (sin agregaciones)
 */
export class GroupByResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GroupByResult.prototype);
        obj.__wbg_ptr = ptr;
        GroupByResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GroupByResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_groupbyresult_free(ptr, 0);
    }
    /**
     * Obtener indices para una key especifica
     * @param {number} key
     * @returns {Uint32Array | undefined}
     */
    get_indices(key) {
        const ret = wasm.groupbyresult_get_indices(this.__wbg_ptr, key);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * Obtener numero de grupos
     * @returns {number}
     */
    group_count() {
        const ret = wasm.groupbyaggregate_group_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Obtener tamanos de grupos
     * Retorna vec plano [key1, size1, key2, size2, ...]
     * @returns {Int32Array}
     */
    group_sizes() {
        const ret = wasm.groupbyresult_group_sizes(this.__wbg_ptr);
        var v1 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * GroupBy para integers (IDs, categorias)
     * Retorna estructura con grupos
     * @param {Int32Array} keys
     * @returns {GroupByResult}
     */
    static groupby_i32(keys) {
        const ptr0 = passArray32ToWasm0(keys, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.groupbyresult_groupby_i32(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return GroupByResult.__wrap(ret[0]);
    }
    /**
     * Obtener keys unicas
     * @returns {Int32Array}
     */
    unique_keys() {
        const ret = wasm.groupbyresult_unique_keys(this.__wbg_ptr);
        var v1 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    constructor() {
        const ret = wasm.groupbyresult_new();
        this.__wbg_ptr = ret >>> 0;
        GroupByResultFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Obtener indices de un grupo por índice
     * @param {number} index
     * @returns {Uint32Array}
     */
    get_group(index) {
        const ret = wasm.groupbyresult_get_group(this.__wbg_ptr, index);
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}
if (Symbol.dispose) GroupByResult.prototype[Symbol.dispose] = GroupByResult.prototype.free;

/**
 * Resultado de GroupBy para u32
 */
export class GroupByResultU32 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GroupByResultU32.prototype);
        obj.__wbg_ptr = ptr;
        GroupByResultU32Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GroupByResultU32Finalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_groupbyresultu32_free(ptr, 0);
    }
    /**
     * @param {number} key
     * @returns {Uint32Array | undefined}
     */
    get_indices(key) {
        const ret = wasm.groupbyresultu32_get_indices(this.__wbg_ptr, key);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * @returns {number}
     */
    group_count() {
        const ret = wasm.groupbyaggregate_group_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Uint32Array}
     */
    unique_keys() {
        const ret = wasm.groupbyresultu32_unique_keys(this.__wbg_ptr);
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {number} index
     * @returns {Uint32Array}
     */
    get_group(index) {
        const ret = wasm.groupbyresultu32_get_group(this.__wbg_ptr, index);
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}
if (Symbol.dispose) GroupByResultU32.prototype[Symbol.dispose] = GroupByResultU32.prototype.free;

/**
 * Hash join optimizado - O(n+m) mejor caso
 * Estrategia: Build hash table con array mas pequeno, probe con el grande
 */
export class HashJoin {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HashJoinFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hashjoin_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.hashjoin_new();
        this.__wbg_ptr = ret >>> 0;
        HashJoinFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Join de integers (IDs, foreign keys)
     * Automaticamente elige build/probe side basado en tamano
     * @param {Int32Array} left_keys
     * @param {Int32Array} right_keys
     * @param {JoinType} join_type
     * @returns {JoinResult}
     */
    static join_i32(left_keys, right_keys, join_type) {
        const ptr0 = passArray32ToWasm0(left_keys, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(right_keys, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.hashjoin_join_i32(ptr0, len0, ptr1, len1, join_type);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return JoinResult.__wrap(ret[0]);
    }
}
if (Symbol.dispose) HashJoin.prototype[Symbol.dispose] = HashJoin.prototype.free;

/**
 * Resultado de join con indices
 */
export class JoinResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(JoinResult.prototype);
        obj.__wbg_ptr = ptr;
        JoinResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JoinResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_joinresult_free(ptr, 0);
    }
    /**
     * @param {number} left
     */
    add_left_only(left) {
        wasm.joinresult_add_left_only(this.__wbg_ptr, left);
    }
    /**
     * @param {number} right
     */
    add_right_only(right) {
        wasm.joinresult_add_right_only(this.__wbg_ptr, right);
    }
    /**
     * @returns {Uint8Array}
     */
    get_left_nulls() {
        const ret = wasm.joinresult_get_left_nulls(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @returns {Uint8Array}
     */
    get_right_nulls() {
        const ret = wasm.joinresult_get_right_nulls(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @returns {Uint32Array}
     */
    get_left_indices() {
        const ret = wasm.joinresult_get_left_indices(this.__wbg_ptr);
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {Uint32Array}
     */
    get_right_indices() {
        const ret = wasm.joinresult_get_right_indices(this.__wbg_ptr);
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {JoinResult}
     */
    static new() {
        const ret = wasm.joinresult_new();
        return JoinResult.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    size() {
        const ret = wasm.joinresult_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} left
     * @param {number} right
     */
    add_pair(left, right) {
        wasm.joinresult_add_pair(this.__wbg_ptr, left, right);
    }
}
if (Symbol.dispose) JoinResult.prototype[Symbol.dispose] = JoinResult.prototype.free;

/**
 * @enum {0 | 1 | 2 | 3}
 */
export const JoinType = Object.freeze({
    Inner: 0, "0": "Inner",
    Left: 1, "1": "Left",
    Right: 2, "2": "Right",
    Full: 3, "3": "Full",
});

/**
 * Tabla pivote con agregaciones
 * Transforma datos de formato largo a ancho
 */
export class PivotTable {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PivotTable.prototype);
        obj.__wbg_ptr = ptr;
        PivotTableFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PivotTableFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pivottable_free(ptr, 0);
    }
    /**
     * @returns {Float64Array}
     */
    get_values() {
        const ret = wasm.pivottable_get_values(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    /**
     * @returns {Int32Array}
     */
    get_col_keys() {
        const ret = wasm.pivottable_get_col_keys(this.__wbg_ptr);
        var v1 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {Int32Array}
     */
    get_row_keys() {
        const ret = wasm.pivottable_get_row_keys(this.__wbg_ptr);
        var v1 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Pivot con promedio
     * @param {Int32Array} row_indices
     * @param {Int32Array} col_indices
     * @param {Float64Array} values
     * @returns {PivotTable}
     */
    static pivot_with_avg(row_indices, col_indices, values) {
        const ptr0 = passArray32ToWasm0(row_indices, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(col_indices, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.pivottable_pivot_with_avg(ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PivotTable.__wrap(ret[0]);
    }
    /**
     * Pivot con max
     * @param {Int32Array} row_indices
     * @param {Int32Array} col_indices
     * @param {Float64Array} values
     * @returns {PivotTable}
     */
    static pivot_with_max(row_indices, col_indices, values) {
        const ptr0 = passArray32ToWasm0(row_indices, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(col_indices, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.pivottable_pivot_with_max(ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PivotTable.__wrap(ret[0]);
    }
    /**
     * Pivot con min
     * @param {Int32Array} row_indices
     * @param {Int32Array} col_indices
     * @param {Float64Array} values
     * @returns {PivotTable}
     */
    static pivot_with_min(row_indices, col_indices, values) {
        const ptr0 = passArray32ToWasm0(row_indices, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(col_indices, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.pivottable_pivot_with_min(ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PivotTable.__wrap(ret[0]);
    }
    /**
     * Crear pivot con suma como agregacion
     * row_indices: que fila pertenece cada valor
     * col_indices: que columna pertenece cada valor
     * values: valores a agregar
     * @param {Int32Array} row_indices
     * @param {Int32Array} col_indices
     * @param {Float64Array} values
     * @returns {PivotTable}
     */
    static pivot_with_sum(row_indices, col_indices, values) {
        const ptr0 = passArray32ToWasm0(row_indices, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(col_indices, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.pivottable_pivot_with_sum(ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PivotTable.__wrap(ret[0]);
    }
    /**
     * Pivot con count
     * @param {Int32Array} row_indices
     * @param {Int32Array} col_indices
     * @returns {PivotTable}
     */
    static pivot_with_count(row_indices, col_indices) {
        const ptr0 = passArray32ToWasm0(row_indices, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(col_indices, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.pivottable_pivot_with_count(ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PivotTable.__wrap(ret[0]);
    }
    /**
     * @returns {number}
     */
    n_cols() {
        const ret = wasm.pivottable_n_cols(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    n_rows() {
        const ret = wasm.pivottable_n_rows(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Obtener valor en posicion especifica
     * @param {number} row_idx
     * @param {number} col_idx
     * @returns {number}
     */
    get_value(row_idx, col_idx) {
        const ret = wasm.pivottable_get_value(this.__wbg_ptr, row_idx, col_idx);
        return ret;
    }
}
if (Symbol.dispose) PivotTable.prototype[Symbol.dispose] = PivotTable.prototype.free;

/**
 * Quartiles (Q1, Q2, Q3)
 */
export class Quartiles {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Quartiles.prototype);
        obj.__wbg_ptr = ptr;
        QuartilesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QuartilesFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_quartiles_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    q1() {
        const ret = wasm.aggregateresult_sum(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    q2() {
        const ret = wasm.aggregateresult_min(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    q3() {
        const ret = wasm.aggregateresult_max(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    iqr() {
        const ret = wasm.quartiles_iqr(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) Quartiles.prototype[Symbol.dispose] = Quartiles.prototype.free;

/**
 * Sort-merge join para datos ordenados - O(n+m)
 */
export class SortMergeJoin {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SortMergeJoinFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sortmergejoin_free(ptr, 0);
    }
    /**
     * Join usando merge si ambos arrays estan ordenados
     * Mas eficiente que hash join si data ya esta sorted
     * @param {Int32Array} left_keys
     * @param {Int32Array} right_keys
     * @returns {JoinResult}
     */
    static join_sorted_i32(left_keys, right_keys) {
        const ptr0 = passArray32ToWasm0(left_keys, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(right_keys, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.sortmergejoin_join_sorted_i32(ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return JoinResult.__wrap(ret[0]);
    }
}
if (Symbol.dispose) SortMergeJoin.prototype[Symbol.dispose] = SortMergeJoin.prototype.free;

/**
 * Streaming aggregator - mantiene stats mientras procesa
 * Usa algoritmo de Welford para varianza numericamente estable
 */
export class StreamAggregator {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StreamAggregatorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_streamaggregator_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get_std_dev() {
        const ret = wasm.streamaggregator_get_std_dev(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_variance() {
        const ret = wasm.streamaggregator_get_variance(this.__wbg_ptr);
        return ret;
    }
    constructor() {
        const ret = wasm.streamaggregator_new();
        this.__wbg_ptr = ret >>> 0;
        StreamAggregatorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    reset() {
        wasm.streamaggregator_reset(this.__wbg_ptr);
    }
    /**
     * Actualizar con nuevo chunk de datos
     * @param {Float64Array} chunk
     */
    update(chunk) {
        const ptr0 = passArrayF64ToWasm0(chunk, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.streamaggregator_update(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {number}
     */
    get_max() {
        const ret = wasm.aggregateresult_max(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_min() {
        const ret = wasm.aggregateresult_min(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_sum() {
        const ret = wasm.aggregateresult_sum(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_mean() {
        const ret = wasm.aggregateresult_mean(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get_count() {
        const ret = wasm.aggregateresult_count(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) StreamAggregator.prototype[Symbol.dispose] = StreamAggregator.prototype.free;

/**
 * Streaming filter - filtra datos mientras procesa
 */
export class StreamFilter {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StreamFilterFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_streamfilter_free(ptr, 0);
    }
    /**
     * Filtrar chunk y retornar valores que pasan
     * @param {Float64Array} chunk
     * @returns {Float64Array}
     */
    filter_chunk(chunk) {
        const ptr0 = passArrayF64ToWasm0(chunk, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.streamfilter_filter_chunk(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v2;
    }
    /**
     * @returns {number}
     */
    get_filtered_count() {
        const ret = wasm.streamfilter_get_filtered_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} threshold
     * @param {string} operation
     */
    constructor(threshold, operation) {
        const ptr0 = passStringToWasm0(operation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.streamfilter_new(threshold, ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        StreamFilterFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    reset() {
        wasm.streamfilter_reset(this.__wbg_ptr);
    }
}
if (Symbol.dispose) StreamFilter.prototype[Symbol.dispose] = StreamFilter.prototype.free;

/**
 * Streaming processor para procesamiento incremental
 * Evita cargar todo en memoria - procesa chunks
 */
export class StreamProcessor {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StreamProcessorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_streamprocessor_free(ptr, 0);
    }
    /**
     * Agregar chunk de datos al buffer
     * @param {Float64Array} data
     */
    push_chunk(data) {
        const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.streamprocessor_push_chunk(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {number}
     */
    buffer_size() {
        const ret = wasm.streamprocessor_buffer_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Procesar proximo chunk disponible
     * Retorna None si no hay suficientes datos
     * @returns {Float64Array | undefined}
     */
    process_next() {
        const ret = wasm.streamprocessor_process_next(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        }
        return v1;
    }
    /**
     * @returns {number}
     */
    processed_count() {
        const ret = wasm.streamprocessor_processed_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} chunk_size
     */
    constructor(chunk_size) {
        const ret = wasm.streamprocessor_new(chunk_size);
        this.__wbg_ptr = ret >>> 0;
        StreamProcessorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Obtener datos restantes (flush)
     * @returns {Float64Array}
     */
    flush() {
        const ret = wasm.streamprocessor_flush(this.__wbg_ptr);
        var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v1;
    }
    reset() {
        wasm.streamprocessor_reset(this.__wbg_ptr);
    }
}
if (Symbol.dispose) StreamProcessor.prototype[Symbol.dispose] = StreamProcessor.prototype.free;

/**
 * Unique optimizado con deteccion automatica de cardinalidad
 * Usa diferentes estrategias segun el tipo de datos
 */
export class UniqueContext {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UniqueContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_uniquecontext_free(ptr, 0);
    }
    /**
     * Unique para integers preservando orden de primera aparicion
     * @param {Int32Array} data
     * @returns {Int32Array}
     */
    static unique_i32(data) {
        const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.uniquecontext_unique_i32(ptr0, len0);
        var v2 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
    /**
     * Unique adaptativo - elige la mejor estrategia automáticamente
     * @param {Int32Array} data
     * @returns {Int32Array}
     */
    static unique_i32_adaptive(data) {
        const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.uniquecontext_unique_i32_adaptive(ptr0, len0);
        var v2 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
    /**
     * Unique optimizado para low cardinality
     * Usa linear scan si detecta pocos valores unicos
     * @param {Int32Array} data
     * @param {number} max_unique
     * @returns {Int32Array | undefined}
     */
    static unique_i32_fast_path(data, max_unique) {
        const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.uniquecontext_unique_i32_fast_path(ptr0, len0, max_unique);
        let v2;
        if (ret[0] !== 0) {
            v2 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v2;
    }
    /**
     * Unique con contador de ocurrencias
     * Retorna pares (valor, count)
     * @param {Int32Array} data
     * @returns {Int32Array}
     */
    static unique_i32_with_counts(data) {
        const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.uniquecontext_unique_i32_with_counts(ptr0, len0);
        var v2 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
    constructor() {
        const ret = wasm.uniquecontext_new();
        this.__wbg_ptr = ret >>> 0;
        UniqueContextFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}
if (Symbol.dispose) UniqueContext.prototype[Symbol.dispose] = UniqueContext.prototype.free;

/**
 * Window functions optimizadas
 * Operan sobre particiones ordenadas de datos
 */
export class WindowContext {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WindowContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_windowcontext_free(ptr, 0);
    }
    /**
     * Dense rank (sin gaps en ranking)
     * @param {Float64Array} values
     * @param {Int32Array} partitions
     * @returns {Uint32Array}
     */
    static dense_rank(values, partitions) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(partitions, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.windowcontext_dense_rank(ptr0, len0, ptr1, len1);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v3;
    }
    /**
     * Last value en la particion
     * @param {Float64Array} values
     * @param {Int32Array} partitions
     * @returns {Float64Array}
     */
    static last_value(values, partitions) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(partitions, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.windowcontext_last_value(ptr0, len0, ptr1, len1);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v3;
    }
    /**
     * Moving average con ventana deslizante
     * window_size: numero de elementos en la ventana
     * @param {Float64Array} values
     * @param {number} window_size
     * @returns {Float64Array}
     */
    static moving_avg(values, window_size) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.windowcontext_moving_avg(ptr0, len0, window_size);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v2;
    }
    /**
     * Moving sum con ventana deslizante
     * @param {Float64Array} values
     * @param {number} window_size
     * @returns {Float64Array}
     */
    static moving_sum(values, window_size) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.windowcontext_moving_sum(ptr0, len0, window_size);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v2;
    }
    /**
     * Row number (1, 2, 3... dentro de cada particion)
     * @param {Int32Array} partitions
     * @returns {Uint32Array}
     */
    static row_number(partitions) {
        const ptr0 = passArray32ToWasm0(partitions, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.windowcontext_row_number(ptr0, len0);
        var v2 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
    /**
     * First value en la particion
     * @param {Float64Array} values
     * @param {Int32Array} partitions
     * @returns {Float64Array}
     */
    static first_value(values, partitions) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(partitions, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.windowcontext_first_value(ptr0, len0, ptr1, len1);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v3;
    }
    /**
     * Running sum (cumulative sum) dentro de particiones
     * partitions: array de partition IDs, debe estar ordenado
     * @param {Float64Array} values
     * @param {Int32Array} partitions
     * @returns {Float64Array}
     */
    static running_sum(values, partitions) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(partitions, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.windowcontext_running_sum(ptr0, len0, ptr1, len1);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v3;
    }
    /**
     * Lag - valor anterior en la particion
     * offset: cuantos valores atras mirar
     * @param {Float64Array} values
     * @param {Int32Array} partitions
     * @param {number} offset
     * @returns {Float64Array}
     */
    static lag(values, partitions, offset) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(partitions, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.windowcontext_lag(ptr0, len0, ptr1, len1, offset);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v3;
    }
    constructor() {
        const ret = wasm.filtercontext_new();
        this.__wbg_ptr = ret >>> 0;
        WindowContextFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Lead - valor siguiente en la particion
     * @param {Float64Array} values
     * @param {Int32Array} partitions
     * @param {number} offset
     * @returns {Float64Array}
     */
    static lead(values, partitions, offset) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(partitions, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.windowcontext_lead(ptr0, len0, ptr1, len1, offset);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
        return v3;
    }
    /**
     * Rank dentro de particiones (valores iguales reciben mismo rank)
     * Asume que data esta ordenada por (partition, value desc)
     * @param {Float64Array} values
     * @param {Int32Array} partitions
     * @returns {Uint32Array}
     */
    static rank(values, partitions) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(partitions, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.windowcontext_rank(ptr0, len0, ptr1, len1);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v3 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v3;
    }
}
if (Symbol.dispose) WindowContext.prototype[Symbol.dispose] = WindowContext.prototype.free;

/**
 * Agregacion completa en un solo paso usando algoritmo de Welford
 * ULTRA-OPTIMIZADO con loop unrolling y procesamiento paralelo
 * @param {Float64Array} data
 * @returns {AggregateResult}
 */
export function aggregate_f64(data) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.aggregate_f64(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return AggregateResult.__wrap(ret[0]);
}

/**
 * Hyper-optimized aggregate that computes everything in one pass
 * Uses pipelined accumulators for maximum throughput
 * @param {Float64Array} data
 * @returns {Float64Array}
 */
export function aggregate_f64_hyper(data) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.aggregate_f64_hyper(ptr0, len0);
    var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v2;
}

/**
 * Agregacion para i32 (mas rapido que f64)
 * @param {Int32Array} data
 * @returns {AggregateResult}
 */
export function aggregate_i32(data) {
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.aggregate_i32(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return AggregateResult.__wrap(ret[0]);
}

/**
 * Anti-join (retorna left indices que NO tienen match)
 * @param {Int32Array} left_keys
 * @param {Int32Array} right_keys
 * @returns {Uint32Array}
 */
export function anti_join_i32(left_keys, right_keys) {
    const ptr0 = passArray32ToWasm0(left_keys, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray32ToWasm0(right_keys, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.anti_join_i32(ptr0, len0, ptr1, len1);
    var v3 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v3;
}

/**
 * @param {Float64Array} data
 * @returns {number}
 */
export function count_unique_f64(data) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.count_unique_f64(ptr0, len0);
    return ret >>> 0;
}

/**
 * Contar valores unicos sin retornar los valores
 * Mas rapido cuando solo necesitas el count
 * @param {Int32Array} data
 * @returns {number}
 */
export function count_unique_i32(data) {
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.count_unique_i32(ptr0, len0);
    return ret >>> 0;
}

/**
 * Deteccion de cardinalidad mediante sampling
 * Util para decidir que algoritmo usar
 * @param {Int32Array} data
 * @param {number} sample_size
 * @returns {number}
 */
export function estimate_cardinality_i32(data, sample_size) {
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.estimate_cardinality_i32(ptr0, len0, sample_size);
    return ret >>> 0;
}

/**
 * Filter floats con comparacion simple
 * @param {Float64Array} data
 * @param {number} threshold
 * @param {string} operation
 * @returns {Float64Array}
 */
export function filter_f64_compare(data, threshold, operation) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(operation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.filter_f64_compare(ptr0, len0, threshold, ptr1, len1);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v3 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v3;
}

/**
 * Filter especializado para floats con range
 * @param {Float64Array} data
 * @param {number} min
 * @param {number} max
 * @returns {Float64Array}
 */
export function filter_f64_range(data, min, max) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.filter_f64_range(ptr0, len0, min, max);
    var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v2;
}

/**
 * Specialized filter using counting (when few values pass)
 * Extremely fast for low selectivity filters
 * @param {Int32Array} data
 * @param {number} threshold
 * @returns {Int32Array}
 */
export function filter_i32_gt_counting(data, threshold) {
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.filter_i32_gt_counting(ptr0, len0, threshold);
    var v2 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * Specialized ultra-fast filter for power-of-2 thresholds
 * Uses bit operations instead of comparisons
 * @param {Int32Array} data
 * @param {number} threshold_log2
 * @returns {Int32Array}
 */
export function filter_i32_gt_power2(data, threshold_log2) {
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.filter_i32_gt_power2(ptr0, len0, threshold_log2);
    var v2 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * Filter u32 (para IDs, categorias)
 * @param {Uint32Array} data
 * @param {number} threshold
 * @param {string} operation
 * @returns {Uint32Array}
 */
export function filter_u32_compare(data, threshold, operation) {
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(operation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.filter_u32_compare(ptr0, len0, threshold, ptr1, len1);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v3 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v3;
}

/**
 * GroupBy con count solamente (mas rapido)
 * @param {Int32Array} keys
 * @returns {Int32Array}
 */
export function groupby_count_i32(keys) {
    const ptr0 = passArray32ToWasm0(keys, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.groupby_count_i32(ptr0, len0);
    var v2 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * GroupBy con agregacion solo de suma (optimizado)
 * @param {Int32Array} keys
 * @param {Float64Array} values
 * @returns {Float64Array}
 */
export function groupby_sum_i32(keys, values) {
    const ptr0 = passArray32ToWasm0(keys, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.groupby_sum_i32(ptr0, len0, ptr1, len1);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v3 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v3;
}

/**
 * GroupBy para u32 (optimizado para IDs y categorías)
 * @param {Uint32Array} keys
 * @returns {GroupByResultU32}
 */
export function groupby_u32(keys) {
    const ptr0 = passArray32ToWasm0(keys, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.groupby_u32(ptr0, len0);
    return GroupByResultU32.__wrap(ret);
}

/**
 * GroupBy para u32 (IDs no negativos)
 * @param {Uint32Array} keys
 * @returns {Uint32Array}
 */
export function groupby_u32_simple(keys) {
    const ptr0 = passArray32ToWasm0(keys, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.groupby_u32_simple(ptr0, len0);
    var v2 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

export function init() {
    wasm.init();
}

/**
 * @param {Float64Array} data
 * @returns {number}
 */
export function max_f64(data) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.max_f64(ptr0, len0);
    return ret;
}

/**
 * @param {Int32Array} data
 * @returns {number}
 */
export function max_i32(data) {
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.max_i32(ptr0, len0);
    return ret;
}

/**
 * Mean ultra-optimizado con vectorizacion
 * @param {Float64Array} data
 * @returns {number}
 */
export function mean_f64(data) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.mean_f64(ptr0, len0);
    return ret;
}

/**
 * @param {Int32Array} data
 * @returns {number}
 */
export function mean_i32(data) {
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.mean_i32(ptr0, len0);
    return ret;
}

/**
 * Mediana (percentil 0.5)
 * @param {Float64Array} data
 * @returns {number}
 */
export function median_f64(data) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.median_f64(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * Min/Max optimizados
 * @param {Float64Array} data
 * @returns {number}
 */
export function min_f64(data) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.min_f64(ptr0, len0);
    return ret;
}

/**
 * @param {Int32Array} data
 * @returns {number}
 */
export function min_i32(data) {
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.min_i32(ptr0, len0);
    return ret;
}

/**
 * Nested loop join (fallback para casos complejos) - O(n*m)
 * Solo usar cuando hash join no es posible
 * @param {Int32Array} left_keys
 * @param {Int32Array} right_keys
 * @returns {JoinResult}
 */
export function nested_loop_join_i32(left_keys, right_keys) {
    const ptr0 = passArray32ToWasm0(left_keys, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray32ToWasm0(right_keys, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.nested_loop_join_i32(ptr0, len0, ptr1, len1);
    return JoinResult.__wrap(ret);
}

/**
 * Percentiles (requiere ordenamiento)
 * p debe estar entre 0.0 y 1.0
 * @param {Float64Array} data
 * @param {number} p
 * @returns {number}
 */
export function percentile_f64(data, p) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.percentile_f64(ptr0, len0, p);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {Float64Array} data
 * @returns {Quartiles}
 */
export function quartiles_f64(data) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.quartiles_f64(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return Quartiles.__wrap(ret[0]);
}

/**
 * Semi-join (solo retorna left indices que tienen match)
 * Mas eficiente que full join si solo necesitas saber que matched
 * @param {Int32Array} left_keys
 * @param {Int32Array} right_keys
 * @returns {Uint32Array}
 */
export function semi_join_i32(left_keys, right_keys) {
    const ptr0 = passArray32ToWasm0(left_keys, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray32ToWasm0(right_keys, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.semi_join_i32(ptr0, len0, ptr1, len1);
    var v3 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v3;
}

/**
 * Sort data array by corresponding keys array (f64 version)
 * @param {Float64Array} data
 * @param {Float64Array} keys
 * @param {boolean} ascending
 */
export function sort_by_key_f64(data, keys, ascending) {
    var ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(keys, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.sort_by_key_f64(ptr0, len0, data, ptr1, len1, ascending);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Sort data array by corresponding keys array
 * This is used for sorting objects by a numeric property
 * @param {Int32Array} data
 * @param {Int32Array} keys
 * @param {boolean} ascending
 */
export function sort_by_key_i32(data, keys, ascending) {
    var ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray32ToWasm0(keys, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.sort_by_key_i32(ptr0, len0, data, ptr1, len1, ascending);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Sort f64 array using pdqsort (Pattern-Defeating Quicksort)
 * PDQ sort is cache-friendly and handles various patterns efficiently
 * @param {Float64Array} data
 * @param {boolean} ascending
 */
export function sort_f64(data, ascending) {
    var ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.sort_f64(ptr0, len0, data, ascending);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Sort i32 array using optimized radix sort
 * For integers, radix sort provides O(n*k) complexity which is faster than O(n log n)
 * @param {Int32Array} data
 * @param {boolean} ascending
 */
export function sort_i32(data, ascending) {
    var ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.sort_i32(ptr0, len0, data, ascending);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Sort u32 array using optimized radix sort
 * @param {Uint32Array} data
 * @param {boolean} ascending
 */
export function sort_u32(data, ascending) {
    var ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.sort_u32(ptr0, len0, data, ascending);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * Sum ultra-optimizado con loop unrolling y pipelining
 * @param {Float64Array} data
 * @returns {number}
 */
export function sum_f64(data) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.sum_f64(ptr0, len0);
    return ret;
}

/**
 * Specialized sum using Kahan summation for extreme precision
 * Prevents floating-point error accumulation
 * @param {Float64Array} data
 * @returns {number}
 */
export function sum_f64_kahan(data) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.sum_f64_kahan(ptr0, len0);
    return ret;
}

/**
 * @param {Int32Array} data
 * @returns {number}
 */
export function sum_i32(data) {
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.sum_i32(ptr0, len0);
    return ret;
}

/**
 * Unique para floats
 * Maneja NaN correctamente comparando representacion de bits
 * @param {Float64Array} data
 * @returns {Float64Array}
 */
export function unique_f64(data) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.unique_f64(ptr0, len0);
    var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v2;
}

/**
 * Unique con counts para floats
 * @param {Float64Array} data
 * @returns {Float64Array}
 */
export function unique_f64_with_counts(data) {
    const ptr0 = passArrayF64ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.unique_f64_with_counts(ptr0, len0);
    var v2 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v2;
}

/**
 * Unique adaptativo: elige el mejor algoritmo automaticamente
 * @param {Int32Array} data
 * @returns {Int32Array}
 */
export function unique_i32_adaptive(data) {
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.unique_i32_adaptive(ptr0, len0);
    var v2 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * Unique para u32 (IDs, categorias)
 * @param {Uint32Array} data
 * @returns {Uint32Array}
 */
export function unique_u32(data) {
    const ptr0 = passArray32ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.unique_u32(ptr0, len0);
    var v2 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * Media ponderada
 * @param {Float64Array} values
 * @param {Float64Array} weights
 * @returns {number}
 */
export function weighted_mean(values, weights) {
    const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(weights, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.weighted_mean(ptr0, len0, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg___wbindgen_copy_to_typed_array_db832bc4df7216c1 = function(arg0, arg1, arg2) {
        new Uint8Array(arg2.buffer, arg2.byteOffset, arg2.byteLength).set(getArrayU8FromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg___wbindgen_string_get_a2a31e16edf96e42 = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(arg0, arg1) {
        // Cast intrinsic for `Ref(String) -> Externref`.
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedFloat64ArrayMemory0 = null;
    cachedInt32ArrayMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('velo_compute_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
