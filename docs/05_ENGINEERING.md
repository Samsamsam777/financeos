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

## Release-Regel

Ein Release benötigt eine konsistente Version in App, Build-Info, HTML,
Service-Worker-Cache und den betroffenen nativen Projektmetadaten. Nicht
durchgeführte Browser-, Plattform- oder Gerätetests werden als offene
Einschränkung dokumentiert.
