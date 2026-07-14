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

## D-010 — Private Premium-Finanzzentrale mit progressiver Präzision

- Datum: 2026-07-15
- Status: angenommen
- Fassung: Version 3 einschließlich Validierungszusatz

### Problem

FinanceOS benötigt vor weiterer Produktentwicklung eine klare Positionierung,
Kernzielgruppe und dauerhafte Grenze. Ohne diese Festlegung drohen ein
austauschbares Haushaltsbuch, direkte Konkurrenz über automatische
Bankanbindungen oder ein überladenes Produkt ohne eindeutigen Nutzen.

### Entscheidung

FinanceOS wird als **private Premium-Finanzzentrale für selbst kontrollierte
Daten** entwickelt. Die Kernbotschaft lautet:

> FinanceOS – die Finanzzentrale, die dir gehört.

Das Produkt richtet sich zuerst an einzelne Privatpersonen mit mehreren
Finanzbereichen, die heute zwischen Apps, Tabellen und Notizen arbeiten, ihre
Bank- oder Brokerzugänge aber nicht an einen weiteren Anbieter weitergeben
möchten. FinanceOS startet Deutschland-first; Architektur und Datenmodell
bleiben für weitere Sprachen, Währungen und Regionen erweiterbar.

FinanceOS liefert bereits mit wenigen bestätigten Angaben einen klar
gekennzeichneten Überblick. Nutzer können ihre Abbildung anschließend
schrittweise um Transaktionen, Budgets, Importe, Regeln und Planung vertiefen.
Der strategische Kern lautet:

> Schnell nützlich, schrittweise präzise, ruhig vorausschauend und vollständig
> unter deiner Kontrolle.

Der FinanceOS Check-in wird als zentrales Produktritual etabliert. Er verbindet
Erfassung beziehungsweise Import, Prüfung unklarer Daten, Bestätigung wichtiger
Werte, bevorstehende Verpflichtungen und verständliche Korrektur in einem
kurzen regelmäßigen Ablauf.

FinanceOS zeigt Datenstand, Herkunft, erkennbare Lücken und Annahmen, statt
Scheingenauigkeit zu erzeugen. Lokale Automatisierung darf vorbereiten und
vorschlagen, aber nichts Wesentliches ohne Nutzerkontrolle verändern. Wichtige
Berechnungen und Datenoperationen bleiben erklärbar, nachvollziehbar und soweit
sinnvoll reversibel.

### Dauerhafte Nicht-Ziele

- direkte Bank-, Broker- oder Zahlungsdienstverbindungen
- automatischer Abruf von Kontoständen oder Transaktionen
- Zahlungs- oder Handelsausführung
- verpflichtendes FinanceOS-Konto oder verpflichtende Cloud-Nutzung
- Speicherung unverschlüsselter Finanzdaten auf FinanceOS-Servern
- Werbung, Finanzproduktvermittlung, Affiliate-Verkauf oder
  Finanzdatenvermarktung
- intransparente externe KI-Verarbeitung persönlicher Finanzdaten
- individuelle Finanz-, Anlage-, Steuer-, Kredit- oder Versicherungsberatung
- Rendite-, Spar- oder Sicherheitsgarantien
- manipulative Gamification, Beschämung oder künstlicher Nutzungsdruck
- professionelle Unternehmensbuchhaltung oder regulatorisches Reporting

Nutzergesteuerter Export an einen selbst gewählten lokalen oder Cloud-Speicher
bleibt nach D-009 zulässig und ist keine FinanceOS-Cloudintegration.

Eine spätere optionale Ende-zu-Ende-verschlüsselte Gerätesynchronisation oder
ein automatisiertes verschlüsseltes Backup ist mit dieser Entscheidung **nicht
freigegeben**. Eine Prüfung benötigt ein Bedrohungsmodell und eine neue
formelle Produkt- und Architekturentscheidung, die D-009 ausdrücklich bewertet.

### Validierungsstatus

Die Wettbewerbsanalyse belegt eine plausible Marktlücke, aber keinen
Markterfolg. Zielgruppe, Pflegeaufwand, FinanceOS Check-in, progressiver
Einstieg, Importkomfort, Verständlichkeit, Zahlungsbereitschaft und möglicher
Synchronisationsbedarf werden mit realen Nutzern überprüft. Wiederholt
widerlegte Kernannahmen führen zu einer bewussten Neubewertung von D-010;
Datenschutz- und Datenhoheitsgrenzen werden nicht stillschweigend geändert.

### Konsequenzen

- `02_PRODUCT.md` enthält die vollständige Produktstrategie.
- `04_DESIGN_GUIDE.md` konkretisiert progressive Bedienung, Check-in,
  Datenqualität und kontrollierte Automatisierung.
- `12_SECURITY.md` hält dauerhafte Datenschutz- und Cloud-Grenzen fest.
- `13_TESTING.md` definiert Nutzer- und Produktvalidierung.
- `14_PERFORMANCE.md` enthält messbare Wettbewerbs- und Bedienziele.
- Roadmap und Backlog führen Validierung vor breiter Feature-Entwicklung.
- D-010 genehmigt noch kein neues Endnutzer-Feature und ändert nicht den
  Sprint-0-Feature-Freeze.
