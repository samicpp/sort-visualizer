import { shuffle } from "../shuffle.js";
import * as check from "./check.js";
export const bogoSort = new class BogoSort {
    operations = 0;
    number(arr) {
        this.operations = 0;
        let sorted = [];
        while (true) {
            sorted = shuffle(arr);
            this.operations++;
            if (check.number(sorted))
                break;
        }
        return sorted;
    }
};
export const bogoSortDebug = new class BogoSortDebug {
    workArr = [];
    async next() { return new Promise(r => setTimeout(r)); }
    ;
    async checked() { return new Promise(r => setTimeout(r)); }
    ;
    async get(name) { return this.workArr[name]; }
    async set(name, value) { return this.workArr[name] = value; }
    async number(arr) {
        this.workArr = [...arr];
        while (true) {
            this.workArr = shuffle(arr);
            await this.next();
            await this.checked();
            if (check.number(this.workArr)) {
                break;
            }
            ;
        }
        return this.workArr;
    }
};
/*
export const SortDebug=new class SortDebug{
    workArr:number[]=[];
    async next(){return new Promise(r=>setTimeout(r))};
    async checked(){return new Promise(r=>setTimeout(r))};
    async get(name:number){return this.workArr[name]}
    async set(name:number,value:number){return this.workArr[name]=value}

    async number(arr: number[]):Promise<number[]>{
        ;
    }
};
// */ 
