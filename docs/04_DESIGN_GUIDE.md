# FinanceOS Design Guide

## Produktidentität

FinanceOS ist ruhig, privat, direkt, hochwertig, verlässlich und verständlich.
Es fühlt sich auf mobilen Geräten vertraut an, kopiert jedoch kein fremdes
Produkt. Farbe, Bewegung und Typografie dienen ausschließlich Orientierung,
Bedeutung und Feedback.

## Verbindliche Prinzipien

1. Weniger Elemente statt mehr.
2. Status zuerst, Details danach.
3. Eine primäre Aufgabe pro Bildschirm.
4. Wiederverwendung schlägt neue Sonderkomponenten.
5. Farbe transportiert Bedeutung und ist keine Dekoration.
6. Animation unterstützt Zustandswechsel und räumliche Orientierung.
7. Jede interaktive Information besitzt ein eindeutiges Ziel.
8. Offline und Privatsphäre sind der Normalfall.

## Semantik

- Violett: Primäraktion, Auswahl und Navigation
- Grün: Einnahme, positiver Zustand oder Fortschritt
- Rot: Ausgabe, Fehler oder negativer Zustand
- Gelb: ungeklärt oder Warnung
- Navy/Grau: Struktur und Material

## Interaktion

- Touchflächen sind mindestens 44 px groß.
- Destruktive Aktionen benötigen Bestätigung oder einen sicheren Undo-Ablauf.
- Speichern erzeugt unmittelbares Feedback.
- Leere Zustände erklären den nächsten sinnvollen Schritt.
- `prefers-reduced-motion`, Safe Areas und schmale Ansichten ab 320 px werden
  berücksichtigt.
- Ein optionales PWA-Feature darf die Kernnavigation nicht blockieren.

## Progressive Bedienung

FinanceOS folgt dem Grundsatz **„Einfach im Standard, leistungsfähig bei
Bedarf“**. Ein erster Finanzüberblick darf keine vollständige Buchhaltung
voraussetzen.

- Der Einstieg fragt nur Daten ab, die für den nächsten sichtbaren Nutzen
  erforderlich sind.
- Erweiterte Felder, Regeln und Auswertungen erscheinen erst nach bewusster
  Aktion oder erkennbarem Bedarf.
- Leere Zustände führen zum kleinsten sinnvollen nächsten Schritt.
- Nutzer können von einer reinen Salden- und Verpflichtungsübersicht
  schrittweise zu Transaktionen, Budgets, Importen und Planung wechseln.
- Fachliche Tiefe wird angeboten, aber nicht als Voraussetzung für die
  Kernnavigation dargestellt.

## FinanceOS Check-in

Der Check-in ist der zentrale wiederkehrende Ablauf und kein Gamification-
Mechanismus. Er verbindet:

1. neue Eingaben und Importe,
2. unklare Daten und mögliche Duplikate,
3. Bestätigung wichtiger Werte,
4. kommende Verpflichtungen und Planungen,
5. verständliche Korrektur und Abschluss.

Der Check-in zeigt sachlich, was geprüft werden sollte, ohne Streaks,
Countdowns, Schuld-Sprache oder künstliche Dringlichkeit. Ein übersprungener
Check-in wird nicht als persönliches Versagen dargestellt.

## Datenqualität und Erklärbarkeit

Relevante Finanzwerte zeigen bei Bedarf:

- Datenstand beziehungsweise letzte Bestätigung,
- Herkunft als manuell, importiert, bestätigt, geschätzt oder geplant,
- erkennbare Lücken und ausgeschlossene Bereiche,
- Formel, Filter, Zeitraum und Annahmen.

Der Weg von einer aggregierten Kennzahl zu ihrer Berechnungsgrundlage benötigt
höchstens zwei gezielte Aktionen. Unsicherheit wird sprachlich und semantisch
gekennzeichnet, niemals nur durch Farbe.

Formulierungen unterscheiden sicher zwischen Ist, Planung und Hochrechnung.
Beispiel: „Nach den aktuell erfassten Verpflichtungen verbleiben
voraussichtlich 840 €“ statt „Du kannst sicher 840 € ausgeben“.

## Kontrollierte Automatisierung

Lokale Vorschläge müssen als Vorschläge erkennbar sein. Vor wesentlichen
Änderungen zeigt FinanceOS Wirkung und betroffene Daten. Nutzer können
Vorschläge korrigieren, deaktivieren oder rückgängig machen.

Importe, Massenänderungen, Regeln und Zusammenführungen benötigen Vorschau und
einen sicheren Undo- beziehungsweise Rollback-Ablauf. Die Oberfläche darf eine
unsichere Zuordnung nicht wie eine bestätigte Tatsache darstellen.

## Sprache und Aufmerksamkeit

- Alltagssprache wird Fachsprache vorgezogen.
- Notwendige Fachbegriffe erhalten kurze kontextbezogene Erklärungen.
- Warnungen benennen Ursache, Auswirkung und sicheren nächsten Schritt.
- Finanzielle Entscheidungen werden nicht moralisch bewertet.
- Benachrichtigungen und Hervorhebungen dienen einer konkreten Aufgabe, nicht
  der künstlichen Erhöhung von Nutzungszeit.
- Vergangenheit, Gegenwart und Zukunft sind visuell eindeutig getrennt.

## Designsystem

Neue Oberflächen verwenden die Tokens und Komponenten unter `src/design/`,
`src/components/` und `src/screens/`. Neue harte Farb-, Abstands-, Radius- oder
Motion-Werte benötigen eine dokumentierte Begründung.

## Freeze-Regel

Bereits stabile Bereiche werden nur bei objektivem Vorteil geändert: weniger
Fehler, klarerer Ablauf, bessere Barrierefreiheit, technische Kompatibilität
oder eine zwingende neue Funktion. Reines Pixel-Pushing ist kein Sprintziel.

Das historische `FINANCEOS_DESIGN_GUIDE.md` bleibt bis zur vollständigen
Migration Referenzmaterial. Bei neuen Entscheidungen ist dieses Dokument
maßgeblich.
