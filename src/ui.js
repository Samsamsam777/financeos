export const esc = value =>
  String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);

export const field = (label, control) =>
  `<div class="field"><label>${label}</label>${control}</div>`;

export function showSheet(content) {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal" id="modal">
      <div class="sheet sheet-enter">
        <div class="sheet-toolbar">
          <button class="icon-btn" id="closeModal" aria-label="Schließen">×</button>
        </div>
        ${content}
      </div>
    </div>
  `);
  document.querySelector("#closeModal").onclick = closeSheet;
}

export function closeSheet() {
  const modal = document.querySelector("#modal");
  const sheet = modal?.querySelector(".sheet");
  if (!modal || !sheet) return;
  sheet.classList.add("sheet-exit");
  modal.classList.add("modal-exit");
  setTimeout(() => modal.remove(), 220);
}
