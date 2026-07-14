# FinanceOS Glossary

Ein Begriff besitzt im gesamten Projekt genau eine fachliche Bedeutung.

## Produkt

- **FinanceOS:** das Gesamtprodukt.
- **Dashboard:** Startansicht mit dem aktuellen Finanzstatus.
- **Konto:** Bank-, Karten-, Bargeld- oder Verrechnungskonto.
- **Buchung:** bestätigte einzelne Einnahme oder Ausgabe.
- **Umbuchung:** Bewegung zwischen eigenen Konten ohne Einnahme- oder
  Ausgabenwirkung.
- **Kategorie:** fachliche Einordnung einer Buchung.
- **Budget:** geplantes Ausgabenlimit einer Kategorie und Periode.
- **Kredit:** finanzielle Verbindlichkeit mit Ursprungssumme und Restschuld.
- **Importentwurf:** erkannter, aber noch nicht bestätigter Buchungsvorschlag.
- **Zu prüfen:** Zustand eines Entwurfs oder einer Buchung, die eine bewusste
  Nutzerentscheidung benötigt.

## Technik

- **Local-first:** Kernfunktionen und primäre Datenhaltung funktionieren lokal
  und ohne Verbindung zu einem FinanceOS-Server.
- **PWA:** installierbare Webanwendung mit progressiven Plattformfunktionen.
- **Capacitor:** native Laufzeit, über die die gemeinsame Webanwendung auf iOS
  und Android ausgeliefert und an Betriebssystemfunktionen angebunden wird.
- **Service Worker:** vom Browser verwalteter Hintergrundprozess für Cache,
  Offline-Auslieferung und Share Target.
- **App-Shell:** minimale statische Oberfläche, die FinanceOS starten kann.
- **Domänenlogik:** fachliche Regeln ohne Abhängigkeit vom DOM.
- **Plattformadapter:** Modul, das Browser-, Capacitor-, Datei- oder
  Betriebssystem-APIs hinter einer stabilen Anwendungsschnittstelle kapselt.
- **Nutzergesteuerter Export:** bewusst ausgelöste Übergabe einer lokal
  erzeugten Datei an eine vom Nutzer gewählte Datei- oder Teilen-Funktion.
- **Contract-Test:** Test einer stabilen Schnittstelle zwischen Modulen oder
  Artefakten.
- **Quality Gate:** verbindliche Prüfung, die vor Merge oder Release grün sein
  muss.
- **Build-Artefakt:** vollständig überprüfter statischer Inhalt von `dist/`.
- **Release:** versioniertes und freigegebenes Build-Artefakt.

Neue verbindliche Begriffe werden ausschließlich hier ergänzt.
