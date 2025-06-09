//import * as check from "./check.ts";
export const stalinSort = new class StalinSort {
    operations = 0;
    number(arr) {
        this.operations = 0;
        const sorted = [arr[0]];
        for (let i = 1; i < arr.length; i++) {
            if (sorted[sorted.length - 1] < arr[i])
                sorted.push(arr[i]);
            this.operations++;
        }
        ;
        return sorted;
    }
};
export const SortDebug = new class SortDebug {
    workArr = [];
    async next() { return new Promise(r => setTimeout(r)); }
    ;
    async checked() { return new Promise(r => setTimeout(r)); }
    ;
    async get(name) { return this.workArr[name]; }
    async set(name, value) { return this.workArr[name] = value; }
    async number(arr) {
        const narr = this.workArr = [...arr];
        for (let i = 1; i < arr.length; i++) {
            if (await this.get(i - 1) > await this.get(i)) {
                narr.splice(i, 1);
                i--;
            }
            ;
            await this.next();
        }
        ;
        return narr;
    }
};
