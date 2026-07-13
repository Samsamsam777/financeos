
import { normalizeMerchant, matchCategoryRule } from "./logic.js";

const DATE_REGEX = /\b(\d{2})[.\/-](\d{2})[.\/-](\d{2,4})\b/;
const AMOUNT_REGEX = /(-?\d{1,3}(?:[.\s]\d{3})*,\d{2})\s*(?:EUR|€)?\b/g;

function toISODate(value) {
  const match = String(value).match(DATE_REGEX);
  if (!match) return "";
  let [, day, month, year] = match;
  if (year.length === 2) year = `20${year}`;
  return `${year}-${month}-${day}`;
}

function toAmount(value) {
  const number = Number(
    String(value)
      .replace(/\s/g, "")
      .replace(/\.(?=\d{3}(?:\D|$))/g, "")
      .replace(",", ".")
  );
  return Number.isFinite(number) ? number : 0;
}

function cleanLine(line) {
  return String(line)
    .replace(DATE_REGEX, " ")
    .replace(AMOUNT_REGEX, " ")
    .replace(/\b(EUR|Soll|Haben|Umsatz|Buchungstag|Valuta|Wertstellung)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function transactionFromParts({
  date,
  amount,
  rawDescription,
  accountId,
  data,
  makeId,
  pageNumber
}) {
  if (!date || !amount || !rawDescription) return null;

  const merchant = normalizeMerchant(rawDescription);
  const match = matchCategoryRule(data, rawDescription);
  const fallback = data.categories.find(item => item.name === "Später zuordnen")?.id ?? "";
  const categoryId = match.categoryId || fallback;
  const type = amount < 0 ? "expense" : "income";
  const absoluteAmount = Math.abs(amount);
  const description = merchant.canonical || rawDescription;

  const duplicateKey = [
    accountId,
    date,
    absoluteAmount.toFixed(2),
    description.toUpperCase()
  ].join("|");

  const existingKeys = new Set(
    (data.transactions ?? []).map(item =>
      [
        item.accountId,
        item.date,
        Number(item.amount).toFixed(2),
        String(item.description).toUpperCase()
      ].join("|")
    )
  );

  return {
    id: makeId(),
    createdAt: Date.now() + Math.floor(Math.random() * 100000),
    pageNumber,
    date,
    type,
    amount: absoluteAmount,
    description,
    originalDescription: rawDescription,
    merchantKey: merchant.key,
    accountId,
    categoryId,
    person: data.settings.people?.[0] ?? "Gemeinsam",
    status: data.categories.find(item => item.id === categoryId)?.name === "Später zuordnen"
      ? "pending"
      : "done",
    duplicate: existingKeys.has(duplicateKey),
    selected: !existingKeys.has(duplicateKey),
    recognized: match.matched
  };
}

function flattenPages(pages) {
  return pages.flatMap(page =>
    page.lines.map(line => ({ line, pageNumber: page.pageNumber }))
  );
}

function detectBank(text) {
  const upper = text.toUpperCase();
  if (/SPARKASSE|KREISSPARKASSE|STADTSPARKASSE|NASPA|HASPA/.test(upper)) return "sparkasse";
  if (/ING-DIBA|ING BANK|ING.DE/.test(upper)) return "ing";
  if (/DEUTSCHE KREDITBANK|\bDKB\b/.test(upper)) return "dkb";
  if (/N26 BANK/.test(upper)) return "n26";
  return "unknown";
}

export function classifyPDF(pages) {
  const allLines = flattenPages(pages);
  const text = allLines.map(item => item.line).join("\n");
  const textLength = text.replace(/\s/g, "").length;
  const dateLines = allLines.filter(item => DATE_REGEX.test(item.line)).length;
  const amountLines = allLines.filter(item => [...item.line.matchAll(AMOUNT_REGEX)].length > 0).length;

  let pdfType = "text";
  if (textLength < 40) pdfType = "image";
  else if (dateLines > 0 && amountLines > 0) pdfType = "table";

  return {
    pdfType,
    bank: detectBank(text),
    textLength,
    lineCount: allLines.length,
    dateLines,
    amountLines
  };
}

function parseGeneric({ pages, accountId, data, makeId }) {
  const results = [];

  for (const { line, pageNumber } of flattenPages(pages)) {
    const date = toISODate(line);
    const amounts = [...line.matchAll(AMOUNT_REGEX)].map(match => toAmount(match[1]));
    if (!date || !amounts.length) continue;

    const amount = amounts.at(-1);
    const rawDescription = cleanLine(line);
    const transaction = transactionFromParts({
      date,
      amount,
      rawDescription,
      accountId,
      data,
      makeId,
      pageNumber
    });
    if (transaction) results.push(transaction);
  }

  return results;
}

function parseSparkasse({ pages, accountId, data, makeId }) {
  const lines = flattenPages(pages);
  const results = [];

  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index];
    const date = toISODate(current.line);
    if (!date) continue;

    const combined = [
      current.line,
      lines[index + 1]?.line ?? "",
      lines[index + 2]?.line ?? ""
    ].join(" ");

    const amounts = [...combined.matchAll(AMOUNT_REGEX)].map(match => toAmount(match[1]));
    if (!amounts.length) continue;

    const amount = amounts.at(-1);
    let description = cleanLine(combined)
      .replace(/\b(SEPA|LASTSCHRIFT|ÜBERWEISUNG|UEBERWEISUNG|KARTENZAHLUNG|GUTSCHRIFT)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!description || description.length < 2) {
      description = cleanLine(current.line);
    }

    const transaction = transactionFromParts({
      date,
      amount,
      rawDescription: description,
      accountId,
      data,
      makeId,
      pageNumber: current.pageNumber
    });

    if (transaction) results.push(transaction);
  }

  return deduplicateParsed(results);
}

function deduplicateParsed(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = [item.date, item.amount.toFixed(2), item.description.toUpperCase()].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const PARSERS = [
  {
    id: "sparkasse",
    label: "Sparkassen-Parser",
    supports: diagnostic => diagnostic.bank === "sparkasse" && diagnostic.pdfType !== "image",
    parse: parseSparkasse
  },
  {
    id: "generic-table",
    label: "Generischer Tabellenparser",
    supports: diagnostic => diagnostic.pdfType === "table",
    parse: parseGeneric
  },
  {
    id: "generic-text",
    label: "Generischer Textparser",
    supports: diagnostic => diagnostic.pdfType === "text",
    parse: parseGeneric
  }
];

export function selectParser(diagnostic) {
  return PARSERS.find(parser => parser.supports(diagnostic)) ?? null;
}

export function parseWithRegistry({ pages, accountId, data, makeId }) {
  const diagnostic = classifyPDF(pages);
  const parser = selectParser(diagnostic);

  if (!parser) {
    return {
      diagnostic,
      parser: null,
      items: [],
      requiresOCR: diagnostic.pdfType === "image"
    };
  }

  const items = parser.parse({ pages, accountId, data, makeId });

  return {
    diagnostic,
    parser: {
      id: parser.id,
      label: parser.label
    },
    items,
    requiresOCR: false
  };
}
