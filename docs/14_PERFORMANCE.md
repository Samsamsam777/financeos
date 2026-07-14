# FinanceOS Performance

## Ziele

- schneller und robuster App-Start
- flüssige Interaktion ohne unnötige Main-Thread-Blockaden
- kontrollierter Speicherverbrauch bei PDF-, QR- und OCR-Verarbeitung
- minimale verpflichtende Netzwerk- und Cachelast
- kontrollierte Größe der nativen iOS- und Android-Pakete
- keine Performance-Regression durch neue Features

## Budgets

| Messgröße | Ziel |
|---|---:|
| LCP, 75. Perzentil | höchstens 2,5 s |
| INP, 75. Perzentil | höchstens 200 ms |
| CLS, 75. Perzentil | höchstens 0,1 |
| eigener JS-/CSS-Code im Build | höchstens 1 MiB |
| verpflichtender App-Shell-Precache | höchstens 5 MiB |

## D-010-Produkt- und Bedienziele

Diese Werte konkretisieren den angenommenen Competitive Product Standard. Sie
sind bis zur dokumentierten Messung Zielbudgets und keine Behauptung über den
aktuellen Code.

| Ablauf | Eintrittsziel | Angestrebter Zielstandard |
|---|---:|---:|
| erster sinnvoller Finanzüberblick | höchstens 10 min | Median höchstens 5 min im moderierten Test |
| häufige manuelle Standarderfassung | höchstens 10 s | Median höchstens 5 s mit sicheren lokalen Standardwerten |
| Kennzahl bis Berechnungsgrundlage | höchstens 2 Aktionen | Formel, Filter, Datenstand und Beiträge in derselben Erklärschicht |
| CSV-Vorschau mit 10.000 typischen Zeilen | keine UI-Blockade | p95 höchstens 3 s auf Referenzhardware |
| Standardaggregation bei 100.000 Buchungen | kein Absturz | p95 höchstens 500 ms auf Referenzhardware |
| sichtbare Reaktion auf Eingabe | höchstens 150 ms | höchstens 100 ms |
| übliche Listen- und Filteroperation | keine blockierende Interaktion | p95 höchstens 200 ms |
| Standard-Kennzahl mit Erklärung bei 100.000 Ereignissen | kein unvollständiger Nachweis | p95 höchstens 750 ms auf Referenzhardware |
| read-only Integritätscheck bei 100.000 Ereignissen | UI bleibt bedienbar | p95 höchstens 5 s auf Referenzhardware |

Zeitwerte für Einrichtung und manuelle Erfassung werden in beobachteten
Usability-Tests gemessen. Laufzeitwerte benötigen definierte Datensätze,
Referenzgeräte, kalten beziehungsweise warmen Zustand und mindestens p50/p95.
Web-Vitals dürfen nicht als Ersatz für fachliche Ablaufmessungen verwendet
werden.

Die Web-Vitals-Ziele folgen den veröffentlichten Schwellenwerten von web.dev:
https://web.dev/articles/vitals

## Verbindliche Regeln

- optionale OCR- und Parser-Ressourcen werden nicht ohne fachlichen Bedarf
  geladen oder in den kritischen App-Start gelegt.
- große Dateien werden nach Nutzung freigegeben; Bitmaps, Canvas, Worker und
  Rohtexte bleiben nicht dauerhaft im Speicher.
- DOM-Neuaufbau und Event-Bindings werden auf den betroffenen Screen begrenzt.
- Animationen verwenden bevorzugt `transform` und `opacity` und respektieren
  `prefers-reduced-motion`.
- neue Abhängigkeiten benötigen Größen- und Laufzeitbewertung.
- native Pakete enthalten nur notwendige Plattformen und Ressourcen; optionale
  OCR-Daten dürfen weder Web- noch nativen Start unnötig blockieren.
- Datenstand, Erklärbarkeit, Undo und Validierung dürfen nicht zugunsten eines
  schnelleren, aber fachlich unsicheren Ablaufs entfernt werden.
- Ein Importabbruch hinterlässt keine Teildaten; Performanceoptimierungen
  erhalten Atomizität und deterministische Ergebnisse.
- Caches für Kennzahlen sind an Datensatzrevision, Formelversion, Zeitraum und
  Filter gebunden und dürfen keine veralteten Ergebnisse als aktuell ausgeben.
- Erklärkomponenten, Ausschlüsse und Vertrauensevidenz werden nicht zur
  Laufzeitersparnis weggelassen.
- Parallelisierung und plattformspezifische Optimierung dürfen weder
  Summenreihenfolge noch Minor-Unit-Ergebnisse verändern.
- Integritätsprüfungen dürfen inkrementell oder in Worker ausgelagert werden,
  bleiben aber read-only und liefern denselben vollständigen Befund.

## Aktuelle Baseline und Risiko

- eigener Code unter `src/`: ungefähr 284 KiB
- lokal eingebettete Vendor-Ressourcen: ungefähr 49 MiB
- der aktuelle Service Worker listet die Tesseract-Sprach- und WASM-Dateien im
  verpflichtenden Installationscache; damit wird das 5-MiB-Precache-Budget
  deutlich überschritten.

Die Trennung von App-Shell und optionalen OCR-Ressourcen ist ein Sprint-0-
Architekturthema. Eine Änderung erfolgt erst nach Contract- und Offline-Test.

Referenzhardware für iPhone, Android und Web sowie verbindliche Golden
Datasets für 10.000 Importzeilen und 100.000 Buchungen sind noch festzulegen.
Ohne diese Festlegung werden die D-010-Laufzeitwerte nicht als bestanden
markiert.

D-011 ersetzt in künftigen Baselines die unscharfe Menge „Buchungen“ durch
versionierte Golden Datasets mit Finanzereignissen, Konto- und
Kategorieauswirkungen. Laufzeitmessungen protokollieren zusätzlich
Schemaversion, Formelversion, Datensatzrevision und Erklärungstiefe.

## Messprozess

Vor Performance-Freigaben werden Build-Größe, Cacheumfang, Lighthouse-Labwerte
und reale Gerätebeobachtungen dokumentiert. Einzelne lokale Messungen werden
nicht als Feldperformance ausgegeben.

Zusätzlich enthält ein D-010-Messnachweis Ablauf, Datenmenge, Datenquelle,
Gerät, Betriebssystem, Browser beziehungsweise native Laufzeit, Messwiederholung,
p50/p95 und bekannte Einschränkungen.
