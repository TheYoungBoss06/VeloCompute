import type { WasmModule } from './types.js';
export declare function loadWasm(): Promise<WasmModule>;
export declare function getWasmSync(): WasmModule;
