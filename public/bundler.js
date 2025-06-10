import init, { wquick_sort, wbogo_sort, wbubble_sort, wheap_sort, wmerge_sort, wradix_sort, wstalin_sort, wcount_sort } from './pkg/sorting_algorithm.js';

await init();


export const quickSort=wquick_sort;
export const bogoSort=wbogo_sort;
export const bubbleSort=wbubble_sort;
export const heapSort=wheap_sort;
export const mergeSort=wmerge_sort;
export const radixSort=wradix_sort;
export const countSort=wcount_sort;
export const stalinSort=wstalin_sort;
