import { useMemo } from 'react'
import {
  createSvgConfig,
  getNoteForStringFret,
  getViewBox,
  getVisibleArea,
  markerFrets,
  strings,
} from '../services/fretboard'
import type { TriadMatch } from '../services/fretboard'

interface FretboardProps {
  selectedFret: number | null
  onSelectFret: (fret: number) => void
  triadMatches: TriadMatch[]
}

function Fretboard({
  selectedFret,
  onSelectFret,
  triadMatches,
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

  const reversedStringIndices = useMemo(
    () => Array.from({ length: strings.length }, (_, index) => strings.length - 1 - index),
    [],
  )

  const triadColors = ['#2563eb', '#16a34a', '#d97706', '#9333ea', '#be123c']

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

      {reversedStringIndices.map((stringIndex, renderedIndex) => {
        const y = svgConfig.stringPositions[renderedIndex]

        return svgConfig.fretPositions.map((x, fret) => {
          const note = getNoteForStringFret(stringIndex, fret)

          return (
            <text
              key={`note-${stringIndex}-${fret}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="note-grid-label"
            >
              {note}
            </text>
          )
        })
      })}

      {reversedStringIndices.map((stringIndex, renderedIndex) => (
        <line
          key={`string-${stringIndex}`}
          x1={svgConfig.left}
          x2={svgConfig.left + svgConfig.boardWidth + 18}
          y1={svgConfig.stringPositions[renderedIndex]}
          y2={svgConfig.stringPositions[renderedIndex]}
          className="fret-string"
        />
      ))}

      {triadMatches.flatMap((match, matchIndex) =>
        match.positions.map((position, index) => {
          const x = svgConfig.fretPositions[position.fret]
          const y = svgConfig.stringPositions[strings.length - 1 - position.stringIndex]
          const chordColor = triadColors[matchIndex % triadColors.length]
          const dotStyle = {
            fill: chordColor,
            stroke: '#fff',
            strokeWidth: position.isRoot ? 2 : 1.5,
          }

          return (
            <circle
              key={`triad-${match.label}-${position.stringIndex}-${position.fret}-${index}`}
              cx={x}
              cy={y}
              r={position.isRoot ? 8 : 6}
              className={position.isRoot ? 'triad-root-dot' : 'triad-dot'}
              style={dotStyle}
            />
          )
        }),
      )}

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
            />

            <text
              x={x}
              y={svgConfig.top + svgConfig.boardHeight + 36}
              textAnchor="middle"
              className="fret-label"
            >
              {fret}
            </text>
          </g>
        )
      })}

      {reversedStringIndices.map((stringIndex, renderedIndex) => (
        <text
          key={`string-label-${stringIndex}`}
          x={svgConfig.left - 42}
          y={svgConfig.stringPositions[renderedIndex] + 6}
          className="string-label"
        >
          {strings[stringIndex]}
        </text>
      ))}
    </svg>
  )
}

export default Fretboard
