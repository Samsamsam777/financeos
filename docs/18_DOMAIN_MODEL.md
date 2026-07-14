# FinanceOS Domain Model and Calculation Canon

## Status und Geltungsbereich

- Entscheidung: D-011
- Fassung: Version 2 einschließlich Vertrauens- und Wettbewerbsvorsprung
- Status: angenommener Zielvertrag
- Freigabe: 2026-07-15 durch `00 — Projektleitung`

Dieses Dokument ist der normative fachliche Vertrag für das zukünftige
FinanceOS-Datenmodell, seine Berechnungen und deren Erklärbarkeit. Es beschreibt
den Zielzustand. Der aktuelle App-Code und vorhandene lokale Daten erfüllen ihn
noch nicht vollständig.

Die Wörter **MUSS**, **DARF NICHT**, **SOLL** und **KANN** kennzeichnen
verbindliche Anforderungen, Verbote, begründet abweichbare Anforderungen und
optionale Fähigkeiten.

## 1. Leitentscheidung

FinanceOS verwendet ein **hybrides ereignisbasiertes Finanzmodell**. Ein
`FinancialEvent` beschreibt einen fachlich zusammengehörenden Vorgang und
enthält getrennte Auswirkungen auf Konten und Auswertungskategorien.

Das Modell ist:

- präziser als eine flache Liste voneinander unabhängiger Buchungen,
- verständlicher als ein vollständiges Buchhaltungssystem mit Soll und Haben,
- geeignet für Einkommen, Ausgaben, Umbuchungen, Erstattungen, Kredite,
  Anfangsbestände, Korrekturen und Bewertungen,
- vollständig lokal, deterministisch, migrierbar und erklärbar.

FinanceOS führt **keine vollständige doppelte Buchführung** ein. Es verwendet
auch **kein unbegrenztes Event Sourcing** als Persistenzarchitektur. Ereignisse
sind das fachliche Modell; ein begrenztes Operationsprotokoll stellt sichere
Änderungen und Undo bereit.

## 2. Fachlicher Datensatz

Der persistierte Datensatz besitzt genau eine versionierte Wurzel. Sie MUSS
mindestens enthalten:

| Feld oder Sammlung | Verantwortung |
|---|---|
| `schemaVersion` | eindeutige Version des Datenschemas |
| `datasetId` | stabile Identität des gesamten Datensatzes |
| `datasetRevision` | monotoner fachlicher Revisionsstand für Berechnung und Cache-Invalidierung |
| `baseCurrency` | primäre ISO-4217-Währung für Summen und Berichte |
| `locale` | Formatierungs- und Sprachkontext |
| `timeZone` | fachliche Zeitzone für lokale Datumsgrenzen |
| `accounts` | Konten, Vermögen und Verbindlichkeiten |
| `events` | tatsächlich erfasste Finanzereignisse |
| `categories` | Analyse- und Auswertungshierarchie |
| `attributions` | Zuordnung zu selbst, Partner, gemeinsam oder frei definierten Bereichen |
| `budgets` | eigenständige Budgetobjekte pro Zeitraum und Geltungsbereich |
| `rules` | lokale, erklärbare Vorschlagsregeln |
| `recurringTemplates` | Vorlagen für wiederkehrende Erwartungen |
| `expectedEvents` | erwartete, noch nicht tatsächliche Vorgänge |
| `scenarios` | isolierte Was-wäre-wenn-Annahmen |
| `importBatches` | atomare Importentwürfe und Importnachweise |
| `reconciliations` | Kontenabgleiche zu einem Stichtag |
| `proposals` | noch nicht bestätigte lokale Vorschläge |
| `operations` | begrenztes Protokoll atomarer Änderungen und Undo-Bezüge |
| `settings` | fachliche und lokale Nutzereinstellungen |

Jede persistente Entität MUSS eine stabile, technisch eindeutige ID besitzen.
Fachliche Verweise verwenden IDs und keine Listenpositionen. Archivierte
Entitäten behalten ihre ID, damit historische Ereignisse und Berechnungen
erklärbar bleiben. Ein Archivstatus DARF keine referenzierte Entität unsichtbar
aus dem historischen Nachweis entfernen.

