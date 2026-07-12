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
  const normalized = description.toUpperCase();
  const rule = data.rules.find(item =>
    normalized.includes(item.needle.toUpperCase())
  );
  return rule?.categoryId ??
    data.categories.find(item => item.name === "Später zuordnen")?.id;
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
