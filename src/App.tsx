import { useState } from 'react'
import Fretboard from './components/Fretboard'
import { getVisibleRange } from './services/fretboard'
import './App.css'

function App() {
  const [selectedFret, setSelectedFret] = useState<number | null>(null)
  const [hoverFret, setHoverFret] = useState<number | null>(null)

  const visibleRange = getVisibleRange(selectedFret)

  return (
    <main className="app-shell">
      <section className="hero-section">
        <p className="eyebrow">Gitarren-Akkordfinder</p>
        <h1>Finde Bünde und zoom direkt auf deinen Griffbrettbereich</h1>
        <p>
          Wähle einen Bund von 0 bis 12, um den Bereich +/- 3 Bünde fokussiert auf dem
          Gitarrenhals anzuzeigen. Klicke erneut zum Zurücksetzen.
        </p>
      </section>

      <section className="fretboard-card">
        <div className="fretboard-header">
          <div>
            <span className="status-label">Aktuelle Ansicht</span>
            <h2>{selectedFret === null ? 'Gesamtes Griffbrett' : `Zoom auf Bund ${selectedFret}`}</h2>
          </div>
          <div className="fretboard-meta">
            <div>Bereich: {visibleRange.start} – {visibleRange.end}</div>
            <button
              type="button"
              className="clear-button"
              onClick={() => setSelectedFret(null)}
              disabled={selectedFret === null}
            >
              Zurück zur 0–12 Ansicht
            </button>
          </div>
        </div>

        <Fretboard
          selectedFret={selectedFret}
          hoverFret={hoverFret}
          onSelectFret={setSelectedFret}
          onHoverFret={setHoverFret}
        />
      </section>
    </main>
  )
}

export default App