Die konkrete Datenbanktechnologie, Verschlüsselung ruhender Daten und mögliche
spätere Synchronisation sind nicht Gegenstand von D-011.

## 3. Geld, Währungen und Zeit

### 3.1 Geldwerte

Geldwerte MÜSSEN als ganzzahlige Minor Units mit ISO-4217-Währung gespeichert
werden, beispielsweise `1099` und `EUR` für 10,99 Euro. Binäre Fließkommazahlen
DÜRFEN weder persistiert noch für fachliche Summen verwendet werden.

Ein Geldwert besteht mindestens aus:

```text
amountMinor: integer
currency: ISO-4217 code
```

Rundung erfolgt nur an einer fachlich definierten Grenze und wird im
Berechnungsergebnis ausgewiesen. Zwischenwerte werden nicht still gerundet.

### 3.2 Währungen

FinanceOS startet Euro-first. Ein Bericht DARF Geldwerte unterschiedlicher
Währungen niemals still addieren. Ohne freigegebenen Wechselkurs und
Konvertierungsnachweis liefert die Berechnung getrennte Währungsergebnisse oder
den Status `undefined`.

Wechselkurse, Kursquellen und sichtbare Multiwährungsfunktionen benötigen eine
spätere Entscheidung. Das Datenmodell MUSS sie ermöglichen, ohne im MVP eine
Umrechnung vorzutäuschen.

### 3.3 Datum und Zeit

Ein tatsächliches Finanzereignis besitzt:

- `effectiveOn` als lokales Kalenderdatum in der Datensatz-Zeitzone,
- `createdAt` und `updatedAt` als UTC-Zeitpunkte,
- optional einen von der Quelle gelieferten Buchungs- oder Valutatag.

Fachliche Perioden verwenden lokale Datumsgrenzen. Technische Zeitpunkte
DÜRFEN nicht still das wirksame Finanzdatum ersetzen.

## 4. Konten und Vorzeichen

Ein Konto besitzt mindestens Klasse, Typ, Währung, Liquidität, Sichtbarkeit in
Berichten und Archivstatus. Unterstützte Klassen sind mindestens:

- Vermögenskonto,
- Verbindlichkeitskonto,
- reines Informations- oder Bewertungskonto, sofern später freigegeben.

Der bestätigte Kontostand folgt einer einheitlichen Nettovermögenskonvention:

- Vermögen ist positiv,
- Verbindlichkeiten sind negativ.

Ein positiver Kontoeffekt erhöht das Nettovermögen; ein negativer Kontoeffekt
vermindert es. Darstellung und Eingabe DÜRFEN nutzerfreundliche positive
Schuldenbeträge zeigen, müssen sie aber deterministisch in die interne
Vorzeichenkonvention überführen.

Ein Anfangsbestand wird als explizites Ereignis gespeichert. Er DARF NICHT als
unsichtbarer Sonderwert am Konto geführt werden.

## 5. FinancialEvent

### 5.1 Kernstruktur

Ein `FinancialEvent` enthält mindestens:

```text
id
type
effectiveOn
postingStatus
reviewStatus
accountEffects[]
categoryImpacts[]
attributionId?
source
links
createdAt
updatedAt
```

`accountEffects` verändern Kontostände. `categoryImpacts` beschreiben die
Wirkung auf Einnahmen- oder Ausgabenanalysen. Beide verwenden dieselbe
Vorzeichenrichtung wie die Nettovermögenswirkung:

- positiver Kategorieeinfluss erhöht das Nettovermögen,
- negativer Kategorieeinfluss vermindert das Nettovermögen.

### 5.2 Ereignistypen

Der Zielvertrag unterstützt mindestens:

