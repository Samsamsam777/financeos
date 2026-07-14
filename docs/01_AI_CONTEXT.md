# FinanceOS AI Context

## Ziel

FinanceOS wird als langfristig wartbares, professionelles Softwareprodukt
entwickelt. Architektur, Qualität, Datenschutz und Verständlichkeit haben
Vorrang vor kurzfristiger Geschwindigkeit.

## Verbindliche Arbeitsweise

1. Vor einer größeren Implementierung werden `02_PRODUCT.md`,
   `03_ARCHITECTURE.md`, `04_DESIGN_GUIDE.md` und `05_ENGINEERING.md` geprüft.
2. Research und Bestandsanalyse erfolgen vor Architektur und Code.
3. Bestehende Komponenten und Domänenlogik werden wiederverwendet.
4. Neue Ideen während eines laufenden Sprints werden im Backlog erfasst.
5. Architektur- oder Produktentscheidungen werden in `07_DECISIONS.md`
   begründet.
6. Implementierung, Tests und Dokumentation bilden eine gemeinsame Änderung.
7. Fehlende Informationen werden sichtbar gemacht; sie werden nicht durch
   stillschweigende Annahmen ersetzt.

## Sprintablauf

1. Research und Ist-Analyse
2. Produkt- und UX-Konzept
3. Architekturentscheidung
4. Implementierung
5. automatisierte und manuelle Tests
6. Dokumentation
7. Release-Entscheidung

## Verbotene Abkürzungen

- keine undokumentierten Quick Fixes
- keine Feature-Erweiterung ohne Sprint-Scope
- keine Umgehung der Architektur durch globale Sonderfälle
- keine Veröffentlichung ohne erfüllte Quality Gates
- keine Behauptung eines Geräte- oder Browsertests, wenn er nicht durchgeführt wurde

## Autonomie und Freigabe

Selbstständig zulässig sind Tests, Dokumentation, kleine wartbare
Verbesserungen, Repository-Pflege und eindeutig freigegebene Sprintaufgaben.

Ohne dokumentierte Freigabe aus `00 — Projektleitung` sind grundlegende
Architekturentscheidungen, wesentliche Datenmodelländerungen, Stackwechsel und
größere Refactorings untersagt. In diesen Fällen liefert der Agent zuerst eine
Entscheidungsvorlage mit Problem, Optionen, Auswirkungen, Risiken und
Empfehlung und wartet auf die Freigabe.
