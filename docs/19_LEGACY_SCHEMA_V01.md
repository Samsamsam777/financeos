# FinanceOS Legacy Schema v01

## Status und Zweck

- Dokumenttyp: geprüfte Ist-Dokumentation des bestehenden Datenformats
- Storage-Key: `financeos_v01`
- geprüfte App-Version: `4.9.3`
- Code-Baseline: Commit `f922f4f`
- Prüftag: 2026-07-15
- fachliches Zielmodell: `18_DOMAIN_MODEL.md` (D-011 Version 2)

Dieses Dokument beschreibt den Datensatz, den die aktuelle Anwendung tatsächlich
liest, ergänzt, verändert, berechnet, exportiert und wiederherstellt. Es ist die
Ausgangsbasis für eine spätere versionierte Migration auf D-011.

Das Dokument genehmigt weder eine Migration noch eine Laufzeitänderung. Es macht
den Legacy-Zustand auch nicht zum Zielvertrag. Bei einem Widerspruch zwischen
dieser Ist-Beschreibung und dem D-011-Zielmodell gilt D-011 für die Zukunft; für
das Verständnis vorhandener Nutzerdaten gilt der hier belegte Ist-Zustand.

## 1. Evidenz und Abdeckungsgrenze

Die Beschreibung wurde aus folgenden Laufzeitquellen abgeleitet:

| Quelle | belegter Bereich |
|---|---|
| `src/constants.js` | Storage-Key, Standard-Dashboard, Personen, Kategorien und Regeln |
| `src/storage.js` | Seed, implizite Migration, Laden, Speichern, Reset, Backup und Restore |
| `src/app.js` | Schreibpfade für Buchungen, Umbuchungen, Importe, QR, Wiederholungen, Konten, Kategorien und Regeln |
| `src/import.js` | CSV-Felder, Normalisierung und Dublettenerkennung |
| `src/pdf-parsers.js` | PDF-Felder, Herkunft und Dublettenerkennung |
| `src/logic.js` | Salden, Monatswerte, Sortierung, Kredite und Händlerregeln |
| `src/views.js` | tatsächlich gelesene Felder, Budgets, Prüfstatus und Legacy-Aliase |

Browserinterne Details von `localStorage`, vom Dateidialog oder von
Drittanbieterparsern sind nicht Teil des Schemas. Temporäre Vorschauwerte, die
vor dem Speichern ausdrücklich entfernt werden, sind nur dort erwähnt, wo sie
die Herkunft persistenter Felder erklären.

## 2. Persistenz- und Versionsvertrag

Der gesamte Zustand liegt als ein JSON-Objekt unter einem einzigen
`localStorage`-Schlüssel:

```text
financeos_v01 -> JSON.stringify(rootData)
```

Der Schlüssel enthält die Zeichenfolge `v01`, im JSON-Datensatz selbst gibt es
jedoch kein `schemaVersion`, keine Datensatz-ID und keine Revision. Der Reader
entscheidet daher nicht anhand einer gespeicherten Version, welche Migration
auszuführen ist. Stattdessen führt `loadData()` bei jedem erfolgreichen Lesen
dieselbe Funktion `migrate(data)` aus.

Der Datensatz enthält außerdem keine explizite Zeitzone, Locale, Erstellzeit,
Änderungszeit, Formelversion oder Integritätsinformation. `settings.currency`
ist der einzige gespeicherte Währungshinweis; die meisten aktuellen Ansichten
formatieren trotzdem direkt als EUR.

### 2.1 Speichervorgang

`saveData(data)` schreibt den vollständigen In-Memory-Zustand synchron mit
`JSON.stringify` zurück. Es gibt:

- keine Teiltransaktion oder atomare Austauschdatei,
- keine Vorabvalidierung,
- keine referenzielle Integritätsprüfung,
- keine Prüfsumme,
- keine Revision oder Konflikterkennung,
- keine automatische Sicherung vor dem Überschreiben,
- keine Behandlung von Quota-, Schreib- oder Serialisierungsfehlern.

Unbekannte serialisierbare Felder bleiben im Allgemeinen erhalten, weil die
implizite Migration Objekte überwiegend per Spread ergänzt. `undefined`-Felder
werden durch JSON entfernt; nicht endliche Zahlen werden als `null` gespeichert.

### 2.2 Ladevorgang und Fehlerfall

Bei vorhandenem Inhalt führt die Anwendung `JSON.parse` und danach die
implizite Migration aus. Das migrierte Objekt wird durch das Laden allein nicht
sofort zurückgeschrieben.

