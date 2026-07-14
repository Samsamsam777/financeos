# FinanceOS Architecture

## Architekturziele

- lokale Datenhoheit
- deterministische und testbare Domänenlogik
- klare Modulgrenzen
- rückwärtskompatible Datenmigrationen
- progressive PWA-Fähigkeiten, die Kernfunktionen nicht blockieren
- gemeinsame Fachlogik für Web, iOS und Android
- plattformspezifische Funktionen ausschließlich hinter definierten Adaptern
- schrittweise Weiterentwicklung ohne Big-Bang-Rewrite

## Aktueller Systemkontext

FinanceOS ist eine statische, clientseitige PWA ohne Backend. Sie wird als
native ES-Module ausgeliefert und speichert Anwendungsdaten unter dem stabilen
Schlüssel `financeos_v01` in `localStorage`. Ein Service Worker stellt die
App-Shell und lokale Drittanbieter-Assets offline bereit.

Die aktuelle Struktur ist ein Legacy-Ausgangszustand: Sie besitzt keine
explizite Schemaversion und implementiert das in D-011 angenommene
Finanzereignismodell, Formelregister und Integritätsmodell noch nicht.
Felder, Schreibpfade, Berechnungssemantik sowie Backup- und Restore-Verhalten
dieses Zustands sind in `19_LEGACY_SCHEMA_V01.md` geprüft dokumentiert.

## Zielsystem

FinanceOS bleibt eine gemeinsame Webanwendung und wird zusätzlich über
Capacitor als native iOS- und Android-Anwendung ausgeliefert. Die PWA bleibt
für Web- und Desktop-Nutzung erhalten. Der fachliche Kern, Anwendungsfälle und
UI-Komponenten werden gemeinsam gepflegt; native Dateizugriffe, Teilen,
App-Lifecycle, sichere Schlüsselablage und weitere Plattformfunktionen laufen
über klar abgegrenzte Adapter.

Die Zielarchitektur enthält kein FinanceOS-Backend. Direkte Verbindungen zu
Banken, Brokern oder anderen Finanzdiensten sind ausgeschlossen. Manuelle
Importe und nutzergesteuerte Exporte über Betriebssystem-Schnittstellen sind
zulässig und werden vollständig lokal vorbereitet.

## Aktuelle Module

| Bereich | Dateien | Verantwortung |
|---|---|---|
| App-Orchestrierung | `src/app.js` | Navigation, Events, Importabläufe, Zustandskoordination |
| Präsentation | `src/views.js`, `src/ui.js` | HTML-Erzeugung und UI-Helfer |
| Domänenlogik | `src/logic.js` | Salden, Auswertungen, Händler- und Regelabgleich |
| Persistenz | `src/storage.js` | Seed, Migration, Laden, Speichern und Backup |
| Import | `src/import.js`, `src/pdf-*.js`, `src/screenshot-import.js` | Parsing und Importentwürfe |
| PWA | `src/pwa.js`, `sw.js`, `manifest.webmanifest` | Installation, Offline-Cache und Share Target |
| Designsystem | `src/design/`, `src/components/`, `src/screens/` | Tokens, Komponenten und Screens |

## Verbindliche Grenzen

1. Fachliche Berechnungen und Parser bleiben unabhängig vom DOM testbar.
2. Views verändern keine persistenten Daten direkt.
3. Persistenzzugriffe laufen über den Storage-Bereich.
4. Importe erzeugen zunächst Entwürfe; erst die Bestätigung erzeugt Buchungen.
5. PWA-Fähigkeiten sind progressive Erweiterungen. Ihr Ausfall darf die
   Kernanwendung nicht am Start hindern.
6. Drittanbieter-Code bleibt lokal versioniert und wird nicht zur Laufzeit von
   externen Diensten geladen.
7. Domäne und Anwendungsfälle importieren keine Capacitor- oder
   Browser-Plattform-APIs direkt.
8. Plattformfunktionen werden über Ports mit Web- und Capacitor-Adaptern
   angebunden.
9. Ein Export wird ausschließlich durch eine bewusste Nutzeraktion gestartet;
   FinanceOS betreibt keine automatische Cloud-Synchronisation.
10. Kernabläufe müssen nach Installation ohne Netzwerkverbindung funktionieren.
11. Geldwerte werden im D-011-Zielmodell ausschließlich als Integer-Minor-Units
    mit expliziter Währung verarbeitet.
12. Domänenberechnungen hängen nicht von UI, Storage-Technologie, Systemzeit,
    Locale-Formatierung oder Iterationsreihenfolge ab.
13. Realität, Erwartung und Szenario bleiben in Speicherung, Anwendungsfällen
    und Darstellung getrennt.
14. Finanzereignisse werden nur gespeichert, wenn ihre typspezifischen
    Invarianten erfüllt sind.
15. Importe und wesentliche Änderungen sind atomar und besitzen einen
    nachvollziehbaren Rollback- beziehungsweise Undo-Pfad.
16. Plattformadapter dürfen Geld-, Datums-, Status- oder Formelregeln nicht
    plattformspezifisch verändern.

## Fachliches Zielmodell nach D-011

Die fachliche Zielarchitektur besteht aus folgenden klaren Schichten:

