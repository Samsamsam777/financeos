# FinanceOS Changelog

## Unreleased — Sprint 0

### Added

- verbindlicher `docs/`-Ordner als Single Source of Truth
- dokumentierter Sprint-0-Scope
- aktuelle Produkt- und Architektur-Baseline
- Engineering Guide mit Quality Gates und Definition of Done
- dependency-arme Node.js-24-Testbasis mit 23 Unit- und Contract-Tests
- Syntaxprüfung für alle eigenen JavaScript-Module
- GitHub-Actions-Workflow für Branches und Pull Requests
- offizieller Sprint-0-Freigabestatus und verbindliche Prioritäten
- Workflow, Glossar, Naming, Security, Testing, Performance und Releaseprozess
- standardisierte Root-Dokumentation und Editor-Konfiguration
- statischer `dist/`-Build mit Dateigrößen und SHA-256-Prüfsummen
- reproduzierbares Build-Manifest ohne Zeitstempel oder Umgebungsdaten
- historische Root-Dokumente eindeutig als nicht verbindlich markiert
- priorisierter Architektur-Audit für Import-, Cache-, Daten- und Modulverträge
- verbindliche Freigabegrenze für Architekturentscheidungen und größere
  Refactorings
- freigegebene Local-first-Cross-Platform-Zielarchitektur mit Capacitor für iOS
  und Android
- dokumentierte Grenze zwischen nutzergesteuertem Cloud-Export und einer nicht
  vorgesehenen Cloud-, Bank- oder Brokerintegration
- angenommene Produktentscheidung D-010 Version 3 für Positionierung,
  Kernzielgruppe und harte Nicht-Ziele
- Deutschland-first-Ausrichtung bei internationalisierbarer Architektur
- progressives Nutzungsmodell vom schnellen Überblick zur vollständigen
  Finanzkontrolle
- FinanceOS Check-in als zu validierendes zentrales Produktritual
- verbindliche Regeln für sichtbare Datenqualität, Erklärbarkeit,
  kontrollierte lokale Automatisierung und Reversibilität
- Produktvalidierungs-, Usability- und Competitive-Product-Ziele für die
  Vorbereitung späterer Sprints
- ausdrückliche Trennung zwischen zulässigem nutzergesteuertem Cloud-Export
  und einer nicht freigegebenen späteren Gerätesynchronisation

### Verified

- `npm ci` ist mit dem eingecheckten Lockfile reproduzierbar.
- 23 von 23 automatisierten Tests sind erfolgreich.
- App-Shell, Manifest, App-Modul und Service Worker werden über einen lokalen
  HTTP-Server erfolgreich ausgeliefert.
- Das Release-Artefakt umfasst 60 Laufzeitdateien und 49,75 MiB.
- Zwei aufeinanderfolgende Builds erzeugen dasselbe Build-Manifest.

### Known Issues

- Der im Produkt beschriebene Screenshot-Import ist im aktuellen Modul
  vorübergehend deaktiviert und noch nicht architektonisch geklärt.
- Ein interaktiver Browser-, PWA-Installations- und iPhone-Test wurde in dieser
  Arbeitsumgebung noch nicht durchgeführt.
