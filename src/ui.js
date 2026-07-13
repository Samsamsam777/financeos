export const esc = value =>
  String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);

export const field = (label, control) =>
  `<div class="field"><label>${label}</label>${control}</div>`;

export function showSheet(content) {
  const trigger = document.activeElement;
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
  const modal = document.querySelector("#modal");
  const closeButton = document.querySelector("#closeModal");

  closeButton.onclick = () => closeSheet(trigger);
  modal.onclick = event => {
    if (event.target.id === "modal") closeSheet(trigger);
  };

  modal.onkeydown = event => {
    if (event.key === "Escape") closeSheet(trigger);
  };

  closeButton.focus({ preventScroll: true });
}

export function closeSheet(returnFocus = null) {
  const modal = document.querySelector("#modal");
  const sheet = modal?.querySelector(".sheet");
  if (!modal || !sheet) return;
  modal.dispatchEvent(new CustomEvent("financeos:sheet-close", { bubbles: true }));
  sheet.classList.add("sheet-exit");
  modal.classList.add("modal-exit");
  setTimeout(() => {
    modal.remove();
    if (returnFocus instanceof HTMLElement && document.contains(returnFocus)) {
      returnFocus.focus({ preventScroll: true });
    }
  }, 220);
}

