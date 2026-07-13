const SHARE_CACHE = "financeos-shared-files";
const SHARE_KEY = "./__shared_pdf__";

export async function consumeSharedPDF() {
  if (!("caches" in window)) return null;
  const cache = await caches.open(SHARE_CACHE);
  const response = await cache.match(SHARE_KEY);
  if (!response) return null;

  const blob = await response.blob();
  await cache.delete(SHARE_KEY);

  return new File([blob], response.headers.get("x-financeos-filename") || "kontoauszug.pdf", {
    type: blob.type || "application/pdf",
    lastModified: Date.now()
  });
}
