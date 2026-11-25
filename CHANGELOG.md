# Änderungsprotokoll – Rheinwerk Bootssimulator

Aktuelle Version: **0.13.0**

Versionierung nach Semantic Versioning (vor 1.0: zweite Stelle = neue Funktionsrunde, dritte Stelle = Korrekturen).

## 0.13.0 – Performance, Schritt 1: Zeichenaufrufe, Detailstufen, dynamische Auflösung
_2026-11-25_

- Leistungsanzeige mit Taste F8: Bildrate, Frame-Zeit, Simulation, Rendern, Zeichenaufrufe, Dreiecke, Auflösung
- Statische Teile werden zusammengefasst (Schifffahrtszeichen, km-Tafeln, Schleusenbauwerke, Torflügel, Signale, Berufsschiffe, Einsatzboote): Zeichenaufrufe im Hauptbild von ~1 710 auf ~830 halbiert
- Schwimmstege mit Detailstufe: in der Nähe einzeln schwimmend, weiter weg je Bereich als ein Modell
- Wasserspiegelung ohne Kleinteile (Tafeln, Zeichen, Laternen, Treibgut): Zeichenaufrufe der Spiegelung von ~1 650 auf ~650
- Straßenlaternen mit Detailstufe (volles Modell nur für die nächsten 10 bis 90 m, sonst vereinfachter Kopf; Schatten nur vom Mast): ~1,3 Mio. auf ~0,2 Mio. Dreiecke
- Dynamische Auflösung mit Ziel-Bildrate (30/45/60 fps); bei knapper Leistung Spiegelung und Schatten nur jedes zweite Bild
- Neue Grafik-Einstellungen: dynamische Auflösung, Ziel-Bildrate, Spiegelung jedes 2. Bild

## 0.12.0 – Versionierung und Änderungsprotokoll
_2026-11-25_

- Versionsnummer im Startbildschirm und im Menü; neuer Menüreiter „Änderungen“ mit dem vollständigen Protokoll
- Hinweis auf Neuerungen beim ersten Start einer neuen Version
- CHANGELOG.md im Projekt, im Offline-Paket und im GitHub-Pages-Paket

## 0.11.0 – Einsatzboote: Querstrahlruder, Längsseitsgehen mit Leinen
_2026-11-25 19:32_

- Feuerlöschboot „RLP 1“ und MZB Koblenz 1 liegen im Hafen an der Moselmündung (WSA-Hafen Lützel, unterhalb der Schleusen)
- Manövriermodell mit Bug- und Heckstrahlruder: seitliche Fahrt bis ~0,9 m/s, Drehen auf der Stelle, Wirkung nimmt mit der Fahrt durchs Wasser ab; Regelung im Wasser-System (Strömung versetzt mit)
- Längsseitsgehen in Phasen: parallel auf ~7 m Abstand, seitlich mit 0,3 m/s heran, Halten mit ~0,5 m Fenderabstand
- Festmachen mit echten Leinen: Aufforderung an den Spieler (Taste M belegt an den Klampen des Einsatzboots), sonst belegt die Besatzung selbst
- Ablegen ohne Drehen: Leinen los, seitlich parallel weg, erst danach Fahrt aufnehmen – kein Rammen mit Bug oder Heck
- Feuerwehr sichert havarierte Frachter längsseits mit sichtbaren Leinen; Brandbekämpfung aus ~20 m Abstand

## 0.10.0 – Feuerwehr Koblenz
_2026-11-25 18:42_

- Feuerlöschboot mit zwei Wasserwerfern (Partikelstrahl) und zwei Mehrzweckboote (Wasserrettung, Lenzpumpe, Sanitäter)
- Alarmierung durch MAYDAY/PAN-PAN, Wasserschutzpolizei, Revierzentrale oder Zeugen (Notruf 112)
- Einsätze: Brand, Wassereinbruch, Person im Wasser, medizinischer Notfall, Absicherung havarierter Frachtschiffe
- Kostenbescheid für Brandbekämpfung und technische Hilfe (Beispielbeträge), Menschenrettung kostenfrei
- Einsatzboote fahren nur in ihrer eigenen Haltung (keine Schleusung im Einsatz)

## 0.9.0 – Gefahren, Unfälle und Schäden
_2026-11-25 18:11_

- Treibgut (Stämme, Äste, Paletten), treibende Leinen/Netze (Propeller), Kanuten und SUP am Ufer
- Technische Defekte: Impeller, Kraftstofffilter, Lichtmaschine (Batteriemodell), Lenkung, Schaltzug; Propellerschaden
- Wassereinbruch mit Bilge, Bilge-Alarm, Bilgepumpe, Sinken; Feuer im Motorraum mit Rauch und Flammen; Mitfahrer über Bord
- Wetterereignisse (Gewitterböe mit Vorwarnung, Nebelbank) und Havarien der Berufsschifffahrt
- Notfallmaßnahmen mit Taste D, Werftreparatur mit Umschalt+D
- Menüreiter „Gefahren“: Häufigkeit, Schwere, jede Gefahrenart einzeln, Ereignisse zum Üben auslösen

## 0.8.0 – Regelüberwachung, Verfolgung, UKW-Funkgerät
_2026-11-25 17:34_

