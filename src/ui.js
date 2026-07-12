
export const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
export const field=(label,control)=>`<div class="field"><label>${label}</label>${control}</div>`;
export const kpi=(label,value)=>`<div class="card kpi"><div class="label">${label}</div><div class="value">${value}</div></div>`;