Fehlt der Schlüssel oder schlägt Lesen, Parsen oder Migrieren fehl, erzeugt die
Anwendung ohne Unterscheidung einen neuen Demo-Datensatz mit 180 Buchungen und
speichert ihn unter demselben Schlüssel. Der Fehler wird lediglich mit
`FinanceOS storage read failed` in der Konsole protokolliert. Es gibt in diesem
Pfad keine Quarantäne des Originalwerts und keine Wiederherstellungsabfrage.

Das ist der höchste Schutzbedarf dieses Legacy-Vertrags: Ein syntaktisch oder
strukturell nicht lesbarer Bestandsdatensatz kann beim nächsten Start durch
Demo-Daten ersetzt werden.

## 3. Datensatzwurzel

Der aktuell normalisierte Root-Zustand hat folgende Form:

```json
{
  "settings": {},
  "accounts": [],
  "categories": [],
  "rules": [],
  "transactions": [],
  "importDrafts": [],
  "recurringTransactions": [],
  "loans": []
}
```

| Feld | Laufzeittyp | bei fehlendem Feld | Verwendung |
|---|---|---|---|
| `settings` | Objekt | leeres Objekt, danach Standardwerte | Darstellung und lokale Bedienpräferenzen |
| `accounts` | Array | leeres Array | Konten und Startsalden |
| `categories` | Array | vollständige Standardliste | Zuordnung und Monatsbudgets |
| `rules` | Array | leeres Array | Händler-zu-Kategorie-Regeln |
| `transactions` | Array | leeres Array | bestätigte Buchungen |
| `importDrafts` | Array | leeres Array | noch nicht bestätigte Import- und Wiederholungsentwürfe |
| `recurringTransactions` | Array | leeres Array | wiederkehrende Vorlagen |
| `loans` | Array | leeres Array | separate Kreditübersicht |

Nur beim Restore werden vorab Root-Felder geprüft. Dort müssen ausschließlich
`accounts` und `transactions` Arrays sein. Alle anderen Root-Felder dürfen
fehlen und werden anschließend ergänzt. Weitere Typen, Werte und Referenzen
werden nicht validiert.

## 4. Einstellungen

### 4.1 `settings`

| Feld | Typ | Standard | aktuelle Semantik |
|---|---|---|---|
| `currency` | String | `EUR` | nominelle Datensatzwährung; kein vollständiger Multiwährungsvertrag |
| `people` | String-Array | `Gemeinsam`, `Sam`, `Partnerin`, `Unklar` | freie Zuordnungswerte für Buchungen |
| `dashboard` | Objekt | siehe unten | sichtbare Dashboardmodule und Reihenfolge |
| `entryPreferences` | Objekt | erstes Konto und erste Person | zuletzt verwendetes Konto und Person bei manueller Erfassung |
| `transactionsFilterOpen` | Boolean | `false` | rein darstellungsbezogener Zustand |
| `expandedDemoDataInstalled` | Boolean | nicht gesetzt | Marker für die automatische Demo-Datenerweiterung |

`people` enthält keine stabilen IDs. Buchungen speichern den sichtbaren Namen
direkt in `person`. Ein Umbenennen oder Entfernen ist in der aktuellen UI nicht
vorgesehen; eine referenzsichere Migration kann deshalb nicht von IDs ausgehen.

### 4.2 `settings.dashboard`

```json
{
  "balance": { "enabled": true, "order": 1 },
  "summary": { "enabled": true, "order": 2 },
  "pending": { "enabled": true, "order": 3 },
  "loans": { "enabled": true, "order": 4, "count": 3 },
  "transactions": { "enabled": true, "order": 5, "count": 6 }
}
```

`balance` und `summary` werden in der UI unabhängig von `enabled` und `order`
fest oben angezeigt. Änderbar sind nur `pending`, `loans` und `transactions`.
Bei älteren Daten wird `dashboard.today` nach `dashboard.summary` umbenannt,
sofern `summary` fehlt. Ein Kreditlimit `count: 2` wird auf `3` gesetzt.

## 5. Stammdaten

### 5.1 Konto

```json
{
  "id": "a1",
  "name": "Gemeinschaftskonto",
  "type": "Girokonto",
  "start": 2500
}
```

| Feld | Typ | Bedeutung |
|---|---|---|
| `id` | String | lokale Referenz-ID ohne formalen Eindeutigkeitscheck |
| `name` | String | sichtbarer Kontoname |
| `type` | String | frei editierbare Typbezeichnung |
| `start` | Number | Startsaldo als Dezimalzahl in der impliziten Datensatzwährung |

