import { useMemo, useState } from 'react'
import Fretboard from './components/Fretboard'
import { getVisibleRange, getVisibleTriadInversions } from './services/fretboard'
import './App.css'

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const modes = ['Dur', 'Moll'] as const
const lowStrings = ['E', 'A', 'D', 'G']

function App() {
  const [selectedFret, setSelectedFret] = useState<number | null>(null)
  const [selectedNote, setSelectedNote] = useState(noteNames[0])
  const [selectedMode, setSelectedMode] = useState<typeof modes[number]>(modes[0])
  const [selectedLowString, setSelectedLowString] = useState(lowStrings[0])

  const visibleRange = getVisibleRange(selectedFret)

  const triadResults = useMemo(
    () =>
      getVisibleTriadInversions(
        selectedNote,
        selectedMode,
        selectedLowString,
        visibleRange,
      ),
    [selectedNote, selectedMode, selectedLowString, visibleRange],
  )

  return (
    <main className="app-shell">
      <section className="fretboard-card">
        <div className="toolbar">
          <div className="toolbar-controls">
            <label className="toolbar-control">
              <span>Note</span>
              <select
                value={selectedNote}
                onChange={(event) => setSelectedNote(event.target.value)}
              >
                {noteNames.map((note) => (
                  <option key={note} value={note}>
                    {note}
                  </option>
                ))}
              </select>
            </label>

            <label className="toolbar-control">
              <span>Tonart</span>
              <select
                value={selectedMode}
                onChange={(event) => setSelectedMode(event.target.value as typeof modes[number])}
              >
                {modes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </label>

            <label className="toolbar-control">
              <span>Tiefe Saite</span>
              <select
                value={selectedLowString}
                onChange={(event) => setSelectedLowString(event.target.value)}
              >
                {lowStrings.map((stringName) => (
                  <option key={stringName} value={stringName}>
                    {stringName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            className="clear-button"
            onClick={() => setSelectedFret(null)}
            disabled={selectedFret === null}
          >
            Zurück
          </button>
        </div>

        <div className="fretboard-meta">
          <div>{selectedFret === null ? 'Gesamtes Griffbrett' : `Zoom auf Bund ${selectedFret}`}</div>
          <div>Bereich: {visibleRange.start} – {visibleRange.end}</div>
          <div>Tonart: {selectedNote} {selectedMode}</div>
          <div>Tiefe Saite: {selectedLowString}</div>
        </div>

        <div className="triad-results">
          <div>
            {triadResults.length > 0
              ? 'Gefundene Dreiklang-Umkehrungen:'
              : 'Keine Dreiklang-Umkehrungen im sichtbaren Bereich'}
          </div>
          {triadResults.length > 0 && (
            <ul>
              {triadResults.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          )}
        </div>

        <Fretboard
          selectedFret={selectedFret}
          onSelectFret={setSelectedFret}
        />
      </section>
    </main>
  )
}

export default App
