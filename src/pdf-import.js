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
      const sorted = rowItems
        .filter(item => item.text)
        .sort((a, b) => a.x - b.x);

      return {
        y,
        items: sorted,
        text: sorted
          .map(item => item.text)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim()
      };
    })
    .filter(row => row.text);
}

function freshBytes(sourceBuffer) {
  return new Uint8Array(sourceBuffer.slice(0));
}

async function openWithWorker(sourceBuffer) {
  const loadingTask = pdfjsLib.getDocument({
    data: freshBytes(sourceBuffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true
  });

  return {
    loadingTask,
    document: await loadingTask.promise
  };
}

async function openWithoutWorker(sourceBuffer) {
  const loadingTask = pdfjsLib.getDocument({
    data: freshBytes(sourceBuffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
    disableWorker: true
  });

  return {
    loadingTask,
    document: await loadingTask.promise
  };
}

async function loadDocument(sourceBuffer) {
  try {
    return await openWithWorker(sourceBuffer);
  } catch (workerError) {
    console.warn("FinanceOS PDF worker fallback", workerError);
    return openWithoutWorker(sourceBuffer);
  }
}

export async function extractPDFLines(file) {
  const sourceBuffer = await file.arrayBuffer();
  let loadingTask = null;
  let document = null;
  const pages = [];

  try {
    const opened = await loadDocument(sourceBuffer);
    loadingTask = opened.loadingTask;
    document = opened.document;

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

    return pages;
  } finally {
    try { await document?.destroy(); } catch {}
    try { loadingTask?.destroy?.(); } catch {}

    // sourceBuffer is never handed directly to PDF.js and therefore remains
    // owned by FinanceOS. It can be overwritten safely after extraction.
    try {
      new Uint8Array(sourceBuffer).fill(0);
    } catch {}
  }
}

export async function clearPDFResources(file) {
  try {
    if (file && typeof file.close === "function") await file.close();
  } catch {}
}
