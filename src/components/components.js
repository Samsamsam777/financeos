export function sectionHeader({ title, action = "", actionTarget = "", context = "" }) {
  return `
    <div class="section-title">
      <h2 class="section-heading">${title}</h2>
      ${action
        ? `<button class="section-link" data-nav="${actionTarget}">${action}</button>`
        : context
          ? `<span class="section-context">${context}</span>`
          : ""}
    </div>
  `;
}

export function groupedCard(content, className = "") {
  return `<div class="card grouped-card ${className}">${content}</div>`;
}

export function materialCard(content, className = "") {
  return `<div class="card material-card ${className}">${content}</div>`;
}
