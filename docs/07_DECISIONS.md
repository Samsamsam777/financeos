# FinanceOS Decisions

## D-001 — `docs/` ist Single Source of Truth

- Datum: 2026-07-14
- Status: angenommen

Product, Architecture, Design Guide und Engineering Guide sind vor größeren
Implementierungen verbindlich zu prüfen. Historische Dokumente außerhalb von
`docs/` sind Referenzmaterial und haben bei Widersprüchen keine Priorität.

## D-002 — Sprint 0 ist ein Foundation-Sprint

- Datum: 2026-07-14
- Status: angenommen

Sprint 0 liefert keine neuen Endnutzer-Features. Er schafft eine belastbare
Dokumentations-, Test-, CI- und Architektur-Baseline für die bestehende PWA.

## D-003 — Inkrementelle Modernisierung statt Rewrite

- Datum: 2026-07-14
- Status: angenommen

Die produktive Codebasis wird schrittweise modularisiert. Vor strukturellen
Änderungen werden Verhaltensverträge durch Tests abgesichert. Ein vollständiger
Rewrite würde unnötig Datenkompatibilität und vorhandenes Produktwissen riskieren.

## D-004 — Dependency-arme Testbasis

- Datum: 2026-07-14
- Status: angenommen

Die erste Testbasis verwendet den integrierten Node.js-Test-Runner und eigene
statische Projektprüfungen. Browser-Automation wird separat bewertet, sobald
die Kernverträge abgesichert sind. Dadurch bleibt Sprint 0 reproduzierbar und
führt keine Produktions-Build-Pipeline ein.

## D-005 — Sprint 0 offiziell freigegeben

- Datum: 2026-07-14
- Status: angenommen

Sprint 0 umfasst ausschließlich die Vervollständigung und Konsistenz der
Dokumentation, Architekturprüfung, Repository-Bereinigung und -Standardisierung
sowie die vollständige Definition von Build, Test und Release. Neue
Produktfeatures beginnen erst nach dem expliziten Abschluss von Sprint 0.

## D-006 — Benennung folgt dem bestehenden Web-Stack

- Datum: 2026-07-14
- Status: angenommen

JavaScript- und CSS-Dateien verwenden `kebab-case`; Symbole im Code folgen den
üblichen JavaScript-Konventionen. Die zuvor allgemeine `snake_case`-Vorlage
wird nicht auf den bestehenden Web-Code übertragen, weil dies umfangreiche
Umbenennungen ohne fachlichen Nutzen verursachen würde.

## D-007 — Releasefähiger statischer Build

- Datum: 2026-07-14
- Status: angenommen

FinanceOS benötigt keinen Transpiler oder Bundler. Der Build prüft den
Quellstand und erzeugt anschließend ein separates, nachvollziehbares
`dist/`-Artefakt inklusive Dateimanifest und Prüfsummen. Quellcode, Tests und
Dokumentation werden nicht mit dem Laufzeitartefakt vermischt.

## D-008 — Architektur- und Refactoring-Freigabe bleibt bei der Projektleitung

- Datum: 2026-07-14
- Status: angenommen

Der Entwicklungsagent trifft keine grundlegenden Architekturentscheidungen und
beginnt keine größeren oder bereichsübergreifenden Refactorings ohne vorherige
Freigabe in `00 — Projektleitung`.

Tests, Dokumentation, Repository-Pflege, kleine Verbesserungen und klar
abgegrenzte freigegebene Sprintaufgaben dürfen selbstständig umgesetzt werden.
Entsteht während der Arbeit ein grundlegender Entscheidungsbedarf, erstellt der
Agent eine Entscheidungsvorlage und pausiert die betroffene Implementierung bis
zur bewussten Freigabe.

## D-009 — Local-first Cross-Platform ohne Finanzdienst-Anbindungen

- Datum: 2026-07-14
- Status: angenommen

FinanceOS wird als gemeinsame Webanwendung entwickelt, bleibt als PWA
verfügbar und wird über Capacitor für iOS und Android ausgeliefert. Fachlogik,
Anwendungsfälle und UI werden gemeinsam gepflegt; plattformspezifische
Funktionen werden ausschließlich über definierte Adapter angebunden. Ein
vollständiger Rewrite in eine andere UI-Technologie ist nicht vorgesehen.

Die App besitzt kein FinanceOS-Backend, keine verpflichtenden Benutzerkonten
und keine direkten Verbindungen zu Banken, Brokern oder anderen
Finanzdiensten. Finanzdaten werden weder automatisch abgerufen noch unbemerkt
synchronisiert oder übertragen. Tracking- und Werbedienste werden nicht
integriert.

Manuelle Dateiimporte und bewusst ausgelöste Exporte bleiben erlaubt. Nutzer
entscheiden über die systemeigene Datei- oder Teilen-Funktion selbst, ob ein
Export lokal oder bei einem Cloud-Anbieter gespeichert wird. FinanceOS meldet
sich nicht bei diesem Anbieter an, behält keinen dauerhaften Kontozugriff und
speichert keine Kopie auf eigenen Servern. Die App bleibt vollständig offline
nutzbar. Exporte sollen standardmäßig verschlüsselt sein; unverschlüsselte
Exporte benötigen eine verständliche Warnung.
