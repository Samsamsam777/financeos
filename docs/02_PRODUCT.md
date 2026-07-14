# FinanceOS Product

## Vision

FinanceOS ist ein privates, ruhiges und verlässliches Finanzwerkzeug, das
Menschen einen verständlichen Überblick über ihre persönlichen Finanzen gibt,
ohne Werbung, Gamification oder künstlichen Handlungsdruck.

## Zielgruppe

Menschen, die Konten, Buchungen, Budgets und Kredite eigenständig verwalten
und dabei lokale Datenhaltung sowie eine direkte, mobile Bedienung bevorzugen.

## Kernnutzen

- finanzielle Situation schnell verstehen
- Buchungen kontrolliert erfassen und importieren
- ungeklärte Daten vor ihrer Wirkung prüfen
- Budgets, Konten und Kredite ohne visuelle Unruhe überblicken
- Daten lokal sichern und wiederherstellen

## Produktprinzipien

1. Offline-first und Privatsphäre sind Standard.
2. Automatisierung erzeugt niemals ungeprüfte finanzielle Wirkung.
3. Jeder Bildschirm hat eine primäre Aufgabe.
4. Das Dashboard zeigt Status; Details folgen nach bewusster Aktion.
5. Informationen erscheinen einmal und an der fachlich richtigen Stelle.
6. Neue Funktionen lösen ein wiederkehrendes reales Problem.
7. Bestehende lokale Daten bleiben über Releases kompatibel.
8. FinanceOS bleibt auch nach Jahren verständlich und wartbar.
9. FinanceOS benötigt weder ein Benutzerkonto noch eine Verbindung zu Banken,
   Brokern oder anderen Finanzdiensten.
10. Nutzer entscheiden selbst, ob und wohin sie bewusst exportierte Daten
    weitergeben.

## Plattform- und Datenschutzmodell

FinanceOS wird als local-first Cross-Platform-Anwendung für Web, iOS und
Android entwickelt. Die gemeinsame Webanwendung bleibt als PWA verfügbar und
wird für iOS und Android über Capacitor in eine native Laufzeit eingebettet.

Die Kernanwendung besitzt kein eigenes Backend und bleibt ohne
Internetverbindung vollständig nutzbar. Es gibt keine direkten Bank- oder
Brokeranbindungen, keinen automatischen Abruf von Finanzdaten und keine
unbemerkte Synchronisation mit externen Diensten.

Manuelle Dateiimporte sowie bewusst ausgelöste Exporte sind Teil der lokalen
Datenhoheit. Nutzer können einen Export über die systemeigene Datei- oder
Teilen-Funktion an einen lokalen Speicherort oder einen selbst gewählten
Cloud-Anbieter übergeben. FinanceOS authentifiziert sich dabei nicht gegenüber
dem Anbieter, erhält keinen dauerhaften Zugriff auf das Cloud-Konto und
speichert keine Kopie auf eigenen Servern.

## Aktueller Produktstand

Die bestehende PWA enthält Konten, Buchungen, Budgets, Kredite, lokale
Datenspeicherung, Backups sowie CSV-, PDF-, QR- und wiederkehrende
Importabläufe. Der Screenshot-Import ist im Produkt beschrieben, im aktuellen
Code aber vorübergehend deaktiviert. Diese Abweichung wird in Sprint 0 geklärt.

## Nicht-Ziele für Sprint 0

- keine neuen Endnutzer-Features
- kein visuelles Redesign
- keine automatische Cloud-Synchronisation, Bank-, Broker-, Konto- oder
  Tracking-Integration
- keine Migration weg von Offline-first
- kein vollständiger Rewrite der bestehenden Anwendung
