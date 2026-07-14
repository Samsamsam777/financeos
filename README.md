# FinanceOS

FinanceOS ist eine private, local-first Cross-Platform-Anwendung zur Verwaltung
persönlicher Finanzen. Sie bleibt als PWA verfügbar und wird für iOS und
Android über Capacitor ausgeliefert. Das Produkt benötigt keine Bank- oder
Brokeranbindung und wird mit langfristig wartbarer Architektur, kontrollierten
Importen und einer ruhigen mobilen UX entwickelt.

## Projektstatus

Sprint 0 ist aktiv. In diesem Sprint werden Dokumentation, Architektur,
Repository-Struktur sowie Build-, Test- und Releaseprozesse vervollständigt.
Neue Produktfeatures beginnen erst mit Sprint 1.

## Lokaler Start

FinanceOS besitzt keine Produktions-Build-Abhängigkeiten. Für die lokale
Auslieferung genügt ein statischer HTTP-Server:

```bash
python3 -m http.server 4173
```

Anschließend ist die App unter `http://localhost:4173` erreichbar.

## Quality Gates

Voraussetzung ist Node.js 24.

```bash
npm ci
npm run check
npm run build
```

- `npm run check` prüft Syntax, Domänenlogik, Importverträge, PWA-Assets und
  Versionskonsistenz.
- `npm run build` erzeugt das überprüfte statische Release-Artefakt unter
  `dist/`.

## Struktur

- `docs/` – verbindliche Single Source of Truth
- `src/` – eigener Anwendungscode
- `assets/` – Icons und Startbilder
- `vendor/` – lokal versionierte Laufzeitabhängigkeiten
- `scripts/` – Quality- und Build-Werkzeuge
- `tests/` – Unit- und Contract-Tests

Der Einstieg in die Projektdokumentation ist
[`docs/README.md`](docs/README.md).
