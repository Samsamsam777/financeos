FinanceOS 4.0.1 – Design System Refinement

FinanceOS 4.0 restructures the UI architecture rather than adding features.

Architecture:
- src/design/tokens.css
- src/design/base.css
- src/components/components.css
- src/components/components.js
- src/screens/screens.css
- FINANCEOS_DESIGN_GUIDE.md

Implemented:
- centralized color, spacing, radius, typography, material and motion tokens
- reusable SectionHeader, GroupedCard and MaterialCard helpers
- one shared grouped-row language for credits, budgets and transactions
- credits made substantially flatter:
  no percentage, rate or interest on the dashboard
- budgets made substantially flatter
- transaction spacing normalized
- add-booking screen aligned to the same material and typography system
- sheets, navbar, FAB and forms aligned to the same token system
- existing local data and storage key remain compatible

Testing:
- all JavaScript modules are syntax-checked
- the UI should be tested on the iPhone before the frozen-state decision

Commit:
FinanceOS 4.0 Design System


4.0.1 refinement:
- Plus action now opens a native-style FinanceOS bottom sheet
- entry form uses the same material, typography, spacing and motion tokens
- type and amount are grouped compactly
- page headings normalized across credits, settings and dashboard configuration


FinanceOS 4.0.2:
- vollständige Produkt- und Designphilosophie in FINANCEOS_DESIGN_GUIDE.md
- Entwicklungsphasen und Roadmap dokumentiert
- Freeze-, Sprint- und Feedback-Regeln verbindlich festgehalten


FinanceOS 4.1 Refinement:
- Zurück-Buttons auf allen Unterseiten
- Header transparent im Ruhezustand, Material bei Scroll
- stärker abgestufte Materialtiefe
- einheitliche FinanceOS-Fokuszustände für Inputs und Selects
- Mehr-Menü als GroupedCard
- Kreditdetailseite verwendet dieselbe Komponentenfamilie
- Buchungsfilter und Buchungsabstände verfeinert
- Motion- und Haptik-Abstraktion vereinheitlicht


FinanceOS 4.2 Final Polish:
- Header vollständig verfeinert: transparent im Ruhezustand, kompaktes Material beim Scrollen
- Kartenmaterial mit klarerer Tiefe
- weichere, dünnere Progress Bars
- Mehr-Menü bleibt GroupedCard
- Filter und Formularfelder vollständig iOS-artig gestaltet
- globale Typografie 5–8 % verkleinert
- Section Header leichter und eleganter
- bekannte Händler erhalten eingebaute Offline-Marken
- Stagger-, Seiten-, Progress- und FAB-Mikrointeraktionen
- Haptik-Abstraktion auf unterstützten Geräten
- Plus öffnet immer das gemeinsame FinanceOS-Bottom-Sheet


FinanceOS 4.3 Cross-Platform PWA:
- eigenes FinanceOS-App-Icon für iPhone, iPad, Android und Desktop
- Android Maskable Icons für adaptive Launcher-Formen
- iOS Apple Touch Icons und Startbilder
- installierbares Web-App-Manifest
- Standalone-Modus ohne Browserleiste
- Portrait-Ausrichtung und Safe-Area-Unterstützung
- verbesserter Offline-Start und Cache-Update
- Installationskarte im Mehr-Menü
- iOS- und Android-spezifische Installationshilfe
- Android-App-Shortcut „Neue Buchung“
- bestehende lokale Daten bleiben kompatibel


FinanceOS 4.4 Stability Fixes:
- persistente App-Shell: Navbar, Header und Ambient werden beim Tabwechsel nicht neu aufgebaut
- separate Scrollposition pro Haupt-Tab
- feste Navbar-Compositor-Ebene gegen vertikales Springen
- geometrisch mittiges X in allen Bottom Sheets
- Einstellungen mit Zurück-Button
- Einstellungsaktionen mit FinanceOS-Line-Icons
- „Zu prüfen“ verschwindet bei null offenen Buchungen vollständig vom Dashboard
- verbesserte Sheet-Schließung per X, Hintergrund und Escape


FinanceOS 4.4.1:
- fehlerhafte Icon-Zuordnung im Mehr-Menü korrigiert
- defensiver Fallback verhindert sichtbares `undefined` bei fehlenden Icons


FinanceOS 4.4.2:
- abgeschnittenen Plus-Button in der unteren Navigation korrigiert
- Paint-Containment der Navbar entfernt, ohne die stabile Shell zurückzunehmen


FinanceOS 4.4.3:
- Haupt-Tabs starten bei jedem Wechsel am Seitenanfang
- gespeicherte Scrollpositionen entfernt
- erneutes Tippen auf den aktiven Tab scrollt ebenfalls nach oben


FinanceOS 4.4.4:
- Kreditverlauf: Türkis und Grün deutlich nach hinten verschoben
- Budgetverlauf umgekehrt: Grün am Anfang, Dunkellila erst am Ende
- Kredit- und Budgetbalken verwenden getrennte Farbdefinitionen


