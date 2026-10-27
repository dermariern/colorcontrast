# Copilot-Handoff: Color Contrast Ratio

> Projektkontext für einen Rechnerwechsel oder eine frische Installation. Diese Datei beschreibt den Workspace, der beim Erstellen eingesehen werden konnte. Andere Projekte außerhalb dieses Workspaces sind darin nicht enthalten.

## Kurzüberblick

- **Projekt:** Color Contrast Ratio – eine kleine, clientseitige Web-App zum Prüfen des Kontrastverhältnisses zweier Farben und ihrer WCAG-Einstufung.
- **Technik:** HTML, CSS und Vanilla JavaScript; kein Framework, Backend, Build-Schritt oder Paketmanager ist im Projekt erkennbar.
- **Sprache der Oberfläche:** Englisch.
- **Domain-Hinweis:** Die Datei `CNAME` enthält `colorcontrastratio.com`. Im HTML steht dieselbe Domain als Canonical URL. Das belegt die beabsichtigte Domain, aber nicht allein die aktuelle Hosting-Konfiguration.
- **Lizenz:** MIT; Details stehen in `LICENSE`.
- **Arbeitsweise:** Änderungen an der aktiven App gehören grundsätzlich in die Dateien im Projekt-Root, nicht in historische Stände unter `wip/Saves/`.

## Starten und Weiterarbeiten

1. Repository auf dem neuen Rechner klonen oder den vollständigen Projektordner übertragen.
2. Den Projektordner in VS Code öffnen.
3. `index.html` direkt im Browser öffnen oder einen beliebigen lokalen statischen Webserver verwenden.
4. Es ist kein `npm install` oder vergleichbarer Installationsschritt nötig. Die Schriftart wird derzeit von Google Fonts geladen; dafür braucht der Browser Internetzugang. Ohne Verbindung greift die generische Fallback-Schrift.
5. Änderungen lokal prüfen, danach wie gewohnt committen und ins Git-Remote pushen.

Ein Git-Remote, konkrete Hosting-Einstellungen und ein Test- oder Build-Befehl ließen sich aus den geprüften Projektdateien nicht ablesen. Für einen nahtlosen Umzug am besten das Repository samt Git-Historie übertragen und zusätzlich diese Datei mitcommiten. VS-Code-Erweiterungen oder systemweite Einstellungen sind nicht als Projektabhängigkeiten dokumentiert.

## Aktive Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | Einstiegspunkt und DOM-Struktur für Vordergrund, Hintergrund, Farbeingaben und Ergebnisanzeige. |
| `assets/styles/assets_styles_styles.css` | Layout, responsive Regeln sowie iOS-Safari- und Mobil-Anpassungen. |
| `scripts/scripts_script.js` | HEX/RGB-Umwandlung, relative Luminanz, Kontrastberechnung, WCAG-Anzeige, dynamisches Layout und Event-Handler. |
| `README.md` | Kurze Projektbeschreibung und grobe Ordnerübersicht. |
| `CNAME` | Enthält die Domain `colorcontrastratio.com`. |
| `LICENSE` | MIT-Lizenz. |
| `gitignore` | Ignoriert unter anderem `.env`, Logs, `node_modules/` und `.DS_Store`. |
| `wip/Mainview.svg` | SVG-Referenz/Designentwurf. |
| `wip/Saves/` | Datierte bzw. nummerierte ältere Fassungen der HTML-, CSS- und JS-Dateien; nicht die aktive App. |

Die ungewöhnlichen Dateinamen der aktiven Stylesheet- und JavaScript-Dateien sind in den HTML-Verweisen bereits berücksichtigt. Beim Umbenennen müssen daher auch die Referenzen in `index.html` angepasst werden.

## Funktionsweise

- `#color1` ist der Vordergrund; `#color2` ist der Hintergrund.
- Beide nativen `<input type="color">` lösen bei `input` ein Update aus.
- `hexToRgb()` zerlegt HEX-Werte in RGB-Kanäle. `getLuminance()` berechnet die relative Luminanz; `getContrastRatio()` bildet daraus das Verhältnis.
- Das Ergebnis wird auf zwei Dezimalstellen formatiert. Die Rating-Schwellen im JavaScript entsprechen den üblichen WCAG-Kontrastschwellen: AA normal 4.5:1, AA groß 3:1, AAA normal 7:1 und AAA groß 4.5:1.
- Die UI zeigt Farbfelder mit HEX- und RGB-Werten, passt Text-/Ergebnisfarben an und verschiebt Größen bzw. Positionen abhängig von Luminanz und Kontrast.
- Es gibt spezielle CSS-Regeln für schmale Viewports und iOS Safari sowie Touch-Handler im JavaScript.

