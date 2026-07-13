import * as pdfjsLib from "../vendor/pdfjs/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "./vendor/pdfjs/pdf.worker.mjs";

function groupTextItems(items) {
  const rows = new Map();

  for (const item of items) {
    const x = Number(item.transform?.[4] ?? 0);
    const y = Number(item.transform?.[5] ?? 0);
    const roundedY = Math.round(y * 2) / 2;

    if (!rows.has(roundedY)) rows.set(roundedY, []);
    rows.get(roundedY).push({
      text: String(item.str ?? "").trim(),
      x,
      y
    });
  }

  return [...rows.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([y, rowItems]) => {
      const sorted = rowItems.filter(item => item.text).sort((a, b) => a.x - b.x);
      return {
        y,
        items: sorted,
        text: sorted.map(item => item.text).join(" ").replace(/\s+/g, " ").trim()
      };
    })
    .filter(row => row.text);
}

async function loadDocument(bytes) {
  const baseOptions = {
    data: bytes,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true
  };

  try {
    const loadingTask = pdfjsLib.getDocument(baseOptions);
    const document = await loadingTask.promise;
    return { loadingTask, document };
  } catch (workerError) {
    console.warn("FinanceOS PDF worker fallback", workerError);
    const fallbackTask = pdfjsLib.getDocument({
      ...baseOptions,
      disableWorker: true
    });
    const document = await fallbackTask.promise;
    return { loadingTask: fallbackTask, document };
  }
}

export async function extractPDFLines(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const { loadingTask, document } = await loadDocument(bytes);
  const pages = [];

  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent({
        includeMarkedContent: false,
        disableNormalization: false
      });
      const rows = groupTextItems(content.items);

      pages.push({
        pageNumber,
        rows,
        lines: rows.map(row => row.text)
      });

      page.cleanup();
    }
  } finally {
    try { await document.destroy(); } catch {}
    try { loadingTask.destroy?.(); } catch {}
    bytes.fill(0);
  }

  return pages;
}

export async function clearPDFResources(file) {
  try {
    if (file && typeof file.close === "function") await file.close();
  } catch {}
}
