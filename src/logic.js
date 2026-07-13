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
  ["REWE", ["REWE"]], ["EDEKA", ["EDEKA"]], ["Lidl", ["LIDL"]],
  ["ALDI", ["ALDI"]], ["Spotify", ["SPOTIFY"]], ["Netflix", ["NETFLIX"]],
  ["Amazon", ["AMAZON", "AMZN"]], ["Apple", ["APPLE.COM/BILL", "APPLE SERVICES", "ITUNES", "APPLE"]],
  ["Shell", ["SHELL"]], ["Aral", ["ARAL"]], ["Deutsche Bahn", ["DB VERTRIEB", "DEUTSCHE BAHN", "BAHN.DE"]]
];

export function normalizeMerchant(description = "") {
  const raw = String(description || "").replace(/\s+/g, " ").trim();
  let value = raw
    .replace(/^(PAYPAL|PP|SUMUP|STRIPE)\s*[\*\-]?\s*/i, "")
    .replace(/^(EC[- ]?KARTE|KARTENZAHLUNG|APPLE PAY|GOOGLE PAY)\s*/i, "")
    .replace(/\b\d{5,}\b/g, " ")
    .replace(/\b[A-Z0-9]{8,}\b/gi, " ")
    .replace(/[|_/]+/g, " ")
    .replace(/\s+/g, " ").trim();
  const upper = value.toUpperCase();
  const alias = MERCHANT_ALIASES.find(([, patterns]) => patterns.some(pattern => upper.includes(pattern)));
  const canonical = alias?.[0] || value || raw;
  const key = canonical.toUpperCase().replace(/[^A-ZÄÖÜ0-9]+/g, " ").trim();
  return { raw, canonical, key };
}

export function matchCategoryRule(data, description = "") {
  const merchant = normalizeMerchant(description);
  const rawUpper = String(description || "").toUpperCase();
  let best = null;
  for (const rule of data.rules || []) {
    const needle = normalizeMerchant(rule.needle);
    let score = 0;
    if (merchant.key && needle.key && merchant.key === needle.key) score = 100;
    else if (merchant.key && needle.key && merchant.key.includes(needle.key)) score = 80;
    else if (String(rule.needle || "") && rawUpper.includes(String(rule.needle).toUpperCase())) score = 60;
    if (!best || score > best.score) best = { rule, score };
  }
  return { merchant, categoryId: best?.score ? best.rule.categoryId : "", matched: Boolean(best?.score) };
}

export function upsertMerchantRule(data, description, categoryId, makeId) {
  const merchant = normalizeMerchant(description);
  if (!merchant.key || !categoryId) return;
  const existing = (data.rules || []).find(rule => normalizeMerchant(rule.needle).key === merchant.key);
  if (existing) {
    existing.needle = merchant.canonical;
    existing.categoryId = categoryId;
  } else {
    data.rules.push({ id: makeId(), needle: merchant.canonical, categoryId });
  }
}
