import { useState } from 'react'
import Fretboard from './components/Fretboard'
import { getVisibleRange } from './services/fretboard'
import './App.css'

function App() {
  const [selectedFret, setSelectedFret] = useState<number | null>(null)

  const visibleRange = getVisibleRange(selectedFret)

  return (
    <main className="app-shell">
      <section className="fretboard-card">
        <div className="toolbar">
          <div className="fretboard-meta">
            <div>{selectedFret === null ? 'Gesamtes Griffbrett' : `Zoom auf Bund ${selectedFret}`}</div>
            <div>Bereich: {visibleRange.start} – {visibleRange.end}</div>
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

        <Fretboard
          selectedFret={selectedFret}
          onSelectFret={setSelectedFret}
        />
      </section>
    </main>
  )
}

export default App