## Bekannte Prüfhinweise für die nächste Sitzung

Diese Punkte sind Beobachtungen aus dem Quellcode, keine bereits bestätigten Fehlerberichte:

1. **Doppelte Höhensteuerung:** `updateColorDisplay()` berechnet Sektionshöhen abhängig von der Luminanz. Anschließend berechnet `updateContrastRatio()` die Höhen erneut abhängig vom Kontrastverhältnis. Die spätere Berechnung überschreibt die erste. Bei Layout-Änderungen sollte eine eindeutige Zuständigkeit festgelegt und auf kleinen Viewports geprüft werden.
2. **Initiale Platzhalter:** Einige im HTML eingetragene RGB- und Verhältniswerte passen nicht zu den danebenstehenden Startfarben. Das JavaScript aktualisiert die Werte beim Laden; ohne JavaScript oder vor dessen Ausführung können kurzzeitig falsche Platzhalter sichtbar sein.
3. **Rating-Fallback:** Bei einem Verhältnis unter 3:1 zeigt `updateContrastRatio()` derzeit dennoch „AA / Large Text“ als Fallback an. Prüfen, ob stattdessen „Fail“ bzw. „None“ angezeigt werden soll.
4. **Suchmaschinen-Metadaten:** `index.html` enthält `noindex, nofollow`, obwohl eine Canonical URL und eine Domain hinterlegt sind. Das kann beabsichtigt sein; vor einer Veröffentlichung/Indexierung prüfen.
5. **Tests:** In den Projektdateien sind keine automatisierten Tests, Testskripte oder Build-Konfigurationen ersichtlich. Vorhandenes Verhalten deshalb manuell in Desktop- und Mobilansichten prüfen.

## Hinweise für Änderungen

- Die Zuordnung der Farb-IDs beibehalten: `color1` = Vordergrund, `color2` = Hintergrund. Die dazugehörigen Anzeige-IDs (`color1-hex`, `color1-r` usw.) müssen im HTML und JavaScript zusammenpassen.
- Bei Änderungen an WCAG-Schwellen die vier Fälle (AA/AAA × normal/groß) getrennt prüfen.
- Bei responsiven Änderungen sowohl die allgemeinen Regeln als auch `@supports (-webkit-touch-callout: none)` und den Breakpoint bei 480 px beachten.
- Historische Dateien unter `wip/Saves/` nur ändern, wenn ausdrücklich eine frühere Version bearbeitet werden soll.
- Vor größeren Refactorings den aktuellen Zustand und die gewünschte visuelle Wirkung abgleichen; die gespeicherten SVG-/Snapshot-Dateien können als Referenz dienen.

## Wiederverwendbarer Startprompt

> Bitte lies zuerst `COPILOT_HANDOFF.md` und prüfe den aktuellen Projektzustand, bevor du Änderungen vornimmst. Arbeite an der aktiven Color-Contrast-App in `index.html`, `assets/styles/assets_styles_styles.css` und `scripts/scripts_script.js`. Bewahre die Vanilla-HTML/CSS/JavaScript-Struktur bei, sofern ich keinen Umbau wünsche. Behandle `wip/Saves/` als historische Sicherungen. Fasse zuerst kurz zusammen, was du verstanden hast, und setze dann meine konkrete Aufgabe um.

## Umfang dieser Datei

Diese Übergabe wurde aus den Dateien im aktuell geöffneten Workspace zusammengestellt. Sie synchronisiert keine Copilot-Chats, VS-Code-Einstellungen, Zugangsdaten, Git-Remotes oder andere Ordner/Projekte auf dem Rechner. Solche Dinge müssen separat über Git, ein Backup oder die jeweiligen offiziellen Synchronisierungsfunktionen übertragen werden. Keine Zugangsdaten in diese Datei eintragen.