- Wasserschutzpolizei ahndet Verstöße nach RheinSchPV, MoselSchPV und BinSchStrO (Lichter, Geschwindigkeit, Wellenschlag, Behinderung, Rotlicht an Schleusen, Ankern in der Fahrrinne, Kollision)
- Anruf auf K10, Lautsprecher, Martinshorn, Verfolgung mit zweiter Einheit, Kontrolle mit Verwarnungsgeld oder Anzeige
- UKW-Funkgerät mit Bedienteil (7-Segment-LCD, Drehknöpfe, Handmikrofon, DISTRESS unter Klappe), ATIS, Dual Watch, Rauschsperre, Reichweite
- Kanalbelegung K10 / K20 Schleuse Koblenz / K22 Oberwesel Revierzentrale; Funkverkehr der Berufsschifffahrt
- Sprachausgabe für Funk und Lautsprecher, Notruf MAYDAY/PAN-PAN, Schlepphilfe der Polizei

## 0.7.1 – Paket für GitHub Pages
_2026-11-25_

- Web-Version als ZIP zum Hosten auf GitHub Pages (keine Programmänderung)

## 0.7.0 – Wasserschutzpolizei, Schleusensignale, PBR-Texturen
_2026-11-25 12:40_

- Zwei WSP-Einheiten (Streifenboot, Kleinboot) mit Liegestelle in Pfaffendorf, Streife, Kontrollen, Blaulicht
- Detailliertes Schleusensignal (rot/grün) nach BinSchStrO
- Hochwertige Oberflächen (Poly Haven, CC0) für Beton, Stahl, Mauerwerk, Basalt; Spundwände mit Larssen-Profil

## 0.6.0 – Manövrierbarkeit und Wehre
_2026-11-25 07:40_

- Weniger Schieben und Driften bei langsamer Fahrt (hydrodynamische Zusatzmasse, verteilter Lateralwiderstand)
- Wehre als plausibel und durchgängig konstruierte Bauwerke ohne Geländeartefakte

## 0.5.1 – Schleusen: Kollision und Boxenliegeplätze
_2026-11-25 00:19_

- Kollision an Spundwänden und Mauern an der Außenkante des Modells
- Boxenliegeplätze an den Stegen richtig belegt (nicht quer zur Box)

## 0.5.0 – Schleusen überarbeitet
_2026-11-25 00:01_

- Geländeartefakte in Schleusen und Vorhäfen entfernt
- Stemmtore statt seitlich aufschwingender Tore
- Räumliches Strömungsgeräusch beim Füllen und Leeren

## 0.4.0 – Realistische Ruderwirkung
_2026-11-24 23:49_

- Ruderwirkung des Außenborders bei langsamer Fahrt korrigiert (Propellerstrahl, Fahrt durchs Wasser)

## 0.3.1 – Steuerung
_2026-11-24 23:33_

- Hart-Steuerbord/-Backbord blockierte nachfolgende Befehle; Mittschiffs (C) reagierte nicht zuverlässig

## 0.3.0 – Cockpit, Kollisionen, Ufer
_2026-11-24 22:33_

- Instrumente im 3D-Cockpit wiederhergestellt; Heckwelle bei voller Fahrt realistisch
- Fahrwege auf Kollisionen geprüft (Schleusen, Brücken, Signale); Hydrografie maßgeblich im Gewässer
- Artefakte und Z-Fighting an Gebäuden behoben; bessere Sicht nach vorn
- Spundwände und Kaimauern in der Innenstadt, Böschungen nach OSINT
- Taste zurück ins Cockpit, Tasten für Hart-Steuerbord/-Backbord, realistisches Anlegen (Kontaktmodell)

## 0.2.0 – Motor, Leinen, Start
_2026-11-24 21:56_

- Anlasser, Rudermittelstellung, schwimmende Pontons, Start am Steg mit Leinenphysik (Leinen einzeln lösen 1–4)
- Startkarte mit Liegeplatzwahl, Kraftstoffverbrauch, organisches Cockpit mit Sitzen und Innenraum

## 0.1.3 – Korrekturen
_2026-11-24 21:17_

- Fehlerbehebungen an der ersten Fassung (Einzelheiten nicht mehr nachvollziehbar)

## 0.1.2 – Korrekturen
_2026-11-24 21:07_

- Fehlerbehebungen an der ersten Fassung (Einzelheiten nicht mehr nachvollziehbar)

## 0.1.1 – Korrekturen
_2026-11-24 20:59_

- Fehlerbehebungen an der ersten Fassung (Einzelheiten nicht mehr nachvollziehbar)

## 0.1.0 – Erste Fassung
_2026-11-24 20:38_

- Rund 10 Flusskilometer um das Deutsche Eck aus offenen Geodaten (DGM1, Orthofotos, OpenStreetMap)
- 6-DOF-Bootsphysik mit Außenborder, Strömung, Wellen und lokaler Wellensimulation
- Schleusen mit Automat, KI-Schiffsverkehr, Wetter mit volumetrischen Wolken, Tag/Nacht
- Klickbares 3D-Cockpit, 2D-Instrumententafel, Seekarte mit Törnplanung, Funk, Einstellungen