| Schicht | Verantwortung |
|---|---|
| Schema und Migration | Datensatzversion, stabile IDs, sequenzielle Migration und Integritätsprüfung |
| Finanzdomäne | Konten, Finanzereignisse, Kontoeffekte, Kategorieauswirkungen und Invarianten |
| Planung | Erwartungen, wiederkehrende Vorlagen, Budgets und isolierte Szenarien |
| Import und Vorschläge | ImportBatch, Dubletten, Feldherkunft und bestätigungspflichtige lokale Vorschläge |
| Operationen | atomare Änderungen, Undo, Void und Import-Rollback |
| Berechnung | versioniertes Formelregister und standardisierte Berechnungsergebnisse |
| Vertrauen | Kontenabgleich, Vertrauensevidenz, Delta- und Quellen-Erklärung |
| Persistenzadapter | lokale Speicherung des fachlichen Datengraphen ohne Änderung seiner Semantik |

Der fachliche Kern verwendet `FinancialEvent` mit getrennten
`accountEffects` und `categoryImpacts`. Kategorien tragen keinen Kontostand;
Budgets sind eigenständige Periodenobjekte. Ein begrenztes Operationsprotokoll
unterstützt Undo, ersetzt aber weder Finanzereignisse noch führt es
vollständiges Event Sourcing ein.

Der Datensatz besitzt eine explizite Schemaversion, Datensatzidentität,
Basiswährung, Locale und Zeitzone. Das vollständige normative Modell, seine
Invarianten und der Berechnungskanon stehen in `18_DOMAIN_MODEL.md`.

### Determinismus

Gleiche Eingaben, Schema-, Formel- und Datensatzversionen erzeugen auf Web,
iOS und Android dieselben Minor-Unit-Werte, Komponenten und Ausschlussgründe.
Locale beeinflusst nur die Darstellung. Aktuelle Uhrzeit und Plattform-APIs
werden als explizite Eingaben an Anwendungsfälle übergeben.

Berechnungsergebnisse enthalten Formelversion, Datensatzrevision, Zeitraum,
Filter, Bestandteile, Ausschlüsse, Annahmen und Vertrauensevidenz. Persistenz
und UI dürfen diese Nachweise nicht nachträglich rekonstruieren oder
wegformatieren.

### Migrationsgrenze

Das bestehende `financeos_v01`-Format wird nicht direkt überschrieben. Vor
einer Umsetzung werden auf Basis des dokumentierten Ausgangsschemas eine
vollständige Sicherung, sequenzielle Migrationsschritte, Golden Datasets,
Zielvalidierung und Rollback definiert. Mehrdeutige Umbuchungen oder Rundungen
werden berichtet und nicht geraten.

## Bekannte Architektur-Risiken

- `src/app.js` und `src/views.js` bündeln zu viele Verantwortlichkeiten.
- Die gespeicherte Datenstruktur besitzt noch keine explizite Schema-Version.
- Import- und UI-Verträge sind nicht automatisiert abgesichert.
- Manifest, Service Worker, Build-Info und App-Version können auseinanderlaufen.
- Der Screenshot-Import ist dokumentiert und in der UI erreichbar, sein Modul
  ist jedoch deaktiviert.
- Es existiert noch kein automatisierter Browser- oder Geräte-Smoke-Test.

## Sprint-0-Audit

| ID | Risiko | Priorität | Evidenz | Nächste Entscheidung |
|---|---|---:|---|---|
| A-01 | Produkt- und Modulvertrag des Screenshot-Imports widersprechen sich | hoch | Route und UI sind vorhanden; `src/screenshot-import.js` ist deaktiviert | sauber deaktivieren oder als isolierten OCR-Adapter neu integrieren |
| A-02 | Share-Target-Vertrag ist inkonsistent | hoch | Manifest akzeptiert PDF und Bilder; Service Worker verarbeitet ausschließlich PDF | unterstützte Dateitypen zwischen Manifest, Handler und Importdomäne vereinheitlichen |
| A-03 | optionale OCR-Ressourcen liegen im Installations-Precache | hoch | Build 49,75 MiB; Tesseract-Sprachen und WASM werden beim Install vorgeladen | App-Shell- und Feature-Caches mit Offline-Vertrag trennen |
| A-04 | gespeicherte Daten besitzen keine explizite Schema-Version | hoch | Ist-Vertrag und Risiken in `19_LEGACY_SCHEMA_V01.md`; weiterhin nur implizite Migration in `src/storage.js` | versioniertes Zielschema und Migrationstests definieren |
| A-05 | Orchestrierung und Views sind zu groß | mittel | `src/app.js` ca. 72 KiB, `src/views.js` ca. 38 KiB | fachliche Extraktion erst nach Verhaltensabsicherung |
| A-06 | historische Root-Dokumente können die SSoT verwässern | mittel | fünf ältere Design-, Token-, Roadmap- und Release-Dateien | Inhalte kontrolliert migrieren, danach archivieren oder entfernen |

Für A-01 bis A-04 sind keine isolierten Patches zulässig. Jede Änderung
benötigt Akzeptanzkriterien, Contract-Tests und einen dokumentierten Offline-
beziehungsweise Datenmigrationspfad.

D-011 entscheidet die fachliche Zielrichtung von A-04. Speichertechnologie,
Verschlüsselung und konkreter Rollout bleiben vor einer Implementierung separat
zu entscheiden. Die Legacy-Dokumentation erfüllt nur die Bestandsaufnahme und
ist keine Freigabe zur Migration.

## Zielrichtung nach Sprint 0

Die bestehende App wird inkrementell in klarere Controller-, Domänen-,
Persistenz- und Plattformadaptergrenzen aufgeteilt. Capacitor wird zunächst in
einem Foundation-Arbeitspaket für iOS und Android validiert. Vor jeder
Extraktion werden die betroffenen Verhaltensverträge durch Tests fixiert. Ein
Rewrite ist nicht vorgesehen.
