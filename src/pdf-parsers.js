
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
  return pages.flatMap(page => {
    const lines = page.lines ?? page.rows?.map(row => row.text) ?? [];
    return lines.map(line => ({ line, pageNumber: page.pageNumber }));
  });
}

function detectBank(text) {
  const upper = text.toUpperCase();
  if (
    /SPARKASSE|KREISSPARKASSE|STADTSPARKASSE|NASPA|HASPA/.test(upper) ||
    (/DATUM/.test(upper) && /ERLÄUTERUNG|ERLAEUTERUNG/.test(upper) && /BETRAG EUR/.test(upper))
  ) return "sparkasse";
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


const SPARKASSE_NON_TRANSACTION_PATTERNS = [
  /KONTOSTAND\s+AM/i,
  /AUSZUG\s+NR/i,
  /KONTOAUSZUG/i,
  /BETRAG\s+EUR/i,
  /^DATUM$/i,
  /^ERLÄUTERUNG$/i,
  /ANLAGE\s+NR/i,
  /KREDIT\s+EUR/i,
  /KRED[-\s]?ZINS/i,
  /EINGERÄUMTE[RN]?\s+KONTO/i,
  /EURIBOR/i,
  /ZINSSÄTZE?/i,
  /VERFÜGUNGSRAHMEN/i,
  /SEITE\s+\d+/i,
  /UST[-\s]?IDNR/i,
  /HANDELSREGISTER/i,
  /BLZ\s*:/i,
  /TELEFON\s+\d/i,
  /FAX\s+\d/i,
  /WWW\./i,
  /INFO@/i
];

function isSparkasseNoise(text = "") {
  const value = String(text).replace(/\s+/g, " ").trim();
  if (!value) return true;
  return SPARKASSE_NON_TRANSACTION_PATTERNS.some(pattern => pattern.test(value));
}

function findSparkasseColumns(rows) {
  const header = rows.find(row => {
    const upper = String(row.text ?? "").toUpperCase();
    return upper.includes("DATUM") &&
      (upper.includes("ERLÄUTERUNG") || upper.includes("ERLAEUTERUNG")) &&
      upper.includes("BETRAG");
  });

  if (header?.items?.length) {
    const dateItem = header.items.find(item => /DATUM/i.test(item.text));
    const descriptionItem = header.items.find(item => /ERLÄUTERUNG|ERLAEUTERUNG/i.test(item.text));
    const amountItem = header.items.find(item => /BETRAG/i.test(item.text));

    if (dateItem && descriptionItem && amountItem) {
      return {
        dateMax: descriptionItem.x - 8,
        descriptionMin: descriptionItem.x - 8,
        amountMin: amountItem.x - 16
      };
    }
  }

  // Conservative fallback for typical Sparkasse landscape statement tables.
  const allX = rows.flatMap(row => (row.items ?? []).map(item => Number(item.x || 0)));
  const maxX = Math.max(600, ...allX);
  return {
    dateMax: maxX * 0.20,
    descriptionMin: maxX * 0.18,
    amountMin: maxX * 0.78
  };
}

function rowColumnText(row, minX, maxX = Infinity) {
  return (row.items ?? [])
    .filter(item => Number(item.x) >= minX && Number(item.x) < maxX)
    .map(item => String(item.text ?? "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractRightColumnAmount(row, amountMin) {
  const rightText = rowColumnText(row, amountMin);
  const matches = [...rightText.matchAll(AMOUNT_REGEX)];
  return matches.length ? toAmount(matches.at(-1)[1]) : null;
}

function cleanSparkasseDescription(parts) {
  return parts
    .join(" ")
    .replace(/\b(ÜBERWEISUNG ONLINE|ÜBERWEISUNG ÜBERTRAG|ÜBERWEISUNG|LASTSCHRIFT BASIS|LASTSCHRIFT|DAUERAUFTRAG|GUTSCHRIFT|KARTENZAHLUNG)\b/gi, " ")
    .replace(/\b(BIC|IBAN|DATUM|UHR)\b[:\s]*/gi, " ")
    .replace(/\b[A-Z]{2}\d{2}(?:\s?\d{4}){3,7}\b/gi, " ")
    .replace(/\b[A-Z0-9-]{14,}\b/g, " ")
    .replace(/\b\d{10,}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSparkasse({ pages, accountId, data, makeId }) {
  const results = [];
  let rejectedRows = 0;

  for (const page of pages) {
    const rows = page.rows ?? [];
    if (!rows.length) continue;

    const columns = findSparkasseColumns(rows);
    let current = null;

    const flush = () => {
      if (!current) return;

      const description = cleanSparkasseDescription(current.descriptionParts);

      const invalid =
        !current.date ||
        current.amount == null ||
        current.amount === 0 ||
        description.length < 2 ||
        isSparkasseNoise(description);

      if (invalid) {
        rejectedRows += 1;
        current = null;
        return;
      }

      const transaction = transactionFromParts({
        date: current.date,
        amount: current.amount,
        rawDescription: description,
        accountId,
        data,
        makeId,
        pageNumber: page.pageNumber
      });

      if (transaction) {
        transaction.parserConfidence = "high";
        results.push(transaction);
      } else {
        rejectedRows += 1;
      }

      current = null;
    };

    for (const row of rows) {
      const fullText = String(row.text ?? "").replace(/\s+/g, " ").trim();
      if (!fullText) continue;

      const leftText = rowColumnText(row, -Infinity, columns.dateMax);
      const middleText = rowColumnText(row, columns.descriptionMin, columns.amountMin);
      const dateMatch = leftText.match(DATE_REGEX);
      const rightAmount = extractRightColumnAmount(row, columns.amountMin);

      // A real booking starts only when date and right-column amount are on
      // the same visual table row. This excludes balances, legal text,
      // interest notices and page furniture.
      if (dateMatch && rightAmount != null) {
        flush();

        current = {
          date: toISODate(dateMatch[0]),
          amount: rightAmount,
          descriptionParts: middleText && !isSparkasseNoise(middleText)
            ? [middleText]
            : []
        };
        continue;
      }

      if (!current) continue;

      // Continuation rows contribute only text from the middle column.
      // Never append left/right column content to the merchant description.
      if (middleText && !isSparkasseNoise(middleText)) {
        current.descriptionParts.push(middleText);
      }
    }

    flush();
  }

  const items = deduplicateParsed(results);
  items.parserMeta = {
    rejectedRows,
    acceptedRows: items.length
  };
  return items;
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
  const parserMeta = items.parserMeta ?? null;

  return {
    diagnostic,
    parser: {
      id: parser.id,
      label: parser.label
    },
    items,
    parserMeta,
    requiresOCR: false
  };
}
