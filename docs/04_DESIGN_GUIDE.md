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
