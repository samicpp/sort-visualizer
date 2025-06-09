//import * as check from "./check.ts";
export const heapSort = new class HeapSort {
    operations = 0;
    #nHeapify(arr, n, i) {
        this.operations++;
        let max = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < n && arr[left] > arr[max]) {
            max = left;
        }
        if (right < n && arr[right] > arr[max]) {
            max = right;
        }
        if (max !== i) {
            [arr[i], arr[max]] = [arr[max], arr[i]];
            this.#nHeapify(arr, n, max);
        }
    }
    number(arr) {
        const narr = [...arr];
        for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
            this.#nHeapify(narr, arr.length, i);
        }
        for (let i = arr.length - 1; i > 0; i--) {
            [narr[0], narr[i]] = [narr[i], narr[0]];
            this.#nHeapify(narr, i, 0);
        }
        return narr;
    }
};
export const heapSortDebug = new class HeapSortDebug {
    workArr = [];
    async next() { return new Promise(r => setTimeout(r)); }
    ;
    async checked() { return new Promise(r => setTimeout(r)); }
    ;
    async get(name) { return this.workArr[name]; }
    async set(name, value) { return this.workArr[name] = value; }
    async #nHeapify(n, i) {
        let max = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < n && (await this.get(left)) > (await this.get(max))) {
            max = left;
        }
        if (right < n && (await this.get(right)) > (await this.get(max))) {
            max = right;
        }
        if (max !== i) {
            const t = await this.get(i);
            await this.set(i, await this.get(max));
            await this.set(max, t);
            //[arr[i], arr[max]] = [arr[max], arr[i]];
            await this.next();
            await this.#nHeapify(n, max);
        }
    }
    async number(arr) {
        const narr = this.workArr = [...arr];
        for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
            await this.#nHeapify(arr.length, i);
        }
        for (let i = arr.length - 1; i > 0; i--) {
            [narr[0], narr[i]] = [narr[i], narr[0]];
            //await this.next();
            await this.#nHeapify(i, 0);
            await this.checked();
        }
        return narr;
    }
};