Ein Konto darf über die UI nur gelöscht werden, wenn keine bestätigte Buchung
seine ID verwendet. Referenzen aus `importDrafts`, `recurringTransactions` oder
anderen Feldern werden dabei nicht geprüft.

### 5.2 Kategorie und Budget

```json
{
  "id": "c1",
  "name": "Lebensmittel",
  "budget": 450
}
```

`budget` ist ein positiver oder beliebiger numerischer Monatswert in der
impliziten Datensatzwährung. Es gibt kein separates Budgetobjekt, keinen
Gültigkeitszeitraum und keine Historie. Die Anwendung verwendet denselben Wert
für jeden Kalendermonat.

Die IDs `c10` und `c11` haben besondere, teilweise hart codierte Bedeutung:

- `c10` / Name `Später zuordnen` dient als Fallback für offene Zuordnung.
- `c11` / Name `Umbuchungen` dient für beide Seiten einer Umbuchung.

Fehlt `c11`, ergänzt die implizite Migration die Kategorie. `c10` wird dagegen
nur über die Standardliste beziehungsweise den Namen gefunden. Semantik hängt
damit sowohl von IDs als auch von veränderbaren Anzeigenamen ab.

Eine Kategorie darf über die UI nicht gelöscht werden, wenn bestätigte
Buchungen oder Regeln sie referenzieren. Entwürfe und wiederkehrende Vorlagen
werden nicht geprüft.

### 5.3 Händlerregel

```json
{
  "id": "r1",
  "needle": "REWE",
  "categoryId": "c1"
}
```

| Feld | Typ | Bedeutung |
|---|---|---|
| `id` | String | lokale ID; bei älteren Regeln ohne ID beim Laden neu erzeugt |
| `needle` | String | normalisierter oder freier Suchbegriff |
| `categoryId` | String | Zielkategorie |

Die Regelreihenfolge kann bei gleichwertigen Treffern das Ergebnis
beeinflussen. Es existieren weder Gültigkeitsbereich noch Priorität,
Versionshistorie oder Herkunftsnachweis.

## 6. Bestätigte Buchung

`transactions` ist eine flache Liste. Es gibt kein übergeordnetes
Finanzereignis und keine getrennten Konto- und Kategorieauswirkungen.

### 6.1 Kernfelder

```json
{
  "id": "uuid-or-fallback",
  "createdAt": 1784073600000,
  "date": "2026-07-15",
  "type": "expense",
  "amount": 42.5,
  "description": "REWE",
  "originalDescription": "PAYPAL *REWE Markt",
  "merchantKey": "REWE",
  "accountId": "a1",
  "categoryId": "c1",
  "person": "Gemeinsam",
  "status": "done"
}
```

| Feld | Typ | Erzeuger/Leser | Semantik und bekannte Grenze |
|---|---|---|---|
| `id` | String | alle Schreibpfade | meist `crypto.randomUUID`, sonst Zeit-Zufall-Fallback; keine zentrale Eindeutigkeitsprüfung |
| `createdAt` | Number | alle Schreibpfade, Migration | Sortierhilfe in Millisekunden; kein verlässlicher Audit-Zeitpunkt |
| `date` | String | alle Buchungspfade | erwartetes Format `YYYY-MM-DD`; keine Root-Validierung |
| `type` | String | `income` oder `expense` | Vorzeichen wird separat durch den Typ ausgedrückt; Betrag soll positiv sein |
| `amount` | Number | alle Buchungspfade | Dezimal-Float, keine Minor Units und kein Währungsfeld je Buchung |
| `description` | String | Anzeige, Suche, Regeln | normalisierte sichtbare Beschreibung |
| `originalDescription` | String | Import/Erfassung | ursprünglicher Text; kann leer sein |
| `merchantKey` | String | Erfassung/Import | normalisierter Händler-Schlüssel; nicht zwingend vorhanden |
| `accountId` | String | Saldo und Filter | Referenz auf `accounts[].id`; nicht zentral geprüft |
| `categoryId` | String | Budget, Anzeige und Regeln | Referenz auf `categories[].id`; nicht zentral geprüft |
| `person` | String | Filter und Anzeige | Kopie eines Anzeigenamens aus `settings.people` |
| `status` | String | Prüfbereich | `pending` oder `done`; vermischt Zuordnungs- und Freigabezustand |

