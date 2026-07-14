# FinanceOS Project Workflow

## Zweck

FinanceOS wird wie ein professionelles Softwareprodukt entwickelt. Arbeitschats
und lokale Notizen sind Arbeitsräume; ausschließlich die versionierten Dateien
unter `docs/` bilden die verbindliche Single Source of Truth.

## Arbeitsbereiche

| Bereich | Verantwortung | Verbindliche Dokumentation |
|---|---|---|
| Projektleitung | Vision, Roadmap, Sprintfreigabe, Prioritäten | Product, Backlog, Roadmap, Decisions |
| Research | Konkurrenz, Plattformen, Standards, Nutzerfeedback | Research-Ergebnis im betroffenen Dokument |
| Architektur | Struktur, Datenmodell, State, Security, Performance | Architecture, Security, Performance, Decisions |
| Design | UX, UI, Komponenten, Motion, Barrierefreiheit | Design Guide |
| Development | Implementierung nach freigegebenem Scope | Engineering, Testing, Changelog |
| Bugs | Ursache, nachhaltige Lösung, Regressionstest | Backlog, Testing, Changelog |
| Releases | Version, Migration, Artefakt, Freigabe | Release Process, Changelog |

## 00 — Projektleitung

Die Projektleitung trifft und genehmigt Richtungsentscheidungen. Sie ist kein
Implementierungsarbeitsraum.

Hier zulässig:

- Sprintziele festlegen und Sprints freigeben
- Produktprioritäten und Nicht-Ziele beschließen
- grundlegende Architekturänderungen genehmigen oder ablehnen
- größere Refactorings freigeben
- Release- und Meilensteinentscheidungen treffen

Die Umsetzung freigegebener Aufgaben erfolgt im Bereich Development. Fehler
werden im Bereich Bugs bearbeitet.

## Freigabegrenze für autonome Arbeit

Der Entwicklungsagent darf Tests, Dokumentation, Repository-Pflege, kleine
Verbesserungen und klar abgegrenzte freigegebene Sprintaufgaben selbstständig
umsetzen.

Er darf niemals ohne vorherige Freigabe der Projektleitung:

- grundlegende Architekturentscheidungen treffen,
- Systemgrenzen oder das Datenmodell wesentlich verändern,
- ein größeres oder bereichsübergreifendes Refactoring beginnen,
- den Technologie-Stack wechseln,
- neue Produktfeatures oder eine neue Produktrichtung einführen.

Stellt der Agent während der Umsetzung einen solchen Bedarf fest, dokumentiert
er Befund, Optionen, Auswirkungen und Empfehlung. Die Implementierung pausiert
an dieser Grenze, bis eine bewusste Projektleitungsentscheidung vorliegt.

## Standardablauf

1. Problem und gewünschtes Ergebnis im Backlog abgrenzen.
2. Relevante bestehende Dokumente prüfen.
3. Notwendige Research-Ergebnisse erfassen.
4. Produkt-, Architektur- und UX-Auswirkung bewerten.
5. Entscheidung dokumentieren.
6. Kleine, überprüfbare Änderung implementieren.
7. Automatisierte und manuelle Tests durchführen.
8. Dokumentation und Changelog aktualisieren.
9. Releasekriterien prüfen und Arbeitseinheit im Daily Log abschließen.

## Rollenregel

Ein Arbeitsbereich verändert keine fachfremden Grundlagen stillschweigend.
Erfordert eine Aufgabe eine Produkt-, Architektur- oder Designentscheidung,
wird diese vor der Implementierung im zuständigen Dokument getroffen.

## Sprintregel

- Ein Sprint enthält höchstens fünf Kernziele.
- Neue Ideen werden während des Sprints im Backlog gesammelt.
- Neue Produktfeatures sind nur in einem dafür freigegebenen Sprint zulässig.
- Jeder Sprint endet mit Tests, Dokumentation, offener Risikoliste und einer
  expliziten Abschlussentscheidung.

## Daily Log

Nach jeder zusammenhängenden Arbeitseinheit werden Ergebnis, Entscheidungen,
Checks, offene Risiken und nächster Schritt in `16_DAILY_LOG.md` ergänzt.
