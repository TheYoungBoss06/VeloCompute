/**
 * Telemetry opt-in para mejorar performance
 * Privacy-first: No PII, solo metricas agregadas anonimas
 */
export interface TelemetryEvent {
    operation: string;
    duration: number;
    dataSize: number;
    success: boolean;
    errorCode?: string;
    browserInfo?: {
        userAgent: string;
        platform: string;
        memory?: number;
    };
}
declare class Telemetry {
    private enabled;
    private endpoint;
    private events;
    private flushInterval;
    private timer?;
    private maxEvents;
    /**
     * Habilitar telemetry (opt-in)
     */
    enable(endpoint?: string): void;
    /**
     * Deshabilitar telemetry
     */
    disable(): void;
    /**
     * Verificar si telemetry esta habilitado
     */
    isEnabled(): boolean;
    /**
     * Track un evento
     */
    track(event: Omit<TelemetryEvent, 'browserInfo'>): void;
    /**
     * Obtener informacion anonima del browser
     */
    private getBrowserInfo;
    /**
     * Iniciar timer para flush automatico
     */
    private startFlushTimer;
    /**
     * Enviar eventos al servidor
     */
    private flush;
    /**
     * Obtener eventos pendientes (para debugging)
     */
    getPendingEvents(): TelemetryEvent[];
    /**
     * Limpiar eventos pendientes
     */
    clear(): void;
}
export declare const telemetry: Telemetry;
/**
 * Wrapper para trackear operaciones automaticamente
 */
export declare function trackOperation<T>(operation: string, dataSize: number, fn: () => T | Promise<T>): T | Promise<T>;
export {};
