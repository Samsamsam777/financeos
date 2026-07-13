# FinanceOS Design Guide

## 1. Zweck dieses Dokuments

Dieses Dokument ist die verbindliche Referenz für alle zukünftigen Design-,
UX- und Interaktionsentscheidungen in FinanceOS.

Es richtet sich nicht nur an Entwickler. Es beschreibt, wie FinanceOS wirkt,
warum es so wirkt und welche Entscheidungen auch langfristig unverändert
bleiben sollen.

FinanceOS darf mit neuen Funktionen wachsen, aber nicht seine Identität
verlieren.

---

# 2. Produktidentität

FinanceOS ist:

- ruhig
- privat
- direkt
- hochwertig
- verlässlich
- verständlich
- offline-orientiert
- kontrollierbar

FinanceOS drängt sich nicht auf.

FinanceOS zeigt nie mehr Informationen als nötig.

FinanceOS fühlt sich wie iOS an, kopiert iOS jedoch nicht.

FinanceOS ist ein Werkzeug, kein Spielzeug.

FinanceOS nutzt Farbe, Animation und Typografie ausschließlich dann, wenn sie
Orientierung, Bedeutung oder Feedback vermitteln.

---

# 3. Entwicklungsphasen

## Phase 1 — Vision

Status: abgeschlossen

Ziele:

- Designrichtung finden
- Navigation definieren
- Dashboard definieren
- Farbwelt definieren
- Grundidentität entwickeln

Ergebnis:

FinanceOS besitzt eine klar erkennbare visuelle und funktionale Richtung.

---

## Phase 2 — Design System

Status: aktiv

Ziel:

Eine UI-Architektur schaffen, die über Jahre erweiterbar bleibt.

### Sprint 1 — Design Tokens

- Farben
- Abstände
- Radien
- Typografie
- Schatten
- Blur
- Materialebenen
- Motion-Zeiten

### Sprint 2 — Component Library

- HeroCard
- SummaryCard
- GroupedCard
- ProgressRow
- LoanRow
- BudgetRow
- TransactionRow
- SectionHeader
- MaterialCard
- BottomSheet
- NavigationBar
- FloatingActionButton

### Sprint 3 — Motion System

- Press
- Fade
- Push
- Pull
- Sheet
- Progress
- Toast
- Navigation
- Scroll-Material

### Sprint 4 — Dashboard Migration

Alle Dashboard-Bereiche werden ausschließlich aus standardisierten Komponenten
zusammengesetzt.

### Sprint 5 — Pages Migration

Buchungen, Budgets, Kredite, Konten, Einstellungen und Erfassung verwenden
dieselben Komponenten und Tokens.

Nach Abschluss dieser Phase existiert kein alter, isolierter UI-Code mehr.

---

## Phase 3 — Feature Development

Erst nach Abschluss und Test des Design Systems kommen größere Funktionen:

- OCR
- automatische Händlererkennung
- automatische Kategorisierung
- Prognosen
- Sparziele
- Erinnerungen
- Widgets
- Apple Shortcuts
- Apple Watch
- Live Activities
- intelligente Finanzhinweise
- optionale KI-Funktionen

Neue Funktionen müssen sich dem Design System unterordnen.

---

# 4. Designprinzipien

## 4.1 Weniger Elemente statt mehr

Jedes Element benötigt einen klaren Zweck.

Wenn zwei Elemente dieselbe Information vermitteln, bleibt nur das klarere.

## 4.2 Status zuerst, Details danach

Das Dashboard zeigt Status.

Detailinformationen erscheinen erst nach einer bewussten Aktion.

Beispiele:

- Kredit auf dem Dashboard: Name, Restschuld, Fortschritt
- Kreditdetails: Rate, Zins, Laufzeit, Historie
- Budget auf der Übersicht: Name, Verbrauch, Restbetrag
- Budgetdetails: Buchungen, Verlauf, Prognose

## 4.3 Eine primäre Aufgabe pro Bildschirm

Jeder Bildschirm benötigt eine klar erkennbare Hauptaufgabe.

Zusätzliche Aktionen dürfen diese Aufgabe nicht visuell überholen.

## 4.4 Wiederverwendung schlägt Individualität

Eine neue Oberfläche prüft zuerst, ob sie mit bestehenden Komponenten gebaut
werden kann.

Neue Komponenten entstehen nur, wenn keine vorhandene Komponente die Aufgabe
sinnvoll lösen kann.

## 4.5 Farbe transportiert Bedeutung

