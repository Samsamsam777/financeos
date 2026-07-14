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

## Aktuelle Baseline und Risiko

- eigener Code unter `src/`: ungefähr 284 KiB
- lokal eingebettete Vendor-Ressourcen: ungefähr 49 MiB
- der aktuelle Service Worker listet die Tesseract-Sprach- und WASM-Dateien im
  verpflichtenden Installationscache; damit wird das 5-MiB-Precache-Budget
  deutlich überschritten.

Die Trennung von App-Shell und optionalen OCR-Ressourcen ist ein Sprint-0-
Architekturthema. Eine Änderung erfolgt erst nach Contract- und Offline-Test.

## Messprozess

Vor Performance-Freigaben werden Build-Größe, Cacheumfang, Lighthouse-Labwerte
und reale Gerätebeobachtungen dokumentiert. Einzelne lokale Messungen werden
nicht als Feldperformance ausgegeben.