| Typ | Bedeutung |
|---|---|
| `income` | Einnahme mit positiver Analysewirkung |
| `expense` | Ausgabe mit negativer Analysewirkung |
| `transfer` | Umbuchung zwischen eigenen Konten ohne Einnahmen- oder Ausgabenwirkung |
| `refund` | Erstattung mit explizitem Bezug zur ursprünglichen Ausgabe, wenn bekannt |
| `debtPayment` | Zahlung auf eine Verbindlichkeit mit trennbarem Tilgungs- und Kostenanteil |
| `openingBalance` | expliziter Anfangsbestand |
| `correction` | nachvollziehbare fachliche Korrektur |
| `revaluation` | Bewertungsänderung ohne laufenden Zahlungsfluss |

Zusätzliche Typen benötigen eine formelle Erweiterung des Vertrages, wenn sie
Berechnungssemantik oder Invarianten verändern.

### 5.3 Invarianten

Für gebuchte laufende Einnahmen-, Ausgaben-, Erstattungs- und
Kreditzahlungsereignisse gilt:

```text
sum(accountEffects.amountMinor) == sum(categoryImpacts.amountMinor)
```

Die Invariante wird je Währung ausgewertet. Nicht zugeordnete Analysewirkung
zählt in dieser Summe mit. Sie wird nicht verworfen. Ein Ereignis mit
unterschiedlichen Währungen benötigt einen später separat freigegebenen,
expliziten Währungsumrechnungsnachweis und darf nicht als normale Umbuchung
behandelt werden.

Für Umbuchungen gilt:

```text
sum(accountEffects.amountMinor) == 0
categoryImpacts.length == 0
```

Auch die Umbuchungssumme wird je Währung ausgewertet.

`openingBalance`, `correction` und `revaluation` sind von normalen
Cashflow-Auswertungen ausgeschlossen. Ihre Wirkung muss dennoch vollständig
über Kontoeffekte nachvollziehbar bleiben.

Jedes Ereignis MUSS seine typspezifischen Invarianten vor Speicherung und nach
Migration erfüllen. Ein Verstoß ist ein Integritätsfehler, keine automatisch
zu korrigierende Kleinigkeit.

### 5.4 Offene Zuordnung

Eine fehlende Kategorie ist ein gültiger, sichtbarer Zustand. Ein
`categoryImpact` DARF `categoryId: null` besitzen. Betrag, Ereignis und
Kontowirkung bleiben vollständig erhalten.

Damit kann Quick Entry einen finanziell korrekten Vorgang erfassen, ohne eine
sofortige Klassifikation zu erzwingen. Offene Zuordnungen werden gesondert
gezählt und im Check-in angeboten. FinanceOS DARF sie nicht still als
„Sonstiges“ klassifizieren.

### 5.5 Fachliche Sonderfälle

- Eine Umbuchung ist genau ein Ereignis mit mindestens zwei Kontoeffekten.
- Eine aufgeteilte Ausgabe ist genau ein Ereignis mit mehreren
  Kategorieeinflüssen.
- Eine Erstattung verlinkt nach Möglichkeit das Ursprungsereignis. Sie wird
  nicht still als neue Einnahme umgedeutet.
- Ein Kredit ist ein Verbindlichkeitskonto. Eine Kreditzahlung trennt Tilgung,
  Zinsen und Gebühren, soweit bekannt. Unbekannte Aufteilungen bleiben
  sichtbar unklar.
- Mehrdeutige Importzeilen werden nicht automatisch zu Umbuchungspaaren
  zusammengeführt.

## 6. Unabhängige Statusdimensionen

FinanceOS vermischt Finanzwirkung, Prüfbedarf und Kategorisierung nicht in
einem einzigen Status.

### 6.1 Buchungsstatus

- `posted`: wirkt auf bestätigte Ist-Berechnungen,
- `pending`: bekannte, aber noch nicht endgültig gebuchte Wirkung,
- `voided`: historisch erhalten, aber ohne aktuelle Finanzwirkung.

### 6.2 Prüfstatus

- `new`: neu und noch nicht bewusst geprüft,
- `unclear`: fachlich unklar,
- `conflict`: widersprüchlich oder kollidierend,
- `reviewed`: bewusst geprüft.

### 6.3 Zuordnungsstatus

Der Zuordnungsstatus wird aus den Kategorieeinflüssen abgeleitet:

