//import { ByteLib } from "./buffer.ts";
//const blib=new ByteLib;
export function encInt(buff) {
    let r = 0n;
    //[...buff].reverse().forEach((e, i) => r += BigInt(e) * 0x100n ** BigInt(i));
    buff.forEach((e, i) => r += BigInt(e) * 0x100n ** BigInt(buff.length - 1 - i));
    return r;
}
;
export function bytes(num) {
    let m = 0, s = 0n, x = 0n;
    if (typeof num == "bigint")
        x = num;
    else
        x = BigInt(parseInt(String(num)) || 0);
    //if (x >= 0xff_ff_ff_ff) throw Error("number too big");
    if (x < 0)
        throw Error("number cant be negative");
    //if(0x1_00_00_00n&x)return 4;
    while (true) {
        if ((x >> s) <= 0)
            break;
        m++;
        s += 8n;
    }
    return m;
}
;
export function decInt(x, a) {
    const buff = [];
    let s = 0n;
    for (let i = BigInt(a - 1); 0 <= i; i--) {
        s = i * 8n;
        buff.push((0xffn * 0x100n ** i & x) >> s);
    }
    ;
    return buff;
}
;
export class ShuffledUintArray extends Array {
    constructor(length = 10) {
        const barr = [...Array(length)];
        for (const i in barr)
            barr[i] = parseInt(i, 10);
        super();
        while (barr.length > 0) {
            const i = Math.floor(Math.random() * barr.length);
            this.push(barr[i]);
            barr.splice(i, 1);
        }
        // console.log(barr,uarr);
        // console.log(uarr.sort())
    }
}
;
export class ShuffledIntArray extends Array {
    constructor(length = 10) {
        const barr = [...Array(length)];
        for (const i in barr)
            barr[i] = Math.floor(length / 2) - parseInt(i, 10);
        super();
        while (barr.length > 0) {
            const i = Math.floor(Math.random() * barr.length);
            this.push(barr[i]);
            barr.splice(i, 1);
        }
        // console.log(barr,uarr);
        // console.log(uarr.sort())
    }
}
;
export class ShuffledStringArray extends Array {
    constructor(length = 10) {
        super();
        const barr = [...Array(length)];
        //const buff=new Uint8Array(blib.bytes(length));
        for (const i in barr) {
            //barr[i]=length/2-parseInt(i,10);
            const buff = decInt(BigInt(i), bytes(BigInt(i))).map(e => Number(e));
            barr[i] = String.fromCharCode(...buff);
        }
        ;
        while (barr.length > 0) {
            const i = Math.floor(Math.random() * barr.length);
            this.push(barr[i]);
            barr.splice(i, 1);
        }
        // console.log(barr,uarr);
        // console.log(uarr.sort())
    }
}
;
export class RandomUintArray extends Array {
    constructor(length = 10, max = length, min = 0) {
        super(length);
        for (let i = 0; i < length; i++) {
            this[i] = Math.floor(Math.random() * (max - min) + min);
        }
        ;
    }
}
;
export class RandomFloatArray extends Array {
    constructor(length = 10, max = length, min = 0) {
        super(length);
        for (let i = 0; i < length; i++) {
            this[i] = Math.random() * (max - min) + min;
        }
        ;
    }
}
;
export class RandomStringArray extends Array {
    constructor(length = 10, chars = 100) {
        super();
        for (let i = 0; i < length; i++) {
            this[i] = "";
            for (let j = 0; j < chars; j++)
                this[i] += String.fromCharCode(Math.floor(Math.random() * 255));
        }
    }
}
;
export function shuffle(arr) {
    const barr = [...arr];
    //for(let i in barr)barr[i]=parseInt(i,10);
    const sarr = [];
    while (barr.length > 0) {
        const i = Math.floor(Math.random() * barr.length);
        sarr.push(barr[i]);
        barr.splice(i, 1);
    }
    ;
    return sarr;
}
;
