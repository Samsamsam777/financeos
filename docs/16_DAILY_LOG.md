# FinanceOS Daily Log

## 2026-07-14 — Sprint 0 gestartet und freigegeben

### Erledigt

- Repository geprüft und lokalen Branch `sprint/0-foundation` erstellt.
- `docs/` als verbindliche Single Source of Truth etabliert.
- Product, Architecture, Design und Engineering als Baseline dokumentiert.
- Node.js-24-Quality-Gates mit Syntax-, Unit- und Contract-Tests eingeführt.
- GitHub-Actions-Workflow vorbereitet.
- lokaler HTTP-Smoke-Test der statischen App-Shell durchgeführt.
- Sprint 0 offiziell für Dokumentation, Architektur, Repository-Standardisierung
  sowie Build-, Test- und Releaseprozess freigegeben.
- Workflow, Glossar, Naming, Security, Testing, Performance und Releaseprozess
  an die bestehende JavaScript-PWA angepasst.
- reproduzierbaren statischen Build mit SHA-256-Dateimanifest implementiert.
- Root-README, EditorConfig und Git-Attributregeln standardisiert.
- Local-first-Cross-Platform-Zielarchitektur mit PWA und Capacitor für iOS und
  Android durch die Projektleitung freigegeben.
- Produktgrenze für nutzergesteuerte lokale und Cloud-Exporte präzisiert.

### Entscheidungen

- keine Produktfeatures in Sprint 0
- inkrementelle Modernisierung statt Rewrite
- dependency-arme Testbasis
- keine Quick Fixes für den deaktivierten Screenshot-Import
- grundlegende Architekturentscheidungen und größere Refactorings benötigen
  vor der Umsetzung eine ausdrückliche Freigabe der Projektleitung
- keine direkten Bank-, Broker- oder Finanzdienst-Anbindungen; manuelle
  Dateiimporte und bewusst ausgelöste Exporte bleiben erlaubt
- kein FinanceOS-Backend und keine automatische Cloud-Synchronisation

### Verifiziert

- `npm ci` erfolgreich
- Syntaxprüfung: 18 Dateien erfolgreich
- automatisierte Tests: 23 von 23 erfolgreich
- App-Shell, Manifest, App-Modul und Service Worker lokal per HTTP erreichbar
- `dist/`: 60 Dateien, 49,75 MiB, lokal per HTTP erfolgreich ausgeliefert
- zwei aufeinanderfolgende Builds erzeugen dasselbe Manifest

### Offene Risiken

- Screenshot-Import ist dokumentiert und erreichbar, aber technisch deaktiviert.
- Tesseract-Ressourcen vergrößern den verpflichtenden Service-Worker-Precache
  deutlich.
- interaktive Browser-, Installations- und Gerätetests stehen aus.
- erster echter GitHub-Actions-Lauf erfolgt erst nach Push.

### Nächster Schritt

Architekturentscheidung für die Trennung von App-Shell und optionalen
OCR-Ressourcen vorbereiten und historische Root-Dokumente kontrolliert in
`docs/` migrieren.
