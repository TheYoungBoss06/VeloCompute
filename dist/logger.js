/**
 * Sistema de logging para debugging y telemetry
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["NONE"] = 4] = "NONE";
})(LogLevel || (LogLevel = {}));
class Logger {
    constructor() {
        this.level = LogLevel.WARN;
        this.logs = [];
        this.maxLogs = 1000;
        this.listeners = [];
    }
    setLevel(level) {
        this.level = level;
    }
    getLevel() {
        return this.level;
    }
    debug(operation, message, metadata) {
        this.log(LogLevel.DEBUG, operation, message, metadata);
    }
    info(operation, message, metadata) {
        this.log(LogLevel.INFO, operation, message, metadata);
    }
    warn(operation, message, metadata) {
        this.log(LogLevel.WARN, operation, message, metadata);
    }
    error(operation, message, metadata) {
        this.log(LogLevel.ERROR, operation, message, metadata);
    }
    log(level, operation, message, metadata) {
        if (level < this.level)
            return;
        const entry = {
            timestamp: Date.now(),
            level,
            operation,
            message,
            metadata,
        };
        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        this.listeners.forEach(listener => {
            try {
                listener(entry);
            }
            catch (err) {
                // Silently fail to avoid infinite loops
            }
        });
        // Console output en development
        if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
            const levelName = LogLevel[level];
            const prefix = `[VeloCompute ${levelName}]`;
            switch (level) {
                case LogLevel.DEBUG:
                    console.debug(prefix, operation, message, metadata || '');
                    break;
                case LogLevel.INFO:
                    console.info(prefix, operation, message, metadata || '');
                    break;
                case LogLevel.WARN:
                    console.warn(prefix, operation, message, metadata || '');
                    break;
                case LogLevel.ERROR:
                    console.error(prefix, operation, message, metadata || '');
                    break;
            }
        }
    }
    /**
     * Performance timing helper
     */
    time(operation) {
        const start = performance.now();
        return () => {
            const duration = performance.now() - start;
            this.info(operation, `Completed in ${duration.toFixed(2)}ms`, { duration });
        };
    }
    /**
     * Async operation wrapper con logging automatico
     */
    async measure(operation, fn) {
        const end = this.time(operation);
        try {
            this.debug(operation, 'Started');
            const result = await fn();
            end();
            return result;
        }
        catch (error) {
            end();
            this.error(operation, `Failed: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
    /**
     * Obtener logs recientes
     */
    getLogs(count = 100) {
        return this.logs.slice(-count);
    }
    /**
     * Filtrar logs por nivel
     */
    getLogsByLevel(level, count = 100) {
        return this.logs.filter(log => log.level === level).slice(-count);
    }
    /**
     * Subscribe to log events
     */
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1)
                this.listeners.splice(index, 1);
        };
    }
    /**
     * Clear all logs
     */
    clear() {
        this.logs = [];
    }
    /**
     * Export logs as JSON
     */
    export() {
        return JSON.stringify(this.logs, null, 2);
    }
}
export const logger = new Logger();
/**
 * Performance wrapper decorator para metodos
 */
export function measured(operation) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const end = logger.time(`${operation}.${propertyKey}`);
            try {
                const result = originalMethod.apply(this, args);
                if (result instanceof Promise) {
                    return result.finally(end);
                }
                end();
                return result;
            }
            catch (error) {
                end();
                throw error;
            }
        };
        return descriptor;
    };
}
