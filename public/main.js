import * as wasm from './bundler.js';
import * as sort from './jsort/mod.js';

// console.log(wasm);
window.wasm=wasm;
window.sort=sort;
const canvas=document.querySelector("canvas");
const view=document.querySelector(".view").children[0];
const startOptions=new URL(location.href).searchParams;
const [inp,_br0,gsm,gna,gbt,_br5,sel,met,btn,_br1,del/*,_br6,fas*/,_br2,acc,_br3,sou,_br4,aut,_br7,shf,sht,_br8,rsr,_br9,fwf,_br10]=document.querySelector(".input").children;
const [tim,_br6,spa]=document.querySelector(".view").children;

const ctx=canvas.getContext("2d");
// const input = [5, 3, 2, 4, 1];
// console.log("Before sort:", input);

// const sorted = wasm.quickSort(input);
// console.log("After sort:", sorted);
const canvasResolution=parseFloat(startOptions.get("res"))||1080;
var canvasRatio=(window.innerWidth*0.99)/(window.innerHeight*0.60)
// canvas.width=window.innerWidth*0.99;
// canvas.height=window.innerHeight*0.60;
canvas.width=canvasResolution;
canvas.height=canvasResolution/canvasRatio;

window.ctx=ctx;
// console.log(
//     "canvas,view,inp,_br0,gsm,gna,gbt,_br5,sel,met,btn,_br1,del,_br2,acc,_br3,sou,_br4",
//     canvas,view,inp,_br0,gsm,gna,gbt,_br5,sel,met,btn,_br1,del,_br2,acc,_br3,sou,_br4
// );
console.log(
    "canvas",canvas,
    "view",view,
    "inp",inp,
    "_br0",_br0,
    "gsm",gsm,
    "gna",gna,
    "gbt",gbt,
    "_br5",_br5,
    "sel",sel,
    "met",met,
    "btn",btn,
    "_br1",_br1,
    "del",del,
    "_br2",_br2,
    "acc",acc,
    "_br3",_br3,
    "sou",sou,
    "_br4",_br4
);

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
    let wasRunning=running;
    if(running){
        running=false;
        await finish;
        //await new Promise(r=>setTimeout(r,delay*2));
    };

    const json=await fetch(sel.value).then(r=>r.json());
    const arr=json.list;
    const delay=parseFloat(del.value);

    let max=arr[0],min=arr[0];
    for(const i of arr){
        max=i<max?max:i;
        min=i>min?min:i;
    };

    //await new Promise(r=>setTimeout(r,delay));
    draw(arr,max);
    if(wasRunning)finish=startHandler();
}

