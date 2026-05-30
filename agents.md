# Agenten-Übersicht für das Projekt

## Projektbeschreibung
Dieses Projekt ist eine kleine React-Anwendung mit TypeScript und Vite, die ein Gitarren-Griffbrett visualisiert.

Die App zeigt:
- ein sechssaitiges Griffbrett mit 15 Bünden
- Notennamen für jede Saite und jeden Bund
- Marker an typischen Bundpositionen (3, 5, 7, 9, 12, 15)
- zoombare Ansicht auf einen ausgewählten Bund

Der Nutzer kann einen Bund anklicken, um auf diesen Bereich zu zoomen, und den gesamten Griffbrettbereich wiederherstellen.

## Hauptbestandteile
- `src/App.tsx` - Hauptkomponente, verwaltet die Bund-Auswahl und den sichtbaren Bereich
- `src/components/Fretboard.tsx` - rendert das Griffbrett als SVG
- `src/services/fretboard.ts` - Berechnung von Noten, sichtbarem Bereich, SVG-Konfiguration und Griffbrettlogik

## Technologie-Stack
- React 19
- TypeScript
- Vite
- ESLint

## Nützliche Befehle
- `npm run dev` - Entwicklungsserver starten
- `npm run build` - Produktionsbuild erstellen
- `npm run preview` - gebauten Stand lokal vorschauen

## Pflegehinweis
Diese Datei soll als zentrale Zusammenfassung für Agenten dienen, die das Projekt verstehen oder automatisiert bearbeiten.

Bitte aktualisiere `agents.md` weiterhin bei folgenden Änderungen:
- neue Hauptfunktionen oder geänderte App-Logik
- größere Änderungen an der Architektur oder am Tech-Stack
- Umbenennungen oder Verschiebungen der wichtigsten Komponenten

So bleibt die Agenten-Dokumentation synchron mit dem aktuellen Projektstatus.