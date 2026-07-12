const svg = (body, viewBox = "0 0 24 24") =>
  `<svg viewBox="${viewBox}" aria-hidden="true">${body}</svg>`;

export const icons = {
  home: svg('<path d="M3 10.7 12 3l9 7.7v9.1a1.2 1.2 0 0 1-1.2 1.2h-5.2v-6.2H9.4V21H4.2A1.2 1.2 0 0 1 3 19.8Z"/>'),
  list: svg('<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>'),
  budget: svg('<path d="M12 3v9h9A9 9 0 1 1 12 3Zm3 0a9 9 0 0 1 6 6h-6Z"/>'),
  more: svg('<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  wallet: svg('<path d="M4 6.5h14.5A1.5 1.5 0 0 1 20 8v9a1.5 1.5 0 0 1-1.5 1.5H4A2 2 0 0 1 2 16.5v-10A2 2 0 0 1 4 4.5h12"/><path d="M15 10h5v4h-5a2 2 0 1 1 0-4Z"/>'),
  income: svg('<path d="M6 17 17 6M9 6h8v8"/>'),
  expense: svg('<path d="m6 7 11 11M17 10v8H9"/>'),
  pending: svg('<path d="M12 18h.01M9.2 9a3 3 0 1 1 4.9 2.3c-1.3 1-2.1 1.6-2.1 3.2"/>'),
  car: svg('<path d="m5 13 1.7-5h10.6l1.7 5M4 13h16v5H4zM7 18v2M17 18v2M7.5 15h.01M16.5 15h.01"/>'),
  house: svg('<path d="m3 11 9-7 9 7v9H6v-9M9 20v-6h6v6"/>'),
  education: svg('<path d="m2 9 10-5 10 5-10 5Zm4 2v5c3 2 9 2 12 0v-5"/>'),
  motorcycle: svg('<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M8 17h5l-2-5h4l3 5M10 12 8 9h4"/>'),
  boat: svg('<path d="M4 13h16l-3 5H7Zm4 0V7h7l3 6M10 7V4h3"/>'),
  card: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>'),
  consumer: svg('<path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>'),
  document: svg('<path d="M6 3h8l4 4v14H6zM14 3v5h5"/>'),
  chevron: svg('<path d="m9 6 6 6-6 6"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>'),
  edit: svg('<path d="m4 16-1 5 5-1L19 9l-4-4Z"/><path d="m13 7 4 4"/>'),
  trash: svg('<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/>'),
  backup: svg('<path d="M12 3v12M7 8l5-5 5 5M5 20h14"/>'),
  arrange: svg('<path d="M8 5h11M8 12h11M8 19h11M3 5h.01M3 12h.01M3 19h.01"/>')
};

export function loanIcon(type) {
  const mapping = {
    auto: "car",
    home: "house",
    consumer: "consumer",
    education: "education",
    motorcycle: "motorcycle",
    boat: "boat",
    card: "card",
    generic: "document"
  };
  return icons[mapping[type] ?? type] ?? icons.document;
}

export function merchantVisual(description = "", type = "expense") {
  const value = description.toUpperCase();
  if (value.includes("PAYPAL")) return { mark: "P", className: "paypal" };
  if (value.includes("REWE")) return { mark: "REWE", className: "rewe" };
  if (value.includes("AMAZON")) return { mark: "a", className: "amazon" };
  if (value.includes("SPOTIFY")) return { mark: "●", className: "spotify" };
  if (value.includes("NETFLIX")) return { mark: "N", className: "netflix" };
  if (value.includes("SHELL") || value.includes("ARAL") || value.includes("TANK")) {
    return { mark: "⛽", className: "fuel" };
  }
  if (type === "income") return { mark: "↗", className: "income" };
  return { mark: description.trim().charAt(0).toUpperCase() || "?", className: "default" };
}