- vollständig zugeordnet,
- teilweise zugeordnet,
- offen.

Ein gebuchtes Ereignis kann gleichzeitig `posted`, `unclear` und teilweise
zugeordnet sein. Nutzeroberfläche und Berechnungen MÜSSEN diese Dimensionen
getrennt behandeln.

## 7. Realität, Erwartung und Szenario

FinanceOS speichert drei strikt getrennte Ebenen:

1. **Realität:** tatsächlich gebuchte oder bekannte Ereignisse.
2. **Erwartung:** wiederkehrende oder einzeln geplante Vorgänge, die eintreten
   können.
3. **Szenario:** isolierte Was-wäre-wenn-Annahmen.

Eine wiederkehrende Vorlage erzeugt Erwartungen und niemals rückwirkend
Tatsachen. Ein tatsächliches Ereignis kann eine Erwartung ganz oder teilweise
erfüllen. Die Verknüpfung bleibt sichtbar.

Szenarien verändern weder Kontostände noch tatsächliche Ereignisse. Jede
Szenariokennzahl MUSS dauerhaft sichtbar von bestätigten und erwarteten Werten
unterschieden werden.

## 8. Kategorien, Budgets und Zuordnungsbereiche

Kategorien dienen ausschließlich Analyse und Navigation. Sie sind keine
versteckten Konten und tragen keinen eigenen Kontostand.

Budgets sind eigenständige Objekte mit Zeitraum, Geltungsbereich und Betrag.
Ein Budget verweist auf eine Kategorie oder eine explizite Kategoriegruppe.
Das Datenmodell erzwingt keine bestimmte Budgetmethode wie Umschlag-, Null- oder
Monatsbudgetierung.

Zuordnungsbereiche beschreiben fachliche Verantwortlichkeit wie `self`,
`partner`, `shared` oder frei definierte Bereiche. Sie sind keine
Benutzerkonten, Rollen oder Zugriffsrechte.

## 9. Import, Herkunft und lokale Vorschläge

### 9.1 ImportBatch

Jeder Import wird als `ImportBatch` vorbereitet. Der Batch enthält mindestens:

- stabile ID und Zeitpunkte,
- Quelldatei-Hash und Importformat,
- Spalten- oder Feldzuordnung,
- Entwürfe und Validierungsfehler,
- Dublettenbefunde,
- Bestätigungs- und Commitstatus,
- Ergebnisreferenzen und Rollbackbezug.

Die Rohdatei wird ohne begründete Notwendigkeit nicht dauerhaft gespeichert.
Ein Import-Commit ist atomar: Entweder werden alle bestätigten Änderungen
übernommen oder keine. Ein Rollback entfernt die Wirkung des gesamten Batches
über eine nachvollziehbare Operation.

Dubletten werden mindestens als `exact`, `probable` und `possible`
unterschieden. Nur exakt und durch einen stabilen Nachweis identische Daten
dürfen ohne weitere Finanzwirkung übersprungen werden. Wahrscheinliche und
mögliche Treffer benötigen eine sichtbare Entscheidung.

### 9.2 Herkunft

Herkunft wird feldbezogen gespeichert, wenn Felder eines Ereignisses aus
unterschiedlichen Quellen stammen. Ein Wert kann beispielsweise importiert,
manuell bestätigt oder durch eine lokale Regel vorgeschlagen sein.

Ein Vorschlag speichert Grundlage, Zielwert, betroffene Felder und erwartete
Wirkung. Vorschläge verändern wesentliche Finanzdaten erst nach bewusster
Bestätigung. Lokale Regeln bleiben erklärbar, korrigierbar und deaktivierbar.
FinanceOS lernt keine stillen Regeln aus Korrekturen.

## 10. Änderungen, Undo und Void

Jede wesentliche Änderung wird als atomare Operation mit stabiler
`operationId`, Typ, Zeitpunkt, betroffenen Entitäten und optionalem
Umkehrbezug ausgeführt.

Jede erfolgreich persistierte fachliche Operation erhöht `datasetRevision`
genau einmal. Abgebrochene oder vollständig zurückgerollte Operationen dürfen
keinen neuen wirksamen Datensatzstand vortäuschen.

