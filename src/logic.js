export const today = () => new Date().toISOString().slice(0, 10);
export const monthKey = date => String(date).slice(0, 7);

export function euro(value, currency = "EUR") {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency
  }).format(Number(value || 0));
}

export function sortNewest(items) {
  return [...items].sort((a, b) => {
    const dateOrder = String(b.date).localeCompare(String(a.date));
    return dateOrder || Number(b.createdAt || 0) - Number(a.createdAt || 0);
  });
}

export function accountBalance(data, accountId) {
  const account = data.accounts.find(item => item.id === accountId);
  return data.transactions
    .filter(item => item.accountId === accountId)
    .reduce((balance, item) => {
      if (item.type === "income") return balance + Number(item.amount);
      if (item.type === "expense") return balance - Number(item.amount);
      return balance;
    }, Number(account?.start || 0));
}

export function totalBalance(data) {
  return data.accounts.reduce(
    (sum, account) => sum + accountBalance(data, account.id),
    0
  );
}

export function monthSummary(data, key = monthKey(today())) {
  const transactions = data.transactions.filter(item => monthKey(item.date) === key);
  const income = transactions
    .filter(item => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const expense = transactions
    .filter(item => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  return {
    income,
    expense,
    available: income - expense,
    savingsRate: income ? (income - expense) / income : 0
  };
}

export function detectCategory(data, description) {
  return matchCategoryRule(data, description).categoryId || data.categories.find(item => item.name === "Später zuordnen")?.id || "";
}

export function filterTransactions(data, filters) {
  let items = [...data.transactions];

  if (filters.query.trim()) {
    const query = filters.query.toLowerCase();
    items = items.filter(item => {
      const category = data.categories.find(category => category.id === item.categoryId);
      return item.description.toLowerCase().includes(query) ||
        String(item.amount).includes(query) ||
        (category?.name ?? "").toLowerCase().includes(query);
    });
  }

  if (filters.account) items = items.filter(item => item.accountId === filters.account);
  if (filters.category) items = items.filter(item => item.categoryId === filters.category);
  if (filters.person) items = items.filter(item => item.person === filters.person);

  if (filters.sort === "amount-desc") {
    items.sort((a, b) => Number(b.amount) - Number(a.amount));
  } else if (filters.sort === "amount-asc") {
    items.sort((a, b) => Number(a.amount) - Number(b.amount));
  } else {
    items = sortNewest(items);
  }

  return items;
}

export function loanProgress(loan) {
  const paid = Math.max(0, Number(loan.principal) - Number(loan.remaining));
  const percent = Number(loan.principal)
    ? Math.max(0, Math.min(100, paid / Number(loan.principal) * 100))
    : 0;
  return { paid, percent };
}


const MERCHANT_ALIASES = [
  { canonical: "PayPal", patterns: ["PAYPAL", "PP*"] },
  { canonical: "Apple", patterns: ["APPLE.COM/BILL", "APPLE SERVICES", "ITUNES.COM/BILL", "APPLE"] },
  { canonical: "Amazon", patterns: ["AMAZON", "AMZN"] },
  { canonical: "REWE", patterns: ["REWE"] },
  { canonical: "EDEKA", patterns: ["EDEKA"] },
  { canonical: "Lidl", patterns: ["LIDL"] },
  { canonical: "ALDI", patterns: ["ALDI"] },
  { canonical: "Spotify", patterns: ["SPOTIFY"] },
  { canonical: "Netflix", patterns: ["NETFLIX"] },
  { canonical: "Shell", patterns: ["SHELL"] },
  { canonical: "Aral", patterns: ["ARAL"] },
  { canonical: "Deutsche Bahn", patterns: ["DB VERTRIEB", "DEUTSCHE BAHN", "BAHN.DE"] }
];

const PAYMENT_PREFIXES = [
  /^PAYPAL\s*[*\-]?\s*/i,
  /^PP\s*[*\-]?\s*/i,
  /^SUMUP\s*[*\-]?\s*/i,
  /^STRIPE\s*[*\-]?\s*/i,
  /^EC\s*[- ]?KARTE\s*/i,
  /^KARTENZAHLUNG\s*/i,
  /^APPLE PAY\s*/i,
  /^GOOGLE PAY\s*/i
];

export function normalizeMerchant(description = "") {
  let value = String(description ?? "").normalize("NFKC").replace(/\s+/g, " ").trim();
  if (!value) return { raw:"", normalized:"", canonical:"", key:"", changed:false };
  const raw=value;
  PAYMENT_PREFIXES.forEach(pattern => { value=value.replace(pattern, ""); });
  value=value.replace(/\b\d{5,}\b/g," ").replace(/\b[A-Z0-9]{8,}\b/gi," ").replace(/[|_/]+/g," ").replace(/\s+/g," ").trim();
  const upper=value.toUpperCase();
  const alias=MERCHANT_ALIASES.find(item => item.patterns.some(pattern => upper.includes(pattern)));
  let canonical=alias?.canonical || value;
  if (!alias && canonical) canonical=canonical.toLowerCase().replace(/(^|\s|-)\p{L}/gu, m => m.toUpperCase());
  const key=canonical.toUpperCase().replace(/[^A-ZÄÖÜ0-9]+/g," ").replace(/\s+/g," ").trim();
  return { raw, normalized:value, canonical, key, changed:canonical!==raw };
}

export function matchCategoryRule(data, description = "") {
  const merchant=normalizeMerchant(description);
  const rawUpper=String(description ?? "").toUpperCase();
  const candidates=(data.rules ?? []).map(rule => {
    const needleRaw=String(rule.needle ?? "");
    const needleMerchant=normalizeMerchant(needleRaw);
    const needleUpper=needleRaw.toUpperCase();
    let score=0;
    if (merchant.key && needleMerchant.key && merchant.key===needleMerchant.key) score=100;
    else if (merchant.key && needleMerchant.key && merchant.key.includes(needleMerchant.key)) score=80;
    else if (merchant.key && needleMerchant.key && needleMerchant.key.includes(merchant.key)) score=70;
    else if (needleUpper && rawUpper.includes(needleUpper)) score=60;
    return {rule,score};
  }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score);
  const best=candidates[0];
  return { merchant, categoryId:best?.rule?.categoryId ?? "", ruleId:best?.rule?.id ?? "", confidence:best?.score ?? 0, matched:Boolean(best) };
}

export function upsertMerchantRule(data, description, categoryId) {
  const merchant=normalizeMerchant(description);
  if (!merchant.key || !categoryId) return null;
  const existing=(data.rules ?? []).find(rule => normalizeMerchant(rule.needle).key===merchant.key);
  if (existing) {
    existing.needle=merchant.canonical || description;
    existing.categoryId=categoryId;
    existing.updatedAt=Date.now();
    return existing;
  }
  const rule={ id:crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`, needle:merchant.canonical || description, categoryId, createdAt:Date.now() };
  data.rules ??= []; data.rules.push(rule); return rule;
}
