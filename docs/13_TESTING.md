# FinanceOS Testing

## Ziel

Tests sichern fachliches Verhalten, Modulverträge, Datenkompatibilität sowie
die PWA- und Capacitor-Auslieferung. Ein grüner Syntaxcheck allein gilt nicht
als Test.

## Testebenen

1. **Unit-Tests:** deterministische Domänenlogik und Parser.
2. **Contract-Tests:** Modulpfade, Dateiverträge, Versionskonsistenz, Manifest
   und Service-Worker-Assets.
3. **Integrations-Tests:** Importentwurf bis Bestätigung, Persistenz und
   Migrationen.
4. **Browser-Smoke-Tests:** Start, Navigation, lokale Speicherung und zentrale
   Nutzerabläufe.
5. **Gerätetests:** Installation, Safe Areas, Tastatur, Kamera, Dateien und
   Offline-Verhalten auf den tatsächlich unterstützten Geräten.

## Aktueller automatisierter Stand

- integrierter Node.js-Test-Runner
- 23 Unit- und Contract-Tests
- Syntaxprüfung aller eigenen JavaScript- und Scriptdateien
- PWA-Asset-, Modulpfad- und Versionsprüfung
- noch keine Browserautomation oder Coverage-Schwelle

## Produkt- und Nutzervalidierung nach D-010

D-010 ist eine angenommene Produktrichtung, aber noch kein Nachweis von
Nutzerfreundlichkeit oder Markterfolg. Vor öffentlicher Veröffentlichung werden
folgende Annahmen mit Personen aus der Kernzielgruppe überprüft:

- die heutige Finanzübersicht wird tatsächlich als fragmentiert erlebt,
- der Verzicht auf Bank- und Brokerverbindungen wird akzeptiert oder bevorzugt,
- ein nützlicher erster Überblick ist innerhalb von höchstens zehn Minuten
  erreichbar,
- unvollständige Daten liefern einen verständlichen, ehrlich gekennzeichneten
  Mehrwert,
- der regelmäßige Pflegeaufwand bleibt mental und zeitlich akzeptabel,
- der FinanceOS Check-in hilft und wirkt nicht wie eine zusätzliche Pflicht,
- Quick Entry und Dateiimport gleichen fehlende Bankanbindungen ausreichend aus,
- Datenstand, Herkunft, Lücken und Hochrechnungen werden korrekt verstanden,
- wichtige Kennzahlen lassen sich ohne Hilfe nachvollziehen,
- es besteht eine realistische Zahlungsbereitschaft,
- fehlende automatische Geräteübertragung verhindert die Nutzung nicht für
  einen wesentlichen Teil der Zielgruppe.

### Validierungsstufen

1. **Problemgespräche:** Bedarf und heutige Arbeitsweisen ohne Vorführung einer
   fertigen Lösung verstehen.
2. **Klickbare Prototypen:** progressiven Einstieg, Quick Entry, Import Review
   und Check-in beobachtet testen.
3. **Aufgabenbasierte Usability-Tests:** Zeit, Fehler, Hilfebedarf und
   Verständnis messen.
4. **Wiederholte Nutzung:** Check-in und Pflegeaufwand über mehrere Termine mit
   realistischen Daten prüfen.
5. **Preisvalidierung:** Zahlungsbereitschaft getrennt von allgemeinem
   Produktinteresse untersuchen.

Für wesentliche Abläufe werden je Iteration mindestens fünf geeignete
Testpersonen angestrebt. Diese Zahl dient dem Auffinden wiederkehrender
Usability-Probleme und ist kein statistischer Marktnachweis. Marktannahmen
benötigen zusätzliche Gespräche und quantitative Gegenproben.

### Testnachweis für Validierung

Ein Nachweis enthält Zielgruppe, Rekrutierungskriterien, Hypothese, Aufgabe,
Prototyp- beziehungsweise Versionsstand, Beobachtungen, Messwerte,
Abweichungen und Entscheidung. Zustimmung in einem Gespräch wird nicht als
bestandener Bediennachweis gewertet.

Wird eine Kernannahme wiederholt widerlegt, wird sie nicht durch zusätzliche
Funktionen kaschiert. Produktleitung und D-010 werden bewusst neu bewertet.

## D-010-Usability-Gates

- erster sinnvoller Überblick: höchstens zehn Minuten
- häufige manuelle Standarderfassung: Ziel höchstens zehn Sekunden
- wichtige Dashboardzahl bis zur Berechnungsgrundlage: höchstens zwei gezielte
  Aktionen
- eindeutige Unterscheidung von bestätigt, importiert, geschätzt und geplant
- kein ungeklärter Import ohne bewusste Bestätigung
- vollständiger Rollback eines Imports
- verständlicher Fehler- und Wiederherstellungspfad ohne Finanzdatenverlust

