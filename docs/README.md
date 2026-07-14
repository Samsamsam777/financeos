# FinanceOS Documentation

Dieser Ordner ist die verbindliche Single Source of Truth für FinanceOS.

## Priorität

Bei Widersprüchen gilt folgende Reihenfolge:

1. `00_PROJECT_WORKFLOW.md` und `01_AI_CONTEXT.md`
2. `02_PRODUCT.md`
3. `03_ARCHITECTURE.md`, `12_SECURITY.md` und `14_PERFORMANCE.md`
4. `04_DESIGN_GUIDE.md`
5. `05_ENGINEERING.md`, `11_NAMING_CONVENTIONS.md`, `13_TESTING.md` und
   `15_RELEASE_PROCESS.md`
6. dokumentierte Entscheidungen in `07_DECISIONS.md`
7. Roadmap, Backlog, Changelog und Daily Log

Ältere Dokumente im Repository dienen bis zu ihrer vollständigen Migration nur
als historisches Referenzmaterial. Neue oder geänderte Regeln werden
ausschließlich hier dokumentiert.

## Verbindlicher Ablauf

Vor jeder größeren Implementierung werden Product, Architecture, Design Guide
und Engineering Guide geprüft. Änderungen, die diesen Grundlagen
widersprechen, werden nicht als Quick Fix umgesetzt. Ist eine Grundlage
unzureichend, wird zuerst die Dokumentation und anschließend die Architektur
geklärt.

## Dokumente

- `00_PROJECT_WORKFLOW.md` – verbindlicher Projekt- und Sprintablauf
- `01_AI_CONTEXT.md` – Arbeitsregeln für AI-gestützte Entwicklung
- `02_PRODUCT.md` – Vision, Zielgruppe und Produktprinzipien
- `03_ARCHITECTURE.md` – Systemgrenzen, Module, Daten und Zielarchitektur
- `04_DESIGN_GUIDE.md` – verbindliche UX- und UI-Regeln
- `05_ENGINEERING.md` – Entwicklungsprozess, Tests, CI und Definition of Done
- `06_BACKLOG.md` – priorisierte Arbeitspakete
- `07_DECISIONS.md` – dauerhafte Produkt- und Architekturentscheidungen
- `08_ROADMAP.md` – Entwicklungsphasen und Sprintziele
- `09_CHANGELOG.md` – nachvollziehbare Änderungen am Produkt
- `10_GLOSSARY.md` – eindeutige fachliche und technische Begriffe
- `11_NAMING_CONVENTIONS.md` – Benennung von Code, Dateien und Modulen
- `12_SECURITY.md` – Sicherheitsmodell und offene Prüfungen
- `13_TESTING.md` – Teststrategie und Release-Testmatrix
- `14_PERFORMANCE.md` – Performancebudgets und Messprozess
- `15_RELEASE_PROCESS.md` – Versionierung, Build, Freigabe und Rollback
- `16_DAILY_LOG.md` – chronologischer Arbeits- und Prüfnachweis
- `17_COMPETITIVE_ANALYSIS.md` – datierte Marktanalyse und nicht bindende
  Research-Grundlage für freizugebende Produktentscheidungen
