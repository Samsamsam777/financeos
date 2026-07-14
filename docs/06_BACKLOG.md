# FinanceOS Backlog

## Priorität P0 — Sprint 0

| ID | Thema | Status | Ergebnis |
|---|---|---|---|
| S0-01 | Dokumentationsstruktur | abgeschlossen | vollständige, konsistente und indexierte Single Source of Truth |
| S0-02 | Architekturprüfung | in Arbeit | Risiken, Zielgrenzen und notwendige Entscheidungen dokumentiert |
| S0-03 | Repository-Standardisierung | in Arbeit | Struktur, Namen, Metadaten und Altbestände bereinigt |
| S0-04 | Build, Test und Release | in Arbeit | reproduzierbares Artefakt und vollständige Freigabegates |
| S0-05 | Cross-Platform-Foundation | in Arbeit | Capacitor-Zielarchitektur und Plattformgrenzen validiert |
| S0-06 | Sprint-Abschluss | geplant | CI-, Browser-, PWA- und Gerätetests dokumentiert bestanden |

### Bereits abgeschlossen

- `docs/` als Single Source of Truth etabliert
- lokale Syntax-, Unit- und Contract-Tests eingeführt
- GitHub-Actions-Workflow vorbereitet
- lokaler HTTP-Smoke-Test durchgeführt
- reproduzierbarer statischer `dist/`-Build mit SHA-256-Dateimanifest
- Local-first-Cross-Platform-Ziel mit Capacitor für iOS und Android freigegeben
- Wettbewerbsanalyse als Research-Grundlage aufgenommen
- Produktpositionierung, Kernzielgruppe und harte Nicht-Ziele mit D-010
  Version 3 freigegeben
- fachliches Finanzereignismodell und Berechnungskanon mit D-011 Version 2
  freigegeben
- bestehendes `financeos_v01`-Format einschließlich Schreibpfaden,
  Berechnungssemantik, Backup-/Restore-Vertrag und Legacy-Risiken dokumentiert

### Offene Sprint-0-Arbeit

- erster GitHub-Actions-Lauf nach Push
- Architekturentscheidung für Screenshot-Import und Share Target
- Architekturentscheidung für App-Shell und optionalen OCR-Cache
- konkrete D-011-Schema- und Migrationsentscheidung mit Golden Datasets
- Capacitor-Foundation für iOS und Android als technischer Machbarkeitstest
- Web- und Capacitor-Adaptergrenzen für Plattformfunktionen definieren
- native Persistenz- und Verschlüsselungslösung bewerten
- interaktive Browser-, Offline-, Installations- und iPhone-Tests
- Hosting-, Deployment- und Rollbackentscheidung
- Bewertung und Migration historischer Root-Dokumente

## Priorität P1 — Produktvalidierung

D-010 ist als strategische Richtung angenommen, seine Markt- und
Bedienannahmen sind jedoch noch nicht mit realen Nutzern validiert.

- Kernzielgruppe in problemorientierten Interviews überprüfen
- progressiven Einstieg als klickbaren Prototyp testen
- ersten nützlichen Finanzüberblick innerhalb von höchstens zehn Minuten prüfen
- FinanceOS Check-in wiederholt mit realistischen Daten testen
- Quick Entry und Import Review gegeneinander und im Mischbetrieb validieren
- Verständnis von Datenstand, Herkunft, Lücken und Hochrechnungen prüfen
- akzeptierten wöchentlichen Pflegeaufwand ermitteln
- Bedarf an Geräteübertragung beziehungsweise späterer Synchronisation erheben
- Zahlungsbereitschaft getrennt vom Funktionswunsch untersuchen
- Ergebnisse dokumentieren und D-010 bei wiederholt widerlegten Kernannahmen
  bewusst neu bewerten

## Priorität P1 — Architektur

- versionierte Datensatzwurzel und Laufzeitverträge aus D-011 spezifizieren
- Legacy-Fixtures für gültige, minimale, beschädigte und mehrdeutige
  `financeos_v01`-Datensätze aus `19_LEGACY_SCHEMA_V01.md` erstellen
- Money-, Account-, FinancialEvent- und Status-Primitiven isoliert modellieren
- Formelregister und standardisiertes Berechnungsergebnis spezifizieren
- Golden Datasets für Invarianten, Berechnungen und Plattformparität erstellen
- read-only Integritätscheck definieren
- sequenzielle Migration mit Sicherung, Bericht und Rollback entwerfen
- atomare Operationen, Void und begrenztes Undo-Protokoll spezifizieren
- Kontenabgleich und Veraltungsregeln spezifizieren
- App-Orchestrierung aus `src/app.js` schrittweise extrahieren
- Views in fachliche Screen-Module aufteilen
- Importentwurf als gemeinsames Domänenmodell definieren
- Versions- und Cache-Bumping automatisieren
- gemeinsame Plattform-Ports und Web-/Capacitor-Adapter etablieren

## Priorität P2 — Produkt

- ersten Überblick ohne vollständige Buchhaltung fachlich spezifizieren
- FinanceOS Check-in als Ende-zu-Ende-Nutzerablauf definieren
- Statusmodell für manuell, importiert, bestätigt, geschätzt und geplant festlegen
- standardisierte „So berechnet“-Ansicht für wichtige Kennzahlen spezifizieren
- offenen Zuordnungszustand und Review-Ablauf ohne Zwangskategorisierung testen
- Vertrauensevidenz je Kennzahl und Kontenabgleich prototypisch validieren
- Realität, Erwartung und Szenario in Sprache und Darstellung testen
- Planwert als „geplanter Restbetrag“ mit Horizont und Annahmen validieren
- kontrollierte lokale Vorschläge mit Vorschau, Erklärung und Undo definieren
- Quick Entry mit wenigen Pflichtfeldern und sicheren lokalen Standardwerten
  spezifizieren
- Import Preview, Dublettenklassen und atomaren Rollback als Produktvertrag
  definieren
- Screenshot-Import nach Architekturentscheidung kontrolliert reaktivieren
- bestehende Importwege hinsichtlich Fehlerzuständen und Barrierefreiheit prüfen
- erst nach stabiler Basis neue Roadmap-Features priorisieren

Nicht freigegeben sind Mehrbenutzersynchronisation, automatische Cloud-Backups,
Bank- oder Brokerverbindungen sowie weitere Endnutzerfeatures außerhalb eines
separat genehmigten Sprints.

Die D-011-Arbeitspakete sind Ziel- und Nachweisplanung. Sie genehmigen weder
eine Datenmigration noch einen Big-Bang-Umbau im laufenden Sprint 0.
