
export const euro=n=>new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(Number(n||0));
export const today=()=>new Date().toISOString().slice(0,10);
export const monthKey=d=>String(d).slice(0,7);
export const sortNewest=list=>[...list].sort((a,b)=>{
 const dc=String(b.date).localeCompare(String(a.date));return dc!==0?dc:Number(b.createdAt||0)-Number(a.createdAt||0)
});
export function detectCategory(data,desc){
 const text=desc.toUpperCase();
 const r=data.rules.find(x=>text.includes(x.needle.toUpperCase()));
 return r?.categoryId||data.categories.find(c=>c.name==="Später zuordnen")?.id
}
export function accountBalance(data,id){
 const a=data.accounts.find(x=>x.id===id);let s=Number(a?.start||0);
 data.transactions.filter(t=>t.accountId===id).forEach(t=>s+=t.type==="income"?Number(t.amount):t.type==="expense"?-Number(t.amount):0);
 return s
}
export function monthSummary(data,key=today().slice(0,7)){
 const tx=data.transactions.filter(t=>monthKey(t.date)===key);
 const income=tx.filter(t=>t.type==="income").reduce((s,t)=>s+Number(t.amount),0);
 const expense=tx.filter(t=>t.type==="expense").reduce((s,t)=>s+Number(t.amount),0);
 return {income,expense,available:income-expense,rate:income?(income-expense)/income:0}
}
export function filterTransactions(data,{query="",account="",category="",person="",sort="newest"}={}){
 let tx=[...data.transactions];
 if(query.trim()){const q=query.toLowerCase();tx=tx.filter(t=>t.description.toLowerCase().includes(q)||String(t.amount).includes(q)||(data.categories.find(c=>c.id===t.categoryId)?.name||"").toLowerCase().includes(q))}
 if(account)tx=tx.filter(t=>t.accountId===account);
 if(category)tx=tx.filter(t=>t.categoryId===category);
 if(person)tx=tx.filter(t=>t.person===person);
 if(sort==="amount-desc")tx.sort((a,b)=>Number(b.amount)-Number(a.amount));
 else if(sort==="amount-asc")tx.sort((a,b)=>Number(a.amount)-Number(b.amount));
 else tx=sortNewest(tx);
 return tx
}
