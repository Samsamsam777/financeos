FinanceOS 1.0 – Design System

Diese Version bereinigt den Quellcode und vereinheitlicht die gesamte App.

Neu strukturiert:
- app.js: Navigation, Events und Bearbeitungsabläufe
- views.js: alle Ansichten
- storage.js: Daten, Migration, Backup und Restore
- logic.js: Finanzberechnungen und Filter
- icons.js: einheitliche SVG-Line-Icons
- ui.js: gemeinsame UI-Hilfen
- constants.js: Version und Standardwerte
- styles.css: zentrales Designsystem

Designsystem:
- ruhiger Apple-inspirierter Dark Mode
- weniger sichtbare Rahmen
- klarerer Kontrast zwischen Hintergrund und Karten
- reduzierte Kartenhöhen
- einheitliche Radien und Abstände
- eigene Line-Icons statt Emojis
- gleiche Designsprache auf Dashboard, Buchungen, Budgets, Krediten,
  Verwaltung, Einstellungen und Eingabemasken
- größere, klar freigestellte Plus-Schaltfläche
- Kreditkachel bleibt der Fortschrittsbalken

Daten:
- bestehender localStorage-Schlüssel bleibt erhalten
- bestehende Buchungen, Konten, Kategorien, Regeln und Dashboard-Einstellungen
  werden weiterverwendet
- ältere Dashboard-Einstellung „today“ wird automatisch zu „summary“ migriert

Installation:
1. Vor dem Update in FinanceOS ein Backup erstellen.
2. ZIP entpacken.
3. Den gesamten Inhalt in dein lokales GitHub-Repository kopieren.
4. Vorhandene Dateien ersetzen.
5. GitHub Desktop öffnen.
6. Commit: FinanceOS 1.0 Design System
7. Push origin.
8. Nach dem Deployment die Homescreen-App vollständig schließen und neu öffnen.

Falls noch die alte Version angezeigt wird:
- App vollständig aus dem App-Switcher entfernen
- erneut öffnen
- nur wenn nötig die Websitedaten für samsamsam777.github.io löschen
