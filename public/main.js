import * as wasm from './bundler.js';
import * as sort from './jsort/mod.js';

// console.log(wasm);
window.wasm=wasm;
window.sort=sort;
const canvas=document.querySelector("canvas");
const view=document.querySelector(".view").children[0];
const [inp,_br0,sel,met,btn,_br1,del,_br2,acc]=document.querySelector(".input").children;

const ctx=canvas.getContext("2d");
// const input = [5, 3, 2, 4, 1];
// console.log("Before sort:", input);

// const sorted = wasm.quickSort(input);
// console.log("After sort:", sorted);

canvas.width=window.innerWidth*0.99;
canvas.height=window.innerHeight*0.60;

window.ctx=ctx;
console.log("canvas,view,inp,_br0,sel,met,btn",canvas,view,inp,sel,met,btn);

inp.onchange=async function(){
    const f=inp.files[0],fn=inp.value;
    if(f.type=="application/json"&&JSON.parse(await f.text()).type=="int"){
        const u=URL.createObjectURL(f);
        const o=new Option("file: "+fn.replaceAll("\\","/").replaceAll(/^.*\//g,""),u,true);
        sel.appendChild(o);
    }else{
        alert("file isnt a json file or of type int");
    };
    inp.value="";
};

sel.onchange=async function(){
    const json=await fetch(sel.value).then(r=>r.json());
    const arr=json.list;
    const delay=parseFloat(del.value);

    await new Promise(r=>setTimeout(r,delay));
    draw(arr);
}

btn.onclick=async function(){
    const mode=met.value;
    const json=await fetch(sel.value).then(r=>r.json());
    const arr=json.list;
    const delay=parseFloat(del.value);
    const useWasm=acc.checked;
    ;
    let sorted=arr;
    let red=[],green=[];


    console.log("button pressed",mode,json);


    if(!useWasm){
        sort[mode+"Debug"].get=async function(index){
            red.push(index);
            return this.workArr[index];
        }
        sort[mode+"Debug"].next=async function(){
            draw(this.workArr,red,green);
            red.length=0;
            await new Promise(r=>setTimeout(r,delay));
        };
        sorted=await sort[mode+"Debug"].number(arr);    
    }else if(useWasm){
        //draw(arr);
        //await new Promise(r=>setTimeout(r,delay));
        sorted=wasm[mode](arr);
    };
    
    // if(mode=="quickSort"&&!useWasm){
    //     sort.quickSortDebug.get=async function(index){
    //         red.push(index);
    //         return this.workArr[index];
    //     }
    //     sort.quickSortDebug.next=async function(){
    //         draw(this.workArr,red,green);
    //         red.length=0;
    //         await new Promise(r=>setTimeout(r,delay));
    //     };
    //     sorted=await sort.quickSortDebug.number(arr);    
    // }else if(mode=="quickSort"&&useWasm){
    //     //draw(arr);
    //     //await new Promise(r=>setTimeout(r,delay));
    //     sorted=wasm.quickSort(arr);
    // }
    
    // else if(mode=="mergeSort"&&!useWasm){
    //     sort.mergeSortDebug.get=async function(index){
    //         red.push(index);
    //         return this.workArr[index];
    //     }
    //     sort.mergeSortDebug.next=async function(){
    //         draw(this.workArr,red,green);
    //         red.length=0;
    //         await new Promise(r=>setTimeout(r,delay));
    //     };
    //     sorted=await sort.mergeSortDebug.number(arr);    
    // }else if(mode=="mergeSort"&&useWasm){
    //     //draw(arr);
    //     //await new Promise(r=>setTimeout(r,delay));
    //     sorted=wasm.mergeSort(arr);
    // }
    
    ;


    for(let i=0;i<sorted.length;i++){
        green.push(i);
        draw(sorted,red,green);
        await new Promise(r=>setTimeout(r,delay));
    };

};

function draw(arr=[1],redIndex=[],greenIndex=[]){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    let largest=arr[0];
    arr.forEach(e=>{ if(e>largest)largest=e; });

    const scale=canvas.height/largest;
    const barWidth=canvas.width/arr.length;

    for(let i=0;i<arr.length;i++){
        const v=arr[i];
        const x=i*barWidth;
        const y=canvas.height-v*scale;
        const height=v*scale;

        ctx.beginPath();
        ctx.rect(x,y,barWidth,height);
        ctx.fillStyle="white";
        if(redIndex.includes(i))ctx.fillStyle="red";
        else if(greenIndex.includes(i))ctx.fillStyle="green";
        ctx.fill();
    };
};


sel.onchange();

window.draw=draw;