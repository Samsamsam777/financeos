# FinanceOS Glossary

Ein Begriff besitzt im gesamten Projekt genau eine fachliche Bedeutung.

## Produkt

- **FinanceOS:** das Gesamtprodukt.
- **Dashboard:** Startansicht mit dem aktuellen Finanzstatus.
- **Konto:** Bank-, Karten-, Bargeld- oder Verrechnungskonto.
- **Finanzereignis (`FinancialEvent`):** fachlich zusammengehörender Vorgang
  mit getrennten Konto- und Analysewirkungen.
- **Buchung:** nutzernahe Bezeichnung für ein tatsächlich gebuchtes
  Finanzereignis; technisch kein unabhängiges zweites Modell.
- **Kontoeffekt (`accountEffect`):** vorzeichenbehaftete Änderung eines
  Kontostands durch ein Finanzereignis.
- **Kategorieauswirkung (`categoryImpact`):** vorzeichenbehafteter Beitrag
  eines Finanzereignisses zu Einnahmen- oder Ausgabenanalysen.
- **Umbuchung:** ein Finanzereignis zwischen eigenen Konten, dessen
  Kontoeffekte sich zu null summieren und das keine Einnahmen- oder
  Ausgabenwirkung besitzt.
- **Offene Zuordnung:** gültige Kategorieauswirkung ohne Kategorie; Betrag und
  Finanzwirkung bleiben vollständig erhalten.
- **Kategorie:** hierarchische fachliche Einordnung für Analyse und Navigation;
  sie trägt keinen Kontostand.
- **Budget:** eigenständiges Planungsobjekt mit Betrag, Zeitraum und
  Kategorie-Geltungsbereich.
- **Kredit:** finanzielle Verbindlichkeit mit Ursprungssumme und Restschuld.
- **Erwartung:** geplanter oder wiederkehrend erwarteter Vorgang ohne
  bestätigte Ist-Wirkung.
- **Szenario:** isolierte Was-wäre-wenn-Annahme, die Realität und Erwartungen
  nicht verändert.
- **Importentwurf:** erkannter, aber noch nicht bestätigter Buchungsvorschlag.
- **ImportBatch:** atomarer Importvorgang mit Quelle, Zuordnung, Entwürfen,
  Dublettenbefunden, Ergebnis und Rollbackbezug.
- **Kontenabgleich (`Reconciliation`):** Vergleich eines beobachteten und eines
  berechneten Kontostands zu einem Stichtag.
- **Vertrauensevidenz:** konkrete Nachweise und Einschränkungen zur
  Verlässlichkeit einer Kennzahl statt eines pauschalen Scores.
- **Berechnungskanon:** versionierte, verbindliche Definition wichtiger
  FinanceOS-Kennzahlen.
- **Datensatzrevision:** eindeutiger Stand des fachlichen Datensatzes, auf den
  sich ein Berechnungsergebnis bezieht.
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
- **Minor Unit:** kleinste ganzzahlige Einheit einer Währung, bei Euro
  beispielsweise Cent.
- **Golden Dataset:** versionierter Referenzdatensatz mit erwarteten
  fachlichen Ergebnissen für Plattform-, Migrations- und Regressionstests.
- **Invariante:** fachliche Bedingung, die für jeden gültigen Datenstand gelten
  muss.
- **Void:** nachvollziehbares Aufheben der aktuellen Finanzwirkung bei Erhalt
  des historischen Nachweises.
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