Die implizite Migration ergänzt nur fehlendes `createdAt`. Der Ausdruck
`Date.parse(transaction.date) ?? index` behandelt `NaN` nicht als fehlend. Bei
ungültigem Datum kann deshalb `NaN` im Speicherobjekt entstehen und bei der
nächsten JSON-Serialisierung zu `null` werden.

### 6.2 Optionale Buchungsfelder

| Feld | Typ | Herkunft | Verhalten nach Bestätigung |
|---|---|---|---|
| `source` | String | Demo-Daten | bleibt nur bei direkt erzeugten Demo-Buchungen erhalten |
| `internalTransfer` | Boolean | Umbuchung | markiert beide flachen Seiten einer Umbuchung |
| `excludeFromAnalytics` | Boolean | Umbuchung | schließt beide Seiten aus Monatswerten und Budgets aus |
| `recurringTemplateId` | String | wiederkehrender Entwurf | bleibt nach Bestätigung erhalten |
| `occurrenceKey` | String | wiederkehrender Entwurf | verhindert dieselbe Vorlagenfälligkeit erneut |
| `qrIban` | String | GiroCode-Entwurf | bleibt nach Bestätigung erhalten |
| `qrRawValue` | String | GiroCode-Entwurf | vollständiger QR-Rohinhalt bleibt nach Bestätigung erhalten |
| `parserConfidence` | String | einzelne PDF-Parser | kann nach Bestätigung erhalten bleiben |

Import-Metadaten `source`, `sourceLabel`, `batchId`, `reviewState` und
`originalStatus` werden beim Bestätigen ausdrücklich entfernt. Damit verliert
die bestätigte Buchung gerade die allgemeine Importherkunft, während einzelne
quellspezifische und potenziell sensible Felder erhalten bleiben.

## 7. Umbuchung

Eine Umbuchung wird als zwei unmittelbar nacheinander eingefügte Buchungen
gespeichert:

1. `expense` auf dem Quellkonto,
2. `income` auf dem Zielkonto.

Beide Seiten besitzen gleichen Betrag und Tag, die Kategorie `c11`, die Person
`Gemeinsam`, `status: done`, `internalTransfer: true` und
`excludeFromAnalytics: true`. Ihre `createdAt`-Werte unterscheiden sich um
eine Millisekunde.

Es gibt keine gemeinsame Umbuchungs-ID, keine Gegenbuchungsreferenz und keine
atomare Domänenoperation. Löschen oder Bearbeiten einer Seite verändert die
andere Seite nicht. Eine spätere Migration kann Paare daher nur heuristisch
erkennen und muss unklare Fälle berichten statt automatisch zusammenzuführen.

## 8. Importentwurf

`importDrafts` enthält flache buchungsähnliche Objekte vor der Bestätigung.
Ein Entwurf besitzt die Kernfelder einer Buchung und zusätzlich:

```json
{
  "source": "csv|pdf|screenshot|qr|recurring|import",
  "sourceLabel": "sichtbare Herkunft",
  "batchId": "lokale Gruppierungs-ID",
  "reviewState": "ready|needs_attention",
  "originalStatus": "done|pending"
}
```

### 8.1 Herkunft und Batchgrenze

Wird keine `batchId` an `enqueueImportDrafts` übergeben, wird die ID innerhalb
der Abbildung für jeden einzelnen Entwurf erzeugt. Ein Dateiimport besitzt
damit nicht zuverlässig eine gemeinsame Batch-ID. Es existiert kein separates
`ImportBatch`-Objekt mit Dateihash, Parser, Parser-Version, Importzeit,
Zeilenzahl, Status oder Rollbackgrenze.

### 8.2 CSV-Vorschau

Die CSV-Vorschau erzeugt vor der Übernahme zusätzlich `rowNumber`, `duplicate`,
`valid`, `selected` und `recognition`. Diese Vorschaufelder werden vor dem
Einreihen entfernt. Persistiert werden die Buchungskernfelder und anschließend
die allgemeinen Entwurfsmetadaten.

Die Dublettenkennung vergleicht exakt:

```text
accountId | date | amount.toFixed(2) | description.toUpperCase()
```

Sie prüft nur bereits bestätigte Buchungen, nicht gleichzeitig ausgewählte
Zeilen oder vorhandene Entwürfe. Es gibt keine dauerhafte Dublettenentscheidung.

### 8.3 PDF-Vorschau