var running=false;
var finish=new Promise(r=>r());
btn.onclick=()=>finish=startHandler();
async function startHandler(){
    let old=btn.onclick;
    btn.onclick=stopHandler;
    btn.innerText="stop";
    running=true;
    // btn.disabled=true;

    try{
        const mode=met.value;
        const json=await fetch(sel.value).then(r=>r.json());
        const arr=json.list;
        const delay=parseFloat(del.value);
        const useWasm=acc.checked;
        const faster=false;//fas.checked;
        const sound=sou.checked;
        const timeNow=performance.now();//Date.now();
        const soundHerz=[
            parseFloat(shf.value)||200,
            parseFloat(sht.value)||1000,
        ];
        const radixSortRadix=(()=>{let v=parseInt(rsr.value)||10;return v<2?2:v})();
        const frequencyWaveForm=fwf.value;
        ;
        let sorted=arr;
        let red=[],green=[],cyan=[];
        let max=arr[0],min=arr[0];

        const oscillator=audioCtx.createOscillator();
        const gainNode=audioCtx.createGain();

        oscillator.type=frequencyWaveForm;//||"sine"; 
        oscillator.frequency.value=0;

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if(sound)oscillator.start();

        console.log("button pressed",mode,json);

        for(const i of arr){
            max=i<max?max:i;
            min=i>min?min:i;
        };


        if(!useWasm&&!faster){
            sort[mode+"Debug"].checked=async function(){
                ;
            };
            sort[mode+"Debug"].get=async function(index){
                red.push(parseInt(index));
                const v=this.workArr[index];
                const freq=valueToFreq(v,min,max,...soundHerz);
                // if(sound)playTone(freq,delay);
                oscillator.frequency.value=freq;
                return v;
            };
            sort[mode+"Debug"].set=async function(index,value){
                cyan.push(parseInt(index));
                //console.log("Set",index);
                const v=this.workArr[index]=value;
                const freq=valueToFreq(v,min,max,...soundHerz);
                // if(sound)playTone(freq,delay);
                oscillator.frequency.value=freq;
                return v;
            };
            sort[mode+"Debug"].next=async function(){
                // console.log("red,cyan,green",red,green,cyan);
                draw(this.workArr,max,red,green,cyan);
                red.length=0; green.length=0; cyan.length=0;
                if(!running)return new Promise(r=>r);
                await new Promise(r=>setTimeout(r,delay));
            };
            if(mode=="radixSort")sort[mode+"Debug"].base=radixSortRadix;
            sort[mode+"Debug"].number(arr).then(r=>sorted=r).catch(err=>err);
            while(arr===sorted&&running){
                await new Promise(r=>setTimeout(r,delay));
            };
            sorted=sort[mode+"Debug"].workArr;
        }else if(useWasm){
            //draw(arr);
            //await new Promise(r=>setTimeout(r,delay));
            sorted=wasm[mode](arr);
        }/*else if(faster){
            sort[mode+"Debug"].number(arr).then(r=>sorted=r).catch(err=>err);
            while(arr===sorted&&running){
                await new Promise(r=>setTimeout(r,delay));
            };
            sorted=sort[mode+"Debug"].workArr;
        };*/
        
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

        running=true;

        const timeTaken=performance.now()-timeNow;
        tim.innerText=`${timeTaken/1000}s`;
        
        green.push(1);
        for(let i=0;i<sorted.length;i++){
            if(!running||(sorted[i-1]>sorted[i]))break;
            green.push(i);
            draw(sorted,max,red,green,cyan);
            const freq=valueToFreq(sorted[i],min,max,...soundHerz);
            // if(sound)playTone(freq,delay);
            oscillator.frequency.value=freq;
            await new Promise(r=>setTimeout(r,delay));
        };

        console.log(`stopped by ${running?"sort finish":"user action"}`);

        oscillator.stop();
    }
    catch(err){
        console.error(err);
    }
    finally{
        // btn.disabled=false;
        running=false;
        btn.innerText="sort";
        btn.onclick=old;
    }
};
async function stopHandler(){
    running=false;
    // try {
    //     ;
    // } catch (err) {
    //     ;
    // } finally {
    //     ;
    // }
};

met.onchange=async function(){
    const delay=parseFloat(del.value);
    if(running){
        running=false;
        await finish;
        //await new Promise(r=>setTimeout(r,delay*2));
        finish=startHandler();
    }if(met.value=="radixSort"){
        rsr.disabled=false;
    }else{
        rsr.disabled=true;
    };
};

gbt.onclick=async function(){
    const mode=gsm.value;
    const amount=parseInt(gna.value);

    if(mode=="shuffled"){
        const arr=new sort.ShuffledUintArray(amount);
        const jstring=JSON.stringify({type:"int",list:arr});

        const b=new Blob([jstring]);
        const u=URL.createObjectURL(b);

        const o=new Option(`generated: ${amount} shuffled numbers`,u);
        sel.append(o);
    } else if(mode=="random"){
        const arr=new sort.RandomUintArray(amount);
        const jstring=JSON.stringify({type:"int",list:arr});

        const b=new Blob([jstring]);
        const u=URL.createObjectURL(b);

        const o=new Option(`generated: ${amount} random numbers`,u);
        sel.append(o);
    } else if(mode=="worst"){
        const arr=Array(amount).fill(0).map((e,i)=>i).reverse();
        const jstring=JSON.stringify({type:"int",list:arr});

        const b=new Blob([jstring]);
        const u=URL.createObjectURL(b);

        const o=new Option(`generated: ${amount} numbers in reverse order`,u);
        sel.append(o);
    } else if(mode=="best"){
        const arr=Array(amount).fill(0).map((e,i)=>i);
        const jstring=JSON.stringify({type:"int",list:arr});

        const b=new Blob([jstring]);
        const u=URL.createObjectURL(b);

        const o=new Option(`generated: ${amount} numbers in order`,u);
        sel.append(o);
    };
}