FinanceOS 4.4.5:
- Kreditübersicht als einzelne Detailkacheln
- Restschuld, abbezahlt und Fortschritt direkt sichtbar
- vorhandene Rate, Zinssatz, Laufzeit und ursprünglicher Betrag werden eingeblendet
- kleiner Fortschrittsbalken am unteren Rand jeder Kreditkachel


FinanceOS 4.4.6:
- iPhone-Safari-Zoom beim Fokussieren von Formularfeldern verhindert
- Inputs, Selects und Textareas rendern auf iOS mit mindestens 16 px
- Bottom Sheet bleibt beim Öffnen der Bildschirmtastatur stabil und scrollbar


FinanceOS 4.4.7:
- Ambient-Hintergrund deutlich weniger weichgezeichnet
- Violett-, Blau- und Türkistöne kommen stärker zur Geltung
- Karten dunkler und nur minimal transparent
- Card-Blur auf ein zurückhaltendes Niveau reduziert


FinanceOS 4.4.8 Final System Polish:
- typografische Rollen, Abstände und optische Ausrichtung vereinheitlicht
- Buchungsformular merkt Konto und Person, fokussiert Betrag und verbessert Tastaturfluss
- Undo für neue und gelöschte Buchungen
- standardisierte Leer- und Offline-Zustände
- einheitliche Press-, Fokus- und Kontrastregeln
- ruhige Privatsphärenkommunikation in Einstellungen


FinanceOS 4.6 Account Details:
- eigene Kontenübersicht mit antippbaren Konten
- separate Detailseite pro Konto
- aktueller Kontostand, Einnahmen und Ausgaben direkt sichtbar
- vollständige Buchungsliste pro Konto
- Buchungen bleiben direkt bearbeitbar


FinanceOS 4.7 CSV Import:
- CSV-Dateien lokal auswählen und verarbeiten
- automatische Spaltenerkennung für Datum, Beschreibung, Betrag, Soll und Haben
- Import einem bestehenden Konto zuweisen
- Händler- und Kategorieerkennung auf importierte Buchungen anwenden
- Duplikate und ungeklärte Buchungen vor dem Import anzeigen
- 100 Demo-Buchungen Gemeinschaftskonto, 50 Kreditkarte, 30 Bargeld


FinanceOS 4.8 PDF Statements:
- PDF-Kontoauszüge lokal im Browser analysieren
- Android Web Share Target für Teilen → FinanceOS
- iPhone-Ablauf über In Dateien sichern → Kontoauszug auswählen
- Sparkassen-typische Datums- und Betragszeilen erkennen
- Importvorschau, Kategorien und Duplikate
- PDF-Bytes, Seiten und Textzeilen nach Verarbeitung freigeben


FinanceOS 4.8.1 Parser System:
- automatische Erkennung von Text-, Tabellen- und Bild-PDFs
- Parser-Registry statt Universalparser
- Sparkassen-Parser mit typischen Layoutmustern
- generischer Tabellen- und Text-Fallback
- Diagnoseansicht mit Bank, PDF-Typ und verwendetem Parser
- klare OCR-Rückmeldung bei bildbasierten PDFs


FinanceOS 4.8.2 Sparkasse Table Fix:
- Sparkassen-Dreispaltenlayout Datum / Erläuterung / Betrag unterstützt
- mehrzeilige Erläuterungen werden bis zur nächsten Datumszeile zusammengeführt
- separat extrahierte Beträge der rechten Spalte werden zugeordnet
- PDF.js Worker-Fallback für iPhone/Safari
- technische Fehlermeldung ist bei Bedarf einsehbar


FinanceOS 4.8.3 iOS PDF Buffer Fix:
- PDF.js erhält für Worker und Fallback jeweils eine eigene Byte-Kopie
- abgetrennte ArrayBuffer werden nicht erneut verwendet
- Safari/iPhone-Fallback kann das PDF jetzt erneut öffnen
- Originalpuffer wird erst nach vollständiger Verarbeitung überschrieben


FinanceOS 4.8.4 iOS PDF Reload Fix:
- iPhone und iPad überspringen den instabilen PDF.js-Worker
- Worker und Fallback lesen die Datei jeweils vollständig neu
- keinerlei Wiederverwendung von ArrayBuffer oder Uint8Array
- PDF.js- und App-Module mit 4.8.4-Cache-Busting
- JavaScript und PDF.js werden im Service Worker netzwerkbevorzugt geladen


FinanceOS 4.8.5 Strict Sparkasse Parser:
- Buchungen nur bei Datum links und Betrag rechts in derselben Tabellenzeile
- Beschreibungen ausschließlich aus der mittleren Erläuterungsspalte
- Kontostände, Überschriften, Zins-, Kreditlinien- und Rechtstexte ausgeschlossen
- abgelehnte Tabellenzeilen werden als Ignoriert ausgewiesen
- Vorschau enthält nur Buchungen mit hoher Parser-Sicherheit