Die Gates werden erst zu Release-Gates, wenn Ablauf, Testdaten, Referenzgerät
und Messmethode dokumentiert sind. Bis dahin sind sie verbindliche
Entwicklungsziele, keine bestandenen Produktversprechen.

## D-011-Domänen- und Migrationsgates

D-011 beschreibt einen Zielvertrag und ist im aktuellen App-Code noch nicht
umgesetzt. Jede spätere Implementierung muss vor Merge mindestens nachweisen:

- Geldwerte bleiben über Laden, Speichern, Rechnen, Export und Restore exakte
  Integer-Minor-Units.
- Einnahmen, Ausgaben, Splits, Umbuchungen, Erstattungen, Kreditzahlungen,
  Anfangsbestände, Korrekturen und Bewertungen erfüllen ihre Invarianten.
- offene Kategoriezuordnungen behalten ihre vollständige Finanzwirkung.
- `posted`, `pending`, `voided` sowie Prüf- und Zuordnungsstatus beeinflussen
  Berechnungen ausschließlich gemäß Vertrag.
- Realität, Erwartung und Szenario verändern sich nicht gegenseitig.
- Import-Commit und Rollback sind atomar; Abbrüche erzeugen keine Teildaten.
- rückdatierte Änderungen markieren betroffene Kontenabgleiche als veraltet.
- jede wichtige Kennzahl liefert Formelversion, Komponenten, Ausschlüsse,
  Annahmen und Vertrauensevidenz.
- Delta-Beiträge summieren sich exakt zur erklärten Veränderung.
- mehrere Währungen werden ohne dokumentierte Umrechnung nicht aggregiert.
- der read-only Integritätscheck erkennt Fehler, verändert aber keine Daten.

### Golden Datasets

Die Referenzdatensätze aus `18_DOMAIN_MODEL.md` werden versioniert und enthalten
für jede Formel erwartete Minor-Unit-Werte, Komponenten, Ausschlüsse und
Vertrauensbefunde. Sie werden unverändert gegen Web, iOS und Android ausgeführt.
Plattformabweichungen sind Blocker und dürfen nicht als Rundungsunterschied
akzeptiert werden.

### Migrationstest

Jede Schemamigration wird mindestens mit folgenden Fällen getestet:

1. gültiger produktiver Ausgangsstand,
2. leere und minimale Datensätze,
3. große realistische Datensätze,
4. bekannte historische Sonder- und Fehlerfälle,
5. Abbruch in jedem Migrationsschritt,
6. vollständiger Rollback,
7. Export-/Restore-Roundtrip vor und nach Migration,
8. verständlicher Bericht für Rundungen und Mehrdeutigkeiten.

Eine Migration gilt nur als bestanden, wenn Sicherung, sequenzielle Schritte,
Zielvalidierung, Integritätscheck und Berechnungsreproduzierbarkeit erfolgreich
sind. Mehrdeutige Umbuchungen werden nicht als korrekt migriert behauptet,
wenn keine Nutzerentscheidung vorliegt.

## Bug-Regel

Jeder behobene Fehler erhält einen Regressionstest auf der niedrigsten
sinnvollen Testebene. Ist ein automatisierter Test technisch noch nicht
möglich, werden reproduzierbare manuelle Schritte dokumentiert und die
Automatisierung in den Backlog aufgenommen.

## Release-Matrix

| Bereich | Jeder PR | Release Candidate |
|---|---:|---:|
| Syntax, Unit und Contracts | ja | ja |
| statischer Build | ja | ja |
| Kernabläufe im Browser | bei Auswirkung | ja |
| Offline-Start und Update | bei PWA-Auswirkung | ja |
| iPhone-PWA | bei UI/PWA-Auswirkung | ja |
| Android/Chromium-PWA | bei PWA-Auswirkung | ja |
| Capacitor-iOS-Build | bei iOS-/Plattformauswirkung | ja |
| Capacitor-Android-Build | bei Android-/Plattformauswirkung | ja |
| native Kernabläufe auf realem Gerät | bei Auswirkung | ja |
| unbeabsichtigte Laufzeit-Netzwerkzugriffe | bei Plattform-/Importauswirkung | ja |
| D-010-Kernabläufe und Erklärbarkeit | bei UX-/Produktänderung | ja |
| D-011-Golden-Datasets und Invarianten | bei Daten-/Berechnungsänderung | ja |
| Migrations- und Rollbackmatrix | bei Schemaänderung | ja |
| Berechnungsparität Web/iOS/Android | bei Domänenänderung | ja |
| Export-/Restore-Roundtrip auf sauberem Gerät | bei Daten-/Backupauswirkung | ja |

## Testnachweis

Ein Testnachweis enthält Datum, Version/Commit, Umgebung, geprüfte Abläufe,
Ergebnis und bekannte Einschränkungen. Nicht durchgeführte Tests werden nicht
als bestanden markiert.
