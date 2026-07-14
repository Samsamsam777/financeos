# FinanceOS Engineering Guide

## Grundsätze

- Architektur vor Implementierung
- kleine, überprüfbare Änderungen
- keine neuen Features während eines laufenden Sprints
- keine Quick Fixes gegen dokumentierte Systemgrenzen
- Tests für neue oder geänderte fachliche Verträge
- Dokumentation im selben Arbeitspaket aktualisieren

## Aktuelle technische Baseline

- statische PWA
- native ES-Module
- Node.js 24 für lokale Quality Gates und CI
- statischer Artefakt-Build ohne Transpiler oder Bundler
- keine externe Laufzeitabhängigkeit für Kernfunktionen

## Freigegebene Zielbaseline

- gemeinsame Webanwendung für PWA, iOS und Android
- Capacitor als native Laufzeit für iOS und Android
- Plattformzugriffe ausschließlich über definierte Adapter
- kein FinanceOS-Backend und keine Laufzeitabhängigkeit von Bank-, Broker-,
  Tracking- oder Cloud-Diensten
- schrittweise Migration der bestehenden Module statt Big-Bang-Rewrite
- D-011-Finanzereignismodell und versionierter Berechnungskanon als
  verbindlicher fachlicher Zielvertrag

## Fachliche Implementierungsregeln nach D-011

- Geld wird als Integer-Minor-Units mit expliziter Währung modelliert.
- Invarianten werden an Domänengrenzen validiert, nicht nur in der UI.
- Formeln sind reine, deterministische Funktionen mit expliziter Version.
- Locale formatiert Ergebnisse, verändert aber keine Berechnungen.
- Systemzeit, Zeitzone und Datensatzrevision werden explizit übergeben.
- Import und wesentliche Änderungen werden atomar ausgeführt.
- Automatisierung erzeugt Vorschläge; Bestätigung bleibt ein eigener
  Anwendungsfall.
- Persistenzadapter bewahren den vollständigen fachlichen Datengraphen und
  ändern seine Semantik nicht.
- Jede Schemaänderung besitzt Vorher-Sicherung, sequenzielle Migration,
  Validierung, Bericht und Rollback.
- Änderungen am Berechnungskanon benötigen neue Formelversion, Golden Dataset
  und dokumentierte Auswirkung.

Der Detailvertrag steht in `18_DOMAIN_MODEL.md`. Eine Implementierung darf
Bezeichner technisch anpassen, aber Vorzeichen, Invarianten,
Statusdimensionen, Ebenentrennung und Reproduzierbarkeit nicht verändern.

## Branching

- `main` bleibt releasefähig.
- Sprintarbeit erfolgt auf `sprint/<nummer>-<thema>`.
- Feature- oder Fix-Branches werden nur innerhalb eines aktiven Sprintziels
  verwendet.
- Commits beschreiben einen fachlich oder technisch abgeschlossenen Schritt.

## Verbindliche Checks

Vor einem Merge müssen mindestens folgende Checks erfolgreich sein:

1. Syntaxprüfung aller eigenen JavaScript-Module
2. Unit- und Contract-Tests
3. Prüfung der statischen PWA-Assets und Versionskonsistenz
4. manueller Smoke-Test der geänderten Kernabläufe
5. bei UI-/PWA-Änderungen ein dokumentierter Test auf den betroffenen Geräten
6. bei Plattformänderungen ein erfolgreicher Build und Smoke-Test der
   betroffenen Capacitor-Ziele

Lokale Ausführung:

```bash
npm ci
npm run check
npm run build
```

`npm run check` führt die Syntaxprüfung sowie alle Unit- und Contract-Tests aus.
`npm run build` wiederholt diese Gates und erzeugt anschließend `dist/` mit
einem deterministischen Dateimanifest und SHA-256-Prüfsummen. Der Build läuft
in GitHub Actions für Pushes auf `main` und `sprint/**` sowie für Pull Requests.

## Definition of Done

Eine Aufgabe ist fertig, wenn:

- Akzeptanzkriterien erfüllt sind,
- Architektur- und Designregeln eingehalten sind,
- automatisierte Tests grün sind,
- Fehler- und Leerzustände berücksichtigt sind,
- bestehende lokale Daten kompatibel bleiben,
- relevante Dokumente aktualisiert sind,
- keine bekannte kritische Regression verschwiegen wird.

Bei Datenmodell-, Import- oder Berechnungsänderungen gilt zusätzlich:

- Golden Datasets decken neue und bestehende Fachfälle ab,
- Integritätscheck und Export-/Restore-Roundtrip sind erfolgreich,
- Web, iOS und Android liefern fachlich identische Ergebnisse,
- Migration und Rollback wurden mit realistischen Altdaten nachgewiesen,
- Formel- und Schemaversionen sind dokumentiert.

## Release-Regel

Ein Release benötigt eine konsistente Version in App, Build-Info, HTML,
Service-Worker-Cache und den betroffenen nativen Projektmetadaten. Nicht
durchgeführte Browser-, Plattform- oder Gerätetests werden als offene
Einschränkung dokumentiert.
