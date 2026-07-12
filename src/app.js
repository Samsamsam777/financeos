
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
 app.innerHTML=`<main class="app"><div class="topbar"><div class="brand"><h1>FinanceOS</h1><p>Mein Finanzbuch</p></div></div>${content}</main>
 <nav class="nav"><div class="nav-inner">${navBtn("today","Heute","⌂")}${navBtn("transactions","Buchungen","≡")}<button class="plus" data-nav="add">＋</button>${navBtn("budgets","Budgets","◔")}${navBtn("more","Mehr","•••")}</div></nav>`;
 bindNav()
}
function bindNav(){document.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>{view=b.dataset.nav;render()})}
function merchantMark(t){
 const d=(t.description||"").toUpperCase();
 if(d.includes("PAYPAL"))return "P";
 if(d.includes("REWE"))return "R";
 if(d.includes("AMAZON"))return "a";
 if(d.includes("SHELL")||d.includes("TANK"))return "⛽";
 if(t.type==="income")return "↗";
 return (t.description||"?").trim().charAt(0).toUpperCase()
}
function txRow(t,withAction=false){
 const pending=t.status==="pending",cls=pending?"pending":t.type==="income"?"positive":"negative";
 return `<div class="row transaction-row">
   <div class="transaction-left">
     <div class="merchant-icon">${esc(merchantMark(t))}</div>
     <div class="transaction-copy"><strong>${esc(t.description)}</strong><div class="meta">${cat(t.categoryId)?.name||"—"} · ${acc(t.accountId)?.name||"—"}</div></div>
   </div>
   <div style="text-align:right"><div class="amount ${cls}">${t.type==="income"?"+":"-"}${euro(t.amount)}</div>${withAction?`<button class="btn ghost" data-edit="${t.id}" style="margin-top:5px;padding:6px 8px">Bearbeiten</button>`:""}</div>
 </div>`
}
function renderToday(){
 const s=monthSummary(data);
 const cfg=data.settings.dashboard;
 const pending=data.transactions.filter(t=>t.status==="pending");
 const totalBalance=data.accounts.reduce((sum,a)=>sum+accountBalance(data,a.id),0);

 const modules=[
  {key:"balance",html:()=>`<section class="dashboard-module">
    <div class="card hero">
      <div class="hero-row">
        <div class="hero-icon">▣</div>
        <div class="hero-copy">
          <div class="label">Gesamtkontostand</div>
          <div class="value">${euro(totalBalance)}</div>
          <div class="sub"><span>Verfügbar diesen Monat</span><strong>${euro(s.available)}</strong></div>
        </div>
      </div>
    </div>
  </section>`},
  {key:"today",html:()=>`<section class="dashboard-module">
    <div class="grid two">
      <div class="card metric-card income">
        <div class="metric-head"><div class="metric-icon income">↗</div><div class="metric-label">Einnahmen</div></div>
        <div class="metric-value">${euro(s.income)}</div>
      </div>
      <div class="card metric-card expense">
        <div class="metric-head"><div class="metric-icon expense">↘</div><div class="metric-label">Ausgaben</div></div>
        <div class="metric-value">${euro(s.expense)}</div>
      </div>
    </div>
  </section>`},
  {key:"pending",html:()=>`<section class="dashboard-module">
    <div class="section-title"><h2>Heute</h2><span class="small">${new Date().toLocaleDateString("de-DE",{weekday:"long",day:"2-digit",month:"long"})}</span></div>
    <div class="card pending-card"><div class="row">
      <div class="pending-left"><div class="pending-icon">□</div><div><strong>Offene Zuordnungen</strong><div class="meta">Unklare Händler später prüfen</div></div></div>
      <button class="btn ${pending.length?"primary":"ghost"}" data-nav="pending">${pending.length}</button>
    </div></div>
  </section>`},
  {key:"loans",html:()=>renderLoanPreview(cfg.loans.count||2)},
  {key:"transactions",html:()=>renderTransactionPreview(cfg.transactions.count||6)}
 ];

 const html=modules
   .filter(m=>cfg[m.key]?.enabled!==false)
   .sort((a,b)=>(cfg[a.key]?.order||99)-(cfg[b.key]?.order||99))
   .map(m=>m.html()).join("");

 shell(html);
 bindLoanInteractions()
}

