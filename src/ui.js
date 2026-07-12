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
          <button class="icon-btn sheet-close" id="closeModal" aria-label="Schließen"><span></span><span></span></button>
        </div>
        ${content}
      </div>
    </div>
  `);
  document.querySelector("#closeModal").onclick = closeSheet;
  document.querySelector("#modal").onclick = event => {
    if (event.target.id === "modal") closeSheet();
  };
}

export function closeSheet() {
  const modal = document.querySelector("#modal");
  const sheet = modal?.querySelector(".sheet");
  if (!modal || !sheet) return;
  sheet.classList.add("sheet-exit");
  modal.classList.add("modal-exit");
  setTimeout(() => modal.remove(), 220);
}
