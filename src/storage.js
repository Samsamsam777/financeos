
const KEY="financeos_v01";
export const seed={
 settings:{people:["Gemeinsam","Sam","Partnerin","Unklar"],currency:"EUR",dashboard:{balance:{enabled:true,order:1},today:{enabled:true,order:2},pending:{enabled:true,order:3},loans:{enabled:true,order:4,count:2},transactions:{enabled:true,order:5,count:6}}},
 accounts:[
  {id:"a1",name:"Gemeinschaftskonto",type:"Girokonto",start:2500},
  {id:"a2",name:"Kreditkarte",type:"Kreditkarte",start:0},
  {id:"a3",name:"Bargeld",type:"Bargeld",start:100}
 ],
 categories:[
  {id:"c1",name:"Lebensmittel",budget:450},{id:"c2",name:"Wohnen",budget:1200},
  {id:"c3",name:"Restaurants",budget:180},{id:"c4",name:"Mobilität",budget:220},
  {id:"c5",name:"Shopping",budget:200},{id:"c6",name:"Abonnements",budget:80},
  {id:"c7",name:"Gesundheit",budget:100},{id:"c8",name:"Freizeit",budget:180},
  {id:"c9",name:"Gehalt",budget:0},{id:"c10",name:"Später zuordnen",budget:0}
 ],
 rules:[
  {id:"r1",needle:"REWE",categoryId:"c1"},{id:"r2",needle:"EDEKA",categoryId:"c1"},
  {id:"r3",needle:"LIDL",categoryId:"c1"},{id:"r4",needle:"ALDI",categoryId:"c1"},
  {id:"r5",needle:"SPOTIFY",categoryId:"c6"},{id:"r6",needle:"NETFLIX",categoryId:"c6"},
  {id:"r7",needle:"DB VERTRIEB",categoryId:"c4"},{id:"r8",needle:"SHELL",categoryId:"c4"},
  {id:"r9",needle:"AMAZON",categoryId:"c5"},{id:"r10",needle:"GEHALT",categoryId:"c9"}
 ],
 transactions:[],
 loans:[{id:"l1",name:"Autokredit",principal:25000,remaining:14382,rate:420,interest:4.2}]
};
const clone=x=>JSON.parse(JSON.stringify(x));
const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random();
function seedExamples(d){
 const dt=new Date().toISOString().slice(0,10);
 d.transactions=[
  {id:uid(),createdAt:Date.now()-2000,date:dt,type:"income",amount:3200,description:"Gehalt",accountId:"a1",categoryId:"c9",person:"Gemeinsam",status:"done"},
  {id:uid(),createdAt:Date.now()-1000,date:dt,type:"expense",amount:74.6,description:"REWE Markt",accountId:"a1",categoryId:"c1",person:"Gemeinsam",status:"done"},
  {id:uid(),createdAt:Date.now(),date:dt,type:"expense",amount:47.9,description:"PAYPAL *M32H8KD",accountId:"a1",categoryId:"c10",person:"Unklar",status:"pending"}
 ]
}
export function load(){
 try{
  const raw=localStorage.getItem(KEY);
  if(raw){
   const d=JSON.parse(raw);
   d.settings ||= clone(seed.settings); d.settings.dashboard ||= clone(seed.settings.dashboard); d.accounts ||= []; d.categories ||= [];
   d.rules=(d.rules||[]).map(r=>({...r,id:r.id||uid()}));
   d.transactions=(d.transactions||[]).map((t,i)=>({...t,createdAt:t.createdAt||Date.parse(t.date)||i}));
   d.loans ||= [];
   return d
  }
 }catch(e){}
 const d=clone(seed);seedExamples(d);save(d);return d
}
export function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
export function reset(){localStorage.removeItem(KEY);location.reload()}
export function makeId(){return uid()}
export function backup(d){
 const blob=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);
 a.download=`financeos-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();
 setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
export async function restore(file){
 const txt=await file.text(),obj=JSON.parse(txt);
 if(!obj.accounts||!obj.transactions)throw Error("Ungültiges Backup");
 save(obj);location.reload()
}
