# FinanceOS Security

## Sicherheitsmodell

FinanceOS ist aktuell eine lokale Single-User-PWA und wird als local-first
Cross-Platform-Anwendung ohne FinanceOS-Backend, verpflichtende Anmeldung oder
automatische Cloud-Synchronisation weiterentwickelt. Finanzdaten verbleiben im
Anwendungsspeicher des Geräts, sofern der Nutzer nicht bewusst eine Datei
importiert oder einen Export an einen selbst gewählten Speicherort übergibt.

## Verbindliche Grundsätze

1. Datenschutz ist standardmäßig aktiv.
2. Es befinden sich keine Secrets oder API-Schlüssel im Client.
3. Externe Netzwerkdienste sind für Kernfunktionen nicht erforderlich.
4. Importdateien werden lokal verarbeitet und nach der Verarbeitung nicht als
   Rohdatei persistiert.
5. Automatisierung verändert Finanzdaten erst nach expliziter Bestätigung.
6. Berechtigungen wie Kamera oder Dateizugriff werden nur bei einer bewussten
   Nutzeraktion angefragt.
7. Drittanbieter-Laufzeitcode wird lokal versioniert und überprüfbar gehalten.
8. Es gibt keine direkten Bank-, Broker- oder Finanzdienst-Anbindungen.
9. FinanceOS authentifiziert sich nicht gegenüber Cloud-Speicheranbietern.
10. Ein Datenexport benötigt immer eine bewusste Nutzeraktion.
11. Tracking-, Werbe- und Analyse-Dienste werden nicht integriert.
12. Lokale Vorschläge legen Grundlage und Wirkung offen und verändern
    wesentliche Finanzdaten erst nach bewusster Bestätigung.
13. Datenstand, Herkunft und Unsicherheit dürfen sicherheitsrelevante oder
    finanzielle Scheingenauigkeit nicht verdecken.

## Export- und Cloud-Grenze

Ein nutzergesteuerter Cloud-Export ist zulässig, aber keine Cloud-Integration
von FinanceOS. Die App erzeugt die Exportdatei lokal und übergibt sie an die
systemeigene Datei- oder Teilen-Funktion. Auswahl, Anmeldung, Ziel und weitere
Verarbeitung liegen beim Nutzer und dem Betriebssystem. FinanceOS speichert
keine serverseitige Kopie und erhält keinen dauerhaften Zugriff auf den
gewählten Anbieter.

Verschlüsselte Exporte sind die Zielvorgabe. Solange Klartext-Backups
unterstützt werden, müssen Dateiinhalte, Risiko und Zielauswahl vor der Übergabe
verständlich erkennbar sein.

## Dauerhafte Produkt- und Datenschutzgrenzen

Nach D-009 und D-010 gelten dauerhaft:

- keine direkten Bank-, Broker- oder Zahlungsdienstverbindungen,
- kein automatischer Abruf persönlicher Finanzdaten,
- kein verpflichtendes FinanceOS-Konto und keine verpflichtende Cloud,
- keine unverschlüsselte Speicherung persönlicher Finanzdaten auf
  FinanceOS-Servern,
- keine Betreiberprofile aus Finanzdaten,
- keine Werbung, Finanzproduktvermittlung oder Finanzdatenvermarktung,
- keine intransparente externe KI-Verarbeitung persönlicher Finanzdaten.

Diese Grenzen dürfen nicht durch ein SDK, einen Supportweg, eine
Diagnosefunktion oder eine spätere Komfortfunktion indirekt umgangen werden.

## Spätere Synchronisation ist nicht freigegeben

Eine optionale Ende-zu-Ende-verschlüsselte Gerätesynchronisation oder ein
automatisiertes verschlüsseltes Backup kann später untersucht werden, ist aber
weder durch D-010 noch durch dieses Dokument zur Umsetzung freigegeben.

Eine Prüfung benötigt mindestens:

- ein dokumentiertes Bedrohungs- und Metadatenmodell,
- Ende-zu-Ende-Verschlüsselung ohne Betreiberzugriff auf Klartext,
- Schlüssel-, Recovery-, Widerrufs- und Gerätewechselkonzept,
- Konflikterkennung und deterministische Zusammenführung,
- vollständige Offline-Funktion ohne Synchronisation,
- lokalen Export und Restore unabhängig vom Dienst,
- Plattformprüfung für Web, iOS und Android,
- und eine neue formelle Entscheidung, die D-009 ausdrücklich bewertet.

Ein nutzergesteuerter Datei-Export an einen selbst gewählten Cloud-Speicher
bleibt davon unberührt und ist keine Synchronisationsfreigabe.

## Datenspeicherung

- Anwendungsdaten liegen aktuell unverschlüsselt in `localStorage`.
- Der Schutz ruhender Daten hängt damit vom Geräte-, Betriebssystem- und
  Browserprofilschutz ab.
- JSON-Backups enthalten sensible Finanzdaten im Klartext. Die Nutzeroberfläche
  muss dies vor Export und Wiederherstellung transparent kommunizieren.
- Eine spätere verschlüsselte Speicherung benötigt eine eigene Bedrohungsanalyse
  und darf nicht als isolierter Kryptografie-Patch eingeführt werden.

## Web-Sicherheit

- Dynamische Werte werden vor der HTML-Ausgabe kontextgerecht escaped.
- Importdaten dürfen niemals als ausführbarer HTML- oder Script-Inhalt enden.
- Neue externe Origins, Inline-Skripte oder gelockerte Browserrichtlinien
  benötigen eine dokumentierte Sicherheitsentscheidung.
- Fehlerprotokolle enthalten keine vollständigen Finanzdaten, Dateien oder
  personenbeziehbaren Importinhalte.

## Offene Sprint-0-Prüfungen

- systematische Prüfung aller dynamischen HTML-Ausgaben
- Content-Security-Policy unter Berücksichtigung von PDF.js, Tesseract und WASM
- Restore-Validierung und Größenlimits für Backups
- dokumentierter Updateprozess für lokal eingebettete Drittanbieter
- Prüfung des Service-Worker-Cache auf unnötige sensible oder optionale Daten

## Nicht anwendbare Anforderungen

FinanceOS-Benutzerkonten, serverseitige Schlüsselverwaltung und serverseitige
Audit-Logs sind aufgrund der angenommenen Local-first-Architektur nicht
vorgesehen. Eine FinanceOS-Serverkomponente wäre eine neue grundlegende
Produkt- und Architekturentscheidung und benötigt eine gesonderte Freigabe.
D-010 hält lediglich eine spätere Prüfung verschlüsselter Geräteübertragung
offen; die aktuelle Architektur bleibt unverändert.