Das Operationsprotokoll dient:

- unmittelbarem Undo,
- Import-Rollback,
- nachvollziehbaren Korrekturen,
- Diagnose von Datenintegritätsproblemen.

Es ist kein unbegrenztes vollständiges Event-Sourcing-Protokoll. Aufbewahrung,
Komprimierung und Datenschutzgrenzen werden vor Implementierung festgelegt.

Ein fachlich wirksames Ereignis wird nicht spurlos gelöscht. Die normale
Korrektur setzt es auf `voided` oder erzeugt eine explizite Gegen- oder
Korrekturoperation. Eine endgültige Löschung ist nur für Datenschutz- oder
Datensatzbereinigungsfälle zulässig und muss alle Referenzen kontrolliert
behandeln.

## 11. Kontenabgleich und Vertrauensnachweis

Ein `Reconciliation` vergleicht für ein Konto und einen Stichtag:

- beobachteten Saldo,
- aus Ereignissen berechneten Saldo,
- Differenz,
- Abgleichstatus,
- Datenquelle und Zeitpunkt.

Eine rückdatierte Änderung, die einen bereits abgeglichenen Zeitraum berührt,
setzt den betroffenen Abgleich auf `stale`. FinanceOS darf einen alten Abgleich
nicht weiter als aktuell darstellen.

FinanceOS zeigt keinen erfundenen globalen Vertrauensscore. Jede wichtige
Kennzahl liefert stattdessen konkrete Vertrauensevidenz, zum Beispiel:

- einbezogene und fehlende Konten,
- letzter Abgleich je relevantem Konto,
- offene Zuordnungen und unklare Ereignisse,
- enthaltene Pending-Werte,
- verwendete Schätzungen oder Erwartungen,
- nicht umrechenbare Währungen,
- Integritäts- und Reproduzierbarkeitsstatus.

## 12. Erklärbarkeit und Berechnungsergebnis

Jede wichtige Kennzahl folgt dem FinanceOS-Erklärungspfad:

```text
Kennzahl -> Treiber -> Bestandteile -> Finanzereignisse -> Quelle
```

Ein standardisiertes Berechnungsergebnis enthält mindestens:

```text
formulaId
formulaVersion
value oder undefinedReason
currency
period
datasetRevision
components
exclusions
filters
rounding
assumptions
trustEvidence
deltaBreakdown?
scenarioId?
```

Formeln werden in einem versionierten Register geführt. Eine Änderung der
Semantik benötigt eine neue `formulaVersion`, Tests und eine dokumentierte
Auswirkung auf bestehende Ergebnisse. Gleiche Eingaben, Schema-, Formel- und
Datensatzversionen MÜSSEN auf allen unterstützten Plattformen bitgenau gleiche
Minor-Unit-Ergebnisse und fachlich gleiche Komponenten liefern.

## 13. Berechnungskanon

### 13.1 Bestätigter Kontostand

```text
confirmedBalance(account, date) =
  sum(posted account effects with effectiveOn <= date)
```

`pending`, `voided`, Erwartungen und Szenarien sind ausgeschlossen. Ein
alternativer Wert mit Pending-Anteilen muss anders benannt und sichtbar
gekennzeichnet sein.

### 13.2 Vermögen, Verbindlichkeiten und Nettovermögen

```text
assets = sum(positive confirmed balances included in net worth)
liabilities = abs(sum(negative confirmed balances included in net worth))
netWorth = assets - liabilities
```

Nicht umrechenbare Währungen werden nicht still einbezogen. Der Ausschluss
erscheint in `trustEvidence` und `exclusions`.

### 13.3 Einnahmen

```text
grossIncome = sum(positive posted income impacts)
incomeReversals = abs(sum(negative posted income impacts))
netIncome = grossIncome - incomeReversals
```

### 13.4 Ausgaben und Erstattungen

```text
grossExpenses = abs(sum(negative posted expense impacts))
refunds = sum(positive posted refund or expense-reversal impacts)
netExpenses = grossExpenses - refunds
```

