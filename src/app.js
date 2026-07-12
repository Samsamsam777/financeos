
import {load,save,reset,backup,restore,makeId} from "./storage.js";
import {euro,today,sortNewest,detectCategory,accountBalance,monthSummary,filterTransactions,monthKey} from "./logic.js";
import {esc,field,kpi} from "./ui.js";

let data=load(),view="today";
let filters={query:"",account:"",category:"",person:"",sort:"newest"};
const app=document.querySelector("#app");
const cat=id=>data.categories.find(x=>x.id===id);
const acc=id=>data.accounts.find(x=>x.id===id);

function navBtn(id,label,icon){return `<button data-nav="${id}" class="${view===id?"active":""}"><div class="nav-icon">${icon}</div>${label}</button>`}
function shell(content){
 app.innerHTML=`<main class="app"><div class="topbar"><div class="brand"><h1>FinanceOS</h1><p>Privat. Offline. Dein Haushalt.</p></div><button class="icon-btn" data-nav="settings">⚙</button></div>${content}</main>
 <nav class="nav"><div class="nav-inner">${navBtn("today","Heute","⌂")}${navBtn("transactions","Buchungen","≡")}<button class="plus" data-nav="add">＋</button>${navBtn("budgets","Budgets","◔")}${navBtn("more","Mehr","•••")}</div></nav>`;
 bindNav()
}
function bindNav(){document.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>{view=b.dataset.nav;render()})}
function txRow(t,withAction=false){
 const pending=t.status==="pending",cls=pending?"pending":t.type==="income"?"positive":"negative";
 return `<div class="row"><div><strong>${pending?"◌ ":""}${esc(t.description)}</strong><div class="meta">${cat(t.categoryId)?.name||"—"} · ${acc(t.accountId)?.name||"—"} · ${t.person||"Gemeinsam"}</div></div>
 <div style="text-align:right"><div class="amount ${cls}">${t.type==="income"?"+":"-"}${euro(t.amount)}</div>${withAction?`<button class="btn ghost" data-edit="${t.id}" style="margin-top:6px;padding:7px 9px">Bearbeiten</button>`:""}</div></div>`
}
function renderToday(){
 const s=monthSummary(data),pending=data.transactions.filter(t=>t.status==="pending"),recent=sortNewest(data.transactions).slice(0,10),loan=data.loans[0];
 shell(`<div class="grid two">${kpi("Verfügbar",euro(s.available))}${kpi("Ausgaben",euro(s.expense))}${kpi("Einnahmen",euro(s.income))}${kpi("Sparquote",Math.round(s.rate*100)+" %")}</div>
 <div class="section-title"><h2>Heute</h2><span class="small">${new Date().toLocaleDateString("de-DE",{weekday:"long",day:"2-digit",month:"long"})}</span></div>
 <div class="card">
  <div class="row"><div><strong>Offene Zuordnungen</strong><div class="meta">Unklare Händler später prüfen</div></div><button class="btn ${pending.length?"primary":"ghost"}" data-nav="pending">${pending.length}</button></div>
  ${loan?`<div class="row"><div style="flex:1"><strong>${loan.name}</strong><div class="meta">${euro(loan.principal-loan.remaining)} von ${euro(loan.principal)} abbezahlt</div><div class="progress" style="margin-top:8px"><span style="width:${Math.min(100,(loan.principal-loan.remaining)/loan.principal*100)}%"></span></div></div><div>${Math.round((loan.principal-loan.remaining)/loan.principal*100)} %</div></div>`:""}
 </div>
 <div class="section-title"><h2>Konten</h2></div><div class="card list">${data.accounts.map(a=>`<div class="row"><div><strong>${esc(a.name)}</strong><div class="meta">${esc(a.type)}</div></div><strong>${euro(accountBalance(data,a.id))}</strong></div>`).join("")}</div>
 <div class="section-title"><h2>Letzte Buchungen</h2><span class="small">max. 10</span></div><div class="card list">${recent.map(t=>txRow(t)).join("")||'<div class="empty">Keine Buchungen</div>'}</div>
 <button class="btn ghost all-link" data-nav="transactions">Alle Buchungen anzeigen →</button>`)
}
function renderTransactions(){
 const tx=filterTransactions(data,filters);
 shell(`<div class="section-title"><h2>Buchungen</h2><button class="btn primary" data-nav="add">＋ Neu</button></div>
 <div class="card form">
  ${field("Suche",`<input id="fQuery" value="${esc(filters.query)}" placeholder="Händler, Kategorie oder Betrag">`)}
  <div class="grid two">
   ${field("Konto",`<select id="fAccount"><option value="">Alle</option>${data.accounts.map(a=>`<option value="${a.id}" ${filters.account===a.id?"selected":""}>${esc(a.name)}</option>`).join("")}</select>`)}
   ${field("Kategorie",`<select id="fCategory"><option value="">Alle</option>${data.categories.map(c=>`<option value="${c.id}" ${filters.category===c.id?"selected":""}>${esc(c.name)}</option>`).join("")}</select>`)}
   ${field("Person",`<select id="fPerson"><option value="">Alle</option>${data.settings.people.map(p=>`<option ${filters.person===p?"selected":""}>${esc(p)}</option>`).join("")}</select>`)}
   ${field("Sortierung",`<select id="fSort"><option value="newest">Neueste zuerst</option><option value="amount-desc" ${filters.sort==="amount-desc"?"selected":""}>Betrag absteigend</option><option value="amount-asc" ${filters.sort==="amount-asc"?"selected":""}>Betrag aufsteigend</option></select>`)}
  </div>
 </div>
 <div class="card list" style="margin-top:12px">${tx.map(t=>txRow(t,true)).join("")||'<div class="empty">Keine Treffer</div>'}</div>`);
 ["fQuery","fAccount","fCategory","fPerson","fSort"].forEach(id=>document.getElementById(id).onchange=document.getElementById(id).oninput=()=>{
   filters={query:fQuery.value,account:fAccount.value,category:fCategory.value,person:fPerson.value,sort:fSort.value};renderTransactions()
 });
 document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openEdit(b.dataset.edit))
}
function renderAdd(){
 shell(`<div class="section-title"><h2>Neue Buchung</h2></div><div class="card"><form id="txForm" class="form">
 ${field("Datum",`<input name="date" type="date" value="${today()}" required>`)}
 ${field("Typ",`<select name="type"><option value="expense">Ausgabe</option><option value="income">Einnahme</option></select>`)}
 ${field("Betrag",`<input name="amount" type="number" inputmode="decimal" step="0.01" placeholder="0,00" required>`)}
 ${field("Beschreibung",`<input name="description" placeholder="z. B. REWE Markt" required>`)}
 ${field("Konto",`<select name="accountId">${data.accounts.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join("")}</select>`)}
 ${field("Kategorie",`<select name="categoryId"><option value="">Automatisch erkennen</option>${data.categories.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select>`)}
 ${field("Person (optional)",`<select name="person">${data.settings.people.map(p=>`<option>${esc(p)}</option>`).join("")}</select>`)}
 <button class="btn primary">Buchung speichern</button></form></div>`);
 txForm.onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),description=f.get("description"),categoryId=f.get("categoryId")||detectCategory(data,description);
 data.transactions.push({id:makeId(),createdAt:Date.now(),date:f.get("date"),type:f.get("type"),amount:Number(f.get("amount")),description,accountId:f.get("accountId"),categoryId,person:f.get("person"),status:cat(categoryId)?.name==="Später zuordnen"?"pending":"done"});
 save(data);view="today";render()}
}
function renderPending(){
 const list=sortNewest(data.transactions.filter(t=>t.status==="pending"));
 shell(`<div class="section-title"><h2>Später zuordnen</h2><span class="badge warn">${list.length} offen</span></div><div class="card list">${list.map(t=>`<div class="row"><div><strong>${esc(t.description)}</strong><div class="meta">${euro(t.amount)} · ${esc(t.person)}</div></div><button class="btn" data-resolve="${t.id}">Zuordnen</button></div>`).join("")||'<div class="empty">Alles erledigt</div>'}</div>`);
 document.querySelectorAll("[data-resolve]").forEach(b=>b.onclick=()=>openResolve(b.dataset.resolve))
}
function renderBudgets(){
 const key=today().slice(0,7),tx=data.transactions.filter(t=>monthKey(t.date)===key&&t.type==="expense");
 shell(`<div class="section-title"><h2>Budgets</h2><span class="small">${key}</span></div><div class="card list">${data.categories.filter(c=>c.budget>0).map(c=>{const used=tx.filter(t=>t.categoryId===c.id).reduce((s,t)=>s+Number(t.amount),0),rest=c.budget-used,pct=Math.min(100,c.budget?used/c.budget*100:0);return `<div class="row"><div style="flex:1"><strong>${esc(c.name)}</strong><div class="meta">${euro(used)} verbraucht · ${euro(rest)} übrig</div><div class="progress" style="margin-top:8px"><span style="width:${pct}%"></span></div></div><div>${Math.round(pct)} %</div></div>`}).join("")}</div>`)
}
function renderMore(){shell(`<div class="section-title"><h2>Mehr</h2></div><div class="grid"><button class="card btn" data-nav="pending">Später zuordnen</button><button class="card btn" data-nav="loans">Kredite</button><button class="card btn" data-nav="manage">Konten, Kategorien & Regeln</button><button class="card btn" data-nav="settings">Backup & Daten</button></div>`)}
function renderLoans(){shell(`<div class="section-title"><h2>Kredite</h2></div><div class="card list">${data.loans.map(l=>{const paid=l.principal-l.remaining,pct=paid/l.principal*100;return `<div><div class="row"><div><strong>${esc(l.name)}</strong><div class="meta">Rate ${euro(l.rate)} · ${l.interest}% Zins</div></div><strong>${euro(l.remaining)}</strong></div><div class="progress"><span style="width:${pct}%"></span></div><div class="small" style="margin-top:8px">${euro(paid)} abbezahlt · ${Math.round(pct)} %</div></div>`}).join("")}</div>`)}
function renderManage(){
 shell(`<div class="section-title"><h2>Verwalten</h2></div>
 <div class="section-title"><h2>Konten</h2><button class="btn primary" id="addAccount">＋</button></div><div class="card list">${data.accounts.map(a=>`<div class="row"><div><strong>${esc(a.name)}</strong><div class="meta">${euro(a.start)} Startsaldo</div></div><button class="btn ghost" data-account="${a.id}">Bearbeiten</button></div>`).join("")}</div>
 <div class="section-title"><h2>Kategorien</h2><button class="btn primary" id="addCategory">＋</button></div><div class="card list">${data.categories.map(c=>`<div class="row"><div><strong>${esc(c.name)}</strong><div class="meta">Budget ${euro(c.budget)}</div></div><button class="btn ghost" data-category="${c.id}">Bearbeiten</button></div>`).join("")}</div>
 <div class="section-title"><h2>Händlerregeln</h2><button class="btn primary" id="addRule">＋</button></div><div class="card list">${data.rules.map(r=>`<div class="row"><div><strong>${esc(r.needle)}</strong><div class="meta">→ ${esc(cat(r.categoryId)?.name||"—")}</div></div><button class="btn ghost" data-rule="${r.id}">Bearbeiten</button></div>`).join("")}</div>`);
 addAccount.onclick=()=>editAccount();addCategory.onclick=()=>editCategory();addRule.onclick=()=>editRule();
 document.querySelectorAll("[data-account]").forEach(b=>b.onclick=()=>editAccount(b.dataset.account));
 document.querySelectorAll("[data-category]").forEach(b=>b.onclick=()=>editCategory(b.dataset.category));
 document.querySelectorAll("[data-rule]").forEach(b=>b.onclick=()=>editRule(b.dataset.rule))
}
function renderSettings(){
 shell(`<div class="section-title"><h2>Backup & Daten</h2></div><div class="card form">
 <button class="btn primary" id="backupBtn">Backup erstellen</button>
 <label class="btn ghost" style="text-align:center">Backup wiederherstellen<input id="restoreInput" type="file" accept="application/json" hidden></label>
 <button class="btn danger ghost" id="resetBtn">Beispieldaten zurücksetzen</button>
 <div class="notice">FinanceOS v0.3 · Beim Backup auf dem iPhone „In Dateien sichern“ und anschließend iCloud Drive wählen.</div></div>`);
 backupBtn.onclick=()=>backup(data);restoreInput.onchange=async e=>{try{await restore(e.target.files[0])}catch(err){alert(err.message)}};resetBtn.onclick=()=>{if(confirm("Wirklich alles zurücksetzen?"))reset()}
}
function modal(content){document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="modal"><div class="sheet"><div style="display:flex;justify-content:flex-end"><button class="icon-btn" id="closeModal">✕</button></div>${content}</div></div>`);closeModal.onclick=()=>document.getElementById("modal")?.remove()}
function openEdit(id){const t=data.transactions.find(x=>x.id===id);modal(`<h2>Buchung bearbeiten</h2><form id="editForm" class="form">
 ${field("Beschreibung",`<input name="description" value="${esc(t.description)}">`)}${field("Betrag",`<input name="amount" type="number" step="0.01" value="${t.amount}">`)}
 ${field("Konto",`<select name="accountId">${data.accounts.map(a=>`<option value="${a.id}" ${a.id===t.accountId?"selected":""}>${esc(a.name)}</option>`).join("")}</select>`)}
 ${field("Kategorie",`<select name="categoryId">${data.categories.map(c=>`<option value="${c.id}" ${c.id===t.categoryId?"selected":""}>${esc(c.name)}</option>`).join("")}</select>`)}
 ${field("Person",`<select name="person">${data.settings.people.map(p=>`<option ${p===t.person?"selected":""}>${esc(p)}</option>`).join("")}</select>`)}
 <button class="btn primary">Speichern</button><button type="button" class="btn danger ghost" id="deleteTx">Löschen</button></form>`);
 editForm.onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);Object.assign(t,{description:f.get("description"),amount:Number(f.get("amount")),accountId:f.get("accountId"),categoryId:f.get("categoryId"),person:f.get("person"),status:cat(f.get("categoryId"))?.name==="Später zuordnen"?"pending":"done"});save(data);modal.remove();renderTransactions()};
 deleteTx.onclick=()=>{if(confirm("Buchung löschen?")){data.transactions=data.transactions.filter(x=>x.id!==id);save(data);modal.remove();renderTransactions()}}
}
function openResolve(id){const t=data.transactions.find(x=>x.id===id);modal(`<h2>Zuordnen</h2><div class="small">${esc(t.description)} · ${euro(t.amount)}</div><form id="resolveForm" class="form" style="margin-top:14px">
 ${field("Kategorie",`<select name="categoryId">${data.categories.filter(c=>c.name!=="Später zuordnen").map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select>`)}
 ${field("Person",`<select name="person">${data.settings.people.map(p=>`<option ${p===t.person?"selected":""}>${esc(p)}</option>`).join("")}</select>`)}
 <label class="small"><input type="checkbox" name="learn" checked> Für zukünftige Buchungen merken</label><button class="btn primary">Speichern</button></form>`);
 resolveForm.onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);t.categoryId=f.get("categoryId");t.person=f.get("person");t.status="done";if(f.get("learn"))data.rules.push({id:makeId(),needle:t.description.toUpperCase(),categoryId:t.categoryId});save(data);modal.remove();renderPending()}
}
function editAccount(id){const a=id?data.accounts.find(x=>x.id===id):{id:makeId(),name:"",type:"Girokonto",start:0};modal(`<h2>${id?"Konto bearbeiten":"Konto hinzufügen"}</h2><form id="accountForm" class="form">
 ${field("Name",`<input name="name" value="${esc(a.name)}" required>`)}${field("Typ",`<input name="type" value="${esc(a.type)}">`)}${field("Startsaldo",`<input name="start" type="number" step="0.01" value="${a.start}">`)}
 <button class="btn primary">Speichern</button>${id?'<button type="button" class="btn danger ghost" id="deleteItem">Löschen</button>':""}</form>`);
 accountForm.onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);Object.assign(a,{name:f.get("name"),type:f.get("type"),start:Number(f.get("start"))});if(!id)data.accounts.push(a);save(data);modal.remove();renderManage()};
 if(id)deleteItem.onclick=()=>{if(data.transactions.some(t=>t.accountId===id))return alert("Konto wird noch von Buchungen verwendet.");data.accounts=data.accounts.filter(x=>x.id!==id);save(data);modal.remove();renderManage()}
}
function editCategory(id){const c=id?data.categories.find(x=>x.id===id):{id:makeId(),name:"",budget:0};modal(`<h2>${id?"Kategorie bearbeiten":"Kategorie hinzufügen"}</h2><form id="categoryForm" class="form">
 ${field("Name",`<input name="name" value="${esc(c.name)}" required>`)}${field("Monatsbudget",`<input name="budget" type="number" step="0.01" value="${c.budget}">`)}
 <button class="btn primary">Speichern</button>${id?'<button type="button" class="btn danger ghost" id="deleteItem">Löschen</button>':""}</form>`);
 categoryForm.onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);Object.assign(c,{name:f.get("name"),budget:Number(f.get("budget"))});if(!id)data.categories.push(c);save(data);modal.remove();renderManage()};
 if(id)deleteItem.onclick=()=>{if(data.transactions.some(t=>t.categoryId===id)||data.rules.some(r=>r.categoryId===id))return alert("Kategorie wird noch verwendet.");data.categories=data.categories.filter(x=>x.id!==id);save(data);modal.remove();renderManage()}
}
function editRule(id){const r=id?data.rules.find(x=>x.id===id):{id:makeId(),needle:"",categoryId:data.categories[0]?.id};modal(`<h2>${id?"Regel bearbeiten":"Regel hinzufügen"}</h2><form id="ruleForm" class="form">
 ${field("Suchbegriff",`<input name="needle" value="${esc(r.needle)}" required>`)}${field("Kategorie",`<select name="categoryId">${data.categories.map(c=>`<option value="${c.id}" ${c.id===r.categoryId?"selected":""}>${esc(c.name)}</option>`).join("")}</select>`)}
 <button class="btn primary">Speichern</button>${id?'<button type="button" class="btn danger ghost" id="deleteItem">Löschen</button>':""}</form>`);
 ruleForm.onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);Object.assign(r,{needle:f.get("needle"),categoryId:f.get("categoryId")});if(!id)data.rules.push(r);save(data);modal.remove();renderManage()};
 if(id)deleteItem.onclick=()=>{data.rules=data.rules.filter(x=>x.id!==id);save(data);modal.remove();renderManage()}
}
function render(){if(view==="today")renderToday();else if(view==="transactions")renderTransactions();else if(view==="add")renderAdd();else if(view==="pending")renderPending();else if(view==="budgets")renderBudgets();else if(view==="loans")renderLoans();else if(view==="manage")renderManage();else if(view==="settings")renderSettings();else renderMore();bindNav()}
render();
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
