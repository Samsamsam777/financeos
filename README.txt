FinanceOS 2.0 – Foundation & Feel

Neu:
- zentrales Motion-System
- Press-Feedback für Buttons und Karten
- weiche Seitenübergänge
- animierte Bottom Sheets
- Toast-Rückmeldungen für Speichern, Löschen und Zuordnen
- animierte Kontostands-, Einnahmen- und Ausgabenzahlen
- animierter Kreditfortschritt
- vorbereitete Haptik-Schnittstelle
- automatische Unterstützung für „Bewegung reduzieren“
- DESIGN.md als verbindliches Produkt- und Designregelwerk
- Motion-Tokens in constants.js und CSS
- sauberere Trennung zwischen UI, Motion, Daten und Logik

Wichtige iPhone-Grenze:
Browser-PWAs können auf iOS keine nativen Haptics auslösen.
FinanceOS nutzt echte Vibration auf unterstützten Geräten und visuelle
Mikrointeraktionen als Fallback auf dem iPhone.

Installation:
1. In FinanceOS ein Backup erstellen.
2. ZIP entpacken.
3. Gesamten Inhalt in das lokale GitHub-Repository kopieren.
4. Vorhandene Dateien ersetzen.
5. Commit: FinanceOS 2.0 Foundation
6. Push origin.
7. Nach dem Deployment die App vollständig schließen und neu öffnen.

Bestehende Daten bleiben kompatibel.
