# FinanceOS Roadmap

## Sprint 0 — Foundation

Status: offiziell freigegeben und aktiv seit 2026-07-14

Ziele:

1. verbindliche Projektdokumentation etablieren
2. aktuellen Produkt- und Architekturstand absichern
3. automatisierte Quality Gates und CI einführen
4. kritische Modul- und PWA-Verträge sichtbar machen
5. reproduzierbare Release- und Geräteprüfung definieren
6. freigegebene Capacitor-Zielarchitektur auf iOS und Android technisch
   validieren

Sprint 1 beginnt erst nach dokumentiertem Abschluss aller Sprint-0-Gates.

## Strategisches Produktgate vor breiter Feature-Entwicklung

D-010 Version 3 ist als Produktrichtung angenommen. Wettbewerbsanalyse und
fachliche Bewertung belegen eine plausible Marktlücke, ersetzen aber keine
Validierung mit realen Nutzern.

Vor einer breiten Feature-Roadmap werden mindestens geprüft:

1. Kernproblem und Kernzielgruppe
2. erster sinnvoller Überblick mit unvollständigen Daten
3. FinanceOS Check-in und akzeptierter Pflegeaufwand
4. Quick Entry und kontrollierter Import Review
5. Verständnis von Datenstand, Herkunft, Lücken und Hochrechnungen
6. Zahlungsbereitschaft und Bedarf an späterer Geräteübertragung

Das Gate darf parallel zu technischer Foundation-Arbeit vorbereitet werden,
hebt aber den Sprint-0-Feature-Freeze nicht auf.

## Fachliches Daten- und Berechnungsgate

D-011 Version 2 ist als Zielvertrag angenommen. Vor einer produktiven
Umstellung des Datenmodells werden in dieser Reihenfolge nachgewiesen:

1. dokumentiertes Ausgangsschema des bestehenden `financeos_v01`-Datensatzes,
2. konkrete versionierte D-011-Schemaverträge,
3. Golden Datasets für Ereignisse, Invarianten und Berechnungskanon,
4. read-only Integritätscheck und Formelregister,
5. sequenzielle Migration mit Sicherung, Bericht und vollständigem Rollback,
6. fachliche Ergebnisparität auf Web, iOS und Android,
7. Export-/Restore-Roundtrip des vollständigen Datengraphen.

Dieses Gate darf parallel zur Produktvalidierung vorbereitet werden. Es ist
keine Freigabe für eine Code-Migration oder neue Endnutzerfeatures.

## Phase 1 — Stabilisierung

- Import- und Datenverträge absichern
- bekannte Abweichungen zwischen Produkt, UI und Implementierung beheben
- Datenmigrationen versionieren und testen
- D-011-Golden-Datasets, Integritätscheck und Formelregister etablieren
- Migration vom aktuellen Datenformat zum D-011-Zielmodell kontrolliert
  spezifizieren und erst nach gesonderter Freigabe umsetzen
- lokale Persistenz und verschlüsselte Exportverträge für Web, iOS und Android
  festlegen
- progressiven Einstieg und FinanceOS Check-in als Prototyp validieren
- fachliche Semantik für Datenstand, Bestätigung, Schätzung und Planung festlegen

## Phase 2 — Inkrementelle Modularisierung

- App-Orchestrierung und Views fachlich aufteilen
- gemeinsame Importdomäne etablieren
- Komponenten- und Designsystem konsolidieren

## Phase 3 — Feature-Entwicklung

Erst nach belastbarer Basis werden neue Funktionen aus dem priorisierten
Backlog umgesetzt. Jede Funktion benötigt Produktziel, UX-Konzept,
Architekturentscheidung und messbare Akzeptanzkriterien.

Die Reihenfolge folgt D-010:

1. schneller Überblick und verlässliche Datenqualität
2. Quick Entry, kontrollierter Import und Review
3. Erklärbarkeit, Undo, Export, Backup und Restore
4. ruhige Planung von Vergangenheit, Gegenwart und naher Zukunft

Die technische Reihenfolge innerhalb dieser Produktziele folgt D-011:
fachliche Primitiven und Migration, danach Berechnungen und Erklärbarkeit,
anschließend darauf aufbauende Nutzerabläufe.

Zusätzliche Sprachen, sichtbare Multiwährung, Haushaltsrollen, automatische
verschlüsselte Backups oder Gerätesynchronisation sind spätere, separat zu
entscheidende Themen. Bank- und Brokerverbindungen bleiben dauerhafte
Nicht-Ziele.
