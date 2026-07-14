# FinanceOS Release Process

## Releaseprinzip

Ein Release ist ein überprüftes, versioniertes statisches Build-Artefakt. Ein
Commit oder eine Versionsnummer allein ist kein Release.

## Versionsquellen

Die Version muss konsistent sein in:

- `package.json`
- `BUILD_INFO.json`
- `src/constants.js`
- Cache-Busting in `index.html`
- Service-Worker-Cache und versionierten Assets in `sw.js`

Contract-Tests verhindern eine Freigabe bei Abweichungen.

## Ablauf

1. Sprint- oder Fix-Scope und Akzeptanzkriterien abschließen.
2. Version nach Semantic Versioning festlegen.
3. Migrationen und Breaking Changes dokumentieren.
4. Changelog und Build-Info aktualisieren.
5. saubere Installation mit `npm ci` durchführen.
6. `npm run build` ausführen.
7. Build-Manifest und Artefaktinhalt prüfen.
8. Release-Testmatrix aus `13_TESTING.md` dokumentiert ausführen.
9. bekannte Einschränkungen und Rollback-Plan festhalten.
10. freigegebenen Commit mergen und mit `v<version>` taggen.
11. exakt das geprüfte `dist/`-Artefakt veröffentlichen.
12. Installation, Update und Offline-Start nach Veröffentlichung prüfen.

## Abbruchkriterien

- fehlgeschlagene Quality Gates
- inkonsistente Versionen
- bekannte kritische Regression
- fehlender Migrationstest bei Datenmodelländerung
- nicht dokumentierte Sicherheits- oder Datenschutzabweichung
- fehlender vorgeschriebener Gerätetest

## Rollback

Das vorherige freigegebene Artefakt und dessen Commit bleiben identifizierbar.
Ein Rollback darf keine neueren lokalen Nutzerdaten stillschweigend zerstören.
Bei Datenmodelländerungen wird deshalb vor dem Release ein Vorwärts- und
Rollback-Szenario dokumentiert.

## Sprint-0-Einschränkung

Ein automatisches Deployment ist noch nicht definiert. Sprint 0 endet erst,
wenn Zielplattform, Hosting, Freigabeverantwortung und Rollbackmechanismus
verbindlich entschieden sind.
