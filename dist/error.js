/**
 * Sistema de errores tipados y descriptivos para VeloCompute
 */
export class VeloError extends Error {
    constructor(message, code, context) {
        super(message);
        this.code = code;
        this.context = context;
        this.name = 'VeloError';
        // Mantener stack trace apropiado
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export class VeloValidationError extends VeloError {
    constructor(message, context) {
        super(message, 'VALIDATION_ERROR', context);
        this.name = 'VeloValidationError';
    }
}
export class VeloMemoryError extends VeloError {
    constructor(message, context) {
        super(message, 'MEMORY_ERROR', context);
        this.name = 'VeloMemoryError';
    }
}
export class VeloWasmError extends VeloError {
    constructor(message, context) {
        super(message, 'WASM_ERROR', context);
        this.name = 'VeloWasmError';
    }
}
/**
 * Error handler con contexto util para debugging
 */
export function handleError(error, operation) {
    if (error instanceof VeloError) {
        throw error;
    }
    if (error instanceof Error) {
        throw new VeloError(`Operation '${operation}' failed: ${error.message}`, 'OPERATION_FAILED', { originalError: error.message, stack: error.stack });
    }
    throw new VeloError(`Operation '${operation}' failed with unknown error`, 'UNKNOWN_ERROR', { error: String(error) });
}
/**
 * Validaciones comunes para arrays
 */
export function validateArray(array, name, options) {
    const isTypedArray = ArrayBuffer.isView(array);
    const isRegularArray = Array.isArray(array);
    if (!isRegularArray && !isTypedArray) {
        throw new VeloValidationError(`${name} must be an array or TypedArray`, { received: typeof array });
    }
    const length = array.length;
    if (!options?.allowEmpty && length === 0) {
        throw new VeloValidationError(`${name} cannot be empty`);
    }
    if (options?.minLength && length < options.minLength) {
        throw new VeloValidationError(`${name} must have at least ${options.minLength} items`, { length });
    }
    if (options?.maxLength && length > options.maxLength) {
        throw new VeloValidationError(`${name} must have at most ${options.maxLength} items`, { length });
    }
}
/**
 * Validaciones para numeros
 */
export function validateNumber(value, name, options) {
    if (typeof value !== 'number' || isNaN(value)) {
        throw new VeloValidationError(`${name} must be a valid number`, { received: value });
    }
    if (options?.integer && !Number.isInteger(value)) {
        throw new VeloValidationError(`${name} must be an integer`, { received: value });
    }
    if (options?.min !== undefined && value < options.min) {
        throw new VeloValidationError(`${name} must be >= ${options.min}`, { received: value });
    }
    if (options?.max !== undefined && value > options.max) {
        throw new VeloValidationError(`${name} must be <= ${options.max}`, { received: value });
    }
}
/**
 * Validar tipo de TypedArray
 */
export function validateTypedArray(array, name, allowedTypes) {
    const isValid = array instanceof Int32Array ||
        array instanceof Float64Array ||
        array instanceof Uint32Array;
    if (!isValid) {
        throw new VeloValidationError(`${name} must be a TypedArray (Int32Array, Float64Array, or Uint32Array)`, { received: array?.constructor?.name || typeof array });
    }
    if (allowedTypes) {
        const typeName = array.constructor.name;
        if (!allowedTypes.includes(typeName)) {
            throw new VeloValidationError(`${name} must be one of: ${allowedTypes.join(', ')}`, { received: typeName });
        }
    }
}
/**
 * Validar memoria disponible
 */
export function checkMemoryLimit(estimatedBytes, operation) {
    // Solo en browser con memory API
    if (typeof performance !== 'undefined' && performance.memory) {
        const memory = performance.memory;
        const available = memory.jsHeapSizeLimit - memory.usedJSHeapSize;
        if (estimatedBytes > available * 0.8) { // Usar max 80% de memoria disponible
            throw new VeloMemoryError(`Insufficient memory for operation '${operation}'`, {
                required: estimatedBytes,
                available: available,
                heapLimit: memory.jsHeapSizeLimit,
                heapUsed: memory.usedJSHeapSize
            });
        }
    }
}