const barColors={
    background: "black",
    idle: "white",
    access: "red",
    check: "green",
    write: "cyan",
};

function draw(arr=[1],largest=arr[0],redIndex=[],greenIndex=[],cyanIndex=[]){
    ctx.fillStyle=barColors.background;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    //let largest=arr[0];
    //arr.forEach(e=>{ if(e>largest)largest=e; });

    const scale=canvas.height/largest;
    const barWidth=canvas.width/arr.length;

    for(let i=0;i<arr.length;i++){
        const v=arr[i];
        const x=i*barWidth;
        const y=canvas.height-v*scale;
        const height=v*scale;

        ctx.beginPath();
        ctx.rect(x,y,barWidth,height);
        ctx.fillStyle=barColors.idle;
        if(redIndex.includes(i))ctx.fillStyle=barColors.access;
        if(greenIndex.includes(i))ctx.fillStyle=barColors.check;
        if(cyanIndex.includes(i))ctx.fillStyle=barColors.write;
        ctx.fill();
    };
};

const audioCtx=new(window.AudioContext||window.webkitAudioContext)();

function valueToFreq(value, minVal, maxVal, minFreq = 100, maxFreq = 1000) {
    const norm = (value - minVal) / (maxVal - minVal);
    return minFreq + norm * (maxFreq - minFreq);
};
function playTone(freq, duration = 100) {
    const oscillator=audioCtx.createOscillator();
    const gainNode=audioCtx.createGain();

    oscillator.type="sine"; 
    oscillator.frequency.value=freq;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime+duration/1000);
};
function strToBool(input){
    const str=String(input).toLowerCase();
    
    if(str=="1")return true;
    if(str=="0")return false;
    if(str=="yes")return true;
    if(str=="no")return false;
    if(str=="true")return true;
    if(str=="false")return false;
    if(str=="enabled")return true;
    if(str=="disabled")return false;
    
    // return false;
};
function or(x,y){
    if(x!=null)return x;
    return y;
};

sel.value=startOptions.get("list")||sel.value;
met.value=startOptions.get("sort")||met.value;
del.value=startOptions.get("delay")||del.value;
rsr.value=startOptions.get("radix")||rsr.value;
shf.value=startOptions.get("min-freq")||shf.value;
sht.value=startOptions.get("max-freq")||sht.value;
fwf.value=startOptions.get("waveform")||fwf.value;

aut.checked=or(strToBool(startOptions.get("auto-start")),aut.checked);
sou.checked=or(strToBool(startOptions.get("sound")),sou.checked);
acc.checked=or(strToBool(startOptions.get("accelerated")),acc.checked);

ctx.imageSmoothingEnabled=or(strToBool(startOptions.get("smoothing")),true);
ctx.imageSmoothingQuality=startOptions.get("smoothing-quality")||"low";
canvas.style.imageRendering=or(strToBool(startOptions.get("pixelated")),false)?"pixelated":"auto";

barColors.background=startOptions.get("background-color")||barColors.background;
barColors.idle=startOptions.get("idle-color")||barColors.idle;
barColors.access=startOptions.get("access-color")||barColors.access;
barColors.check=startOptions.get("check-color")||barColors.check;
barColors.write=startOptions.get("write-color")||barColors.write;

sel.onchange();
window.draw=draw;
window.startHandler=startHandler;

if(strToBool(startOptions.get("start")))finish=startHandler();
if(strToBool(startOptions.get("fullscreen"))){
    canvas.style.position="fixed";
    canvas.style.top=0;
    canvas.style.left=0;
    canvasRatio=window.innerWidth/window.innerHeight;
    canvas.height=canvas.width*canvasRatio;
    canvas.style.width="100%";
    canvas.style.height="100%";
};

await new Promise(r=>setTimeout(r,2000));

while(true){
    const delay=parseFloat(del.value);
    await finish;
    await new Promise(r=>setTimeout(r,delay*2));
    if(!running&&aut.checked)await new Promise(r=>setTimeout(r,1500));
    if(!running&&aut.checked)finish=startHandler();
}


