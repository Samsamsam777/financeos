import { normalizeMerchant, matchCategoryRule } from "./logic.js";

const HEADER_ALIASES = {
  date: ["datum", "date", "buchungstag", "valuta", "wertstellung"],
  description: ["beschreibung", "verwendungszweck", "merchant", "händler", "haendler", "empfänger", "empfaenger", "name", "text"],
  amount: ["betrag", "amount", "umsatz", "value"],
  debit: ["soll", "debit", "belastung", "ausgabe"],
  credit: ["haben", "credit", "gutschrift", "einnahme"],
  type: ["typ", "type", "art"],
  account: ["konto", "account", "iban"]
};

const normalizeHeader = value =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9]+/g, "");

function detectSeparator(text) {
  const firstLine = String(text).split(/\r?\n/).find(line => line.trim()) ?? "";
  const candidates = [",", ";", "\t"];
  return candidates
    .map(separator => ({ separator, count: firstLine.split(separator).length }))
    .sort((a, b) => b.count - a.count)[0]?.separator ?? ";";
}

function parseLine(line, separator) {
  const values = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (character === separator && !quoted) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += character;
  }

  values.push(current.trim());
  return values;
}

export function parseCSV(text) {
  const separator = detectSeparator(text);
  const lines = String(text)
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(line => line.trim());

  if (lines.length < 2) {
    throw new Error("Die CSV-Datei enthält keine Buchungen.");
  }

  const headers = parseLine(lines[0], separator);
  const rows = lines.slice(1).map((line, index) => {
    const values = parseLine(line, separator);
    return {
      rowNumber: index + 2,
      values,
      record: Object.fromEntries(headers.map((header, headerIndex) => [
        header,
        values[headerIndex] ?? ""
      ]))
    };
  });

  return { separator, headers, rows };
}

export function detectColumns(headers) {
  const normalized = headers.map(normalizeHeader);
  const result = {};

  Object.entries(HEADER_ALIASES).forEach(([target, aliases]) => {
    const normalizedAliases = aliases.map(normalizeHeader);
    const index = normalized.findIndex(header =>
      normalizedAliases.some(alias => header.includes(alias) || alias.includes(header))
    );
    if (index >= 0) result[target] = headers[index];
  });

  return result;
}

export function parseAmount(value) {
  const cleaned = String(value ?? "")
    .replace(/\s/g, "")
    .replace(/[€$£]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : 0;
}

export function parseDate(value) {
  const input = String(value ?? "").trim();
  if (!input) return "";

  const iso = input.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (iso) {
    const [, year, month, day] = iso;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const european = input.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
  if (european) {
    let [, day, month, year] = european;
    if (year.length === 2) year = `20${year}`;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const timestamp = Date.parse(input);
  if (!Number.isNaN(timestamp)) return new Date(timestamp).toISOString().slice(0, 10);
  return "";
}

function field(record, column) {
  return column ? record[column] ?? "" : "";
}

export function buildImportPreview({
  parsed,
  columns,
  accountId,
  data,
  makeId
}) {
  const existingKeys = new Set(
    (data.transactions ?? []).map(item =>
      [
        item.accountId,
        item.date,
        Number(item.amount).toFixed(2),
        String(item.description ?? "").toUpperCase()
      ].join("|")
    )
  );

  return parsed.rows.map(row => {
    const rawDescription = field(row.record, columns.description);
    const merchant = normalizeMerchant(rawDescription);

    let amount = parseAmount(field(row.record, columns.amount));
    const debit = parseAmount(field(row.record, columns.debit));
    const credit = parseAmount(field(row.record, columns.credit));
    const typeValue = String(field(row.record, columns.type)).toLowerCase();

    let type = "expense";
    if (credit > 0) {
      amount = credit;
      type = "income";
    } else if (debit > 0) {
      amount = debit;
      type = "expense";
    } else if (amount < 0) {
      amount = Math.abs(amount);
      type = "expense";
    } else if (/einnah|credit|haben|gutschrift/.test(typeValue)) {
      type = "income";
    }

    const date = parseDate(field(row.record, columns.date));
    const match = matchCategoryRule(data, rawDescription);
    const fallback = data.categories.find(item => item.name === "Später zuordnen")?.id ?? "";
    const categoryId = match.categoryId || fallback;
    const description = merchant.canonical || rawDescription || "Unbekannte Buchung";

    const duplicateKey = [
      accountId,
      date,
      Number(amount).toFixed(2),
      String(description).toUpperCase()
    ].join("|");

    const valid = Boolean(date && amount > 0 && description);
    const duplicate = existingKeys.has(duplicateKey);

    return {
      id: makeId(),
      rowNumber: row.rowNumber,
      createdAt: Date.now() + row.rowNumber,
      date,
      type,
      amount,
      description,
      originalDescription: rawDescription,
      merchantKey: merchant.key,
      accountId,
      categoryId,
      person: data.settings.people?.[0] ?? "Gemeinsam",
      status: data.categories.find(item => item.id === categoryId)?.name === "Später zuordnen"
        ? "pending"
        : "done",
      duplicate,
      valid,
      selected: valid && !duplicate,
      recognition: match.matched ? "recognized" : "pending"
    };
  });
}
