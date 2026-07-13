export const APP_VERSION = "4.9.3";
export const STORAGE_KEY = "financeos_v01";

export const DEFAULT_DASHBOARD = {
  balance: { enabled: true, order: 1 },
  summary: { enabled: true, order: 2 },
  pending: { enabled: true, order: 3 },
  loans: { enabled: true, order: 4, count: 3 },
  transactions: { enabled: true, order: 5, count: 6 }
};

export const DEFAULT_PEOPLE = ["Gemeinsam", "Sam", "Partnerin", "Unklar"];

export const DEFAULT_CATEGORIES = [
  { id: "c1", name: "Lebensmittel", budget: 450 },
  { id: "c2", name: "Wohnen", budget: 1200 },
  { id: "c3", name: "Restaurants", budget: 180 },
  { id: "c4", name: "Mobilität", budget: 220 },
  { id: "c5", name: "Shopping", budget: 200 },
  { id: "c6", name: "Abonnements", budget: 80 },
  { id: "c7", name: "Gesundheit", budget: 100 },
  { id: "c8", name: "Freizeit", budget: 180 },
  { id: "c9", name: "Gehalt", budget: 0 },
  { id: "c10", name: "Später zuordnen", budget: 0 },
  { id: "c11", name: "Umbuchungen", budget: 0 }
];

export const DEFAULT_RULES = [
  ["REWE", "c1"], ["EDEKA", "c1"], ["LIDL", "c1"], ["ALDI", "c1"],
  ["SPOTIFY", "c6"], ["NETFLIX", "c6"], ["DB VERTRIEB", "c4"],
  ["SHELL", "c4"], ["AMAZON", "c5"], ["GEHALT", "c9"]
].map(([needle, categoryId], index) => ({ id: `r${index + 1}`, needle, categoryId }));


export const MOTION = {
  press: 90,
  page: 220,
  sheet: 280,
  toast: 220,
  number: 420
};