- Grün: positiv, Einnahme, Fortschritt oder Erfolg
- Rot: Ausgabe, Fehler oder negativer Zustand
- Gelb: prüfen, Warnung oder ungeklärter Zustand
- Violett: Navigation, Primäraktion und Identität
- Neutralgrau/Navy: Material und Struktur

Farbe wird nicht als Dekoration eingesetzt.

## 4.6 Animationen unterstützen

Nichts bewegt sich ohne Grund.

Animationen:

- erklären Übergänge
- bestätigen Eingaben
- zeigen Zustandsänderungen
- erhalten räumliche Orientierung

Animationen dürfen niemals Aufmerksamkeit erzwingen.

## 4.7 Jede Information hat einen nächsten Schritt

Wenn eine Information antippbar ist, muss das Ziel eindeutig sein.

Beispiele:

- Gesamtkontostand → Kontenübersicht
- Einnahmen → Einnahmenliste
- Ausgaben → Ausgabenliste
- Kredit → Kreditdetails
- Buchung → Buchungsdetails
- Zu prüfen → offene Buchungen
- Budget → Budgetdetails

## 4.8 Offline und Privatsphäre sind Standard

Lokale Datenhaltung ist der Ausgangspunkt.

Cloud, Sync oder externe Dienste sind Erweiterungen und niemals Voraussetzung.

---

# 5. Materialsystem

FinanceOS nutzt definierte Ebenen.

## Level 0 — Background

Der Ambient-Hintergrund ist fest, ruhig und atmosphärisch.

Er bewegt sich unabhängig vom Scroll-Inhalt.

## Level 1 — Surface

Normale Karten und Listen.

Keine starken Schatten.

Keine sichtbaren dekorativen Rahmen.

## Level 2 — Raised Surface

Primäre oder interaktive Karten.

Minimal heller als Surface.

## Level 3 — Overlay

Sticky Header, Navigation und temporäre Flächen.

Blur und Transparenz dienen der räumlichen Trennung.

## Level 4 — Sheet

Bottom Sheets und modale Detailansichten.

Deutlichste Materialebene, aber weiterhin ruhig.

## Regeln

- Karten werden über Helligkeit getrennt, nicht über starke Ränder.
- Schatten sind Floating-Elementen vorbehalten.
- Blur wird nur auf Overlay, Navigation und Sheets eingesetzt.
- Jede Ebene verwendet Design Tokens.

---

# 6. Farbregeln

## Hintergrund

Sehr dunkles Navy statt reines Schwarz.

Der Ambient-Hintergrund darf sichtbar sein, aber niemals dominant wirken.

## Karten

Kühlere graublaue Materialien.

Karten müssen sich vom Hintergrund abheben, ohne hell zu wirken.

## Akzentfarbe

Violett ist die FinanceOS-Identitätsfarbe.

Sie wird verwendet für:

- aktive Navigation
- Primäraktionen
- wichtige Line-Icons
- Fokuszustände
- ausgewählte Elemente

## Semantische Farben

Semantische Farben dürfen nie ihre Bedeutung wechseln.

---

# 7. Typografiesystem

Es dürfen nur definierte Rollen verwendet werden.

## Display

Primäre Finanzwerte.

Beispiel: Gesamtkontostand.

## Title

Seitentitel und FinanceOS-Header.

## Section

Abschnittsüberschriften.

Beispiele: Kredite, Letzte Buchungen, Budgets.

## Headline

Titel in Karten und Listen.

## Body

Normale Werte und Inhalte.

## Caption

Metadaten, Konten, Kategorien, Zeitangaben.

## Micro

Navigationsbeschriftungen und sehr kleine Statusinformationen.

## Regeln

- Keine willkürlichen Schriftgrößen.
- Finanzwerte dürfen größer als ihre Umgebung sein.
- Abschnittsüberschriften dürfen Kartentitel nicht übermäßig dominieren.
- Metadaten sind kleiner und farblich zurückgenommen.
- Schriftgewicht erzeugt Hierarchie vor zusätzlicher Farbe.

---

# 8. Spacing-System

Alle Abstände basieren auf einem festen Raster.

Erlaubte Grundwerte:

- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48

Keine willkürlichen Abstände ohne dokumentierte Begründung.

## Vertikaler Rhythmus

- kleine interne Abstände: 4–8
- Karteninhalt: 12–16
- zwischen Karten: 8–12
- zwischen Abschnitten: 20–24
- Seitenränder: responsive, tokenbasiert

---

# 9. Radius-System

## Small

Kleine Controls und Iconflächen.

## Medium

Inputs, Buttons und kleine Karten.

## Large

Standardkarten und Gruppierungen.

## Hero

