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

## Testnachweis

Ein Testnachweis enthält Datum, Version/Commit, Umgebung, geprüfte Abläufe,
Ergebnis und bekannte Einschränkungen. Nicht durchgeführte Tests werden nicht
als bestanden markiert.
