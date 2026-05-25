import { useMemo } from 'react'
import {
  createSvgConfig,
  getViewBox,
  getVisibleArea,
  markerFrets,
  strings,
} from '../services/fretboard'

interface FretboardProps {
  selectedFret: number | null
  hoverFret: number | null
  onSelectFret: (fret: number) => void
  onHoverFret: (fret: number | null) => void
}

function Fretboard({
  selectedFret,
  hoverFret,
  onSelectFret,
  onHoverFret,
}: FretboardProps) {
  const svgConfig = useMemo(() => createSvgConfig(), [])
  const visibleArea = useMemo(
    () => getVisibleArea(selectedFret, svgConfig),
    [selectedFret, svgConfig],
  )
  const viewBox = useMemo(
    () => getViewBox(selectedFret, visibleArea, svgConfig),
    [selectedFret, visibleArea, svgConfig],
  )

  return (
    <svg viewBox={viewBox} className="fretboard-svg" aria-label="Gitarren-Griffbrett">
      <defs>
        <linearGradient id="wood-grain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e5c29f" />
          <stop offset="40%" stopColor="#d4a66d" />
          <stop offset="100%" stopColor="#b17a49" />
        </linearGradient>
      </defs>

      <rect
        x={svgConfig.left - 18}
        y={svgConfig.top - 18}
        width={svgConfig.boardWidth + 36}
        height={svgConfig.boardHeight + 36}
        rx={24}
        fill="url(#wood-grain)"
      />

      {svgConfig.stringPositions.map((y, index) => (
        <line
          key={`string-${index}`}
          x1={svgConfig.left}
          x2={svgConfig.left + svgConfig.boardWidth + 18}
          y1={y}
          y2={y}
          className="fret-string"
        />
      ))}

      {svgConfig.fretPositions.map((x, fret) => {
        const isNut = fret === 0
        const isSelected = selectedFret === fret
        const showMarker = markerFrets.includes(fret)

        return (
          <g key={`fret-${fret}`}>
            <line
              x1={x}
              x2={x}
              y1={svgConfig.top - 6}
              y2={svgConfig.top + svgConfig.boardHeight + 6}
              className={isNut ? 'fret-nut' : 'fret-line'}
              style={{ strokeWidth: isNut ? 10 : isSelected ? 6 : 2 }}
            />

            {showMarker && fret > 0 && (
              <circle
                cx={x + 14}
                cy={svgConfig.top + svgConfig.boardHeight / 2}
                r={6}
                className="fret-marker"
              />
            )}

            <rect
              x={x - svgConfig.clickWidth / 2}
              y={svgConfig.top - 16}
              width={svgConfig.clickWidth}
              height={svgConfig.boardHeight + 40}
              fill="transparent"
              className="fret-click-area"
              onClick={() => onSelectFret(fret)}
              onMouseEnter={() => onHoverFret(fret)}
              onMouseLeave={() => onHoverFret(null)}
            />

            <text
              x={x}
              y={svgConfig.top + svgConfig.boardHeight + 36}
              textAnchor="middle"
              className="fret-label"
            >
              {fret}
            </text>

            {hoverFret === fret && (
              <text
                x={x}
                y={svgConfig.top - 14}
                textAnchor="middle"
                className="fret-hover-label"
              >
                Bund {fret}
              </text>
            )}
          </g>
        )
      })}

      {svgConfig.stringPositions.map((y, index) => (
        <text
          key={`string-label-${index}`}
          x={svgConfig.left - 42}
          y={y + 6}
          className="string-label"
        >
          {strings[index]}
        </text>
      ))}
    </svg>
  )
}

export default Fretboard