PDF-Parser erzeugen zusätzlich `pageNumber`, `duplicate`, `selected` und
`recognized`; diese Werte werden vor dem Einreihen entfernt. Ein optionales
`parserConfidence` wird nicht allgemein entfernt und kann persistieren. Die
PDF-Datei selbst und ihr Hash werden nicht im Datensatz gespeichert.

Der Screenshot-Pfad würde denselben allgemeinen Entwurfsvertrag verwenden,
sein Erkennungsmodul ist in der geprüften App-Version jedoch deaktiviert. Aus
diesem Pfad lässt sich daher aktuell kein zusätzlicher verlässlicher
Persistenzvertrag ableiten.

### 8.4 Bestätigen und Verwerfen

Bestätigen kopiert ausgewählte Entwürfe in `transactions`, entfernt die fünf
allgemeinen Entwurfsmetadaten und löscht die Entwürfe anschließend. Verwerfen
löscht sie direkt. Beide Abläufe speichern anschließend einmal den gesamten
Root-Zustand, besitzen aber kein Operationsobjekt, keinen dauerhaften
Undo-Nachweis und keinen Batch-Rollback.

## 9. Wiederkehrende Vorlage

```json
{
  "id": "uuid",
  "createdAt": 1784073600000,
  "description": "Miete",
  "type": "expense",
  "amount": 1200,
  "accountId": "a1",
  "categoryId": "c2",
  "person": "Gemeinsam",
  "frequency": "monthly",
  "startDate": "2026-07-01",
  "nextDueDate": "2026-08-01",
  "active": true
}
```

`frequency` verwendet `weekly`, `monthly`, `quarterly` oder `yearly`. Die
implizite Migration setzt bei älteren Einträgen `monthly`, konstruiert fehlende
Datumswerte aus aktuellem lokalem Jahr und Monat sowie einem optionalen
Legacy-Feld `day` und setzt `active`, sofern es nicht ausdrücklich `false` ist.
Diese Ergänzung ist zeitabhängig und damit nicht reproduzierbar.

Bei der Auswertung werden fällige Termine bis zum aktuellen Datum erzeugt,
höchstens 24 pro Vorlage und Lauf. Jeder Termin wird als Importentwurf mit
`recurringTemplateId` und `occurrenceKey = templateId:date` abgelegt.
`nextDueDate` wird fortgeschrieben. Der Ablauf verwendet sowohl UTC-basiertes
`today()` als auch lokal erzeugte Datumsobjekte.

Wiederkehrende Vorlagen sind keine getrennte Planungsebene im Sinne von D-011:
Sie erzeugen zwar zunächst Entwürfe, besitzen aber keine Erwartungsversion,
keinen Horizont, keine Ausnahmeregel und keinen Historienvertrag.

## 10. Kredit

Der Seed und die Kreditdetailansicht verwenden:

```json
{
  "id": "l1",
  "name": "Autokredit",
  "type": "auto",
  "principal": 25000,
  "remaining": 14382,
  "rate": 420,
  "interest": 4.2
}
```

| Feld | Typ | Bedeutung |
|---|---|---|
| `id` | String | lokale Kredit-ID |
| `name` | String | sichtbarer Name |
| `type` | String | Icon-/Darstellungstyp |
| `principal` | Number | ursprünglicher Nominalbetrag |
| `remaining` | Number | Restschuld |
| `rate` | Number | monatliche Rate |
| `interest` | Number | Zinssatz als Prozentzahl |

Teile der Listenansicht lesen zusätzlich die älteren Aliase `initial`,
`amount`, `monthlyRate`, `interestRate`, `term` und `months`. Die Migration
vereinheitlicht diese Aliase nicht. Insbesondere nutzt die Fortschrittslogik
`principal`, während ein Teil der Übersicht für den ursprünglichen Betrag nur
`initial` oder `amount` liest. Unterschiedliche Ansichten können daher denselben
Legacy-Kredit unterschiedlich interpretieren.

Kredite stehen außerhalb der Konten und Buchungen. Zahlungen verändern
`remaining` nicht automatisch; Verbindlichkeiten gehen nicht in den
Gesamtkontostand ein. Bei einem einzelnen alten Kredit mit ID `l1` ergänzt die
implizite Migration zwei Demo-Kredite.

## 11. Aktuelle Berechnungssemantik

Diese Regeln sind Teil des Ausgangsverhaltens und für Paritäts- und
Migrationsberichte relevant. Sie sind nicht der D-011-Zielkanon.

### 11.1 Kontosaldo und Gesamtkontostand