function renderLoanPreview(count){
 const loans=data.loans.slice(0,Math.max(0,Number(count)||0));
 if(!loans.length)return "";
 return `<section class="dashboard-module">
   <div class="section-title"><h2>Kredite</h2><button class="section-link" data-nav="loans">Alle Kredite →</button></div>
   <div class="list" style="gap:7px">${loans.map(l=>{
      const paid=Math.max(0,l.principal-l.remaining);
      const pct=l.principal?Math.max(0,Math.min(100,paid/l.principal*100)):0;
      return `<div class="card loan-strip" data-loan="${l.id}">
        <div class="loan-strip-fill" style="width:${pct}%"></div>
        <div class="loan-strip-content">
          <div class="loan-icon">▱</div>
          <strong>${esc(l.name)}</strong>
          <span class="pct">${Math.round(pct)} %</span>
        </div>
      </div>`
   }).join("")}</div>
 </section>`
}
function renderTransactionPreview(count){const recent=sortNewest(data.transactions).slice(0,Math.max(0,Number(count)||0));if(!recent.length)return "";return `<section class="dashboard-module"><div class="section-title"><h2>Letzte Buchungen</h2><button class="section-link" data-nav="transactions">Alle Buchungen →</button></div><div class="card list">${recent.map(t=>txRow(t)).join("")}</div></section>`}
function bindLoanInteractions(){document.querySelectorAll("[data-loan]").forEach(el=>{let timer=null,longPressed=false;const id=el.dataset.loan;const start=()=>{longPressed=false;timer=setTimeout(()=>{longPressed=true;showLoanQuickView(id)},550)};const cancel=()=>{if(timer)clearTimeout(timer)};el.addEventListener("touchstart",start,{passive:true});el.addEventListener("touchend",()=>{cancel();if(!longPressed){view="loans";render()}});el.addEventListener("touchmove",cancel,{passive:true});el.addEventListener("mousedown",start);el.addEventListener("mouseup",()=>{cancel();if(!longPressed){view="loans";render()}});el.addEventListener("mouseleave",cancel)})}
function showLoanQuickView(id){const l=data.loans.find(x=>x.id===id);if(!l)return;const paid=Math.max(0,l.principal-l.remaining);const pct=l.principal?paid/l.principal*100:0;modal(`<h2>${esc(l.name)}</h2><div class="card list"><div class="row"><span class="meta">Ursprünglicher Betrag</span><strong>${euro(l.principal)}</strong></div><div class="row"><span class="meta">Restschuld</span><strong>${euro(l.remaining)}</strong></div><div class="row"><span class="meta">Abbezahlt</span><strong>${euro(paid)}</strong></div><div class="row"><span class="meta">Getilgt</span><strong>${Math.round(pct)} %</strong></div><div class="row"><span class="meta">Monatliche Rate</span><strong>${euro(l.rate)}</strong></div><div class="row"><span class="meta">Zinssatz</span><strong>${l.interest} %</strong></div></div>`)}

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
function renderMore(){shell(`<div class="section-title"><h2>Mehr</h2></div><div class="grid"><button class="card btn" data-nav="dashboard-settings">Dashboard anpassen</button><button class="card btn" data-nav="pending">Später zuordnen</button><button class="card btn" data-nav="loans">Kredite</button><button class="card btn" data-nav="manage">Konten, Kategorien & Regeln</button><button class="card btn" data-nav="settings">Einstellungen & Backup</button></div>`)}
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

function renderDashboardSettings(){
 const cfg=data.settings.dashboard;const labels={balance:"Gesamtkontostand",today:"Einnahmen & Ausgaben",pending:"Offene Zuordnungen",loans:"Kredite",transactions:"Letzte Buchungen"};const keys=["balance","today","pending","loans","transactions"];
 shell(`<div class="section-title"><h2>Dashboard anpassen</h2></div><div class="card form"><div class="notice">Das Dashboard bleibt scrollbar. Über Reihenfolge und Anzahl legst du fest, was zuerst sichtbar ist.</div>${keys.map(k=>`<div class="dashboard-config-row"><div><strong>${labels[k]}</strong>${k==="loans"||k==="transactions"?`<div class="meta">Anzahl sichtbarer Einträge</div>`:""}</div><div class="config-controls"><input class="toggle" type="checkbox" data-enable="${k}" ${cfg[k].enabled!==false?"checked":""}>${k==="loans"||k==="transactions"?`<input type="number" min="0" max="20" value="${cfg[k].count||0}" data-count="${k}">`:""}<select data-order="${k}">${[1,2,3,4,5].map(n=>`<option value="${n}" ${Number(cfg[k].order)===n?"selected":""}>${n}</option>`).join("")}</select></div></div>`).join("")}<button class="btn primary" id="saveDashboard">Speichern</button></div>`);
 saveDashboard.onclick=()=>{keys.forEach(k=>{cfg[k].enabled=document.querySelector(`[data-enable="${k}"]`).checked;cfg[k].order=Number(document.querySelector(`[data-order="${k}"]`).value);const count=document.querySelector(`[data-count="${k}"]`);if(count)cfg[k].count=Math.max(0,Math.min(20,Number(count.value)||0))});save(data);view="today";render()}
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
function render(){if(view==="today")renderToday();else if(view==="transactions")renderTransactions();else if(view==="add")renderAdd();else if(view==="pending")renderPending();else if(view==="budgets")renderBudgets();else if(view==="loans")renderLoans();else if(view==="manage")renderManage();else if(view==="dashboard-settings")renderDashboardSettings();else if(view==="settings")renderSettings();else renderMore();bindNav()}
render();
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