Hero-Karten und Bottom Sheets.

## Pill

Badges, Fortschritt und Toasts.

Keine neuen Radien außerhalb des Systems.

---

# 10. Icon-System

FinanceOS verwendet einheitliche Line-Icons.

## Regeln

- keine Emojis als UI-Symbole
- einheitliche Strichstärke
- einheitliche optische Größe
- gleiche Rundungen
- semantische Zuordnung
- violette Tönung für neutrale Funktionsicons
- Weiß für Icons auf farbigen Flächen
- Grün, Rot und Gelb nur für semantische Zustände

Beispiele:

- Auto → Auto-Line-Icon
- Hauskredit → Haus-Line-Icon
- Konsumkredit → Einkaufstaschen-Line-Icon
- offene Prüfung → Fragezeichen-Line-Icon
- Anpassen → Listen-/Anordnungs-Line-Icon

---

# 11. Komponentenregeln

## HeroCard

Zeigt ausschließlich die wichtigste Finanzinformation.

Enthält keine überflüssigen Details.

## SummaryCard

Teilt zwei verwandte Werte in einer gemeinsamen Karte.

## SectionHeader

Besteht aus:

- Abschnittstitel
- optionaler Aktion
- optionalem Kontext

## GroupedCard

Fasst verwandte Zeilen in einer Materialfläche zusammen.

## ProgressRow

Zeigt Status über einen schmalen Fortschrittsbalken.

Der Balken ersetzt keine notwendige Zahl, aber vermeidet redundante Angaben.

## LoanRow

Dashboard:

- Name
- Restschuld
- Fortschritt

Nicht im Dashboard:

- Zinssatz
- Rate
- Laufzeit
- Prozentwert, sofern Fortschritt und Restschuld ausreichend sind

## BudgetRow

- Kategorie
- verwendet / Gesamtbudget
- Restbetrag
- Fortschritt

## TransactionRow

- Händlersymbol
- Titel
- Kategorie und Konto
- Betrag
- optionaler Chevron

## PendingBar

Ruhige Informationszeile.

Sie darf nicht stärker wirken als Kredite oder Buchungen.

## BottomSheet

Verwendet dieselbe Typografie, Materialebene und Feldstruktur wie die App.

Das Plus-Menü darf niemals wie eine separate Anwendung wirken.

---

# 12. Motion-System

## Press

100 ms

- leichte Skalierung
- leichte Abdunklung
- Navigation erst nach vollständigem Tippen

## Fast State

160 ms

Für kleine Zustandsänderungen.

## Page Transition

220 ms

Für Navigation zwischen Seiten.

## Sheet

280 ms

Für Bottom Sheets.

## Progress

520 ms

Für Kredit- und Budgetfortschritt.

## Regeln

- Touch-down löst niemals Navigation aus.
- Long Press ist nur Zusatzfunktion und nie Voraussetzung.
- `prefers-reduced-motion` wird respektiert.
- Transform und Opacity werden bevorzugt.
- Keine dekorativen Daueranimationen außer sehr langsamer Ambient-Bewegung.

---

# 13. UX-Regeln

1. Jede Hauptinformation führt zu einer passenden Detailansicht.
2. Destruktive Aktionen benötigen Bestätigung.
3. Speichern erzeugt unmittelbares Feedback.
4. Dashboard zeigt Status, nicht vollständige Auswertungen.
5. Detailansichten dürfen umfangreicher sein.
6. Eine Primäraktion pro Bildschirm.
7. Touchflächen sind mindestens 44 px groß.
8. Safe Areas werden immer berücksichtigt.
9. Neue Geräte erfordern Tests, kein Redesign.
10. Leere Zustände erklären den nächsten möglichen Schritt.

---

# 14. Dashboard-Regeln

Fest oben:

- Gesamtkontostand
- Einnahmen
- Ausgaben

Konfigurierbar darunter:

- Zu prüfen
- Kredite
- Letzte Buchungen

Das Dashboard bleibt scrollbar.

Die Nutzer können Reihenfolge und Sichtbarkeit der unteren Module ändern.

Das Dashboard enthält keine komplexen Diagramme, sofern sie nicht für eine
tägliche Entscheidung notwendig sind.

---

# 15. Freeze-Regel

Ein UI-Bereich wird eingefroren, sobald er im Test mindestens 9,5/10 erreicht.

Danach wird er nur geändert, wenn ein objektiver Vorteil vorliegt:

- klarerer Ablauf
- weniger Fehler
- bessere Zugänglichkeit
- messbare Zeitersparnis
- neue zwingende Funktion
- technische Kompatibilität