```text
Kontosaldo = account.start
            + Summe aller income-Beträge des Kontos
            - Summe aller expense-Beträge des Kontos

Gesamtkontostand = Summe aller Kontosalden
```

Alle bestätigten Buchungen werden unabhängig von `status`, Kategorie,
Erfassungsquelle oder Datum einbezogen. Offene Buchungen wirken deshalb bereits
auf den Saldo. Kredite sind nicht enthalten.

### 11.2 Monatsübersicht und Sparquote

Die Monatsübersicht filtert nach den ersten sieben Zeichen von `date` und
schließt nur `excludeFromAnalytics: true` aus. Sie berücksichtigt auch
`status: pending`.

```text
Einnahmen = Summe income
Ausgaben = Summe expense
Verfügbar = Einnahmen - Ausgaben
Sparquote = Verfügbar / Einnahmen; bei Einnahmen = 0 ergibt sie 0
```

### 11.3 Budgets

Pro Kategorie mit `budget > 0` werden die Ausgaben des aktuellen Monats
summiert, sofern sie nicht `excludeFromAnalytics` tragen. Offene Buchungen sind
eingeschlossen. Erstattungen und Umbuchungsinkonsistenzen besitzen keine eigene
fachliche Behandlung.

### 11.4 Kredite

```text
getilgt = max(0, principal - remaining)
fortschritt = clamp(getilgt / principal * 100, 0, 100)
```

Die Berechnungen verwenden JavaScript `Number`. Es gibt kein Formelregister,
keine Ergebnisrevision und keine gespeicherten Komponenten oder Ausschlussgründe.

## 12. Zeit-, Geld- und Identitätssemantik

### Geld

- Geldwerte sind JavaScript-Dezimalzahlen und keine Integer-Minor-Units.
- Die Währung wird nicht pro Konto, Buchung, Budget oder Kredit gespeichert.
- Eingaben erlauben zwei Dezimalstellen, das Schema erzwingt sie nicht.
- Rundungsmodus und Präzisionsgrenze sind nicht definiert.

### Datum und Zeit

- Geschäftstage sind normalerweise Strings im Format `YYYY-MM-DD`.
- `today()` verwendet `new Date().toISOString()`, also den UTC-Tag.
- Wiederholungstermine werden teilweise mit lokaler Zeit um 12:00 Uhr berechnet.
- `createdAt` ist eine numerische Sortierhilfe mit heterogener Herkunft, kein
  fachlich belastbarer oder manipulationsgeschützter Zeitstempel.
- Zeitzone und Locale sind nicht Teil des Datensatzes.

### IDs und Referenzen

- IDs sind lokale Strings ohne zentralen Namespace oder Eindeutigkeitscheck.
- Es gibt keine Fremdschlüsselvalidierung beim Laden oder Speichern.
- Löschprüfungen decken nur einen Teil der möglichen Referenzen ab.
- Es existieren keine Tombstones, stabilen Revisionen oder Merge-Identitäten.

## 13. Implizite Migration im Detail

`migrate(data)` ist eine Reparatur- und Ergänzungsfunktion ohne Ein- oder
Ausgangsversion. Sie führt derzeit unter anderem aus:

1. fehlende Einstellungen und Root-Arrays ergänzen,
2. `dashboard.today` nach `dashboard.summary` umbenennen,
3. Kredit-Dashboardzahl `2` auf `3` setzen,
4. Kategorie `c11` ergänzen,
5. fehlende Regel-IDs erzeugen,
6. Entwurfsmetadaten und `createdAt` ergänzen,
7. Wiederholungsfelder teilweise anhand der aktuellen Systemzeit ergänzen,
8. Buchungs-`createdAt` ergänzen,
9. Kredittypen aus Namen ableiten,
10. bei genau einem Demo-Kredit weitere Demo-Kredite ergänzen,
11. einen erkannten alten Drei-Buchungs-Demozustand durch 180 neue
    Demo-Buchungen ersetzen.

Die Funktion verändert das eingelesene Objekt in place. Es gibt keine
Migrationstabelle, keine einzelnen wiederholbaren Schritte, keinen Bericht,
keine Sicherung, keine Zielvalidierung und keinen Rollback. Einige Ergebnisse
hängen von aktueller Zeit oder zufällig erzeugten IDs ab. Ein erneutes Ausführen
ist daher nicht für alle Eingaben deterministisch nachweisbar.

## 14. Backup, Restore und Reset

### Backup

Der Export ist eine eingerückte JSON-Kopie des vollständigen aktuellen
In-Memory-Zustands. Dateiname und MIME-Typ sind:

```text
financeos-backup-YYYY-MM-DD.json
application/json
```

Es gibt keinen Envelope mit Formatkennung, Schema- oder App-Version,
Erstellzeit, Datensatz-ID, Währung, Zeitzone, Prüfsumme, Verschlüsselung oder
Dateigrößeninformation. Das Backup enthält sensible Finanzdaten im Klartext,
einschließlich eventuell gespeicherter `qrRawValue`- und `qrIban`-Werte.

### Restore

Restore liest die ganze Datei als Text, parst JSON, prüft nur, ob `accounts`
und `transactions` Arrays sind, wendet die implizite Migration an, überschreibt
den aktuellen Schlüssel und lädt die Seite neu. Es gibt:

- kein Größenlimit,
- keine Schema- oder App-Kompatibilitätsprüfung,
- keine vollständige Typ- oder Referenzvalidierung,
- keine Vorschau und keinen Migrationsbericht,
- keine automatische Vorher-Sicherung,
- keinen transaktionalen Rollback,
- keinen nachgewiesenen Roundtrip des vollständigen Datengraphen.

### Reset

Nach einer Bestätigung entfernt Reset den kompletten `localStorage`-Schlüssel
und lädt die Seite neu. Dadurch erzeugt der nächste Start wieder den
Demo-Datensatz.

## 15. Abbildung auf D-011

Die folgende Tabelle ist ein Migrationsinventar, keine Transformationsfreigabe.

| Legacy-Ist | D-011-Ziel | erforderliche Klärung |
|---|---|---|
| unversionierte Root-Arrays | versionierter Datensatz mit ID, Revision, Basiswährung, Locale und Zeitzone | Envelope und Startversion definieren |
| `Number`-Beträge | Integer-Minor-Units plus Währung | Rundung, ungültige Werte und Abweichungsbericht definieren |
| `account.start` | versionierter Eröffnungsbestand oder FinancialEvent | Stichtag und Herkunft fehlen |
| flache `transaction` | `FinancialEvent` mit Konto- und Kategorieauswirkungen | Ereignistyp, Status und Herkunft ableiten |
| zwei lose Umbuchungsseiten | ein atomarer Transfer | sichere Paarungskriterien; unklare Fälle melden |
| `status: pending|done` | Buchungs-, Prüf- und Zuordnungsstatus getrennt | Legacy-Bedeutung kontextabhängig ableiten |
| `person` als Name | stabiler Zuordnungsbereich | IDs erzeugen, Dubletten und Umbenennungen behandeln |
| Kategorie mit `budget` | Kategorie plus eigenständiges Periodenbudget | Zeitraum und Historie fehlen |
| Entwurf ohne `ImportBatch` | Batch, Herkunft, Feldprovenienz und Rollback | verlorene Herkunft kann nicht rekonstruiert werden |
| wiederkehrende Vorlage | Erwartungs-/Planungsebene | bestehende Fälligkeiten und Historie abgrenzen |
| separate Kredite | Verbindlichkeitskonten und nachvollziehbare Ereignisse | Saldo, Zahlungen und Stichtage sind unverbunden |
| direktes Ändern/Löschen | Operation, Undo und Void | keine persistente Änderungshistorie vorhanden |
| berechnete Summen ohne Nachweis | versioniertes Formelregister und erklärbares Ergebnis | Paritäts- und bewusste Abweichungsregeln definieren |
| Roh-JSON-Backup | versionierter, validierbarer vollständiger Export | Envelope, Integrität, Verschlüsselung und Roundtrip entscheiden |

### 15.1 Sicher automatisch ableitbare Kandidaten

Unter zusätzlicher Validierung erscheinen folgende Abbildungen grundsätzlich
eindeutig:

- Konto-, Kategorie-, Regel- und Vorlagen-IDs als Legacy-Quell-IDs erhalten,
- gültige `YYYY-MM-DD`-Werte als lokale Geschäftstage übernehmen,
- `income` und `expense` als erste Ereignistypkandidaten verwenden,
- `accountId` und `categoryId` als Referenzkandidaten übernehmen,
- `originalDescription`, `merchantKey`, `occurrenceKey` und vorhandene
  quellspezifische Felder verlustfrei in einen Legacy-/Provenienzbereich
  übernehmen.

Auch diese Kandidaten benötigen vor Umsetzung Schema, Validierung, Golden
Datasets, Sicherung und Rollback.

### 15.2 Mehrdeutige oder verlorene Information

