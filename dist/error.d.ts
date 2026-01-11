/**
 * Sistema de errores tipados y descriptivos para VeloCompute
 */
export declare class VeloError extends Error {
    code: string;
    context?: Record<string, any> | undefined;
    constructor(message: string, code: string, context?: Record<string, any> | undefined);
}
export declare class VeloValidationError extends VeloError {
    constructor(message: string, context?: Record<string, any>);
}
export declare class VeloMemoryError extends VeloError {
    constructor(message: string, context?: Record<string, any>);
}
export declare class VeloWasmError extends VeloError {
    constructor(message: string, context?: Record<string, any>);
}
/**
 * Error handler con contexto util para debugging
 */
export declare function handleError(error: unknown, operation: string): never;
/**
 * Validaciones comunes para arrays
 */
export declare function validateArray<T>(array: T[] | Int32Array | Float64Array | Uint32Array, name: string, options?: {
    minLength?: number;
    maxLength?: number;
    allowEmpty?: boolean;
}): void;
/**
 * Validaciones para numeros
 */
export declare function validateNumber(value: number, name: string, options?: {
    min?: number;
    max?: number;
    integer?: boolean;
}): void;
/**
 * Validar tipo de TypedArray
 */
export declare function validateTypedArray(array: any, name: string, allowedTypes?: Array<'Int32Array' | 'Float64Array' | 'Uint32Array'>): void;
/**
 * Validar memoria disponible
 */
export declare function checkMemoryLimit(estimatedBytes: number, operation: string): void;