Reines Pixel-Pushing ist nach dem Freeze nicht erlaubt.

---

# 16. Sprint-Regel

Ein Sprint enthält maximal fünf Kernpunkte.

Neue Ideen während eines Sprints kommen in den Backlog.

Jeder Sprint endet mit:

- iPhone-Test
- Feedback nach Vorlage
- Bewertung
- Freeze-Entscheidung
- nächster Sprint

---

# 17. Feedback-Vorlage

## FinanceOS vX.X Feedback

### Erster Eindruck

Bewertung: /10

Kommentar:

### Was ist deutlich besser geworden?

- 

### Was stört noch?

#### Muss

- 

#### Sollte

- 

#### Nice to have

- 

### Bugs

- 

### Neue Ideen

- 

### Nicht mehr ändern

- 

### Bewertung

- Design:
- UX:
- Codequalität:
- Apple-Faktor:
- Release-Reife:

### Nächster Sprint

Maximal fünf Punkte.

---

# 18. Langfristige Regel

FinanceOS wächst über Fähigkeiten, nicht über visuelle Unruhe.

Neue Funktionen müssen sich so anfühlen, als wären sie von Anfang an Teil der
App gewesen.

Das Design System ist keine Empfehlung.

Es ist die verbindliche Grundlage von FinanceOS.


# FinanceOS 4.1 Ergänzungen

## Zurücknavigation

Jede Unterseite besitzt einen klaren Zurück-Button.

Root-Tabs besitzen keinen Zurück-Button.

Der Zurück-Button verwendet das gemeinsame Line-Icon und eine Touchfläche von
mindestens 44 px.

## Formular-Fokus

Browser-Standard-Fokusringe werden vollständig durch FinanceOS-Fokus ersetzt:

- violette Kontur
- weicher Fokus-Ring
- keine blaue Browser-Standarddarstellung

## Mehr-Menü

Das Mehr-Menü verwendet GroupedCard und SettingsRow.

Große generische Vollflächen-Buttons sind nicht zulässig.

## Materialtiefe

Karten verwenden Raised Surface und einen sehr zurückhaltenden Schatten.

Header und Navigation sind Overlay-Material.

Bottom Sheets verwenden Sheet-Material.


# FinanceOS 4.2 — Final Polish

## Typografie

Die globale Skala wurde um ungefähr 5–8 % reduziert. Finanzwerte behalten ihre
Priorität. Abschnittstitel verwenden Medium/Semibold statt schwerem Bold.

## Händleridentität

Bekannte Händler verwenden eingebaute lokale Marken. Es werden keine externen
Tracker oder Logo-Dienste geladen. Unbekannte Händler erhalten weiterhin eine
Initiale.

## Motion

Listen werden dezent gestaffelt eingeblendet. Der Floating Action Button federt
beim Loslassen zurück. Seitenbewegung berücksichtigt die Navigationsrichtung.

## Freeze

Dashboard-Struktur, Dashboard-Kreditlayout, Navigation, Plus-Button und
Ambient-Hintergrund bleiben strukturell eingefroren.


# FinanceOS 4.4.8 — Freeze Candidate

## Sprache

FinanceOS beschreibt Zustände ruhig und präzise. Es bewertet nicht und
gamifiziert nicht.

Bevorzugt:
- Noch 24 € verfügbar
- Restschuld um 420 € reduziert
- Daten bleiben auf diesem Gerät

Nicht bevorzugt:
- Achtung!
- Super!
- Du hast gewonnen

## Zustände

Jede Datenansicht besitzt definierte Leer-, Offline-, Erfolgs- und
Fehlerzustände. Jeder leere Zustand erklärt den nächsten sinnvollen Schritt.

## Eingaben

FinanceOS merkt das zuletzt verwendete Konto und die Person. Betragseingaben
erhalten direkten Fokus. Kein teilweise ausgefülltes Formular darf durch eine
unbeabsichtigte Interaktion verloren gehen.

## Undo

Buchungen können nach Erstellen oder Löschen unmittelbar rückgängig gemacht
werden. Undo ersetzt unnötige Bestätigungsdialoge.

## Privatsphäre

Lokale Datenhaltung, Offline-Verfügbarkeit und fehlende Anmeldepflicht sind
Bestandteil der Produktidentität und werden ruhig sichtbar gemacht.


# FinanceOS 4.7 — Import

Importe werden vollständig lokal verarbeitet. Vor dem Speichern zeigt FinanceOS neue Buchungen, ungeklärte Kategorien und mögliche Duplikate. Nichts wird ohne bewusste Bestätigung in den Datenbestand übernommen.
