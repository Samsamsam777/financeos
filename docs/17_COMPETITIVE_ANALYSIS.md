# FinanceOS – Wettbewerbs- und Marktanalyse

**Recherche-Stand:** 14. Juli 2026<br>
**Untersuchungsraum:** Finanz-, Budget-, Haushaltsbuch- und Vermögensübersichts-Apps für iPhone, Android und Web<br>
**Produkte:** Finanzguru, Outbank, finanzblick, Monarch Money, Copilot Money, YNAB, Actual Budget, MoneyCoach, MoneyControl, Money Manager (Realbyte), Wallet by BudgetBakers, Goodbudget, PocketSmith, Quicken Simplifi und Toshl Finance

## Einordnung, Methodik und Beleglogik

Diese Analyse ist Desk Research, keine vollständige technische oder barrierefreie Auditierung aller Apps. Untersucht wurden aktuelle Produktseiten, Hilfecenter, Preis- und Datenschutzseiten, Store-Einträge sowie aktuelle, öffentlich sichtbare Nutzerstimmen. Wo Funktionen nur vom Anbieter beschrieben werden, ist das ausdrücklich als **Anbieterangabe** zu lesen. Store-Bewertungen dienen ausschließlich zur Erkennung von Mustern; einzelne Stimmen werden als Beispiele, nicht als repräsentative Statistik behandelt.

Die folgenden Kennzeichnungen werden verwendet:

- **Fakt:** öffentlich dokumentierte Funktion, Plattform, Preis- oder Richtlinienangabe; bei Produktfunktionen bleibt die Quelle regelmäßig eine Anbieterangabe.
- **Anbieterangabe:** Selbstbeschreibung oder Sicherheits-/Qualitätsversprechen ohne unabhängige Prüfung.
- **Nutzerkritik:** öffentlich sichtbare Nutzerstimme; zusätzlich wird die Evidenzstärke genannt.
- **Bewertung:** fachliche Einordnung auf Grundlage der recherchierten Belege.
- **Ableitung:** strategische Schlussfolgerung für FinanceOS, keine bereits genehmigte Anforderung.
- **Nicht verifiziert (NV):** die öffentliche Evidenz reichte für eine belastbare Aussage nicht aus.

Preise sind Listenpreise beziehungsweise sichtbare Aktionspreise zum Recherchezeitpunkt, meist vor lokalen Steuern und abhängig von Region und Store. Bewertungen beziehen sich auf den dokumentierten Produktstand, nicht auf jede Plattformversion im Detail.

### Verbindliche Projektbasis und Quellenbefund

Die bereitgestellten Projektdokumente wurden vor der Marktanalyse geprüft. Als verbindliche Leitplanken wurden insbesondere übernommen: Architecture First, Research Before Coding, UX Before Features, Privacy/Security by Design, Single Source of Truth, keine undokumentierten Schnelllösungen, messbare Performance, asynchrone Arbeit ohne blockierende Oberfläche, Unit-/UI-/Integrations-/Regressionstests und eine Definition of Done mit Build, Tests und Dokumentation.

**Korrigierter Befund nach Repository-Abgleich:** Mehrere für die Recherche bereitgestellte Kopien der Projektdokumente waren unter falschen Dateinamen zugeordnet. Der anschließend geprüfte aktuelle Stand des GitHub-Repositorys auf `main` enthält die Dokumente unter den korrekten Namen und mit den vorgesehenen Verantwortlichkeiten. Damit liegt kein entsprechender Zuordnungsfehler im verbindlichen `docs/`-Ordner des Repositorys vor. Die versionierten Dokumente auf `main` bleiben die Single Source of Truth; ältere oder extern bereitgestellte Kopien sind lediglich nicht verbindliche Momentaufnahmen und dürfen den Repository-Stand nicht überschreiben. Aus der Recherche folgt weiterhin keine stillschweigende Änderung der Projektbasis.

---

# A. Executive Summary

## Die zehn wichtigsten Erkenntnisse

1. **Der Markt verlangt bislang fast immer einen Tausch zwischen Bequemlichkeit und Datenhoheit.** Finanzguru, Monarch, Copilot, Simplifi und finanzblick erzeugen schnell Wert durch Bankaggregation, verarbeiten dafür aber Finanzdaten in servergestützten Systemen. Actual Budget, MoneyControl und Realbytes Money Manager geben mehr lokale Kontrolle, erreichen jedoch nicht durchgängig die plattformübergreifende Produktreife und visuelle Ruhe der Premium-Apps. Outbank kommt dem Privacy-Ansatz am nächsten, bleibt aber ein Multibanking-Produkt mit Bankzugängen. **Die untersuchte Stichprobe zeigt damit eine glaubwürdige Marktlücke: Premium-UX plus vollständiger Offline-Kern plus konsequent manuelle beziehungsweise kontrollierte Dateneingabe.**

