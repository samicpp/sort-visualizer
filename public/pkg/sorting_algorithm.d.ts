/* tslint:disable */
/* eslint-disable */
export function wquick_sort(arr: Int32Array): Int32Array;
export function wmerge_sort(arr: Int32Array): Int32Array;
export function wbubble_sort(arr: Int32Array): Int32Array;
export function wradix_sort(arr: Int32Array): Int32Array;
export function wcount_sort(arr: Int32Array): Int32Array;
export function wheap_sort(arr: Int32Array): Int32Array;
export function wbogo_sort(arr: Int32Array): Int32Array;
export function wstalin_sort(arr: Int32Array): Int32Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly quick_sort: (a: number, b: number) => void;
  readonly radix_sort: (a: number, b: number) => void;
  readonly count_sort: (a: number, b: number) => void;
  readonly heap_sort: (a: number, b: number) => void;
  readonly merge_sort: (a: number, b: number) => void;
  readonly bubble_sort: (a: number, b: number) => void;
  readonly stalin_sort: (a: number, b: number) => void;
  readonly bogo_sort: (a: number, b: number) => void;
  readonly alloc: (a: number) => number;
  readonly dealloc: (a: number, b: number) => void;
  readonly wquick_sort: (a: number, b: number) => [number, number];
  readonly wmerge_sort: (a: number, b: number) => [number, number];
  readonly wbubble_sort: (a: number, b: number) => [number, number];
  readonly wradix_sort: (a: number, b: number) => [number, number];
  readonly wcount_sort: (a: number, b: number) => [number, number];
  readonly wheap_sort: (a: number, b: number) => [number, number];
  readonly wbogo_sort: (a: number, b: number) => [number, number];
  readonly wstalin_sort: (a: number, b: number) => [number, number];
  readonly __wbindgen_export_0: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
