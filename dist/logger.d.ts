/**
 * Sistema de logging para debugging y telemetry
 */
export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}
export interface LogEntry {
    timestamp: number;
    level: LogLevel;
    operation: string;
    message: string;
    duration?: number;
    metadata?: Record<string, any>;
}
declare class Logger {
    private level;
    private logs;
    private maxLogs;
    private listeners;
    setLevel(level: LogLevel): void;
    getLevel(): LogLevel;
    debug(operation: string, message: string, metadata?: Record<string, any>): void;
    info(operation: string, message: string, metadata?: Record<string, any>): void;
    warn(operation: string, message: string, metadata?: Record<string, any>): void;
    error(operation: string, message: string, metadata?: Record<string, any>): void;
    private log;
    /**
     * Performance timing helper
     */
    time(operation: string): () => void;
    /**
     * Async operation wrapper con logging automatico
     */
    measure<T>(operation: string, fn: () => Promise<T>): Promise<T>;
    /**
     * Obtener logs recientes
     */
    getLogs(count?: number): LogEntry[];
    /**
     * Filtrar logs por nivel
     */
    getLogsByLevel(level: LogLevel, count?: number): LogEntry[];
    /**
     * Subscribe to log events
     */
    subscribe(listener: (entry: LogEntry) => void): () => void;
    /**
     * Clear all logs
     */
    clear(): void;
    /**
     * Export logs as JSON
     */
    export(): string;
}
export declare const logger: Logger;
/**
 * Performance wrapper decorator para metodos
 */
export declare function measured(operation: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export {};