Erstattungen werden nicht als normales Einkommen gezählt.

### 13.5 Cashflow und Sparquote

```text
cashFlow = netIncome - netExpenses
```

Anfangsbestände, Korrekturen, Bewertungen und reine Umbuchungen sind
ausgeschlossen.

```text
savingsRate = cashFlow / netIncome
```

Die Sparquote ist nur definiert, wenn `netIncome > 0`. Sie wird nicht auf null
oder 100 Prozent begrenzt. Ein negativer oder über 100 Prozent liegender Wert
kann fachlich korrekt sein und wird erklärt statt versteckt.

### 13.6 Budgetverbrauch

```text
budgetConsumption =
  posted net expenses in the budget scope and period
```

Der Geltungsbereich berücksichtigt die explizit festgelegte
Kategoriehierarchie. Offene Zuordnungen werden separat ausgewiesen und nicht
willkürlich einem Budget zugerechnet.

### 13.7 Bestätigte liquide Mittel

```text
confirmedLiquidFunds =
  sum(confirmed balances of accounts explicitly marked liquid)
```

Überziehungen bleiben negativ. Nicht liquide Vermögenswerte werden nicht als
verfügbares Geld dargestellt.

### 13.8 Geplanter Restbetrag

```text
plannedRemainder(horizon) =
  confirmedLiquidFunds
  + open expected income through horizon
  - open expected expenses through horizon
```

Der Wert MUSS Horizont, einbezogene Erwartungen, Annahmen und Lücken zeigen.
Er wird nicht als „frei verfügbar“ bezeichnet, solange Reserven, Budgets,
Unvollständigkeit oder Unsicherheit diese Aussage nicht rechtfertigen.

### 13.9 Kredite

Die Restschuld folgt dem bestätigten Saldo des Verbindlichkeitskontos. Ein
Fortschrittswert ist nur definiert, wenn Ursprungssumme und spätere zusätzliche
Ziehungen bekannt sind. Zinsen und Gebühren zählen als Aufwand; Tilgung
verändert Vermögen und Verbindlichkeit, aber nicht den laufenden Aufwand.

### 13.10 Delta-Erklärung

Jede Veränderung einer wichtigen Kennzahl zwischen zwei Ständen wird in
fachliche Beiträge zerlegt. Die Summe der Beiträge MUSS exakt dem Delta
entsprechen. Ein unerklärter Rest ist ein Integritätsfehler und darf nicht als
„Rundungsdifferenz“ verborgen werden, sofern keine dokumentierte Rundungsregel
ihn vollständig erklärt.

## 14. Integrität und Reproduzierbarkeit

Ein read-only Integritätscheck prüft mindestens:

- eindeutige IDs und gültige Referenzen,
- Integer-Minor-Units und bekannte Währungscodes,
- Ereignisinvarianten und Statuskombinationen,
- Import- und Operationsbezüge,
- Abgleichkonsistenz,
- Formelversionen und Reproduzierbarkeit gespeicherter Nachweise,
- Trennung von Realität, Erwartung und Szenario.

Der Check verändert keine Daten automatisch. Er liefert Befund, betroffene IDs,
Schweregrad und mögliche manuelle beziehungsweise migrationsgestützte
Behebung.

Golden Datasets decken mindestens ab:

- Einnahme, Ausgabe, Split und offene Zuordnung,
- Umbuchung, Erstattung und Storno,
- Kreditaufnahme, Tilgung, Zins und Gebühr,
- Anfangsbestand, Korrektur und Bewertung,
- Pending, Voided und alle Prüfstatus,
- Budgethierarchie und Attribution,
- Erwartung, Erfüllung und Szenario,
- Importdubletten und atomaren Rollback,
- rückdatierte Änderung und veralteten Abgleich,
- mehrere Währungen ohne stilles Aggregieren,
- undefinierte und negative Sparquote,
- Delta-Erklärung und Integritätsfehler.

Dieselben Golden Datasets MÜSSEN in Web, iOS und Android fachlich identische
Ergebnisse erzeugen.

