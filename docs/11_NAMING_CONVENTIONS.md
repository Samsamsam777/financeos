# FinanceOS Naming Conventions

## Sprache

- Fachbegriffe in UI und Produktdokumentation sind deutsch.
- Code, technische Dateinamen und APIs sind englisch.
- Begriffe aus `10_GLOSSARY.md` werden konsistent verwendet.

## Dateien und Ordner

- JavaScript- und CSS-Dateien verwenden `kebab-case`.
- Testdateien enden auf `.test.js`.
- Dokumente verwenden das bestehende nummerierte `UPPER_SNAKE_CASE`-Schema.
- Ordner werden nach fachlicher Verantwortung strukturiert, nicht allein nach
  Dateityp.
- Neue Namen beschreiben eine Verantwortung und vermeiden generische Begriffe
  wie `helpers`, `utils` oder `misc`, sofern eine präzisere Domäne existiert.

## JavaScript

- Funktionen und Variablen: `camelCase`
- Klassen und konstruktionsähnliche Typen: `PascalCase`
- echte modulweite Konstanten: `UPPER_SNAKE_CASE`
- boolesche Werte beginnen nach Möglichkeit mit `is`, `has`, `can` oder `should`
- Event-Handler beschreiben das Ereignis oder die Handlung eindeutig

## Komponenten und Module

- Ein Modul besitzt einen klaren Verantwortungsbereich.
- Domänenbegriffe werden nicht durch technische Synonyme dupliziert.
- Abkürzungen sind nur erlaubt, wenn sie im Glossar oder Webstandard etabliert
  sind, beispielsweise PWA, PDF oder CSV.

## Kommentare

Kommentare erklären Gründe, Randbedingungen oder Sicherheitsannahmen. Sie
wiederholen nicht den unmittelbar lesbaren Code.

Vor einer neuen Datei wird geprüft, ob Verantwortung und Name bereits durch ein
bestehendes Modul abgedeckt sind.