Nicht ohne Bericht oder Nutzerentscheidung geraten werden dürfen:

- Rundung nicht ganzzahliger oder nicht endlicher Beträge,
- Paarung von Umbuchungsseiten ohne gemeinsame ID,
- Bedeutung offener `status`-Werte,
- Herkunft bereits bestätigter Importe, deren Metadaten entfernt wurden,
- Refunds und Gegenbuchungen, die nur als `income` erscheinen,
- Stichtag und Herkunft von Startsalden,
- Zuordnung alter Kredit-Aliase und unverbundener Kreditzahlungen,
- ungültige oder durch UTC-/Lokalzeit abweichende Datumswerte,
- verwaiste Konto-, Kategorie-, Vorlagen- oder Regelreferenzen,
- Semantik benutzerveränderter Sonderkategorien.

## 16. Risikoregister des Ausgangsschemas

| ID | Risiko | Schwere | Nachweis im Ist-Vertrag | erforderliches Gate vor Migration |
|---|---|---:|---|---|
| L-01 | unlesbarer Datensatz kann durch Demo-Daten überschrieben werden | kritisch | gemeinsamer Fallback für fehlend und fehlerhaft | Originalquarantäne, Sicherung und Fehlerzustand |
| L-02 | kein explizites Schema oder sequenzieller Migrationspfad | hoch | `migrate(data)` ohne Version | versionierter Envelope und Migrationsregistry |
| L-03 | Geldwerte können Float- und Rundungsabweichungen enthalten | hoch | `Number` in Speicherung und Formeln | Minor-Unit-Regeln und Abweichungsbericht |
| L-04 | Restore akzeptiert strukturell unzureichende Daten und überschreibt direkt | hoch | Prüfung nur zweier Arrays | vollständige Validierung, Vorschau und Rollback |
| L-05 | Umbuchung kann einseitig verändert oder gelöscht werden | hoch | zwei Buchungen ohne gemeinsame ID | heuristische Prüfung und atomarer Zieltyp |
| L-06 | bestätigte Importe verlieren allgemeine Herkunft und Batchgrenze | hoch | Metadaten werden beim Bestätigen entfernt | Provenienzlücke ausdrücklich kennzeichnen |
| L-07 | QR-Rohinhalt und IBAN bleiben im Klartextdatensatz und Backup | hoch | quellspezifische Felder werden nicht entfernt | Datenminimierung und Export-/Bedrohungsmodell |
| L-08 | Lösch- und Restorepfade sichern Referenzen nur teilweise | hoch | keine zentrale Integritätsprüfung | read-only Integritätscheck und Quarantäne |
| L-09 | Status vermischt Prüfung, Zuordnung und fachliche Wirksamkeit | mittel | `pending|done`, trotzdem in Berechnungen | getrennte Statusdimensionen und Paritätsbericht |
| L-10 | Zeitverhalten ist gemischt und teilweise nicht deterministisch | mittel | UTC-Tag, Lokalzeit und zeitabhängige Migration | explizite Zeitzone und Clock-Eingabe |
| L-11 | Kredite und Zahlungen sind fachlich getrennt | mittel | separate `loans` ohne Ereignisreferenzen | Verbindlichkeitsmigration mit Nutzerprüfung |
| L-12 | unbekannte Felder können unbemerkt Teil des Backups werden | mittel | offene JSON-Objekte und Vollbackup | Allowlist-/Extension-Vertrag und Datenschutzprüfung |

## 17. Verbindliche Grenze für den nächsten Schritt

Mit diesem Dokument ist nur das erste Daten- und Berechnungsgate aus
`08_ROADMAP.md` erfüllt: Das Ausgangsschema ist nachvollziehbar beschrieben.

Vor jeder Änderung an App-Code oder Bestandsdaten folgen separat:

1. konkrete versionierte D-011-Laufzeitverträge,
2. repräsentative und fehlerhafte Legacy-Fixtures,
3. Golden Datasets für Zielinvarianten und Berechnungen,
4. read-only Integritäts- und Migrationsvorprüfung,
5. explizite Regeln für jede Mehrdeutigkeit,
6. vollständige Vorher-Sicherung, Bericht und Rollback,
7. Export-/Restore-Roundtrip und Plattformparität.

Die kritischsten Schutzmaßnahmen sind zuerst L-01 und L-04. Ihre spätere
Behebung ist eine eigene, freizugebende Architektur- und Implementierungsarbeit
und gehört nicht zu diesem Dokumentations-Patch.
