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

## 2026-07-15 — D-011 Version 2 dokumentiert

### Erledigt

- D-011 als angenommenen fachlichen Zielvertrag dokumentiert.
- normatives hybrides Finanzereignismodell und versionierten
  Berechnungskanon in `18_DOMAIN_MODEL.md` aufgenommen.
- Nutzerwirkung, Architekturgrenzen, Implementierungsregeln, Glossar,
  Sicherheitsgrenzen und Performanceziele konsistent verteilt.
- Golden-Dataset-, Integritäts-, Migrations-, Rollback- und
  Plattformparitätsgates in Testing, Backlog und Roadmap aufgenommen.
- aktuellen App-Code und bestehendes Datenformat ausdrücklich als noch nicht
  D-011-konform gekennzeichnet; keine Laufzeitdatei verändert.

### Entscheidungen

- FinancialEvent mit getrennten Konto- und Kategorieauswirkungen statt flacher
  Buchungsliste oder vollständiger doppelter Buchführung
- Integer-Minor-Units und keine stille Aggregation mehrerer Währungen
- offene Zuordnung als gültiger Zustand
- strikte Trennung von Realität, Erwartung und Szenario
- versionierte, deterministische und bis zur Quelle erklärbare Kennzahlen
- konkrete Vertrauensevidenz statt pauschalem Vertrauensscore
- atomare Importe und Operationen mit Rollback, Undo und Void

### Verifiziert

- `git diff --check` ohne Befund
- Syntaxprüfung: 18 Dateien erfolgreich
- automatisierte Tests: 23 von 23 erfolgreich
- reproduzierbarer Build: 60 Dateien, 49,75 MiB
- Änderung umfasst ausschließlich Dateien unter `docs/`

### Offene Risiken

- Das bestehende `financeos_v01`-Format besitzt weiterhin keine explizite
  Schemaversion.
- Konkrete Persistenz-, Verschlüsselungs- und Migrationsentscheidungen stehen
  vor einer Codeumsetzung aus.
- Golden Datasets und Plattformparität sind als Gates definiert, aber noch
  nicht implementiert beziehungsweise nachgewiesen.

### Nächster Schritt

Dokumentationsänderung über einen eigenen Pull Request prüfen und mergen.
Danach das aktuelle `financeos_v01`-Ausgangsschema dokumentieren, ohne bereits
eine Migration zu beginnen.