2. **„Privacy-first“ ist nur glaubwürdig, wenn es am Betriebsmodell erkennbar ist.** Eine Datenschutzerklärung mit Verschlüsselungsversprechen genügt nicht, wenn Kontodaten, Nutzungsanalysen, Werbe-IDs oder KI-Dienste beteiligt sind. Finanzguru beschreibt serverseitige Verarbeitung und Finanzproduktvermarktung in seiner [Datenschutzerklärung](https://finanzguru.de/datenschutz); Monarch nennt Aggregatoren, Analyse-, Marketing- und KI-Dienstleister in seiner [Privacy Policy](https://www.monarch.com/privacy); Wallet speichert Finanzdaten laut [Privacy Policy](https://budgetbakers.com/en/privacy) serverseitig und setzt Analyse-/Fehlerdienste ein. Outbank dokumentiert dagegen eine lokale, verschlüsselte Datenhaltung und direkte Kommunikation zwischen Gerät und Bank in seinem [Sicherheitskonzept](https://outbankapp.com/sicherheit/). FinanceOS kann Vertrauen nicht nur behaupten, sondern durch das Fehlen eines Betreiber-Finanzdatenservers beweisbar machen.

3. **Manuelle Erfassung darf kein Notbehelf sein, sondern muss das schnellste und am besten gestaltete Kernritual werden.** MoneyCoach wirbt mit extrem schneller Erfassung, Siri und Shortcuts; Realbyte setzt auf Kalender, Rechner und wiederkehrende Eingaben; Toshl verspricht manuelle Erfassung in vier Berührungen. Die jeweiligen Anbieterangaben stehen auf den Produktseiten von [MoneyCoach](https://moneycoach.ai/), [Realbyte](https://realbyteapps.com/) und [Toshl](https://toshl.com/). FinanceOS sollte nicht „trotz manueller Eingabe“ gut sein, sondern gerade deshalb: lokale Vorschläge, sichere Standardwerte, Vorlagen, Rückgängig und sofortige Korrektur müssen besser sein als bei bankzentrierten Apps.

4. **Der Dateiimport ist für FinanceOS das eigentliche Verbindungsstück zur Finanzwelt und damit ein Onboarding-, Vertrauens- und Qualitätsmerkmal.** PocketSmith unterstützt OFX, QFX, QIF und CSV mit Mapping und wiederverwendbaren Vorlagen ([Import-Dokumentation](https://learn.pocketsmith.com/article/484-bank-files)); Actual Budget unterstützt QIF, OFX, QFX, CAMT.053 und CSV ([Produktübersicht](https://actualbudget.org/)); Toshl nennt acht Importformate ([Preisseite](https://toshl.com/pricing/)). Quicken Simplifi zeigt das Gegenbild: CSV-Import nur im Web, starres Datumsformat und eine bereits importierte, später gelöschte Datei kann nicht erneut importiert werden ([Import-Hilfe](https://support.simplifi.quicken.com/en/articles/4413430-how-to-manually-import-transactions-in-quicken-simplifi)). Der Spitzenstandard ist eine Vorschau mit Mapping, Validierung, erklärter Dublettenwahrscheinlichkeit und vollständigem Rollback.

5. **Nachvollziehbarkeit ist im Markt überraschend schwach ausgeprägt.** Viele Apps liefern attraktive Aggregationen, Trends oder „Safe-to-spend“-Werte, erklären aber Filter, ausgeschlossene Konten, Wechselkurse, Rundung und Berechnung nicht auf derselben Ebene. Die besten Teilmuster sind prüfbare Transaktions-Inboxen bei Monarch und Simplifi, Reconciliation bei YNAB sowie Undo/Redo bei Actual. FinanceOS kann hier einen eigenen Standard setzen: Jede Summe muss bis zu ihren Quelldaten und ihrer Formel in höchstens zwei Interaktionen erklärbar sein.

6. **Eine Review-Inbox ist die beste Brücke zwischen Effizienz und Kontrolle.** Monarch stellt „Needs review“ in den Mittelpunkt seiner [Produktübersicht](https://www.monarch.com/); Simplifi dokumentiert eine explizite [Reviewed-Spalte](https://support.simplifi.quicken.com/en/articles/5225070-using-the-reviewed-column); MoneyCoach hebt in aktuellen Versionen einen Reviewed-Status hervor ([App-Store-Eintrag](https://apps.apple.com/us/app/moneycoach-budget-planner/id989642198)). FinanceOS sollte neue, importierte, regelbasierte und unklare Buchungen klar trennen und niemals still kategorisieren.

7. **Gute Dashboards sind kuratiert, anpassbar und schrittweise erklärend – nicht möglichst voll.** Monarch, Copilot und PocketSmith zeigen hohe visuelle Qualität und starke Hierarchie. Simplifi besitzt elf Standardkacheln, die sich ausblenden und umsortieren lassen ([Dashboard-Hilfe](https://support.simplifi.quicken.com/en/articles/3357180-getting-to-know-your-dashboard)). Das zeigt zugleich die Gefahr: Anpassbarkeit heilt keine schlechte Erstauswahl. FinanceOS braucht eine ruhige Standardansicht mit wenigen Fragen: Was ist da? Was hat sich verändert? Was steht an? Was benötigt meine Prüfung?

8. **„Offline-fähig“ ist im Markt ein unscharfer Werbebegriff.** YNAB nennt Offline-Nutzung, bleibt aber ein synchronisiertes Cloud-Produkt ([Features](https://www.ynab.com/features)); Actual arbeitet lokal und kann ohne Server genutzt werden, warnt aber bei der Browservariante vor Datenverlust durch gelöschten Browser-Speicher ([Installationshinweise](https://actualbudget.org/docs/install/)); Outbank hält lokale Daten vor, benötigt für Bankabrufe naturgemäß ein Netzwerk. FinanceOS sollte Offline-Fähigkeit nicht als Label, sondern als Testvertrag definieren: Start, Lesen, Schreiben, Berechnen, Import, Export und Backup funktionieren im Flugmodus ohne Verzögerung oder Blockade.

9. **Portabilität und Wiederherstellung sind echte Wettbewerbsvorteile, werden aber oft zu eng umgesetzt.** Simplifi exportiert Transaktionen nur im Web als CSV und lässt Splitdetails standardmäßig aus ([Export-Hilfe](https://support.simplifi.quicken.com/en/articles/3404263-how-to-export-transactions-from-quicken-simplifi)); eine aktuelle Copilot-Rezension bemängelt fehlenden gefilterten Export ([App Store](https://apps.apple.com/us/app/copilot-track-budget-money/id1447330651)). Actual, PocketSmith und Toshl sind beim Import/Export stärker. FinanceOS sollte CSV für Menschen, versioniertes JSON für vollständige Portabilität und ein verschlüsseltes, testbar wiederherstellbares Vollbackup anbieten.

10. **Barrierefreiheit ist ein offener Qualitätsraum.** Finanzguru veröffentlicht eine auf WCAG 2.1 AA ausgerichtete [Barrierefreiheitserklärung](https://finanzguru.de/barrierefreiheit), YNAB dokumentiert Zielstandard, Testdatum und bekannte Grenzen transparent ([Accessibility Statement](https://www.ynab.com/accessibility)). Bei der Mehrzahl der Apps war keine belastbare, aktuelle Konformitätsaussage auffindbar. FinanceOS kann sich durch nachweisbare WCAG-2.2-AA-Konformität, 200-%-Textskalierung, vollständige Tastaturbedienung im Web, Screenreader-Semantik und zugängliche Diagrammalternativen sichtbar abheben.

## Strategische Kurzthese

**FinanceOS sollte als „ruhige Finanzzentrale, die dir gehört“ positioniert werden:** professionelle Übersicht und Planung ohne Bankzugang, Betreibercloud, Werbung, Tracking oder undurchsichtige Automatik. Der Vorteil entsteht nicht allein aus Datenschutz, sondern aus der Kombination von schneller manueller Bedienung, kontrolliertem Import, lückenloser Erklärbarkeit, zuverlässigem Offline-Betrieb und langfristiger Portabilität.

---

# B. Marktsegmentierung

| Segment | Repräsentative Apps | Primärer Nutzen | Typische Stärke | Typischer struktureller Nachteil |
|---|---|---|---|---|
| Automatisierte deutsche Finanzassistenten | Finanzguru, finanzblick | Sofortübersicht aus Bankdaten, Verträge, Budgets | Sehr kurze Time-to-value nach Bankverbindung; deutsche Bankabdeckung | Bankzugang und servergestützte Verarbeitung sind zentral; Produktvermittlung kann Vertrauen schwächen |
| Privacy-orientiertes Multibanking | Outbank | Alle Banken und Finanzprodukte lokal bündeln | Lokale verschlüsselte Daten, starke Bankabdeckung, seriöse Sicherheitskommunikation | Weiterhin Bankzugänge; Kernnutzen hängt für aktuelle Salden vom Netz und Finanzinstituten ab |
| Internationale Premium-Finanzzentralen | Monarch, Copilot, Quicken Simplifi | Automatisierte Haushaltsübersicht, Planung, Vermögen | Herausragende Dashboards, Review-Workflows, Haushalts-/Planungsfunktionen | Cloudkonto, Aggregatoren, Abonnement und Sync-Abhängigkeit; Offline-Kern schwach |
| Methodische Budgetsysteme | YNAB, Goodbudget | Verhaltensänderung über eine klare Budgetmethode | Konsequente Planung, Lerninhalte, Reconciliation beziehungsweise Umschlagsystem | Lernkurve; Methode prägt Informationsarchitektur und passt nicht zu jedem Nutzer |
| Local-first/Open Source | Actual Budget | Kontrollierbares, lokales Envelope-Budget | Local-first, offene Formate, Undo/Redo, optionales selbst gehostetes Sync | Technischer Betrieb und Browser-Speicherrisiken; weniger native Premium-Politur |
| Manuelle und offline-nahe Tracker | MoneyCoach, MoneyControl, Money Manager (Realbyte) | Schnelle selbstbestimmte Erfassung | Gute Eingaberituale, wiederkehrende Buchungen, niedrige Einstiegshürde | Plattformfragmentierung, begrenzte Import-/Review-Tiefe oder weniger konsistente Premium-UX |
| Flexible Hybrid- und Planungswerkzeuge | Wallet, PocketSmith, Toshl | Dateiimport, Bankoption, Forecasting, Multiwährung | Breites Datenmodell, starke Imports oder Langfristprognosen | Betreibercloud; teilweise hohe Komplexität, eingeschränkte mobile Parität oder veraltete Richtlinien |

## Marktkarte und Lücke

Die Anbieter besetzen drei Achsen meist nur paarweise:

1. **Automatisierung und Premium-Design:** stark bei Finanzguru, Monarch, Copilot und Simplifi.
2. **Datenhoheit und Offline-Nähe:** stark bei Actual, Outbank, MoneyControl und Realbyte.
3. **Planung, Import und Vermögenssicht:** stark bei PocketSmith, Monarch, YNAB und Wallet.

**Bewertung:** Keine untersuchte App verbindet nach öffentlich belegbarem Stand alle folgenden Eigenschaften konsequent: iPhone + Android + Web, vollständiger Offline-Kern, keine Bank-/Brokerzugänge, kein Betreibercloudspeicher für Finanzdaten, hochwertige manuelle Erfassung, kontrollierter Multi-Format-Import, vollständiger Export, ruhige Premium-UX und erklärbare Kennzahlen. Genau diese Kombination ist die strategische Chance von FinanceOS.

**Wichtige Einschränkung:** Diese Lücke ist attraktiv, aber anspruchsvoll. Ohne automatische Bankdaten muss FinanceOS den manuellen Aufwand durch bessere Interaktionen und Importe kompensieren. Datenschutz allein gleicht Reibung nicht aus.

---

# C. Vergleichsmatrix

## Bewertungsmaßstab

- **5 – Segmentführend:** außergewöhnlich vollständig, kohärent und gut belegt.
- **4 – Stark:** überdurchschnittlich, mit kleineren Lücken.
- **3 – Solide:** marktüblich und nutzbar, aber nicht differenzierend.
- **2 – Schwach:** klare funktionale, gestalterische oder strukturelle Nachteile.
- **1 – Unvereinbar oder weitgehend fehlend:** für dieses Kriterium kaum vorhanden oder vom Betriebsmodell grundsätzlich begrenzt.
- **NV – Nicht verifiziert:** öffentliche Evidenz nicht ausreichend.

Die Werte sind eine fachliche Vergleichsbewertung, kein Labortest. Ein niedriger Datenschutz- oder Offline-Wert bedeutet nicht automatisch Unsicherheit, sondern häufig eine geringere Passung zum Local-first-Ziel von FinanceOS. Bei Barrierefreiheit wird bewusst häufig **NV** vergeben, weil Store-Screenshots oder allgemeine Designqualität keine Audit-Evidenz ersetzen.

## C1. Bedienung und Kernworkflow

| App | Design | Onboarding | Manuelle Erfassung | Import | Dashboard |
|---|---:|---:|---:|---:|---:|
| Finanzguru | 5 | 5 | 2 | 1 | 5 |
| Outbank | 4 | 4 | 4 | 4 | 4 |
| finanzblick | 3 | 4 | 3 | 2 | 4 |
| Monarch Money | 5 | 5 | 3 | 4 | 5 |
| Copilot Money | 5 | 5 | 3 | 3 | 5 |
| YNAB | 4 | 3 | 5 | 5 | 4 |
| Actual Budget | 3 | 2 | 5 | 5 | 4 |
| MoneyCoach | 5 | 4 | 5 | 4 | 4 |
| MoneyControl | 3 | 4 | 5 | 3 | 3 |
| Money Manager (Realbyte) | 3 | 3 | 5 | 3 | 3 |
| Wallet by BudgetBakers | 4 | 5 | 4 | 5 | 4 |
| Goodbudget | 3 | 3 | 4 | 4 | 3 |
| PocketSmith | 4 | 3 | 4 | 5 | 5 |
| Quicken Simplifi | 4 | 5 | 3 | 3 | 4 |
| Toshl Finance | 4 | 4 | 5 | 5 | 4 |

## C2. Planung und Finanzbild

| App | Budgetplanung | Vermögensübersicht | Wiederkehrendes/Verträge | Langfristplanung |
|---|---:|---:|---:|---:|
| Finanzguru | 4 | 4 | 5 | 3 |
| Outbank | 3 | 4 | 4 | 2 |
| finanzblick | 3 | 3 | 4 | 2 |
| Monarch Money | 5 | 5 | 5 | 4 |
| Copilot Money | 4 | 5 | 5 | 4 |
| YNAB | 5 | 3 | 4 | 4 |
| Actual Budget | 5 | 3 | 4 | 3 |
| MoneyCoach | 4 | 3 | 4 | 3 |
| MoneyControl | 3 | 2 | 4 | 2 |
| Money Manager (Realbyte) | 4 | 4 | 4 | 3 |
| Wallet by BudgetBakers | 4 | 4 | 4 | 4 |
| Goodbudget | 5 | 2 | 4 | 3 |
| PocketSmith | 5 | 5 | 5 | 5 |
| Quicken Simplifi | 5 | 5 | 5 | 4 |
| Toshl Finance | 4 | 3 | 4 | 4 |

## C3. Datenhoheit, Qualität und Geschäftsmodell

| App | Datenkontrolle | Datenschutz-Passung | Offline-Kern | Export/Portabilität | Barrierefreiheit | Preis/Leistung |
|---|---:|---:|---:|---:|---:|---:|
| Finanzguru | 2 | 2 | 1 | 2 | 4¹ | 4 |
| Outbank | 5 | 5 | 4 | 4 | NV | 4 |
| finanzblick | 3 | 3 | 2 | 2 | NV | 5 |
| Monarch Money | 4 | 3 | 1 | 4 | 3² | 3 |
| Copilot Money | 3 | 3 | 1 | 3 | NV | 3 |
| YNAB | 4 | 4 | 3 | 4 | 4³ | 3 |
| Actual Budget | 5 | 5 | 5 | 5 | NV | 5 |
| MoneyCoach | 4 | 4 | 4 | 3 | NV | 4 |
| MoneyControl | 4 | 4 | 5 | 4 | NV | 4 |
| Money Manager (Realbyte) | 4 | 3 | 5 | 4 | NV | 4 |
| Wallet by BudgetBakers | 4 | 2 | 3 | 4 | NV | 4 |
| Goodbudget | 3 | 3 | 2 | 4 | NV | 3 |
| PocketSmith | 4 | 3 | 1 | 5 | NV | 2 |
| Quicken Simplifi | 3 | 2 | 1 | 3 | NV | 4⁴ |
| Toshl Finance | 4 | 2 | 2 | 5 | NV | 4 |

¹ Finanzguru veröffentlicht eine WCAG-2.1-AA-orientierte Erklärung, räumt aber laufende Anpassungen ein.<br>
² Monarchs aktuelle Versionshinweise nennen Verbesserungen für Screenreader-Kontext, Kontrast, Dark Mode und Diagrammlesbarkeit; eine vollständige Konformitätserklärung wurde nicht gefunden.<br>
³ YNAB dokumentiert eine Prüfung und bekannte Grenzen bei maximaler Textskalierung.<br>
⁴ Der Wert berücksichtigt den zeitlich begrenzten Einführungspreis; zum regulären Preis sinkt die relative Bewertung.

## Interpretation statt Gesamtrangliste

Eine Gesamtnote wäre irreführend: PocketSmith ist beim Forecasting führend, aber weder günstig noch mobile-first; Actual ist bei Datenhoheit führend, aber nicht beim nativen Onboarding; Finanzguru ist bei automatischem Sofortnutzen stark, aber strategisch nicht mit einem bankfreien Local-first-Modell vergleichbar. Für FinanceOS sind daher die **jeweiligen Spitzenmuster** wichtiger als ein Sieger.

---

# D. Detaillierte Einzelanalyse

## 1. Finanzguru

**Positionierung und Zielgruppe.** Finanzguru ist ein deutscher, bankzentrierter Finanzassistent. Nach Verbindung von Bankkonten kategorisiert die App Transaktionen, erkennt Verträge, bildet Budgets und bietet Kündigungs-, Versicherungs-, Cashback- und Produktvergleichsfunktionen. Der Anbieter nennt mehr als 3.000 unterstützte Banken und Deutschland sowie Österreich als Kernmärkte ([Produktseite](https://finanzguru.de/)). Das Nutzenversprechen ist unmittelbar verständlich: Die App analysiert bestehende Kontodaten und erzeugt schnell einen Gesamtüberblick.

**Stärkste Funktionen und UX.** Die Stärke ist das Onboarding nach einer Bankverbindung: vorhandene Historie füllt Kategorien, Verträge und Dashboard ohne Vorarbeit. Wiederkehrende Zahlungen werden prominent und handlungsorientiert dargestellt. Gestaltung, Typografie und visuelle Hierarchie gehören zur Spitzengruppe der deutschen Apps. Eine veröffentlichte [Barrierefreiheitserklärung](https://finanzguru.de/barrierefreiheit) nennt Kontraste, Tastaturbedienung, Alternativtexte, reduzierte Bewegung, Screenreader und Textgrößen mit Orientierung an WCAG 2.1 AA; zugleich weist der Anbieter auf noch nicht vollständig umgesetzte Anpassungen hin.

**Schwächen.** Manuelle Erfassung und kontrollierter Dateiimport sind nicht das Zentrum des Produkts; belastbare Angaben zu einer vollständigen Importvorschau, Dublettenprüfung, Vollsicherung und verlustfreien Wiederherstellung wurden nicht gefunden. Berechnungen entstehen weitgehend aus automatischer Kategorisierung und Vertragserkennung, deren Herleitung für Nutzer weniger kontrollierbar ist als in einem manuellen System. Das Produkt kombiniert Finanzübersicht zudem mit Kündigung, Versicherung, Cashback und Produktvermittlung. Das ist geschäftlich nachvollziehbar, steht aber im Spannungsfeld zu einer vollkommen ruhigen, verkaufsfreien Umgebung.

**Datenschutzmodell.** Laut [Datenschutzerklärung](https://finanzguru.de/datenschutz) verarbeitet der Dienst Personen-, Bank-, Transaktions-, Analyse- und Partnerproduktdaten serverseitig, nutzt Verschlüsselung und nennt unter anderem Adjust, AWS sowie Push-Dienste als Dienstleister. Der Anbieter erklärt, Daten nicht zu verkaufen; gleichzeitig beschreibt die Richtlinie die Optimierung und Vermarktung von Finanzprodukten. Das ist kein Local-first-Modell und erfordert die Verarbeitung sensibler Kontodaten außerhalb des Endgeräts.

**Geschäftsmodell.** Freemium mit kostenpflichtigem Plus-Angebot und kommerziellen Finanz-/Vertragsangeboten. Der aktuelle exakte Plus-Listenpreis konnte aus der frei zugänglichen Produktseite nicht belastbar verifiziert werden.

**Nutzerkritik.** In der aktuellen sichtbaren [Google-Play-Stichprobe](https://play.google.com/store/apps/details?id=de.dwins.financeguru) finden sich einzelne Hinweise auf mühsame manuelle Bankaktualisierung, falsche Vertragserkennung und Irritation über Marketing- beziehungsweise KI-Kommunikation. **Evidenzstärke: niedrig** – aktuelle Beispiele, aber keine ausreichend breite, unabhängig quantifizierte Wiederholung.

**Erkenntnis für FinanceOS.** Zu übernehmen sind klare Hierarchie, schnelle Erstorientierung und verständliche Darstellung wiederkehrender Belastungen. Bewusst nicht zu übernehmen sind Bankzugang, verkaufsnahe Vertragsstrecken und stille Klassifikation. FinanceOS muss den fehlenden Datenautomatismus durch eine gleichwertig schnelle Demo, kontrollierten Import und ein überlegenes Review-Erlebnis kompensieren.

## 2. Outbank

**Positionierung und Zielgruppe.** Outbank ist ein Premium-Multibanking-Produkt für Nutzer, die viele Banken und Finanzdienste in einer App sehen möchten, ohne ihre Finanzdaten in einer Betreibercloud analysieren zu lassen. Der Anbieter nennt mehr als 4.500 Banken und Dienste sowie iPhone, iPad, Mac und Android ([Produktseite](https://outbankapp.com/)).

**Stärkste Funktionen und UX.** Outbank verbindet breite Bankabdeckung mit lokalen Kategorien, Regeln, Vertragsanalyse, Offline-Konten, manuellen Buchungen, Importen, PDF-/CSV-Export und lokalen Backups. Der [Google-Play-Eintrag](https://play.google.com/store/apps/details?id=com.stoegerit.outbank.android) und die [Feature-Übersicht](https://outbankapp.com/features/) nennen diese Funktionen. Die Oberfläche ist informationsreich, aber im Vergleich zu klassischen Banking-Apps kontrolliert und konsistent. Das Produkt zeigt, dass seriöse Sicherheitskommunikation selbst ein UX-Merkmal sein kann.

**Schwächen.** Der Kern bleibt Bankaggregation: aktuelle Salden und Abrufe hängen von Bank-Schnittstellen, Netzverbindung und deren Zuverlässigkeit ab. Für langfristige Finanzplanung und methodische Budgets ist Outbank weniger tief als YNAB, PocketSmith oder Monarch. Eine aktuelle, belastbare öffentliche Barrierefreiheitsdokumentation wurde nicht gefunden.

**Datenschutzmodell.** Nach dem [Sicherheitskonzept](https://outbankapp.com/sicherheit/) werden Finanzdaten lokal verschlüsselt, Kategorisierung und Vertragsanalyse lokal ausgeführt und Bankabfragen direkt vom Gerät ausgelöst. Backups können lokal erfolgen; optionaler Secure Sync ist Ende-zu-Ende-verschlüsselt. Der Anbieter nennt AES-Verschlüsselung, App-Passwort und fehlendes Profiling. Diese Aussagen sind Anbieterangaben, passen aber strukturell deutlich besser zu Privacy-first als die meisten Aggregatoren.

**Geschäftsmodell.** Seit 1. Juli 2026 kostet „Individual“ laut [Preisseite](https://outbankapp.com/preise/) 3,99 Euro pro Monat oder 39,99 Euro pro Jahr; „Business“ 9,99 Euro beziehungsweise 99,99 Euro. Es gibt 14 Tage Testzeitraum und keinen Einmalkauf.

**Nutzerkritik.** Für den Recherchezeitraum ließ sich kein ausreichend robuster, aktueller wiederkehrender Kritikpunkt aus frei sichtbaren Store-Stimmen verifizieren. Bankverbindungsprobleme wären bei einem Multibanking-Produkt grundsätzlich relevant, dürfen ohne belastbare aktuelle Stichprobe aber nicht als nachgewiesenes Muster behauptet werden.

**Erkenntnis für FinanceOS.** Outbank ist der wichtigste Privacy-Benchmark: lokale Verarbeitung, klare Sicherheitsarchitektur und bezahltes Produkt statt Datenmonetarisierung. FinanceOS kann es übertreffen, indem es keinerlei Bankzugänge verarbeitet, seine Planungstiefe erhöht, Web als vollwertige Plattform anbietet und jede Kennzahl bis zur Buchung erklärt.

## 3. finanzblick

**Positionierung und Zielgruppe.** finanzblick von Buhl ist ein kostenloser deutscher Finanzassistent mit Bankaggregation, automatischer Kategorisierung, Budgets und Verbindung zum WISO-Steuer-Ökosystem. Der Anbieter nennt mehr als 4.000 Banken, deutsche Server und browser- sowie mobil nutzbare Synchronisierung ([Produktseite](https://www.buhl.de/finanzblick/)).

**Stärkste Funktionen und UX.** Der Einstieg ist nach Bankverbindung schnell; Bargeld- und Offline-Konten erweitern die Übersicht. Der [Google-Play-Eintrag](https://play.google.com/store/apps/details?id=de.buhl.finanzblick) nennt eine schnelle Barerfassung ohne Registrierung, verschlüsselte Datenbank und mobile/webbasierte Nutzung. Die Steuerintegration ist ein klarer Ökosystemvorteil für deutsche Nutzer.

**Schwächen.** Das Produkt ist primär für automatische Bankdaten gebaut. Importvorschau, Dublettenlogik, vollständiger Export und lokale Wiederherstellung ließen sich nicht hinreichend belegen. Die Oberfläche wirkt funktional, aber weniger ruhig und hochwertig als Monarch, Copilot oder Finanzguru. Die Verzahnung mit Konto und Cloud-Synchronisierung widerspricht einem vollständig lokalen Kern.

**Datenschutzmodell.** Buhl nennt deutsche Server, Verschlüsselung und regulatorische Sicherheitsmaßnahmen; der Play-Store-Eintrag weist zugleich – als Selbstauskunft des Entwicklers – auf die Erhebung von Personen-, Finanz- und weiteren Datentypen hin. Ein Bankzugang ist für den Hauptnutzen stark bevorzugt. Damit ist finanzblick datenschutzbewusst innerhalb eines Cloud-/Banking-Modells, aber nicht Local-first.

**Geschäftsmodell.** Die App wird dauerhaft kostenlos angeboten und unterstützt das breitere Buhl-/WISO-Ökosystem. Werbung oder eine konkrete Gegenfinanzierung dürfen daraus ohne zusätzliche Belege nicht abgeleitet werden.

**Nutzerkritik.** Die öffentlich sichtbaren kritischen Store-Stimmen zu fehlenden Regeln und wenig intuitiver Bedienung waren überwiegend älter. **Evidenzstärke: niedrig und historisch**; daraus folgt kein belastbares aktuelles Qualitätsurteil.

**Erkenntnis für FinanceOS.** finanzblick zeigt den Wert eines niedrigen Einstiegs und lokaler Bargeldkonten. FinanceOS sollte jedoch nicht versuchen, „kostenlos plus Ökosystem“ nachzubilden, sondern einen transparenten Preis gegen klare Datenhoheit stellen. Steuerexporte können später sinnvoll sein, dürfen aber den MVP nicht verkomplizieren.

## 4. Monarch Money

**Positionierung und Zielgruppe.** Monarch ist eine US-zentrierte Premium-Finanzzentrale für Einzelpersonen, Paare und Haushalte. Das Produkt kombiniert Transaktionen, zwei Budgetansätze, wiederkehrende Zahlungen, Ziele, Vermögen, Investments, anpassbare Berichte und Zusammenarbeit mit Haushaltsmitgliedern oder Beratern ([Produktseite](https://www.monarch.com/)).

**Stärkste Funktionen und UX.** Monarch gehört beim Dashboard, bei Informationshierarchie und bei Haushaltszusammenarbeit zur Spitzengruppe. Besonders relevant ist „Needs review“: neue oder unklare Transaktionen werden nicht nur kategorisiert, sondern in einen expliziten Prüfworkflow geführt. Flexible Budgets statt einer einzigen erzwungenen Methode, anpassbare Reports, wiederkehrender Kalender und klare Net-Worth-Ansicht bilden eine kohärente Finanzzentrale. Die aktuelle [App-Store-Seite](https://apps.apple.com/us/app/monarch-budget-track-money/id1459319842) dokumentiert Verbesserungen an Screenreader-Kontext, Kontrast, Dark Mode, Onboarding und Diagrammlesbarkeit.

**Schwächen.** Der hohe Sofortnutzen beruht auf Cloudkonto und Finanzaggregatoren. Ohne Verbindungen sinkt der Vorteil deutlich; ein vollständiger Offline-Kern ist nicht dokumentiert. Die Funktionsfülle erzeugt Lernaufwand. Der aktuelle offizielle Listenpreis ließ sich zum Stichtag nicht belastbar aus einer frei zugänglichen Preisquelle verifizieren; daher wird er nicht geschätzt.

**Datenschutzmodell.** Monarch nennt Read-only-Zugriff, Verschlüsselung, 2FA und SOC-2-Kontrollen ([Security](https://www.monarch.com/security)). Die [Privacy Policy](https://www.monarch.com/privacy) nennt jedoch umfangreiche Profil-, Haushalts-, Finanz-, Nutzungs- und abgeleitete Daten sowie Plaid, Finicity, MX, Spinwheel, OpenAI und Marketing-/Analyse-Technologien. Der Anbieter sagt, Finanzdaten nicht zu verkaufen. Das ist ein professionell abgesichertes Cloudmodell, kein lokales Eigentumsmodell.

**Geschäftsmodell.** Werbefreies Abonnement. Exakter aktueller Preis: **nicht verifiziert**.

**Nutzerkritik.** Sichtbare [App-Store-Stimmen](https://apps.apple.com/us/app/monarch-budget-track-money/id1459319842) nennen wiederholtes Neuanmelden von Aggregatorverbindungen, Lernkurve und Abonnementaversion. **Evidenzstärke: niedrig bis mittel** – mehrere thematisch passende Beispiele, aber keine systematische Vollerhebung.

**Erkenntnis für FinanceOS.** Monarch ist der stärkste Benchmark für eine moderne, haushaltsweite Informationsarchitektur. FinanceOS sollte Review-Inbox, flexible Planung und klare Vermögensentwicklung eigenständig übernehmen, aber jede Automatik lokal, sichtbar, bestätigbar und umkehrbar machen.

## 5. Copilot Money

**Positionierung und Zielgruppe.** Copilot ist eine designorientierte Premium-App für Nutzer im Apple-Ökosystem; verfügbar sind iPhone, iPad, Mac und Web, nicht Android. Die App bündelt automatische Kategorisierung, Review-Status, Budgets, Cashflow, wiederkehrende Zahlungen, Abonnements, Investments und Nettovermögen ([Produktseite](https://www.copilot.money/)).

**Stärkste Funktionen und UX.** Copilot setzt einen hohen Maßstab bei visueller Hierarchie, Animation, Statusdarstellung und der Verbindung von Transaktionsprüfung mit einem ruhigen Ausgabenbild. Der Anbieter nennt eine Finalistenplatzierung beim Apple Design Award. Rückerstattungen, anstehende Rechnungen, Rollovers und Investments werden in einer konsistenten visuellen Sprache behandelt. Das Produkt zeigt, wie Finanzsoftware hochwertig wirken kann, ohne wie klassische Buchhaltung auszusehen.

**Schwächen.** Android fehlt. Der Nutzen hängt stark von Finanzaggregatoren und Cloudverarbeitung ab; eine vollständige Offline-Nutzung ist nicht dokumentiert. Manuelle Erfassung und Dateiportabilität sind gegenüber dem automatischen Feed nachgeordnet. Das Webangebot beseitigt die Android-Lücke nicht für mobile Nutzer.

**Datenschutzmodell.** Die aktuelle [Privacy Policy](https://www.copilot.money/privacy-policy) nennt verknüpfte Finanz-, Nutzungs-, Geräte- und Standortdaten, Plaid/Finicity, KI-/LLM-Dienstleister sowie Marketing-Technologien auf der Website. Copilot erklärt, Finanzinformationen nicht zu verkaufen, keine Werbung in der App zu schalten und Kundendaten nicht zum Trainieren von KI-Modellen zu verwenden. Daten werden in den USA verarbeitet. Das ist ein werbefreies Cloud-Abonnement mit reduzierter Monetarisierung, aber kein Local-first-System.

**Geschäftsmodell.** Laut [Produktseite](https://www.copilot.money/) 13 US-Dollar monatlich oder 95 US-Dollar jährlich.

**Nutzerkritik.** Aktuelle sichtbare [App-Store-Rezensionen](https://apps.apple.com/us/app/copilot-track-budget-money/id1447330651) nennen gelegentliche Resynchronisierung, falsche Transaktionsdaten/-notizen und einen Export, der nur alle statt gefilterter Transaktionen umfasse. **Evidenzstärke: niedrig bis mittel** – konkrete aktuelle Beispiele, keine repräsentative Häufigkeitsmessung.

**Erkenntnis für FinanceOS.** Copilot ist der visuelle Qualitätsbenchmark, nicht der Datenschutzbenchmark. FinanceOS sollte dieselbe Sorgfalt in Typografie, Rhythmus, kleine Interaktionen und Diagrammlesbarkeit investieren, dabei jedoch Export, Plattformparität und Erklärbarkeit als Produktgrundrechte behandeln.

## 6. YNAB

**Positionierung und Zielgruppe.** YNAB ist kein neutraler Ausgabentracker, sondern ein methodisches Planungssystem: verfügbares Geld erhält Aufgaben, Nutzer planen vor dem Ausgeben und passen den Plan aktiv an. Bankimport ist in ausgewählten Regionen möglich; andernorts und alternativ stehen Datei- und manuelle Eingabe zur Verfügung. Die [Preisseite](https://www.ynab.com/pricing) nennt unterstützten Bankimport für USA, Kanada, Großbritannien und Teile Europas sowie eine Währung pro Plan.

**Stärkste Funktionen und UX.** YNAB ist beim aktiven Budgetieren, bei Reconciliation, Zielbildung, Schuldenplanung und Lernmaterial führend. Der Web-Dateiimport unterstützt laut [Hilfecenter](https://www.ynab.com/help-center) QFX, OFX und CSV. Die App ist werbefrei, synchronisiert mehrere Geräte und nennt auch Offline-Nutzung ([Features](https://www.ynab.com/features)). Manuelle Eingabe ist kein zweitrangiger Fallback, sondern Teil der Methode. Besonders gut ist die klare Beziehung zwischen vorhandenem Geld, Zuweisung und Ausgabe.

**Schwächen.** Die Methode erzeugt für viele Nutzer zunächst eine erhebliche Lernkurve. Sie ist nützlich, aber normativ: Wer nur beobachten, flexibel planen oder Vermögen und Verpflichtungen ganzheitlich betrachten möchte, muss sich der Budgetlogik anpassen. Vermögenshistorie und freies Reporting sind weniger zentral als bei Monarch oder PocketSmith. „Offline“ bedeutet nicht local-only; Synchronisierung und Konto bleiben Cloudfunktionen.

**Datenschutzmodell.** YNAB beschreibt ein Abonnement ohne Werbung und erklärt, Finanzdaten nicht für fremde Zwecke zu nutzen. Die [Datenschutzdarstellung](https://www.ynab.com/blog/ynab-privacy) nennt Verschlüsselung, kontrollierten Supportzugriff und anonymisierte Nutzungsdaten. Bankimport verarbeitet bei Aktivierung naturgemäß Daten über externe Anbieter. Das Modell ist vergleichsweise vertrauenswürdig innerhalb einer Cloud-App, aber Betreibercloud und Konto bleiben erforderlich.

**Barrierefreiheit.** Die [Accessibility-Erklärung](https://www.ynab.com/accessibility) nennt WCAG 2.2 AA und EN 301 549 als Ziel, ein Testdatum vom 24. Juni 2025 sowie bekannte Grenzen: mobile Textskalierung erreicht nicht überall 200 Prozent. Diese transparente Benennung von Restproblemen ist selbst eine Best Practice.

**Geschäftsmodell.** 109 US-Dollar pro Jahr oder 14,99 US-Dollar pro Monat, jeweils zuzüglich möglicher Steuern; 34 Tage Test und Haushaltsfreigabe für bis zu sechs Personen ([Preisseite](https://www.ynab.com/pricing)).

**Nutzerkritik.** Mehrere aktuelle Rezensionen im [Google Play Store](https://play.google.com/store/apps/details?id=com.youneedabudget.evergreen.app) beschreiben unabhängig voneinander eine steile Lernkurve. Einzelne Nutzer kritisieren Preissteigerungen und werblich wirkende Inhalte auf der Startseite; der Anbieter widerspricht der Einordnung als Werbung. **Evidenzstärke: mittel** für Lernkurve, **niedrig** für Werbe-/Preisthema.

**Erkenntnis für FinanceOS.** Zu übernehmen sind aktive Planung, Reconciliation und die respektvolle Kommunikation, dass Pläne geändert werden dürfen. Nicht zu übernehmen ist eine einzige verpflichtende Methode. FinanceOS sollte „Beobachten“, „Planen mit Kategorien“ und später optional „Jeder Euro hat eine Aufgabe“ unterstützen, ohne den Datenbestand an eine Methode zu binden.

## 7. Actual Budget

**Positionierung und Zielgruppe.** Actual ist eine quelloffene, privacy-orientierte Envelope-Budget-App für Nutzer, die lokale Daten, offene Formate und optional selbst kontrollierte Synchronisierung schätzen. Die [Produktseite](https://actualbudget.org/) nennt Local-first, Offline-Nutzung, Ende-zu-Ende-Verschlüsselung für optionales Sync, Undo/Redo sowie QIF-, OFX-, QFX-, CAMT.053- und CSV-Import.

**Stärkste Funktionen und UX.** Actual ist der stärkste konzeptionelle Referenzpunkt für FinanceOS. Änderungen erfolgen lokal und sofort; Server-Sync ist optional. Undo/Redo, Budgetregeln, Reconciliation, Dateiimport, YNAB-Migration und eine lokale API geben Nutzern hohe Kontrolle. Das Datenmodell bleibt für technisch versierte Nutzer zugänglich, statt sie in einer proprietären Cloud einzuschließen.

**Schwächen.** Installation, Selbsthosting und Sync-Konfiguration sind anspruchsvoller als ein typisches Store-Onboarding. Die Web-/PWA-Nutzung ist nicht mit einer vollständig nativen Premium-App gleichzusetzen. Die [Installationsdokumentation](https://actualbudget.org/docs/install/) warnt, dass das Löschen von Browser-Speicher lokale Daten entfernen kann, und empfiehlt Browserbetrieb nicht als einzige dauerhafte Ablage. Das ist ein relevantes Zuverlässigkeits- und Erwartungsmanagementproblem, kein belegtes Nutzerkritikmuster.

**Datenschutzmodell.** Daten liegen lokal und können mit einem frei gewählten Server synchronisiert werden. Laut [Sync-Dokumentation](https://actualbudget.org/docs/getting-started/sync/) ist die optionale Synchronisierung Ende-zu-Ende-verschlüsselbar; lokale Gerätedaten sind jedoch nicht zusätzlich durch Actual selbst verschlüsselt, weshalb vollständige Geräteverschlüsselung empfohlen wird. Banktokens sind bei optionaler Bankanbindung nicht Teil der Ende-zu-Ende-Verschlüsselung. Diese präzisen Grenzen sind wichtig und glaubwürdiger als absolute Sicherheitsversprechen.

**Geschäftsmodell.** Open Source und kostenlos; mögliche Hosting- und Wartungskosten trägt der Nutzer beziehungsweise ein gewählter Anbieter.

**Nutzerkritik.** Eine mit kommerziellen Store-Apps vergleichbare aktuelle Review-Stichprobe existiert nicht. **Nicht verifiziert.** Offizielle Hinweise belegen jedoch operative Reibung bei Hosting, Browser-Speicher und Konflikt-/Sync-Wiederherstellung.

**Erkenntnis für FinanceOS.** Local-first, offene Backups, Undo/Redo und kontrollierter Sync sind direkte Referenzprinzipien. FinanceOS muss sie mit nativem Onboarding, klarer Backup-Führung, sicherer Gerätespeicherung, zugänglichem Design und plattformübergreifender Konsistenz übertreffen.

## 8. MoneyCoach

**Positionierung und Zielgruppe.** MoneyCoach ist eine Apple-zentrierte, visuell hochwertige Finanz-App für manuelle Haushaltsführung mit optionaler Bankanbindung. Sie läuft auf iPhone, iPad, Mac, Apple Watch und weiteren Apple-Oberflächen; Android und ein gleichwertiges Webprodukt fehlen. Die [Produktseite](https://moneycoach.ai/) nennt manuelle Konten, Budgets, Kategorien, Rollovers, Ziele, Multiwährung, Siri, Shortcuts und iCloud-Familienfunktionen.

**Stärkste Funktionen und UX.** MoneyCoach behandelt die manuelle Buchung als primären Hochfrequenzworkflow. Der Anbieter wirbt mit etwa drei Sekunden für eine normale und zwei Sekunden für eine Quick Entry; diese Werte sind **Anbieterangaben, nicht unabhängig gemessen**. Widgets, Wallet-/Shortcut-Integration und lokale Vorschläge verkürzen die Distanz zwischen Zahlung und Eintrag. Gestaltung und Apple-Plattformintegration sind im manuellen Segment besonders stark. CSV-Import und erweiterte Exporte werden auf der [Privacy-first-Seite](https://moneycoach.ai/privacy-first-budgeting-app) und im [App Store](https://apps.apple.com/us/app/moneycoach-budget-planner/id989642198) genannt.

**Schwächen.** Plattformbindung, uneinheitliche Tiefe bei Import/Export und optionale Bank-/KI-Funktionen verwässern die klare Privacy-Positionierung. Eine vollständige, nachvollziehbare Importvorschau und robuste Dublettenerkennung konnten nicht verifiziert werden. Langfristige Vermögens- und Verpflichtungsplanung ist weniger ausgeprägt als bei PocketSmith oder Monarch.

**Datenschutzmodell.** Laut [Privacy Policy](https://moneycoach.ai/privacy-policy) bleiben Finanzdaten grundsätzlich lokal und können optional verschlüsselt über iCloud synchronisiert werden. Zugleich nennt die Richtlinie optionale Bankanbindung, Firebase/Adjust und eine KI-basierte Transaktionsanreicherung, bei der Beschreibungen an einen Dienst gesendet werden. Die Formulierungen wirken teilweise widersprüchlich: Die KI-Funktion wird an einer Stelle als wesentlich/nicht deaktivierbar, an anderer als optional beschrieben. JSON-/CSV-Portabilität wird zugesagt. Diese Unklarheit ist ein Vertrauensrisiko, selbst wenn die technische Verarbeitung datensparsam ist.

**Geschäftsmodell.** Freemium mit Abonnement und In-App-Käufen; ein weltweit einheitlicher aktueller Listenpreis wurde nicht verifiziert.

**Nutzerkritik.** Ältere Store-Stimmen nennen manuellen Einrichtungsaufwand, Sync-Probleme und Exportwünsche. Neuere Versionshinweise dokumentieren Import-, Family-Sync- und Bankverbindungsverbesserungen, beweisen aber keine aktuelle Häufigkeit. **Evidenzstärke: niedrig und teilweise historisch.**

**Erkenntnis für FinanceOS.** MoneyCoach ist der wichtigste Benchmark für Freude und Geschwindigkeit bei manueller Eingabe. FinanceOS sollte diesen Anspruch plattformneutral übernehmen, aber seine Datenschutzgrenze einfacher formulieren: keine stille KI-Übertragung, keine uneindeutige „wesentlich/optional“-Logik und vollständiger Export aller Datenbeziehungen.

## 9. MoneyControl

**Positionierung und Zielgruppe.** MoneyControl von Primoco ist ein klassisches, manuell ausgerichtetes Haushaltsbuch für Nutzer, die ohne Bankverbindung arbeiten möchten. Die App unterstützt Konten, Kategorien, Personen, Gruppen, wiederkehrende Buchungen, Belege, Rechner, Auswertungen sowie PDF-/CSV-Ausgabe. Mobile Nutzung kann offline erfolgen; Web-/Gerätesynchronisierung ist optional ([Feature-Übersicht](https://primoco.me/en/features)).

**Stärkste Funktionen und UX.** Die Stärke ist ein überschaubares, bewährtes Eingabemodell: Transaktionen lassen sich mit wiederkehrenden Mustern, Shortcuts und Kontextfeldern erfassen. Es gibt keinen Zwang zur Bankanbindung und keine Produktvermittlung. Das macht MoneyControl zu einem guten Benchmark für die Erwartung „ein Haushaltsbuch funktioniert einfach und ohne Netzwerk“.

**Schwächen.** Dashboard, Vermögensbild und langfristige Planung bleiben funktionaler als bei Premium-Finanzzentralen. Importmapping, Dublettenprüfung, Massenbearbeitung und Review-Workflow sind öffentlich nicht in derselben Tiefe belegt wie bei PocketSmith oder Actual. Plattform- und Synchronisationsangebote wirken weniger einheitlich als ein konsequent gemeinsam entwickeltes iOS-/Android-/Web-System.

**Datenschutzmodell.** Primoco erklärt, Appdaten nicht zu verkaufen, für Werbung auszuwerten oder mit Banken zu verbinden, und nennt deutsche beziehungsweise europäische Server für optionale Onlinefunktionen ([Datenschutzinformation](https://primoco.me/en/info/privacy)). Die Seite ist rechtlich/inhaltlich nicht so aktuell und detailliert wie moderne Transparenzberichte. Ein lokaler Kern ist vorhanden; optionale Synchronisierung muss gesondert bewertet werden.

**Geschäftsmodell.** Die [Preisseite](https://primoco.me/en/price) nennt für Web 12 Euro für drei Monate, 18 Euro für sechs Monate und 28 Euro pro Jahr ohne automatische Verlängerung. Mobile Premiumfunktionen werden per dauerhaftem In-App-Kauf angeboten; der exakte regionale Preis ist nicht verifiziert.

**Nutzerkritik.** Im aktuellen [Google-Play-Eintrag](https://play.google.com/store/apps/details?id=com.priotecs.MoneyControl) finden sich einzelne Hinweise auf ein zeitweise defektes Dropbox-Backupzertifikat sowie Unzufriedenheit mit Premium/Support. **Evidenzstärke: niedrig** – relevante konkrete Fälle, aber kein belastbares, breites Muster.

**Erkenntnis für FinanceOS.** Die Lehre ist nicht, das klassische Haushaltsbuch zu kopieren, sondern dessen Verlässlichkeit und Bankfreiheit mit moderner Hierarchie, Review-Workflow, Importqualität, Barrierefreiheit und nachvollziehbarer Vermögensentwicklung zu verbinden.

## 10. Money Manager von Realbyte

**Positionierung und Zielgruppe.** Realbytes Money Manager ist ein weltweit verbreiteter manueller Finanztracker mit doppelter Buchungslogik, Budgets, Kalender, Statistiken, Vermögenswerten, Schulden und PC-Zugriff über WLAN. Der Anbieter nennt mehr als 20 Millionen Downloads ([Produktseite](https://realbyteapps.com/)); der [Google-Play-Eintrag](https://play.google.com/store/apps/details?id=com.realbyteapps.moneymanagerfree) weist mehr als zehn Millionen Installationen aus.

**Stärkste Funktionen und UX.** Für Vielerfasser ist die App effizient: Rechner, Kalender, wiederkehrende Buchungen, Konten- und Kategorienstruktur sowie Vermögens-/Schuldenfelder liegen nah beieinander. Die doppelte Buchungslogik und die Möglichkeit, Assets und Transfers sauber abzubilden, sind funktional stärker als bei vielen vereinfachten Budget-Apps. Backup/Wiederherstellung und Excel-Ausgabe werden öffentlich genannt.

**Schwächen.** Die Oberfläche ist dicht und eher werkzeug- als erklärungsorientiert. Onboarding, leere Zustände und Lernführung sind weniger hochwertig als bei modernen Premium-Produkten. Geräteübergreifende Synchronisierung ist uneinheitlich; Plattformen und Kaufmodelle unterscheiden sich. Ein kontrollierter Transaktionsimport mit Vorschau und erklärter Dublettenerkennung ist nicht in führender Qualität belegt.

**Datenschutzmodell.** Der manuelle Kern ist offline nutzbar und erfordert keine Bankverbindung. Der Play-Store-Datensicherheitsabschnitt – eine Entwickler-Selbstauskunft – nennt jedoch geteilte App-Aktivitäts-, Leistungs- und Geräte-ID-Daten sowie erhobene Personen-/Finanzdaten. Die kostenlose Version enthält Werbung. Damit ist die App lokal funktional, aber nicht so strikt werbe- und trackingfrei wie FinanceOS sein soll.

**Geschäftsmodell.** Kostenlose, werbefinanzierte Version plus Käufe/Premiumvarianten; der iOS-Eintrag nennt zusätzlich Sync-Abonnements. Regionale Preise und Funktionsparität unterscheiden sich und wurden nicht als einheitliches Modell verifiziert.

**Nutzerkritik.** Aktuelle Play-Stimmen loben gerade die manuelle, private Arbeitsweise, wünschen aber plattformübergreifenden Sync; weitere Einzelstimmen nennen Zifferneingabe- und Einführungsprobleme. Im [iOS App Store](https://apps.apple.com/us/app/money-manager-expense-budget/id560481810) treten ebenfalls Sync-/Einrichtungsfragen auf. **Evidenzstärke: mittel** für fragmentierte Synchronisation, **niedrig** für einzelne UI-Probleme.

**Erkenntnis für FinanceOS.** FinanceOS sollte die buchhalterische Korrektheit von Transfers, Assets und Schulden übernehmen, aber die Komplexität hinter progressiver Offenlegung verbergen. Werbung, plattformspezifische Funktionsmodelle und uneinheitliche Datenwege sind bewusst auszuschließen.

## 11. Wallet by BudgetBakers

**Positionierung und Zielgruppe.** Wallet ist eine breite, internationale Finanzplattform mit manueller Erfassung, optionaler Banksynchronisierung, Budgets, Zielen, Gruppenfreigabe, Multiwährung, Investments und Nettovermögen. Der Anbieter nennt CSV-, XLS- und OFX-Import sowie iOS, Android und Web ([Produktseite](https://budgetbakers.com/en/products/wallet/) und [Feature-Übersicht](https://budgetbakers.com/en/products/wallet/features/)).

**Stärkste Funktionen und UX.** Wallet ist beim Verhältnis aus Funktionsbreite, Plattformabdeckung und Import stark. Es bietet genügend Struktur für einfache Ausgaben ebenso wie für Konten, Vermögenswerte und gemeinsame Budgets. Das Onboarding erzeugt schnell ein vollständiges Bild, besonders mit Bankanbindung. Ein Lifetime-Angebot ist für Nutzer attraktiv, die Abonnements vermeiden möchten.

**Schwächen.** Die Breite führt zu einer dichteren Informationsarchitektur als bei Copilot. Ein Benutzerkonto ist laut Datenschutzrichtlinie erforderlich; „offline erfassen“ bedeutet nicht, dass Daten grundsätzlich lokal bleiben. Importqualität wird mit mehreren Formaten beworben, doch eine vollständig belegte Vorschau-/Rollback-Logik wurde nicht gefunden. Die Kombination aus manuellen Daten, Bankdaten, optionaler KI/OCR und Analysediensten ist schwerer verständlich als ein striktes Local-first-Versprechen.

**Datenschutzmodell.** Die am 1. April 2026 wirksame [Privacy Policy](https://budgetbakers.com/en/privacy) nennt serverseitig gespeicherte Finanzdaten, optionale Bankdaten, Standort, Kontakte, Bilder und Benachrichtigungsdaten, Offline-Erfassung mit späterem Upload sowie Google-, Mixpanel- und Sentry-Dienste. OpenAI kann optional für OCR-Verarbeitung eingesetzt werden. Der Anbieter erklärt, Finanzhistorie nicht zu verkaufen, und nennt ISO-27001-/GDPR-Ausrichtung. Strukturell bleibt es ein Cloudkonto mit umfangreicher Datenverarbeitung.

**Geschäftsmodell.** Kostenlose manuelle Basis, Premium-Abonnement und Lifetime-Kauf. Ein belastbarer, regionsübergreifend aktueller Preis wurde nicht verifiziert.

**Nutzerkritik.** Ältere Store-Stimmen nennen falsche/duplizierte Transaktionen und Missverständnisse rund um Lifetime-Funktionsumfang. **Evidenzstärke: niedrig und historisch**; nicht als aktuelles, quantifiziertes Muster zu behandeln.

**Erkenntnis für FinanceOS.** Zu übernehmen sind breite Formatunterstützung, Plattformparität und die Verbindung von Haushalt und Vermögen. FinanceOS sollte deutlich weniger Datenkategorien verarbeiten, kein Konto voraussetzen und jede optionale externe Aktion separat und verständlich auslösen lassen.

## 12. Goodbudget

**Positionierung und Zielgruppe.** Goodbudget digitalisiert die Umschlagmethode für Einzelpersonen und Haushalte. Das Produkt bietet iPhone, Android und Web, gemeinsame Budgets, manuelle Transaktionen und in den USA optionalen Bankimport ([Produktseite](https://goodbudget.com/) und [Leistungsübersicht](https://goodbudget.com/what-you-get/)).

**Stärkste Funktionen und UX.** Das mentale Modell ist leicht erklärbar: Geld wird vorab Umschlägen zugeordnet. Die gemeinsame Nutzung unterstützt Haushaltsabsprachen, und der Anbieter flankiert das Produkt mit Lernmaterial. QFX/OFX-Import im Web, automatisches Matching und CSV-Export werden im [Google-Play-Eintrag](https://play.google.com/store/apps/details?id=com.dayspringtech.envelopes) beschrieben. Für Nutzer, die genau diese Methode wollen, ist der Fokus eine Stärke.

**Schwächen.** Die Methode dominiert das Produkt und eignet sich weniger für eine neutrale Vermögenszentrale. Vermögenswerte, Investments und langfristige Entwicklungen sind nicht der Schwerpunkt. Geräte-/Historienlimits der Gratisversion und Cloudkonto erzeugen Lock-in-Anreize. Vollständige Offline-Funktion, lokale Verschlüsselung und barrierefreie Konformität sind nicht verifiziert.

**Datenschutzmodell.** Die [Privacy Policy](https://goodbudget.com/privacy-policy) beschreibt ein US-/AWS-basiertes Kontomodell, optional Plaid für Bankverbindungen, Datenspeicherung und Löschmöglichkeiten. Der Anbieter erklärt, Daten nicht zu verkaufen oder zu vermieten. Das bleibt ein synchronisierter Cloudservice.

**Geschäftsmodell.** Laut [Anmeldeseite](https://goodbudget.com/signup) bietet Free zehn reguläre und zehn jährliche Umschläge, ein Konto, zwei Geräte und ein Jahr Historie. Premium kostet 10 US-Dollar monatlich oder 80 US-Dollar jährlich und bietet unbegrenzte Umschläge/Konten, fünf Geräte und sieben Jahre Historie; Bank-Sync ist US-only.

**Nutzerkritik.** Eine aktuelle Play-Rezension beschreibt, dass eine automatische Umschlagauffüllung eine erwartete Zuweisung überschrieben habe. **Evidenzstärke: niedrig** – ein konkretes Beispiel, aber ein wichtiger Hinweis auf das Anti-Pattern versteckter Automatik. Die Gesamtwertung im Play Store liegt sichtbar unter vielen Wettbewerbern, erklärt jedoch nicht die Ursachen und wird deshalb nicht als Beleg für ein bestimmtes Problem verwendet.

**Erkenntnis für FinanceOS.** Umschläge können später als optionaler Budgetmodus sinnvoll sein. Automatisches Auffüllen oder Verschieben muss jedoch vorhersehbar, in einer Vorschau sichtbar und rückgängig sein. Historie und Gerätezahl dürfen nicht als Lock-in-Hebel gegen Datenportabilität wirken.

## 13. PocketSmith

**Positionierung und Zielgruppe.** PocketSmith positioniert sich als persönliche Finanzplanung mit Kalender, Szenarien, Cashflow-Prognose, Multiwährung, Nettovermögen, Regeln, flexiblen Budgets und stark anpassbaren Dashboards ([Produktseite](https://www.pocketsmith.com/)). Die Zielgruppe ist eher analytisch und langfristig orientiert als bei einem einfachen Ausgabentracker.

**Stärkste Funktionen und UX.** Forecasting ist der zentrale Differenziator: Je nach Tarif reichen Projektionen zehn, dreißig oder sechzig Jahre. Transaktionskalender, „Safe Balance“, Regeln, Rollovers und flexible Budgets verbinden operative Ausgaben mit Zukunftsplanung. Der Import unterstützt OFX, QFX, QIF und CSV mit Feldmapping, Datumsprüfung und speicherbaren Vorlagen ([Bankdatei-Hilfe](https://learn.pocketsmith.com/article/484-bank-files)). Eigene Migrationshilfen existieren für mehrere Wettbewerber ([Migration](https://learn.pocketsmith.com/article/258-moving-to-pocketsmith-from-another-personal-finance-app)).

**Schwächen.** Komplexität und Preis sind hoch. Die [Mobile-Dokumentation](https://learn.pocketsmith.com/article/515-mobile-apps) bezeichnet die Apps ausdrücklich als Begleiter und nicht als vollwertigen Ersatz für die Webversion. Beim Dublettenhandling kann das Ersetzen überlappender Datumsbereiche unerwartet wirken; falsch erkannte Datumsformate sind ein dokumentiertes Importproblem. Das Produkt ist cloudzentriert und nicht für vollständige Offline-Nutzung konzipiert.

**Datenschutzmodell.** PocketSmith nennt TLS, Verschlüsselung ruhender Daten, 2FA und Read-only-Aggregatoren, weist aber darauf hin, dass Daten nicht feldweise verschlüsselt sind und autorisierte Support-/Engineering-Mitarbeiter unter Umständen zugreifen können ([Security](https://www.pocketsmith.com/security/)). Die öffentliche [Privacy Policy](https://www.pocketsmith.com/legal/privacy-policy/) trägt ein Revisionsdatum von 2019 und ist damit für 2026 auffällig alt. Das bedeutet nicht automatisch mangelhaften Datenschutz, schwächt aber die Transparenz.

**Geschäftsmodell.** Laut aktueller [Preisseite](https://my.pocketsmith.com/plans) kostet Foundation 9,99 US-Dollar pro Monat bei Jahreszahlung beziehungsweise 14,95 monatlich, Flourish 16,66 beziehungsweise 24,95 und Fortune 26,66 beziehungsweise 39,95. Es gibt einen begrenzten Free-Tarif.

**Nutzerkritik.** Mehrere jüngere Rezensionen im [Google Play Store](https://play.google.com/store/apps/details?id=com.pocketsmith.app) beschreiben die mobile Oberfläche als komplex beziehungsweise gegenüber der Webversion eingeschränkt. **Evidenzstärke: mittel**, gestützt durch die offizielle Companion-Einordnung.

**Erkenntnis für FinanceOS.** PocketSmith ist der Benchmark für Zukunftskalender, Importvorlagen und langfristige Szenarien. FinanceOS sollte Prognosen erst später und immer mit sichtbaren Annahmen einführen. Mobile darf nie ein bloßer Viewer der „eigentlichen“ Web-App sein.

## 14. Quicken Simplifi

**Positionierung und Zielgruppe.** Simplifi ist eine US-/Kanada-zentrierte Cloud-Finanzzentrale für Bankaggregation, Spending Plan, Budgets, Ziele, Reports, Investments, geplante Rechnungen und projizierten Cashflow. Der Anbieter nennt mehr als 14.000 Finanzinstitute und Web-/Mobile-Nutzung ([Produktseite](https://www.quicken.com/products/simplifi/)).

**Stärkste Funktionen und UX.** Der „Spending Plan“ verbindet erwartete Einnahmen, Rechnungen, Abonnements, Ziele und frei verfügbares Geld. Das Dashboard besitzt elf Standardkacheln und lässt sich ausblenden beziehungsweise umsortieren ([Dashboard-Hilfe](https://support.simplifi.quicken.com/en/articles/3357180-getting-to-know-your-dashboard)). Eine [Reviewed-Spalte](https://support.simplifi.quicken.com/en/articles/5225070-using-the-reviewed-column) unterstützt kontrollierte Transaktionsprüfung. Kommende Belastungen und Cashflow werden verständlich in die operative Oberfläche integriert.

**Schwächen.** Import und Export zeigen deutliche Plattform- und Kontrollgrenzen. CSV-Import funktioniert nur im Web, verlangt ein starres `M/D/YY`-Datumsformat und ein festes Template; eine bereits importierte und danach gelöschte Transaktionsmenge kann nicht erneut aus derselben Datei importiert werden ([Import-Hilfe](https://support.simplifi.quicken.com/en/articles/4413430-how-to-manually-import-transactions-in-quicken-simplifi)). Export ist ebenfalls webbasiert; CSV lässt Splitdetails standardmäßig aus, Berichte können CSV/PDF ausgeben ([Export-Hilfe](https://support.simplifi.quicken.com/en/articles/3404263-how-to-export-transactions-from-quicken-simplifi)). Ein Offline-Kern ist nicht dokumentiert.

**Datenschutzmodell.** Die [US Privacy Statement](https://www.quicken.com/privacy-us/us/) nennt Identitäts-, Finanz-, Login-, Transaktions-, Kontakt- und Nutzungsdaten sowie Analyse-, Marketing-, Partner- und Cross-Service-Technologien. Sicherheitsmaßnahmen werden beschrieben, die Aufbewahrungslogik bleibt situationsabhängig. Das ist ein klassischer Cloud-/Aggregatorbetrieb und keine Privacy-first-Architektur.

**Geschäftsmodell.** Zum Stichtag bewirbt Quicken 2,99 US-Dollar pro Monat, jährlich abgerechnet, als zeitlich begrenzten Erstjahrespreis; regulär werden 5,99 US-Dollar genannt, Aktion laut Seite bis 13. August 2026 ([Produktseite](https://www.quicken.com/products/simplifi/)).

**Nutzerkritik.** Sichtbare aktuelle [Google-Play-Rezensionen](https://play.google.com/store/apps/details?id=com.quicken.acme) nennen einzelne Probleme mit Rechnungssynchronisierung, Support/Erstattung und einen starken Preisanstieg nach der Einführungsphase. **Evidenzstärke: niedrig bis mittel** – konkrete aktuelle Fälle, aber keine repräsentative Auswertung.

**Erkenntnis für FinanceOS.** Spending Plan, Reviewed-Status und kommende Belastungen sind starke Muster. Starre, web-only und teilweise irreversible Import-/Exportlogik ist ein klares Gegenbild: FinanceOS muss Vorschau, erneuten Import, Rollback und Plattformparität garantieren.

## 15. Toshl Finance

**Positionierung und Zielgruppe.** Toshl verbindet schnelle manuelle Erfassung mit optionaler Banksynchronisierung, Budgets, Planung, Multiwährung und breit angelegtem Import/Export auf iOS, Android und Web. Der Anbieter wirbt mit manueller Eingabe in vier Berührungen und acht Importformaten ([Produktseite](https://toshl.com/) und [Preisseite](https://toshl.com/pricing/)).

**Stärkste Funktionen und UX.** Toshl ist im manuellen Workflow und bei Portabilität stark. Bereits der Gratisplan enthält Import und CSV-Export; Pro ergänzt wiederkehrende Einträge, Erinnerungen, Planung, Belege sowie CSV/PDF/Excel-Ausgaben. Die verspielte visuelle Identität senkt für manche Nutzer die Hemmschwelle gegenüber Finanzverwaltung. Mehrere Währungen und flexible Tags unterstützen komplexere Lebenssituationen.

**Schwächen.** Die verspielte Tonalität passt nicht zu jedem Nutzer und nicht ohne Weiteres zur angestrebten Ruhe von FinanceOS. Vollständiger Offline-Betrieb und lokale Datenhaltung sind nicht gegeben. Die letzten öffentlich sichtbaren Store-Updates lagen Ende 2024; das ist gegenüber dem Recherchezeitpunkt 2026 ein Wartungs- und Zukunftssignal, ohne allein einen Produktmangel zu beweisen.

**Datenschutzmodell.** Die [Privacy Policy](https://toshl.com/privacy/) trägt den Stand 11. Mai 2023 und nennt Konto-, Nutzungs-, Standort- und Bilddaten, Firebase/Google/Kissmetrics, Marketing-/Werbetechnologien, Bankdienstleister, Serververschlüsselung und möglichen Mitarbeiterzugriff für Support. Der Anbieter erklärt, Daten nicht zu verkaufen, und bietet eine umfangreiche CSV-/Bild-/Metadatenportabilität sowie API. Die Richtlinie ist funktional detailliert, aber 2026 nicht aktuell genug.

**Geschäftsmodell.** Free sowie Pro und Medici. In den aktuellen Store-Preisangaben werden für Pro 2,99 US-Dollar monatlich oder 19,99 jährlich und für Medici 4,99 beziehungsweise 39,99 genannt; regionale Preise können abweichen. Die Webseite selbst stellte die Werte beim Abruf nicht zuverlässig dar.

**Nutzerkritik.** Sichtbare Kritik zu Synchronisationsverzögerungen und Abstürzen ist überwiegend älter; eine aktuelle wiederkehrende Nutzerkritik wurde nicht belastbar verifiziert. Der ältere Update-Stand ist ein objektives Produktsignal, aber kein Ersatz für Nutzerbelege.

**Erkenntnis für FinanceOS.** Toshl zeigt, dass manuelle Eingabe und starke Portabilität massenmarkttauglich sein können. FinanceOS sollte die kurze Erfassung und Formatbreite übernehmen, aber eine ruhigere Sprache, aktuellere Transparenz und einen vollständig lokalen Datenpfad bieten.

## Querschnitt: wiederkehrende Nutzerprobleme nach Evidenzstärke

| Muster | Beleglage | Betroffene Beispiele | Bedeutung für FinanceOS |
|---|---|---|---|
| Lernkurve bei methodischem Budgetieren | Mittel | YNAB; teilweise Goodbudget | Methode optional machen, Begriffe im Kontext erklären, Demo statt Pflichtkurs |
| Sync-/Aggregatorfriktion | Mittel | Monarch, Copilot, Simplifi, Realbyte; systembedingt auch andere Aggregatoren | Kein Bank-Sync beseitigt eine Fehlerklasse; Dateiimport und Backup müssen dafür außerordentlich robust sein |
| Mobile Funktionslücke | Mittel bis hoch | PocketSmith offiziell als Companion; Copilot ohne Android | Plattformparität als Release-Gate, Unterschiede transparent dokumentieren |
| Export-/Portabilitätslücken | Mittel | Simplifi offiziell eingeschränkt; Copilot aktuelle Einzelkritik | Vollständiges, dokumentiertes Exportmodell und Roundtrip-Tests |
| Versteckte oder überraschende Automatik | Niedrig, aber risikoreich | Goodbudget-Einzelbeispiel; automatische Kategorisierung allgemein | Vorschau, Herkunftskennzeichen, Bestätigung und Undo |
| Preis-/Abofriktion | Niedrig bis mittel | YNAB, Simplifi, Monarch, Outbank | Klarer Listenpreis, keine Lockangebote ohne Folgepreis, Export nie hinter Kündigungsbarriere |
| Komplexe oder dichte Oberfläche | Mittel | PocketSmith; Realbyte als fachliche Bewertung | Progressive Offenlegung und kuratiertes Default-Dashboard |
| Veraltete Datenschutz-/Produktkommunikation | Objektiv belegt | PocketSmith Policy 2019; Toshl Policy 2023/Store-Updates 2024 | Jede Policy versionieren, Änderungsverlauf und Datenflussdiagramm pflegen |

---

# E. Best-Practice-Katalog

Die folgenden Prinzipien sind Muster, keine Vorlagen zum Kopieren. FinanceOS sollte Informationsprinzipien übernehmen, aber visuelle Ausführung, Texte, Interaktionen und Komponenten eigenständig entwickeln.

## 1. Review-Inbox statt unsichtbarer „Magie“

- **Gute Referenzen:** Monarchs „Needs review“, Simplifis Reviewed-Spalte und MoneyCoachs Reviewed-Status.
- **Warum es funktioniert:** Automatik spart Arbeit, ohne die Entscheidungshoheit zu verschleiern. Der Nutzer erkennt, welche Daten bestätigt und welche nur vorgeschlagen sind.
- **FinanceOS besser:** Jede importierte, regelbasierte oder unsichere Änderung erhält Herkunft, Konfidenz und Status. Batch-Bestätigung ist möglich; eine Änderung kann einzeln oder als Gruppe rückgängig gemacht werden. Review-Filter zeigen „neu“, „unklar“, „Konflikt“, „geändert“ und „geprüft“.

## 2. Rückgängig als Sicherheitsnetz, nicht nur als Komfort

- **Gute Referenz:** Actual nennt Undo/Redo als Kernfunktion ([Produktseite](https://actualbudget.org/)).
- **Warum es funktioniert:** Nutzer experimentieren eher mit Regeln, Massenbearbeitung und Planung, wenn Fehler nicht endgültig sind.
- **FinanceOS besser:** Sofortiges Undo nach Einzelaktionen plus lokales Operationsprotokoll für Importe, Massenänderungen und Regelanwendungen. Eine Rücknahme zeigt vorab, was betroffen ist. Backups ersetzen Undo nicht.

## 3. Manuelle Erfassung als Hochgeschwindigkeitsworkflow

- **Gute Referenzen:** MoneyCoach mit Shortcuts/Siri, Realbyte mit Rechner/Kalender und Toshl mit kurzer Erfassungsfolge.
- **Warum es funktioniert:** Die tägliche Kostenbarriere wird gesenkt; die App passt sich an wiederkehrende reale Situationen an.
- **FinanceOS besser:** Betrag ist sofort fokussiert; Konto, Kategorie, Empfänger und Datum erhalten ausschließlich lokale, kontextabhängige Vorschläge. Nur Betrag und Konto sind zwingend, sofern der Nutzer andere Felder nicht als Pflicht definiert. Vorlagen, Favoriten, Duplizieren, Splitten und Wiederholen liegen in derselben Logik. Speichern bestätigt subtil und bietet sofort Undo.

## 4. Importmapping mit wiederverwendbaren Vorlagen

- **Gute Referenzen:** PocketSmiths speicherbare Mappingvorlagen und Formatprüfung ([Importhilfe](https://learn.pocketsmith.com/article/484-bank-files)); Actuals Formatbreite; Toshl und Wallet mit mehreren Dateiformaten.
- **Warum es funktioniert:** Der zweite Import derselben Quelle wird schnell, ohne dass der erste Import blind erfolgen muss.
- **FinanceOS besser:** Quelldatei wird zunächst unverändert gehasht und analysiert. Der Nutzer sieht erkannte Kodierung, Trennzeichen, Dezimal-/Datumsformat, Spaltenzuordnung, Validierungsfehler und Dublettenklassen. Vorlagen gehören dem Nutzer, sind exportierbar und können vor Anwendung geprüft werden.

## 5. Flexible Planung ohne Methoden-Zwang

- **Gute Referenzen:** Monarchs alternative Budgetansichten, Simplifis Spending Plan und PocketSmiths flexible Budgets/Rollovers.
- **Warum es funktioniert:** Beobachter, Planer und methodische Budgetierer brauchen unterschiedliche mentale Modelle.
- **FinanceOS besser:** Ein gemeinsames Datenmodell trägt mehrere Sichten: Kategorielimits, verfügbare Beträge, Umschläge und einfache Beobachtung. Eine Ansicht verändert nicht still die zugrunde liegenden Transaktionen. Jede Planungszahl zeigt Zeitraum, einbezogene Konten, geplante Buchungen und Übertragsregel.

## 6. Zukunftskalender und sichere Vorschau

- **Gute Referenzen:** PocketSmiths Kalender und Langfristprojektion, Copilots Upcoming-Bereich, Simplifis projected cash flow.
- **Warum es funktioniert:** Nutzer sehen nicht nur Vergangenes, sondern die Auswirkung bekannter Verpflichtungen.
- **FinanceOS besser:** Prognosen trennen **gebucht**, **bestätigt geplant**, **wiederkehrend erwartet** und **Szenario** visuell und semantisch. Keine einzelne Zukunftszahl erscheint ohne Annahmen. Unsicherheit wird als Band oder Szenario, nicht als scheinpräziser Kontostand gezeigt.

## 7. Kuratiertes, anpassbares Dashboard

- **Gute Referenzen:** Monarch, Copilot und PocketSmith; Simplifi dokumentiert ausblendbare und sortierbare Kacheln ([Dashboard-Hilfe](https://support.simplifi.quicken.com/en/articles/3357180-getting-to-know-your-dashboard)).
- **Warum es funktioniert:** Die Standardansicht beantwortet häufige Fragen, während fortgeschrittene Nutzer priorisieren können.
- **FinanceOS besser:** Maximal vier primäre Bereiche in der ersten Bildschirmhöhe; Anpassung ist optional. Jede Kachel hat Leerzustand, Datenzeitraum, Kontenumfang und „So berechnet“-Zugang. Das Dashboard zeigt keine Verkaufsflächen und keine künstlichen Dringlichkeiten.

## 8. Lokaler Datentresor mit verständlichen Grenzen

- **Gute Referenzen:** Outbanks lokales Sicherheitsmodell und Actuals transparente Dokumentation lokaler sowie synchronisierter Daten.
- **Warum es funktioniert:** Datenschutz wird als Datenfluss und nicht als abstraktes Versprechen verständlich.
- **FinanceOS besser:** Eine in der App lesbare Datenflussansicht zeigt: lokale Datenbank, lokaler Schlüssel, bewusst gewählter Dateiimport, bewusst gewählter Export/Backup und keinerlei Betreibercloud. Wenn der Nutzer ein fremdes Cloudlaufwerk als Ziel auswählt, wird genau dieser Übergang erklärt. „Lokal“ und „verschlüsselt“ werden nicht gleichgesetzt.

## 9. Transparente Barrierefreiheit mit bekannten Grenzen

- **Gute Referenzen:** YNAB nennt Zielstandard, Testdatum und offene Textskalierungsgrenzen; Finanzguru nennt konkrete unterstützte Mechanismen.
- **Warum es funktioniert:** Messbare Aussagen schaffen mehr Vertrauen als „barrierearm“ ohne Prüfbasis.
- **FinanceOS besser:** Öffentliche, versionierte Konformitätserklärung gegen WCAG 2.2 AA; dokumentierte Screenreader-, Tastatur-, Kontrast-, Textskalierungs- und Reduced-Motion-Tests pro Plattform. Diagramme haben tabellarische oder textliche Alternativen.

## 10. Vollständige Portabilität auf zwei Ebenen

- **Gute Referenzen:** Actual mit offenen Formaten/API, PocketSmith mit Migrationsimporten und Toshl mit CSV/Bildern/Metadaten/API.
- **Warum es funktioniert:** Nutzer können den Dienst verlassen, prüfen und wiederherstellen; das senkt die Angst vor Bindung.
- **FinanceOS besser:** CSV ist eine lesbare Teilansicht; versioniertes JSON enthält den vollständigen Graphen aus Konten, Transaktionen, Splits, Transfers, Kategorien, Regeln, Budgets, Zielen und Metadaten. Ein verschlüsseltes Vollbackup enthält zusätzlich Einstellungen und Anhänge. Export ist jederzeit und ohne aktives Abo möglich, sofern das Geschäftsmodell später ein Abo nutzt.

## 11. Plattform-native Qualität bei gemeinsamem Produktmodell

- **Gute Referenzen:** Copilot und MoneyCoach im Apple-Ökosystem.
- **Warum es funktioniert:** Navigation, Eingabeverhalten, Menüs, Shortcuts und Typografie fühlen sich erwartbar an.
- **FinanceOS besser:** Gemeinsame Semantik und Feature-Parität, aber plattformgerechte Ausführung nach Apple HIG und Material Design. Keine pixelgleiche Oberfläche über alle Plattformen; keine fachlichen Unterschiede bei Daten, Import, Export oder Berechnungen.

## 12. Ein sinnvoller Start ohne echte Finanzdaten

- **Gute Teilreferenz:** Premium-Apps erklären ihre Oberfläche über gefüllte Dashboards; methodische Apps nutzen Lerninhalte.
- **Warum es funktioniert:** Ein leeres Finanzprodukt erklärt seinen Wert schlecht.
- **FinanceOS besser:** Lokales, klar als Beispiel gekennzeichnetes Demoprofil kann ohne Konto oder Netzwerk geöffnet und restlos verworfen werden. Alternativ führt ein dreiminütiger Assistent zu einem ersten Konto, Anfangssaldo und drei Beispielbuchungen. Niemals werden Demodaten mit echten Daten vermischt.

---

# F. Anti-Pattern-Katalog

## 1. Versteckte Automatik

**Problem:** Kategorien, Budgets oder wiederkehrende Beträge ändern sich ohne klaren Ursprung. Eine aktuelle Goodbudget-Einzelstimme zum unerwarteten Auto-Fill illustriert das Risiko ([Google Play](https://play.google.com/store/apps/details?id=com.dayspringtech.envelopes)).<br>
**Folge:** Nutzer verlieren Vertrauen in Summen und korrigieren dieselben Fehler mehrfach.<br>
**FinanceOS-Regel:** Vorschläge sind als Vorschläge markiert. Regelname, Zeitpunkt, betroffene Felder und Undo sind sichtbar. Keine Regel wird durch eine einzelne Korrektur still dauerhaft gelernt.

## 2. Scheingenauigkeit bei Kennzahlen und Prognosen

**Problem:** „Verfügbar“, „Safe Balance“, Vermögensänderung oder Forecast erscheinen als einzelne exakte Zahl, obwohl Filter, ausstehende Buchungen, Währungen und Annahmen verborgen sind.<br>
**Folge:** Die Oberfläche sieht kompetent aus, kann aber falsche Entscheidungen begünstigen.<br>
**FinanceOS-Regel:** Jede Aggregation nennt Zeitraum, Datenstand, Kontenumfang, Währungslogik und Unsicherheiten. Prognose ist nie mit gebuchtem Ist-Zustand gleich gestaltet.

## 3. Irreversibler oder überraschender Import

**Problem:** Simplifi erlaubt laut eigener [Importhilfe](https://support.simplifi.quicken.com/en/articles/4413430-how-to-manually-import-transactions-in-quicken-simplifi) keine erneute Übernahme bereits importierter und später gelöschter Transaktionen aus derselben Datei. PocketSmith dokumentiert ersetzende Operationen in überlappenden Zeiträumen.<br>
**Folge:** Der Nutzer versteht nicht, ob Daten fehlen, ersetzt oder dupliziert wurden.<br>
**FinanceOS-Regel:** Kein Schreiben vor expliziter Bestätigung; Vorschau ist vollständig; Import erhält eine ID; gesamter Import ist atomar rücknehmbar; derselbe Datensatz kann nach bewusster Entscheidung erneut verarbeitet werden.

## 4. Daten-Lock-in durch Teil-Export

**Problem:** CSV nur im Web, fehlende Splits, fehlende Anhänge, kein Export von Regeln/Budgets oder keine gefilterte Ausgabe. Simplifis dokumentierter Export ist ein Beispiel.<br>
**Folge:** Der Nutzer kann Zahlen lesen, aber den vollständigen Zustand weder migrieren noch beweissicher archivieren.<br>
**FinanceOS-Regel:** Menschenlesbarer Export plus maschinenlesbarer Voll-Export plus getestetes Restore. Portabilität ist keine Premium-Zusatzfunktion.

## 5. Erzwungene Bankanbindung

**Problem:** Ein vermeintlich optionaler „Überspringen“-Pfad liefert danach kaum Nutzen oder wird wiederholt mit Verbindungshinweisen unterbrochen.<br>
**Folge:** Datenschutzbewusste Nutzer fühlen sich als Randfall und brechen ab.<br>
**FinanceOS-Regel:** Es gibt keinerlei Bankanbindung. Onboarding, Dashboard und Hilfe sind von Beginn an für manuelle Daten und Dateien entworfen.

## 6. Betreibercloud als unsichtbarer Standard

**Problem:** „Offline erfassbar“ wird mit „lokal gespeichert“ verwechselt, obwohl Daten später automatisch zum Anbieter hochgeladen werden. Wallet beschreibt Offline-Erfassung mit späterem Upload in seiner [Privacy Policy](https://budgetbakers.com/en/privacy).<br>
**Folge:** Das tatsächliche Datenmodell widerspricht der Nutzererwartung.<br>
**FinanceOS-Regel:** Netzwerklose Nutzung ist der Normalzustand. Ein Export in iCloud, Google Drive, Dropbox oder einen anderen Ort ist eine bewusst gestartete Betriebssystemaktion, keine FinanceOS-Synchronisierung.

## 7. Marketing, Vertragsvermittlung und Verkauf im Finanzkontext

**Problem:** Empfehlungen, Cashback, Versicherungs- oder Kündigungsstrecken konkurrieren mit der neutralen Übersicht. Finanzguru zeigt die geschäftliche Nähe solcher Funktionen auf der [Produktseite](https://finanzguru.de/).<br>
**Folge:** Nutzer können nicht sicher unterscheiden, ob ein Hinweis ihrer Finanzlage oder einem Vertriebsinteresse dient.<br>
**FinanceOS-Regel:** Keine Werbung, keine Affiliate-Links, kein Leadverkauf, keine Produktvermittlung, keine manipulativen Upgrade-Hinweise im Finanzworkflow.

## 8. Überladenes Dashboard

**Problem:** Viele Kacheln, Statusfarben, Trends und Empfehlungen stehen gleichrangig nebeneinander. Selbst bei anpassbaren Dashboards entsteht zunächst kognitive Last.<br>
**Folge:** Wichtiges wird nicht schneller, sondern schwerer gefunden.<br>
**FinanceOS-Regel:** Kuratierter Standard, progressive Offenlegung, maximal eine primäre Aussage pro Karte und ein zentraler Review-Hinweis statt mehrerer Warnflächen.

## 9. Plattformhierarchie

**Problem:** Wesentliche Funktionen wie Import, Export oder Konfiguration existieren nur im Web; Mobile ist Begleiter. PocketSmith beschreibt seine Apps ausdrücklich so ([Mobile-Hilfe](https://learn.pocketsmith.com/article/515-mobile-apps)); Simplifi beschränkt Import/Export auf Web.<br>
**Folge:** Nutzer wissen nicht, wo eine Aufgabe erledigt werden kann, und fühlen sich mobil eingeschränkt.<br>
**FinanceOS-Regel:** Datenkritische Kernaufgaben sind auf allen Plattformen verfügbar. Abweichungen wegen Betriebssystemgrenzen werden vorab dokumentiert und nicht als dauerhafte Produktstrategie akzeptiert.

## 10. Unklare Abos und Lockpreise

**Problem:** Einführungspreis, Monatsäquivalent bei Jahresbindung und regulärer Folgepreis werden visuell unterschiedlich gewichtet. Simplifi bewirbt 2,99 US-Dollar monatlich, fakturiert aber jährlich und nennt 5,99 US-Dollar regulär ([Produktseite](https://www.quicken.com/products/simplifi/)).<br>
**Folge:** Preisvertrauen sinkt unabhängig vom eigentlichen Wert.<br>
**FinanceOS-Regel:** Gesamtbetrag, Abrechnungsintervall, Folgepreis, Kündigung und Leistungsgrenzen stehen gleich sichtbar. Kein Countdown und keine künstliche Verknappung.

## 11. Datenschutztext ohne aktuellen Datenfluss

**Problem:** Eine alte oder abstrakte Richtlinie erklärt moderne KI-, Analyse- oder Sync-Pfade nicht. PocketSmiths Richtlinie ist von 2019, Toshls von 2023.<br>
**Folge:** Nutzer und Projektteam können die reale Verarbeitung nicht sicher mit dem Versprechen abgleichen.<br>
**FinanceOS-Regel:** Versionierte Datenflussmatrix und Netzwerk-Allowlist gehören zur Release-Dokumentation; jede neue externe Kommunikation braucht Projektleitungs- und Security-Freigabe.

## 12. „Lokal“ ohne Backup- und Schlüsselkonzept

**Problem:** Lokale Daten können durch Geräteverlust, gelöschten Browser-Speicher oder verlorene Schlüssel endgültig verschwinden. Actual warnt ausdrücklich vor dem Browser-Speicherrisiko ([Installationshinweise](https://actualbudget.org/docs/install/)).<br>
**Folge:** Privacy wird mit geringerer Zuverlässigkeit bezahlt.<br>
**FinanceOS-Regel:** Backup-Einrichtung wird respektvoll erklärt, Restore regelmäßig testbar gemacht und Schlüsselverlust ehrlich beschrieben. Kein falsches Versprechen „Daten können nie verloren gehen“.

## 13. Gamification, Scham und manipulative Warnungen

**Problem:** Rote Alarme, Streaks, Schuld-Sprache oder künstliche Dringlichkeit sollen Verhalten erzwingen.<br>
**Folge:** Finanzstress steigt; Nutzer meiden die App oder optimieren auf die Darstellung statt auf ihre Ziele.<br>
**FinanceOS-Regel:** Neutraler Ton, keine Streaks, keine Konfetti-Pflicht, keine moralische Wertung. Überschreitungen werden als Information mit Handlungsoptionen erklärt.

## 14. Farbe als alleiniger Bedeutungsträger

**Problem:** Einnahme/Ausgabe, positiv/negativ oder geprüft/ungeprüft werden nur über Grün/Rot vermittelt.<br>
**Folge:** Sehbehinderte, farbfehlsichtige und Screenreader-Nutzer verlieren Information.<br>
**FinanceOS-Regel:** Text, Vorzeichen, Icons/Shapes und Semantik ergänzen Farbe. Für Android nennt die aktuelle [Accessibility-Dokumentation](https://developer.android.com/guide/topics/ui/accessibility/apps) mindestens 4,5:1 Kontrast für normalen Text und 48-dp-Touchziele; Apple empfiehlt mindestens 44 × 44 pt in den [UI Design Tips](https://developer.apple.com/design/tips/).

---

# G. Differenzierungsstrategie

## Positionierung

**Kategorie:** Private Finanzzentrale für selbst kontrollierte Daten.<br>
**Kernbotschaft:** **„FinanceOS ist die ruhige Finanzzentrale, die dir gehört.“**<br>
**Unterzeile:** Ausgaben, Budgets, Vermögen und Verpflichtungen professionell verstehen – vollständig offline, ohne Bankzugang, Werbung oder Betreibercloud.

Diese Positionierung sollte nicht auf „weniger Funktionen aus Datenschutzgründen“ hinauslaufen. Sie verspricht eine andere Form von Qualität:

- **Kontrolle:** Der Nutzer entscheidet, welche Datei wann gelesen und wohin exportiert wird.
- **Erklärbarkeit:** Jede Kennzahl ist auf Quellen, Filter und Formel zurückführbar.
- **Ruhe:** Keine Werbung, Produktvermittlung, Streaks oder künstliche Dringlichkeit.
- **Langlebigkeit:** Vollständige Exporte und testbare Backups verhindern Abhängigkeit.
- **Handwerk:** Manuelle Eingabe und Korrektur sind schneller und sicherer als bei bankzentrierten Apps.

## Warum FinanceOS statt …?

### … Finanzguru?

Finanzguru gewinnt bei automatischem Sofortnutzen aus Bankdaten und Vertragserkennung. FinanceOS gewinnt, wenn der Nutzer keine Kontozugänge teilen und keine serverseitige Analyse oder Finanzproduktvermarktung möchte. Der konkrete Vorteil ist nicht abstrakt „mehr Datenschutz“, sondern:

- kein Bank-/Brokerzugang und keine Betreiberverarbeitung persönlicher Finanzdaten,
- keine verkaufsnahen Vertrags-, Versicherungs- oder Cashback-Flächen,
- vollständig kontrollierter Import vor dem Speichern,
- jede Kategorie, Regel und Kennzahl ist sichtbar, korrigierbar und rückgängig,
- vollständiger Offline-Betrieb.

**Ehrliche Grenze:** FinanceOS kann ohne Nutzeraktion keine tagesaktuellen Bankstände oder automatische Vertragserkennung versprechen.

### … Outbank?

Outbank ist ein starker lokaler Multibanking-Benchmark. FinanceOS differenziert sich nicht mit einer pauschalen Behauptung „privater“, sondern mit einem anderen Zweck:

- keinerlei Verarbeitung von Bankzugängen,
- tiefere Budget-, Verpflichtungs-, Ziel- und Vermögensplanung,
- gleichwertige Web-, iOS- und Android-Workflows,
- Dateiimport als erstklassiger, prüfbarer Prozess,
- Erklärschicht für jede aggregierte Zahl.

**Ehrliche Grenze:** Wer viele Banken automatisch in einer App abrufen oder Zahlungen auslösen will, ist bei Outbank besser aufgehoben.

### … YNAB?

YNAB ist für Nutzer stark, die eine konsequente Methode und Lernführung wollen. FinanceOS sollte gewinnen bei Nutzern, die:

- keine einzelne Budgetmethode erzwungen bekommen möchten,
- Vermögen, Schulden, Verpflichtungen und Entwicklung gleichrangig sehen wollen,
- vollständig lokal und ohne Anbieteraccount arbeiten möchten,
- deutschsprachige Begriffe und lokale Dateiquellen benötigen,
- Planung als ruhige Option statt als tägliches Verhaltensprogramm verstehen.

**Ehrliche Grenze:** FinanceOS darf nicht behaupten, YNABs erprobte Verhaltensmethode oder Bildungsökosystem sofort zu ersetzen.

### … MoneyCoach oder MoneyControl?

Diese Apps belegen, dass manuelle Finanzverwaltung funktioniert. FinanceOS muss erkennbar mehr bieten:

- konsistente Premium-Qualität auf iPhone, Android und Web,
- leistungsfähige Importvorschau und Dublettenerkennung,
- Review-Inbox, Batch-Bearbeitung und mehrstufiges Undo,
- nachvollziehbare Vermögens- und Verpflichtungsentwicklung,
- verbindliche Barrierefreiheits- und Performancebudgets,
- vollständiger, dokumentierter Datenexport statt einzelner Tabellen.

**Ehrliche Grenze:** Ein etabliertes, einfaches Haushaltsbuch kann für Nutzer mit wenigen Buchungen günstiger und ausreichend sein.

### … eine Tabellenkalkulation?

Eine Tabelle ist transparent und portabel, verlangt aber selbst gebaute Struktur, Formeln und mobile Eingabe. FinanceOS bietet einen konkreten Mehrwert durch:

- korrekt modellierte Konten, Transfers, Splits, wiederkehrende Buchungen, Budgets, Vermögenswerte und Schulden,
- schnelle mobile Eingabe mit lokalen Vorschlägen,
- kontrolliertes Mapping verschiedener Dateien und Dublettenprüfung,
- atomare Änderungen, Undo, Änderungsverlauf und Restore,
- zugängliche, responsive Diagramme mit konsistenter Berechnungslogik,
- automatische, aber lokale Ableitungen ohne Formelpflege.

FinanceOS sollte zugleich die Stärke der Tabelle respektieren: Daten und Rechenweg bleiben exportierbar und prüfbar.

## Kernzielgruppe

Am stärksten profitiert eine **privacy-bewusste, aktiv mitdenkende Person oder ein Haushalt**, der mehrere Konten, Bargeld, Vermögen, Schulden und regelmäßige Verpflichtungen überblicken will, aber Bankzugänge nicht an Dritte geben möchte. Typische Merkmale:

- Bereitschaft zu kurzer manueller Pflege oder periodischem Dateiimport,
- Wunsch nach hochwertiger Übersicht statt klassischer Buchhaltungsoptik,
- Wertschätzung von Eigentum, Export und langfristiger Verfügbarkeit,
- Bedarf an Planung ohne Scham, Verkaufsdruck oder Gamification,
- mehrere Finanzbereiche, für die eine einfache Ausgabenliste nicht genügt.

## Bewusst nicht primäre Zielgruppen

- Nutzer, die ausschließlich vollautomatische Live-Salden wünschen,
- Nutzer, die Zahlungen oder Verträge direkt aus der App abschließen/wechseln wollen,
- aktive Trader, die Echtzeitkurse und Steuerberechnung erwarten,
- Unternehmen mit vollständiger Buchhaltung, Rechnungswesen und regulatorischem Reporting,
- Nutzer, die persönliche Finanzberatung oder Renditeversprechen suchen.

## Glaubwürdige Versprechen

FinanceOS kann – nach technischer Umsetzung und Tests – glaubwürdig versprechen:

1. Die Kernfunktionen starten und arbeiten ohne Netzwerk.
2. FinanceOS fordert keine Bank- oder Brokerzugänge an.
3. Persönliche Finanzdaten werden nicht auf FinanceOS-Servern gespeichert.
4. Es gibt keine Werbung, Affiliate-Vermittlung oder verhaltensbasierte Nachverfolgung.
5. Exporte und Backups werden nur durch eine bewusste Nutzeraktion ausgelöst.
6. Jede berechnete Zahl lässt sich auf Daten, Zeitraum, Filter und Formel zurückführen.
7. Der Nutzer kann seine vollständigen Daten in dokumentierten Formaten exportieren und wiederherstellen.
8. Automatische lokale Vorschläge verändern Daten nicht unsichtbar und sind umkehrbar.

## Versprechen, die FinanceOS nicht geben darf

- „Daten können niemals verloren gehen.“ Lokale Daten bleiben ohne erfolgreiches Backup verlierbar.
- „Absolut sicher“ oder „unknackbar“. Sicherheit ist ein überprüfter Prozess, keine absolute Eigenschaft.
- „Immer aktuell“. Ohne Bankverbindung ist der Stand nur so aktuell wie Eingabe oder Import.
- „Perfekte Dublettenerkennung“ oder „fehlerfreie Kategorisierung“. Unsicherheit muss gezeigt werden.
- „Vollständig anonym“, wenn Store, Lizenzierung, Support oder freiwillige externe Exporte Metadaten erzeugen.
- „Keine Netzwerkkommunikation“, falls Lizenzprüfung, Update, Support oder freiwillige Dienste später Netzwerk nutzen. Stattdessen braucht es eine präzise Allowlist.
- „Finanzberatung“, „garantierte Einsparung“ oder Rendite-/Schuldenfreiheitsgarantien.
- „Unterstützt jedes Bankformat“. Unterstützte Formate und Varianten müssen versioniert angegeben werden.

## Verteidigbarer Produktvorteil

Der langfristige Wettbewerbsvorteil ist keine einzelne Funktion. Er entsteht aus einem zusammenhängenden Qualitätsvertrag:

> **Lokale, portable Daten + hervorragende manuelle/Datei-Workflows + lückenlose Erklärbarkeit + ruhiges plattformübergreifendes Design.**

Jeder Teil verstärkt die anderen. Ein lokales Produkt ohne Backup ist riskant; ein schöner Tracker ohne Import ist arbeitsintensiv; ein Dashboard ohne Erklärbarkeit ist dekorativ; ein Export ohne vollständiges Datenmodell ist scheinbare Portabilität. FinanceOS muss die Kombination als System liefern.

---

# H. Competitive Product Standard für FinanceOS

**Status aller folgenden Werte:** **Vorschlag – Freigabe durch Projektleitung erforderlich.** Sie konkretisieren die Marktanalyse und überschreiben keine vorhandene Entscheidung. „Mindeststandard“ ist die Eintrittsschwelle für ein professionelles Produkt; „Zielstandard“ ist die angestrebte Wettbewerbsqualität; „Alleinstellungsmerkmal“ beschreibt die bewusst differenzierende Ausführung.

## H1. Messbare Qualitätsziele

| Bereich | Mindeststandard | Zielstandard | Bewusstes Alleinstellungsmerkmal |
|---|---|---|---|
| Erster sinnvoller Überblick | Ohne Account und Netzwerk erreichbar; nach Anlage eines Kontos und drei Buchungen entsteht eine brauchbare Übersicht in höchstens 10 Minuten | Median ≤ 5 Minuten im moderierten Usability-Test; ≥ 80 % der Testpersonen ohne Hilfe | Sofort nutzbares, vollständig lokales Demoprofil plus klarer Wechsel zu echten Daten; Demo restlos löschbar |
| Manuelle Standardbuchung | Höchstens 5 Interaktionen nach Öffnen des Erfassungsdialogs; Betrag, Konto und Typ genügen | Median ≤ 5 Sekunden beziehungsweise höchstens 3 Pflichtinteraktionen mit sicheren lokalen Standardwerten | Erfassung direkt vom Startbereich/OS-Shortcut, lokale kontextuelle Vorschläge, sofortiges Undo; keine Netzabhängigkeit |
| Korrektur | Jede Buchung editier- und löschbar; Transfers/Splits bleiben konsistent | Letzte Aktion mit einer Interaktion rückgängig; Mehrfachbearbeitung mit Vorschau | Lokales Operationsprotokoll für Regel-, Batch- und Importänderungen; selektive oder vollständige Rücknahme |
| Importvorschau | Kein Datensatz wird vor Bestätigung gespeichert; Spalten, Datum, Betrag, Konto, Fehler und Anzahl sichtbar | Kodierung, Trennzeichen, Dezimal-/Datumsformat automatisch erkannt und korrigierbar; Vorschau zeigt alle Fehlerklassen | Herkunfts-Hash, wiederverwendbare Mappingvorlage, erklärbare Dublettenklassen „sicher/wahrscheinlich/möglich“, atomarer Rollback |
| Importleistung | 10.000 Zeilen ohne UI-Blockade; Abbruch hinterlässt keine Teildaten | Vorschau für 10.000 typische CSV-Zeilen p95 ≤ 3 s auf definierter Mittelklasse-Referenzhardware | Streaming-Verarbeitung mit Fortschritt, deterministisches Ergebnis und reproduzierbarer Importbericht |
| Dubletten | Exakte Übereinstimmungen anhand dokumentierter Felder erkannt | Konfigurierbare Kombination aus Quelle, Konto, Datum, Betrag, Währung, Beschreibung und externer ID | Jede Entscheidung wird erklärt; Nutzer kann Fälle vor Commit einzeln oder als Gruppe auflösen; keine stille Löschung |
| Review-Workflow | Importierte beziehungsweise ungeprüfte Buchungen filterbar | Status „neu/unklar/Konflikt/geprüft“ mit Batch-Aktion und Tastaturbedienung | Herkunft, Vorschlag, Regel und Konfidenz in einem auditierbaren Verlauf; Review-Zähler ohne alarmistische Sprache |
| Erklärbarkeit | Jede Dashboardzahl nennt Zeitraum und Währung | In höchstens 2 Interaktionen zu Konten, Filtern, Buchungen und Formel; Ausschlüsse sichtbar | „So berechnet“-Ansicht mit Eingaben, Rundung, Transfer-/Splitlogik und reproduzierbarem Ergebnis; als Bericht exportierbar |
| Offline-Verhalten | App-Start, Lesen, Schreiben, Suchen, Berechnen, Budgetieren, Import und Export funktionieren im Flugmodus | Kein Funktionsbanner, Spinner oder degradierter Kernworkflow ohne Netz; Offline-Suite auf allen Plattformen | Automatisierter Release-Gate-Test blockiert unerlaubte Verbindungen; in-app Datenflussansicht bestätigt lokalen Betrieb |
| Startzeit | Keine spürbar blockierende Migration; kalter Start p95 < 2,0 s auf definierter Referenzhardware | Kalt p95 < 1,5 s, warm p95 < 0,5 s | Offline und bei großem Datenbestand dieselben Budgets; Messwerte pro Release dokumentiert |
| Interaktionslatenz | Eingabequittung < 150 ms; keine blockierende Hauptthread-Arbeit | Sichtbare Reaktion < 100 ms; übliche Listen-/Filteroperationen p95 < 200 ms | Berechnungen inkrementell und deterministisch; Performancebudget ist CI-/Release-Gate |
| Großer Datenbestand | 100.000 Buchungen öffnen, durchsuchen und exportieren ohne Absturz | Scrollen bleibt flüssig; Standardaggregation p95 < 500 ms auf Referenzgerät | Gleiche Berechnungsergebnisse unabhängig von Plattform und Datenreihenfolge; golden datasets prüfen Parität |
| Export | CSV für Buchungen und Konten; kein aktives Abo für eigenen Datenexport erforderlich | Versioniertes, dokumentiertes JSON mit Konten, Splits, Transfers, Kategorien, Budgets, Regeln, Zielen und Metadaten | Menschlicher Export + maschinenlesbarer Voll-Export + verschlüsseltes Vollbackup; automatischer Roundtrip-Gleichheitstest |
| Backup/Restore | Nutzerinitiierte lokale Datei; Integritätsprüfung; kein Überschreiben ohne Warnung | Versioniert, verschlüsselt, Prüfsumme, Vorschau von Datum/Version/Inhalt; Restore auf sauberem Gerät getestet | Regelmäßiger lokaler Backup-Check ohne Upload; simulierte Wiederherstellung prüft Lesbarkeit, ohne Produktionsdaten zu verändern |
| Verschlüsselung | Betriebssystemgeschützter Speicher und verschlüsselte lokale Datenbank für Finanzdaten; Schlüssel nicht in Klartext | Hardware-/Secure-Enclave-/Keystore-gestützte Schlüsselableitung, automatische Sperre optional | Verständliche Schlüssel- und Wiederherstellungsgrenzen; keine „Passwort vergessen“-Hintertür über FinanceOS-Server |
| Netzwerk | Kern funktioniert mit blockiertem Netzwerk; keine Finanzdaten in Logs, Crashreports oder Telemetrie | Explizite Domain-/Zweck-Allowlist, standardmäßig keine Produktanalyse; Netzwerkzugriffe in Tests beobachtet | Veröffentlichte, versionierte Datenflussmatrix; nutzerinitiierte Exporte an fremde Clouds sind OS-Dateiaktionen, kein FinanceOS-Backend |
| Barrierefreiheit | WCAG 2.2 AA; iOS-Touchziele ≥ 44 × 44 pt, Android ≥ 48 dp; Kontrast ≥ 4,5:1 normal/3:1 groß | 200-%-Textskalierung ohne Inhaltsverlust, vollständiger Screenreaderfluss, Web vollständig per Tastatur, reduzierte Bewegung, keine Farbcodierung allein | Öffentliche Konformitätserklärung pro Release; Diagramme immer zusätzlich als zugängliche Tabelle/Erklärung; Tests mit Betroffenen |
| Fehlerzustände | Kein Datenverlust bei ungültiger Datei, vollem Speicher, Abbruch oder App-Neustart | Fehler nennt Ursache, betroffenen Umfang und sichere nächste Schritte; technische Details kopierbar ohne Finanzinhalt | Fehlerbericht kann lokal geprüft/exportiert werden; Recovery-Pfade werden wie Hauptpfade getestet |
| Plattformparität | Konten, Buchungen, Kategorien, Budget, Review, Import, Export und Backup überall vorhanden | Gleiche fachliche Ergebnisse und Dateikompatibilität auf iOS, Android und Web | Plattform-native Interaktion bei identischem semantischem Modell; Paritätsmatrix ist Release-Gate |
| Preis-/Geschäftsmodell | Gesamtpreis, Abrechnungsintervall und Folgepreis klar; keine Werbung/Provision | Kernzugang und Export bleiben nach Kauf-/Aboänderung fair definiert; keine künstliche Dringlichkeit | Preis finanziert ausschließlich das Produkt; keinerlei Interessenkonflikt durch Finanzproduktvermittlung |

## H2. Externe Mindestnormen

- Apple empfiehlt in seinen [UI Design Tips](https://developer.apple.com/design/tips/) mindestens 44 × 44 pt große Ziele, lesbaren Text ab 11 pt sowie ausreichenden Kontrast, Abstand und Ausrichtung. Die [Human Interface Guidelines – Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) bleiben die verbindliche Plattformreferenz.
- Android nennt in der aktuellen [Accessibility-Dokumentation](https://developer.android.com/guide/topics/ui/accessibility/apps) mindestens 48 dp große Touchziele, Inhaltsbeschreibungen und 4,5:1 Kontrast für kleinen beziehungsweise 3:1 für großen Text.
- WCAG 2.2 AA verlangt gemäß [W3C Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) 4,5:1 für normalen und 3:1 für großen Text. Das Web-Mindestziel von 24 × 24 CSS-Pixeln nach [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) ist eine Untergrenze; FinanceOS sollte plattformweit die komfortableren 44-pt-/48-dp-Werte anstreben.

## H3. Abnahmedefinition für „vollständig offline“

Eine Version darf nur als „vollständig offline im Kern“ beworben werden, wenn ein frisches, zuvor aktiviertes beziehungsweise lizenzrechtlich zulässiges Gerät im Flugmodus folgende Tests besteht:

1. App öffnen und vorhandene Daten lesen.
2. Konto, Ausgabe, Einnahme, Transfer, Split und wiederkehrende Buchung anlegen.
3. Kategorie, Budget und Ziel bearbeiten.
4. Dashboard und Vermögensverlauf neu berechnen.
5. Unterstützte Datei importieren, Vorschau prüfen, Commit und Rollback ausführen.
6. CSV/JSON und verschlüsseltes Backup erstellen.
7. Backup auf einer sauberen lokalen Testinstallation wiederherstellen.
8. Suchen, filtern, sortieren und Batch-Bearbeitung durchführen.
9. App beenden, neu starten und denselben konsistenten Zustand vorfinden.
10. Netzwerkprotokoll zeigt keinen blockierten Pflichtaufruf und keine Finanzdatenübertragung.

## H4. Abnahmedefinition für „nachvollziehbar“

Für jede Kennzahl – zum Beispiel „Ausgaben im Monat“, „verfügbares Budget“, „Nettovermögen“ oder „kommende Verpflichtungen“ – muss eine standardisierte Erklärung enthalten:

- fachliche Definition,
- Datenstand und Zeitraum,
- einbezogene und ausgeschlossene Konten/Kategorien,
- Umgang mit Transfers, Splits, Rückerstattungen und ausstehenden Buchungen,
- Währung, Kursquelle und Kursdatum, falls relevant,
- Formel und Rundungsregel,
- Liste der beitragenden Buchungen beziehungsweise Komponenten,
- Kennzeichnung von Annahmen und unsicheren Daten.

---

# I. Priorisierte Empfehlungen

Alle Empfehlungen sind **Vorschlag – Freigabe durch Projektleitung erforderlich**. Die Priorisierung berücksichtigt Nutzerwert, Datenschutz, Architekturwirkung und langfristige Wartbarkeit; sie ist keine Sprintfreigabe.

## I1. Unbedingt vor Sprint 1 klären

| Priorität | Entscheidung/Arbeitspaket | Warum vor Implementierung? | Aufwand/Risiko |
|---:|---|---|---|
| 1 | Produktpositionierung, Kernzielgruppe und harte Nicht-Ziele freigeben | „Keine Bankverbindung, kein Betreibercloudspeicher, keine Werbung/Tracking/Verkaufsflächen“ beeinflusst jede spätere Produkt- und Architekturentscheidung. | Niedriger Aufwand, hohe strategische Wirkung |
| 2 | Fachliches Datenmodell und Berechnungskanon definieren | Konten, Anfangssaldo, Transfers, Splits, Rückerstattungen, Verbindlichkeiten, geplante Buchungen und Währungen bestimmen jede Kennzahl. Späte Korrekturen sind migrationsintensiv. | Mittel bis hoch; größtes Langfristrisiko |
| 3 | Bedrohungsmodell, lokale Verschlüsselung, Schlüssel- und Recovery-Strategie entscheiden | Local-first ohne Backup/Recovery kann Datenverlust verschärfen; eine serverlose Architektur verhindert zugleich klassische Passwortwiederherstellung. | Hoch; Security- und UX-kritisch |
| 4 | Netzwerkvertrag und erlaubte externe Kommunikation freigeben | Lizenzprüfung, Updates, Crashdiagnostik, Support oder Kursdaten können dem Versprechen widersprechen. Eine Allowlist muss vor SDK-Auswahl bestehen. | Mittel; verhindert spätere Datenschutzschuld |
| 5 | Importvertrag und erste unterstützte Formate bestimmen | Import ist Onboarding und Hauptdatenkanal. Parser, Mapping, Dubletten, Atomizität und Provenienz prägen das Datenmodell. | Hoch; zentraler Qualitätsfaktor |
| 6 | Backup-, Export- und Restore-Format versionieren | Ein Vollbackup darf nicht erst nach dem MVP „hinzugefügt“ werden; es muss Migrationen und Datenbeziehungen von Anfang an tragen. | Mittel; hohe Lock-in-/Zuverlässigkeitswirkung |
| 7 | Plattform- und Paritätsstrategie festlegen | Web-Offlinefähigkeit, Dateisystemzugriff, Verschlüsselung und Hintergrundverhalten unterscheiden sich erheblich zwischen iOS, Android und Browser. | Hoch; Architekturentscheidung |
| 8 | Budgetmethoden und MVP-Scope festlegen | Ein einfaches Kategorielimit, Spending Plan und Envelope-System benötigen unterschiedliche Begriffe und Zustände. | Mittel; verhindert unvereinbare UX |
| 9 | Performance-Referenzhardware, Datenmengen und Accessibility-Gates freigeben | Ohne Messumgebung sind „schnell“ und „barrierefrei“ nicht abnehmbar. | Niedrig bis mittel; laufender Qualitätshebel |
| 10 | Geschäftsmodell und Offline-Lizenzverhalten entscheiden | Ein Abo mit regelmäßiger Serverprüfung kann vollständige Offline-Nutzung unterbrechen; ein Einmalkauf beeinflusst Finanzierung und Updatepolitik. | Mittel; strategisch und technisch relevant |
| 11 | Zwei klickbare Prototypen testen: Quick Entry und Import Review | Dies sind die wichtigsten Differenzierungsworkflows und sollten vor Datenbank-/UI-Festlegung mit Zielnutzern validiert werden. | Niedrig bis mittel; hohe UX-Risikoreduktion |

Die falsch zugeordneten externen Quellenkopien sollten zur Vermeidung künftiger Fehlinterpretationen ersetzt oder entfernt werden. Dies ist eine Quellenpflege und kein Bereinigungsbedarf im Repository sowie kein eigenständiger Sprint-1-Blocker.

## I2. Relevant für den MVP

### Produktkern

- Konten für Bank, Bargeld, Kredit, Vermögenswert und Verbindlichkeit – rein manuell.
- Einnahme, Ausgabe, Transfer, Split, Rückerstattung und Anfangssaldo mit sauberer Semantik.
- Kategorien und Unterkategorien; lokale Regeln nur mit Vorschau, Herkunft und Undo.
- Review-Inbox mit Status, Suche, Filtern und Massenbearbeitung.
- Wiederkehrende Buchungen mit klarer Trennung zwischen Vorlage, erwarteter und tatsächlich gebuchter Transaktion.
- Kategoriebudgets mit optionalem Übertrag; keine erzwungene Methode.
- Vermögensübersicht und Verlauf, deren Änderungen bis zu Einzelkomponenten erklärbar sind.
- Ruhiges Dashboard mit Saldo/Vermögen, Monatsfluss, Budgetstatus, kommenden Verpflichtungen und Review-Bedarf.

### Import, Export und Zuverlässigkeit

- CSV als erstes Format nur dann, wenn flexible Zuordnung, Zeichensatz-, Dezimal- und Datumserkennung vollständig sind; sonst ist „CSV“ irreführend breit.
- Vollständige Importvorschau, drei Dublettenklassen, Validierungsbericht und atomarer Rollback.
- Menschenlesbarer CSV-Export und versioniertes JSON vom ersten Release an.
- Verschlüsseltes lokales Vollbackup mit Integritätsprüfung und getestetem Restore.
- Crash-sichere Datenbanktransaktionen und Migrations-/Roundtrip-Tests.
- Kein Finanzinhalt in Logs, Crashreports oder Diagnosedateien.

### Bedienung und Qualität

- Quick Entry gemäß H1; Vorlagen/Favoriten, Duplizieren und unmittelbares Undo.
- „So berechnet“-Ansicht für jede aggregierte Zahl.
- Leere, Lade-, Fehler-, Erfolg- und Konfliktzustände als Teil des Designs, nicht als Nacharbeit.
- WCAG 2.2 AA, Dynamic Type/Font Scaling, Screenreader, Web-Tastatur, Reduced Motion und zugängliche Diagrammalternative.
- Automatisierte Offline-, Netzwerk-, Import-, Restore-, Migrations-, Accessibility- und Performance-Gates.
- Vollwertige Kernworkflows auf allen freigegebenen Plattformen; kein mobile-only oder web-only Import/Export.

## I3. Relevant für spätere Versionen

| Thema | Nutzen | Voraussetzung/Begrenzung |
|---|---|---|
| OFX/QFX, CAMT.053 und bankabhängige CSV-Profile | Weniger manuelle Zuordnung, bessere europäische Abdeckung | Parser-Sicherheitsmodell, Testkorpus, Versionspflege und klare Formatgrenzen |
| Erweiterte lokale Regeln | Effizientere Review-Inbox | Erklärbarkeit, Vorschau, Konfliktauflösung, Batch-Undo |
| Ziele und Schuldenabbau | Langfristiger Nutzen | Keine moralische Sprache; Annahmen und Zinslogik sichtbar |
| Multiwährung | Relevanz für internationale Haushalte | Entscheidung zu Kursquelle, Offline-Kursen, historischen Kursen und Datenschutz |
| Zukunftskalender und Szenarien | Sicht auf Verpflichtungen und Entwicklung | Strikte Trennung von Ist, Erwartung und Szenario; keine Scheingenauigkeit |
| Anpassbare Dashboards und Berichte | Power-User-Nutzen | Erst nach einem validierten starken Default; zugängliche Konfiguration |
| Haushaltszusammenarbeit | Großer Alltagsnutzen | Ohne Betreibercloud technisch und UX-seitig anspruchsvoll; Konflikt-, Schlüssel- und Berechtigungskonzept |
| Nutzergewählter Datei-/Cloud-Ordner für Backup oder Sync | Gerätewechsel und eigene Datenhoheit | Ende-zu-Ende-Verschlüsselung, Konfliktlösung, OS-Grenzen; ausdrücklich keine FinanceOS-Cloud |
| Lokale API/Automationen | Portabilität und Power-User | Authentisierung, Sandbox, Versionierung und Missbrauchsschutz |
| Beleganhänge/OCR | Komfort | Rein lokale OCR bevorzugen; Speicher-, Export-, Lösch- und Backupfolgen klären |
| Steuer- und Beraterexporte | Regionaler Mehrwert | Rechtliche/semantische Pflege; kein Steuerberatungsversprechen |

## I4. Bewusst nicht übernehmen

- Direkte Bank-, Broker- oder Zahlungsdienstverbindungen.
- Zahlungsinitiierung, Vertragskündigung, Versicherungsvermittlung, Cashback oder Produktvergleich.
- Erforderliches Nutzerkonto für den lokalen Kern.
- FinanceOS-eigener Cloudspeicher für persönliche Finanzdaten.
- Werbung, Affiliate-Links, Verkauf von Leads oder Nutzerprofilen.
- Verhaltens- oder Finanztracking; insbesondere keine Drittanbieter-Analytics-SDKs mit Finanzkontext.
- Opaques Cloud-AI-Kategorisieren oder Übertragung von Beschreibungen an LLMs.
- Kredit-Score, Anlageempfehlungen, Renditeversprechen oder personalisierte Finanzberatung.
- Streaks, Ranglisten, Scham-/Angstsprache und manipulative Warnungen.
- Eine erzwungene Budgetmethode.
- Exportbeschränkung als Kündigungs- oder Upgrade-Hebel.
- Unterschiedliche fachliche Wahrheiten pro Plattform.

## I5. Empfohlene MVP-Reihenfolge

1. Fachmodell, Sicherheits-/Netzwerkvertrag und Backupformat.
2. Lokaler Datenspeicher mit Migration, Verschlüsselung und Golden-Dataset-Tests.
3. Konten/Transaktionen/Transfers/Splits und Quick Entry.
4. CSV-Import mit Vorschau, Dubletten, Commit und Rollback.
5. Review-Inbox, Kategorien und transparente lokale Regeln.
6. Berechnungsschicht mit erklärbaren Monatsflüssen und Nettovermögen.
7. Budgets und wiederkehrende Verpflichtungen.
8. Dashboard als Projektion der validierten Berechnungsschicht.
9. Export, verschlüsseltes Backup und Restore-Härtung.
10. Plattformparität, Accessibility-, Offline-, Performance- und Recovery-Abnahme.

---

# J. Offene Fragen und Entscheidungsbedarf

Die folgenden Punkte können nicht seriös durch Wettbewerbsrecherche entschieden werden. Sie benötigen eine explizite Freigabe durch **„00 – Projektleitung“**.

## J1. Produkt und Markt

1. Soll FinanceOS zuerst auf Deutschland/DACH optimiert werden oder von Beginn an international (Datums-/Zahlenformate, Währungen, Steuerbegriffe)?
2. Ist die primäre Einheit eine Einzelperson oder ein Haushalt? Welche Rollen und Sichtbarkeiten wären später nötig?
3. Welche Nutzergruppe hat Vorrang: tägliche manuelle Erfassung, monatlicher Dateiimport oder Mischbetrieb?
4. Welche Budgetmethode gehört in den MVP: reine Limits, Überträge, Spending Plan oder Envelope? Darf ein Nutzer ohne Budget arbeiten?
5. Wie tief müssen Vermögenswerte im MVP gehen: nur manuelle Werte oder auch Stückzahlen/Kurse? Ohne Brokerverbindung entstehen Kursdaten- und Netzwerkfragen.
6. Sind Ziele und Schuldenplanung MVP oder spätere Planung?
7. Welche Sprache ist zulässig: „Finanzplanung“, „Analyse“, „Hinweis“ versus rechtlich missverständliche „Beratung“?
8. Soll es ein lokales Demoprofil geben, und wie deutlich wird es von echten Daten getrennt?

## J2. Geschäftsmodell

1. Einmalkauf, kostenpflichtige Major-Version, Abonnement oder Kombination?
2. Wie funktioniert Lizenzprüfung nach längerer Offline-Zeit, ohne den Kern zu blockieren?
3. Welche Funktionen bleiben nach Ablauf eines Abos lesbar, exportierbar und wiederherstellbar?
4. Gibt es Familienfreigabe, Bildungsrabatt oder plattformspezifische Käufe?
5. Welche Mindestumsätze sind nötig, um drei Plattformen, Importparser, Security und Accessibility langfristig zu pflegen?

## J3. Daten, Sicherheit und Wiederherstellung

1. Welche lokale Datenbank- und Verschlüsselungsstrategie wird verbindlich gewählt?
2. Wie wird der Schlüssel erzeugt, gespeichert, rotiert und bei Gerätewechsel übertragen?
3. Gibt es ein optionales eigenes Passwort für Backups? Was geschieht bei Verlust?
4. Soll FinanceOS regelmäßige Backup-Erinnerungen geben? Wie bleibt der Ton ruhig und nicht alarmistisch?
5. Darf ein Nutzer einen OS-/Cloud-Dateipicker für Backups nutzen? Welche Anbieter werden nur als Speicherziel, nicht als Integration behandelt?
6. Wie lange werden Undo-/Operationsdaten gehalten, und sind sie Teil des Exports?
7. Wie werden Anhänge verschlüsselt, dedupliziert und gelöscht?
8. Welche Diagnoseinformationen darf Support erhalten, und wie werden Finanzdaten garantiert entfernt?

## J4. Import, Währungen und Berechnungen

1. Welche CSV-Varianten und ersten Banken-/Brokerexporte werden offiziell unterstützt?
2. Gehören OFX/QFX und CAMT.053 in den MVP oder erst in eine spätere Version?
3. Welche Felder definieren eine exakte, wahrscheinliche oder mögliche Dublette?
4. Wie werden Transfers erkannt, ohne automatisch falsche Paare zu erzeugen?
5. Wie werden Rückerstattung, Storno, Kreditkartenabrechnung und Bargeldabhebung modelliert?
6. Wird Multiwährung im MVP unterstützt? Wenn ja: manuelle Kurse, Online-Kursquelle, historischer Kurs und Bewertungsstichtag?
7. Welche Kennzahl ist die primäre Dashboardzahl: liquide Mittel, Nettovermögen, Monatsüberschuss oder frei verfügbarer Betrag?
8. Wie werden geplante, vorgemerkte und tatsächlich gebuchte Vorgänge visuell und rechnerisch getrennt?

## J5. Plattform und Betrieb

1. Was bedeutet „Web“: installierbare PWA, lokale Browser-App, Desktop-Wrapper oder Browserclient mit Dateispeicherzugriff?
2. Welche Mindestversionen von iOS, Android und Browsern werden unterstützt?
3. Ist vollständige Feature-Parität zum selben Release erforderlich oder darf es dokumentierte zeitliche Abweichungen geben?
4. Welche Update-/Migrationsgarantie gilt für langfristig offline gebliebene Installationen?
5. Sind automatische Updateprüfungen zulässig, und welche Metadaten fallen dabei an?
6. Welche Referenzgeräte und Datenbestände gelten für Performancebudgets?
7. Wie werden Webdaten vor Browserbereinigung geschützt beziehungsweise wie wird dieses Risiko kommuniziert?

## J6. Konkrete Änderungsvorschläge für Projektdokumente

Jeder folgende Punkt ist **Vorschlag – Freigabe durch Projektleitung erforderlich**. Dieser Bericht nimmt keine Änderung an den Originaldokumenten vor.

| Zieldokument | Konkreter Vorschlag |
|---|---|
| `00_PROJECT_WORKFLOW.md` | Research-DoD um Quellenstand, Belegtypen, Evidenzstärke bei Nutzerkritik und explizite Freigabegrenze für Anforderungen ergänzen. |
| `01_AI_CONTEXT.md` | Harte Produktgrenzen aufnehmen: kein Bank-/Brokerzugang, kein Betreibercloudspeicher für Finanzdaten, keine Werbung/Tracking/Produktvermittlung; externe Netzwerkaktionen nur nach dokumentierter Freigabe. |
| `02_PRODUCT.md` | Positionierung „ruhige Finanzzentrale, die dir gehört“, Kernzielgruppe, Nicht-Zielgruppen, glaubwürdige/nicht zulässige Versprechen und MVP-Scope ergänzen. |
| `03_ARCHITECTURE.md` | Local-first-Datenfluss, Import-Staging, atomarer Commit/Rollback, versioniertes Export-/Backupformat, Schlüsselgrenzen, Berechnungsschicht und Plattformparität dokumentieren. |
| `04_DESIGN_GUIDE.md` | Review-Status, „So berechnet“, Quick Entry, Undo, ruhige Warnsprache, Prognose-Semantik, Leer-/Fehlerzustände und plattformspezifische Touchziele als Muster aufnehmen. |
| `05_ENGINEERING.md` | Verbot von Finanzdaten in Logs, deterministische Berechnungen, Operationsprotokoll, Netzwerk-Allowlist und Parser-Isolation als Engineering-Regeln ergänzen. |
| `06_BACKLOG.md` | Epics für Fachmodell, Quick Entry, Import Preview/Dedupe/Rollback, Review-Inbox, Explainability, Export/Backup/Restore, Offline-Gate, Accessibility und Performance anlegen – erst nach Freigabe. |
| `07_DECISIONS.md` | ADR-/Entscheidungseinträge für Geschäftsmodell, Webplattform, Verschlüsselung/Recovery, Importformate, Budgetmethode, Multiwährung, Telemetrie und nutzergewählten Cloud-Dateiordner vorbereiten. |
| `08_ROADMAP.md` | MVP auf kontrollierte Datenaufnahme, Review, erklärbare Übersicht und Portabilität begrenzen; Forecast, Multiwährung, Haushalts-Sync und lokale API in spätere Phasen verschieben. |
| `12_SECURITY.md` | Bedrohungsmodell, Schlüsselmanagement, Backup-Angriffe, Importdatei-Risiken, Clipboard/Screenshot/App-Switcher, Diagnostics-Redaction und Netzwerkprüfung konkretisieren. |
| `13_TESTING.md` | Golden Datasets, Cross-Platform-Parität, Import-Fuzzing, Crash-/Disk-full-Tests, Export-Roundtrip, Restore auf sauberem Gerät, Offline- und Accessibility-Gates ergänzen. |
| `14_PERFORMANCE.md` | Referenzhardware und p95-Budgets aus H1 nach Messung/Freigabe übernehmen; 10k-Import und 100k-Buchungsbestand als feste Szenarien definieren. |

**Verbindliche Vorbedingung:** Vor jeder inhaltlichen Änderung ist die aktuelle Version des betroffenen Dokuments direkt aus dem GitHub-Repository auf `main` zu prüfen. Extern bereitgestellte Kopien sind nicht verbindlich und dürfen den Repository-Stand nicht ersetzen.

---

# Quellenregister

Alle Quellen wurden zuletzt am 14. Juli 2026 geprüft, soweit nicht ein abweichender Richtlinien- oder Aktualisierungsstand im Bericht genannt ist. Store-Inhalte, Rezensionen, Preise und Aktionsangebote können sich jederzeit ändern.

## Produkt-, Hilfe-, Preis- und Datenschutzquellen

### Finanzguru

- [Produktseite](https://finanzguru.de/)
- [Datenschutzerklärung](https://finanzguru.de/datenschutz)
- [Barrierefreiheitserklärung](https://finanzguru.de/barrierefreiheit)
- [Hilfecenter](https://hilfe.finanzguru.de/)
- [Google Play](https://play.google.com/store/apps/details?id=de.dwins.financeguru)

### Outbank

- [Produktseite](https://outbankapp.com/)
- [Sicherheit](https://outbankapp.com/sicherheit/)
- [Features](https://outbankapp.com/features/)
- [Preise](https://outbankapp.com/preise/)
- [Google Play](https://play.google.com/store/apps/details?id=com.stoegerit.outbank.android)

### finanzblick

- [Produktseite](https://www.buhl.de/finanzblick/)
- [Google Play](https://play.google.com/store/apps/details?id=de.buhl.finanzblick)

### Monarch Money

- [Produktseite](https://www.monarch.com/)
- [Security](https://www.monarch.com/security)
- [Privacy Policy](https://www.monarch.com/privacy)
- [Apple App Store](https://apps.apple.com/us/app/monarch-budget-track-money/id1459319842)

### Copilot Money

- [Produktseite und Preise](https://www.copilot.money/)
- [Privacy Policy](https://www.copilot.money/privacy-policy)
- [Privacy & Security](https://www.copilot.money/privacy-and-security)
- [Hilfecenter](https://help.copilot.money/en/)
- [FAQ](https://www.copilot.money/faq)
- [Apple App Store](https://apps.apple.com/us/app/copilot-track-budget-money/id1447330651)

### YNAB

- [Preise](https://www.ynab.com/pricing)
- [Features](https://www.ynab.com/features)
- [Hilfecenter](https://www.ynab.com/help-center)
- [Datenschutzdarstellung](https://www.ynab.com/blog/ynab-privacy)
- [Accessibility Statement](https://www.ynab.com/accessibility)
- [Google Play](https://play.google.com/store/apps/details?id=com.youneedabudget.evergreen.app)

### Actual Budget

- [Produktseite](https://actualbudget.org/)
- [Sync-Dokumentation](https://actualbudget.org/docs/getting-started/sync/)
- [Installations- und Offline-Hinweise](https://actualbudget.org/docs/install/)

### MoneyCoach

- [Produktseite](https://moneycoach.ai/)
- [Privacy-first-Beschreibung](https://moneycoach.ai/privacy-first-budgeting-app)
- [Privacy Policy](https://moneycoach.ai/privacy-policy)
- [Apple App Store](https://apps.apple.com/us/app/moneycoach-budget-planner/id989642198)

### MoneyControl

- [Produktseite](https://primoco.me/en/)
- [Features](https://primoco.me/en/features)
- [Preise](https://primoco.me/en/price)
- [Datenschutz](https://primoco.me/en/info/privacy)
- [Google Play](https://play.google.com/store/apps/details?id=com.priotecs.MoneyControl)

### Money Manager von Realbyte

- [Produktseite](https://realbyteapps.com/)
- [Google Play](https://play.google.com/store/apps/details?id=com.realbyteapps.moneymanagerfree)
- [Apple App Store](https://apps.apple.com/us/app/money-manager-expense-budget/id560481810)

### Wallet by BudgetBakers

- [Produktseite](https://budgetbakers.com/en/products/wallet/)
- [Features](https://budgetbakers.com/en/products/wallet/features/)
- [Privacy Policy](https://budgetbakers.com/en/privacy)
- [Google Play](https://play.google.com/store/apps/details?id=com.droid4you.application.wallet)

### Goodbudget

- [Produktseite](https://goodbudget.com/)
- [Leistungsübersicht](https://goodbudget.com/what-you-get/)
- [Preise und Tarifgrenzen](https://goodbudget.com/signup)
- [Privacy Policy](https://goodbudget.com/privacy-policy)
- [Google Play](https://play.google.com/store/apps/details?id=com.dayspringtech.envelopes)

### PocketSmith

- [Produktseite](https://www.pocketsmith.com/)
- [Preise](https://my.pocketsmith.com/plans)
- [Security](https://www.pocketsmith.com/security/)
- [Privacy Policy](https://www.pocketsmith.com/legal/privacy-policy/)
- [Dateiimport](https://learn.pocketsmith.com/article/484-bank-files)
- [Migration aus anderen Apps](https://learn.pocketsmith.com/article/258-moving-to-pocketsmith-from-another-personal-finance-app)
- [Mobile Apps](https://learn.pocketsmith.com/article/515-mobile-apps)
- [Google Play](https://play.google.com/store/apps/details?id=com.pocketsmith.app)

### Quicken Simplifi

- [Produktseite und Preise](https://www.quicken.com/products/simplifi/)
- [CSV-Import](https://support.simplifi.quicken.com/en/articles/4413430-how-to-manually-import-transactions-in-quicken-simplifi)
- [Export](https://support.simplifi.quicken.com/en/articles/3404263-how-to-export-transactions-from-quicken-simplifi)
- [Reviewed-Spalte](https://support.simplifi.quicken.com/en/articles/5225070-using-the-reviewed-column)
- [Dashboard](https://support.simplifi.quicken.com/en/articles/3357180-getting-to-know-your-dashboard)
- [US Privacy Statement](https://www.quicken.com/privacy-us/us/)
- [Google Play](https://play.google.com/store/apps/details?id=com.quicken.acme)

### Toshl Finance

- [Produktseite](https://toshl.com/)
- [Preise](https://toshl.com/pricing/)
- [Privacy Policy](https://toshl.com/privacy/)
- [Apple App Store](https://apps.apple.com/us/app/toshl-finance-best-budget/id921590251)
- [Google Play](https://play.google.com/store/apps/details?id=com.thirdframestudios.android.expensoor)

## Design- und Accessibility-Standards

- [Apple Human Interface Guidelines – Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Apple UI Design Dos and Don’ts](https://developer.apple.com/design/tips/)
- [Android: Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps)
- [W3C WCAG 2.2 – Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C WCAG 2.2 – Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

## Unabhängige Gegenprobe

- Der aktuelle Überblick [TechRadar: Best personal finance software of 2026](https://www.techradar.com/best/best-personal-finance-software) bestätigt als unabhängige Einordnung die im Bericht ermittelten relativen Stärken: YNAB für konsequentes Budgetieren, Simplifi für einen leichteren mobilen Einstieg, Monarch für anspruchsvolle Finanzverwaltung und PocketSmith für Multiwährung und langfristige Prognosen. Diese redaktionelle Auswahl wurde nur zur Triangulation verwendet; Funktions-, Preis- und Datenschutzangaben stammen weiterhin vorrangig aus Primärquellen.
- Der [San Francisco Chronicle zur YNAB-Methode](https://www.sfchronicle.com/personal-finance/article/budgeting-app-rebrand-ynab-20298723.php) verdeutlicht die strategische Spannung zwischen motivierender, werteorientierter Budgetierung und als beschämend empfundener Budgetkultur. Die Quelle stützt nicht einzelne Produktfunktionen, sondern die Empfehlung für neutrale, nicht moralisierende Sprache.

## Projektdokumente

Geprüft wurden zunächst die bereitgestellten Fassungen von `00_PROJECT_WORKFLOW.md`, `01_AI_CONTEXT.md`, `02_PRODUCT.md`, `03_ARCHITECTURE.md`, `04_DESIGN_GUIDE.md`, `05_ENGINEERING.md`, `06_BACKLOG.md`, `07_DECISIONS.md`, `08_ROADMAP.md`, `12_SECURITY.md`, `13_TESTING.md` und `14_PERFORMANCE.md` sowie ergänzend README, Glossar, Naming Conventions und Changelog. Nachdem sich mehrere dieser Kopien als falsch zugeordnet erwiesen hatten, wurde der aktuelle [`docs/`-Stand auf GitHub `main`](https://github.com/Samsamsam777/financeos/tree/main/docs) gegengeprüft. Dort sind die Dokumente korrekt benannt und zugeordnet. Für alle späteren Projektentscheidungen und Änderungen gilt ausschließlich dieser versionierte Repository-Stand als verbindliche Grundlage.

---

# Schlussantwort auf die Leitfrage

> **Wie muss FinanceOS gestaltet und entwickelt werden, damit es nicht nur eine datenschutzfreundliche Alternative zu bestehenden Finanz-Apps ist, sondern in Bedienbarkeit, Klarheit, Vertrauen, Datenkontrolle und langfristigem Nutzen einen eigenen Spitzenstandard setzt?**

FinanceOS muss Datenschutz von einer Einschränkung in einen **überprüfbaren Produktvorteil** verwandeln. Das gelingt nur, wenn lokale Datenhoheit mit besserer Bedienung gekoppelt wird: Eine Buchung muss in Sekunden erfasst, eine Datei vor jeder Änderung vollständig verstanden, jeder automatische Vorschlag sichtbar bestätigt und jede Aktion rückgängig gemacht werden können. Jede Kennzahl muss ihren Zeitraum, ihre Quellen, Filter, Formel und Annahmen offenlegen. Der Kern muss im Flugmodus ohne Abstriche starten, rechnen, importieren, exportieren und sichern. Der Nutzer muss seine vollständigen Daten in dokumentierten Formaten mitnehmen und aus einem verschlüsselten Backup zuverlässig wiederherstellen können.

Gestalterisch braucht FinanceOS die Ruhe und Sorgfalt von Copilot und Monarch, die manuelle Geschwindigkeit von MoneyCoach, die lokale Kontrolle von Outbank und Actual, die Planungsstärke von YNAB und PocketSmith sowie die Portabilität von Actual und Toshl – jedoch als eigenständiges, konsistentes System ohne Bankzugang, Betreibercloud, Werbung, Tracking, Vertriebsinteresse oder Methoden-Zwang.

Der Spitzenstandard lautet deshalb nicht „mehr Features“. Er lautet:

1. **Weniger, aber klar priorisierte Informationen.**
2. **Schnellste manuelle und kontrollierte Datenaufnahme im Segment.**
3. **Erklärbare statt unsichtbare Automatik.**
4. **Offline als bestandener Test, nicht als Werbewort.**
5. **Portabilität, Backup und Undo als Kernfunktionen.**
6. **Barrierefreiheit und Plattformparität als Release-Gates.**
7. **Ein Geschäftsmodell ohne Interessenkonflikt.**

Wenn FinanceOS diesen Qualitätsvertrag konsequent einhält, ist es nicht bloß die private Variante eines bestehenden Finanzassistenten. Es wird eine eigene Kategorie: **eine professionelle, ruhige und langfristig verlässliche Finanzzentrale, deren Daten, Regeln und Erkenntnisse dem Nutzer gehören.**