## 15. Migration

Jede Datenmigration folgt diesem Ablauf:

1. vorhandene Schemaversion erkennen,
2. überprüfbare Sicherung vor der ersten Änderung erzeugen,
3. Migration in sequenziellen, versionierten Schritten ausführen,
4. jeden Schritt validieren,
5. Ziel-Invarianten und Integrität prüfen,
6. verständlichen Migrationsbericht erzeugen,
7. bei Fehler vollständig zum Ausgangsstand zurückkehren.

Mehrdeutige Umbuchungspaare werden nicht geraten. Frühere Fließkommawerte
werden nach einer dokumentierten Regel in Minor Units überführt; jede
Rundung, Verwerfung oder Unklarheit erscheint im Bericht.

Eine Migration darf erst als erfolgreich gelten, wenn der vollständige
Datensatz geladen, validiert und reproduzierbar berechnet wurde.

## 16. Export und Portabilität

Der vollständige versionierte JSON-Export enthält den gesamten referenzierten
Datengraphen einschließlich Archivdaten, Erwartungen, Szenarien,
Importnachweisen, Abgleichen, Operationen und notwendigen Formel- und
Schemaversionen.

CSV ist ein verständlicher Teilauszug für ausgewählte Tabellen und kein
vollständiges Backup. Export und Restore MÜSSEN Roundtrip-Tests bestehen.
Verschlüsselungs- und Backupformat werden separat entschieden; D-011 hebt die
Sicherheitsgrenzen aus `12_SECURITY.md` nicht auf.

## 17. Datenschutz- und Diagnosegrenzen

Logs, Telemetrie und Crashberichte DÜRFEN keine vollständigen Finanzereignisse,
Salden, Importzeilen oder Rohdateien enthalten. Diagnosen verwenden technische
IDs, Fehlerklassen und minimierte Strukturinformationen. Eine notwendige
Supportdiagnose benötigt bewusste Auswahl und Vorschau durch den Nutzer.

## 18. Ausdrückliche Nicht-Ziele

D-011 entscheidet nicht über:

- Datenbank- oder Storage-Technologie,
- Verschlüsselung ruhender Daten,
- Cloud-Backup oder Synchronisation,
- Bank-, Broker- oder Zahlungsdienstverbindungen,
- Wechselkursquellen,
- detaillierte Wertpapierpositionen und Kurse,
- eine bestimmte Budgetmethode,
- Mehrbenutzerkonten und Rollen,
- Finanzberatung, Produktempfehlungen oder Geschäftsmodell,
- konkrete Nutzeroberflächen,
- externe oder generative KI.

Nicht eingeführt werden:

- vollständige doppelte Buchführung,
- unbegrenztes Event Sourcing,
- stilles Lernen aus Nutzerkorrekturen,
- erzwungene Kategorisierung oder Budgetierung,
- automatische fachliche Korrekturen ohne Bestätigung,
- ein pauschaler, nicht belegbarer Vertrauensscore.

## 19. Implementierungsgrenze und nächste Entscheidungen

D-011 genehmigt diesen fachlichen Zielvertrag, aber keinen Big-Bang-Umbau und
kein neues Endnutzerfeature. Die Umsetzung erfolgt inkrementell nach D-003 und
benötigt vor Codeänderung mindestens:

1. Abbildung des aktuellen `financeos_v01`-Formats auf eine dokumentierte
   Ausgangsschemaversion,
2. konkrete JSON-Schemas oder gleichwertige Laufzeitverträge,
3. Golden Datasets und Migrationstests,
4. Entscheidung über lokale Persistenz und Verschlüsselung,
5. versioniertes Formelregister,
6. Rollout- und Rollbackplan für bestehende Nutzerdaten.

Abweichungen von Invarianten, Vorzeichen, Realität-Erwartung-Szenario-Trennung
oder Berechnungskanon benötigen eine neue formelle Entscheidung. Benennungen
und technische Repräsentation dürfen sich ändern, wenn Semantik,
Reproduzierbarkeit und Erklärbarkeit vollständig erhalten bleiben.
