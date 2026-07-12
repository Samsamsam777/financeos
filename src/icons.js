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
  back: svg('<path d="M15 18l-6-6 6-6"/>'),
  arrange: svg('<path d="M8 5h11M8 12h11M8 19h11M3 5h.01M3 12h.01M3 19h.01"/>'),
  cart: svg('<path d="M3 4h2l2.2 10.2h9.9L20 7H7"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>'),
  building: svg('<path d="M5 21V4h10v17M15 9h4v12M8 8h4M8 12h4M8 16h4"/>'),
  restaurant: svg('<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M16 3v18M16 3c3 2 4 5 4 8h-4"/>'),
  transport: svg('<path d="M5 16h14M7 16l1-8h8l1 8M8 19h.01M16 19h.01M9 11h6"/>'),
  shopping: svg('<path d="M6 8h12l1 12H5L6 8ZM9 9V6a3 3 0 0 1 6 0v3"/>'),
  subscription: svg('<path d="M4 7h16v10H4zM8 11h8M8 14h5"/>'),
  health: svg('<path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z"/><path d="M9 12h6M12 9v6"/>'),
  leisure: svg('<path d="M7 9h10l2 9-4-2-3 2-3-2-4 2 2-9ZM9 12h.01M15 12h.01"/>')
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
  const spotify = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9.2c4.7-1.5 9.8-1 14 1.2"/><path d="M6.3 13c3.9-1.1 8.1-.7 11.5 1.1"/><path d="M7.5 16.5c3-.8 6.2-.5 8.9.8"/></svg>';
  const apple = '<span class="brand-glyph">●</span>';
  const paypal = '<span class="brand-word brand-paypal">P</span>';
  const rewe = '<span class="brand-word brand-rewe">REWE</span>';
  const lidl = '<span class="brand-word brand-lidl">LIDL</span>';
  const netflix = '<span class="brand-word brand-netflix">N</span>';
  const amazon = '<span class="brand-word brand-amazon">a</span>';

  if (value.includes("APPLE")) return { mark: apple, className: "apple", html: true };
  if (value.includes("PAYPAL")) return { mark: paypal, className: "paypal", html: true };
  if (value.includes("REWE")) return { mark: rewe, className: "rewe", html: true };
  if (value.includes("LIDL")) return { mark: lidl, className: "lidl", html: true };
  if (value.includes("AMAZON")) return { mark: amazon, className: "amazon", html: true };
  if (value.includes("SPOTIFY")) return { mark: spotify, className: "spotify", html: true };
  if (value.includes("NETFLIX")) return { mark: netflix, className: "netflix", html: true };
  if (value.includes("SHELL") || value.includes("ARAL") || value.includes("TANK")) {
    return { mark: icons.transport, className: "fuel", html: true };
  }
  if (type === "income") return { mark: icons.income, className: "income", html: true };
  return {
    mark: description.trim().charAt(0).toUpperCase() || "?",
    className: "default",
    html: false
  };
}


export function categoryIcon(name = "") {
  const value = name.toLowerCase();
  if (value.includes("lebensmittel")) return icons.cart;
  if (value.includes("wohn")) return icons.building;
  if (value.includes("restaurant")) return icons.restaurant;
  if (value.includes("mobil")) return icons.transport;
  if (value.includes("shopping")) return icons.shopping;
  if (value.includes("abo") || value.includes("abonnement")) return icons.subscription;
  if (value.includes("gesund")) return icons.health;
  if (value.includes("freizeit")) return icons.leisure;
  return icons.budget;
}
