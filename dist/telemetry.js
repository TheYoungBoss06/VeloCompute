/**
 * Telemetry opt-in para mejorar performance
 * Privacy-first: No PII, solo metricas agregadas anonimas
 */
class Telemetry {
    constructor() {
        this.enabled = false;
        this.endpoint = 'https://telemetry.velo-compute.dev/events';
        this.events = [];
        this.flushInterval = 60000; // 1 minuto
        this.maxEvents = 100;
    }
    /**
     * Habilitar telemetry (opt-in)
     */
    enable(endpoint) {
        this.enabled = true;
        if (endpoint)
            this.endpoint = endpoint;
        this.startFlushTimer();
        if (typeof console !== 'undefined') {
            console.log('[VeloCompute] Telemetry enabled. Thank you for helping improve performance!');
            console.log('[VeloCompute] No personally identifiable information is collected.');
        }
    }
    /**
     * Deshabilitar telemetry
     */
    disable() {
        this.enabled = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        this.flush(); // Enviar eventos pendientes
    }
    /**
     * Verificar si telemetry esta habilitado
     */
    isEnabled() {
        return this.enabled;
    }
    /**
     * Track un evento
     */
    track(event) {
        if (!this.enabled)
            return;
        const fullEvent = {
            ...event,
            browserInfo: this.getBrowserInfo(),
        };
        this.events.push(fullEvent);
        // Mantener solo los ultimos maxEvents
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(-this.maxEvents);
        }
        // Flush inmediato si hay muchos eventos
        if (this.events.length >= 50) {
            this.flush();
        }
    }
    /**
     * Obtener informacion anonima del browser
     */
    getBrowserInfo() {
        // Check si estamos en browser environment
        if (typeof globalThis !== 'undefined' && globalThis.navigator) {
            const nav = globalThis.navigator;
            return {
                userAgent: nav.userAgent || 'unknown',
                platform: nav.platform || 'unknown',
                memory: performance.memory?.jsHeapSizeLimit,
            };
        }
        return undefined;
    }
    /**
     * Iniciar timer para flush automatico
     */
    startFlushTimer() {
        if (this.timer)
            return;
        this.timer = setInterval(() => this.flush(), this.flushInterval);
    }
    /**
     * Enviar eventos al servidor
     */
    async flush() {
        if (this.events.length === 0 || !this.enabled)
            return;
        const eventsToSend = [...this.events];
        this.events = [];
        try {
            // Solo en browser con fetch
            if (typeof fetch === 'undefined')
                return;
            await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    events: eventsToSend,
                    timestamp: Date.now(),
                    version: '1.0.0'
                }),
                // No bloquear si falla
                keepalive: true,
            });
        }
        catch (error) {
            // Silently fail - no queremos romper la app por telemetry
            if (typeof console !== 'undefined' && console.warn) {
                console.warn('[VeloCompute] Telemetry upload failed (this is ok):', error);
            }
        }
    }
    /**
     * Obtener eventos pendientes (para debugging)
     */
    getPendingEvents() {
        return [...this.events];
    }
    /**
     * Limpiar eventos pendientes
     */
    clear() {
        this.events = [];
    }
}
export const telemetry = new Telemetry();
/**
 * Wrapper para trackear operaciones automaticamente
 */
export function trackOperation(operation, dataSize, fn) {
    if (!telemetry.isEnabled()) {
        return fn();
    }
    const start = performance.now();
    try {
        const result = fn();
        if (result instanceof Promise) {
            return result
                .then(value => {
                telemetry.track({
                    operation,
                    duration: performance.now() - start,
                    dataSize,
                    success: true,
                });
                return value;
            })
                .catch(error => {
                const errorCode = error.code || 'UNKNOWN';
                telemetry.track({
                    operation,
                    duration: performance.now() - start,
                    dataSize,
                    success: false,
                    errorCode,
                });
                throw error;
            });
        }
        telemetry.track({
            operation,
            duration: performance.now() - start,
            dataSize,
            success: true,
        });
        return result;
    }
    catch (error) {
        const errorCode = error.code || 'UNKNOWN';
        telemetry.track({
            operation,
            duration: performance.now() - start,
            dataSize,
            success: false,
            errorCode,
        });
        throw error;
    }
}
