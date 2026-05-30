export const strings = ['E', 'A', 'D', 'G', 'B', 'e']
export const totalFrets = 15
export const fretNumbers = Array.from({ length: totalFrets + 1 }, (_, index) => index)
export const markerFrets = [3, 5, 7, 9, 12, 15]

const chromaticNoteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function noteToPitchClass(note: string) {
  const normalized = note.toUpperCase()

  switch (normalized) {
    case 'C':
      return 0
    case 'C#':
    case 'DB':
      return 1
    case 'D':
      return 2
    case 'D#':
    case 'EB':
      return 3
    case 'E':
      return 4
    case 'F':
      return 5
    case 'F#':
    case 'GB':
      return 6
    case 'G':
      return 7
    case 'G#':
    case 'AB':
      return 8
    case 'A':
      return 9
    case 'A#':
    case 'BB':
      return 10
    case 'B':
      return 11
    default:
      return 0
  }
}

export function pitchClassToNoteLetter(pitchClass: number) {
  const normalizedPitchClass = (pitchClass % 12 + 12) % 12

  return chromaticNoteNames[normalizedPitchClass]
}

export function getNoteForStringFret(stringIndex: number, fret: number) {
  const openStringPitchClass = noteToPitchClass(strings[stringIndex])

  return pitchClassToNoteLetter(openStringPitchClass + fret)
}

export interface SvgConfig {
  width: number
  height: number
  left: number
  right: number
  top: number
  bottom: number
  boardWidth: number
  boardHeight: number
  stringPositions: number[]
  fretPositions: number[]
  clickWidth: number
}

export interface VisibleRange {
  start: number
  end: number
}

export interface VisibleArea {
  x: number
  width: number
}

export type Mode = 'Dur' | 'Moll'

interface TriadInversion {
  label: string
  notes: string[]
}

export interface TriadPosition {
  stringIndex: number
  fret: number
  note: string
  isRoot: boolean
}

export interface TriadMatch {
  label: string
  notes: string[]
  positions: TriadPosition[]
}

const modeTriadIntervals: Record<Mode, number[]> = {
  Dur: [0, 4, 7],
  Moll: [0, 3, 7],
}

const inversionLabels = ['Grundstellung', '1. Umkehrung', '2. Umkehrung'] as const

export function getTriadInversions(rootNote: string, mode: Mode): TriadInversion[] {
  const rootPitchClass = noteToPitchClass(rootNote)
  const triadNotes = modeTriadIntervals[mode].map((interval) =>
    pitchClassToNoteLetter(rootPitchClass + interval),
  )

  return [
    { label: inversionLabels[0], notes: triadNotes },
    { label: inversionLabels[1], notes: [triadNotes[1], triadNotes[2], triadNotes[0]] },
    { label: inversionLabels[2], notes: [triadNotes[2], triadNotes[0], triadNotes[1]] },
  ]
}

export function getVisibleTriadInversions(
  selectedNote: string,
  selectedMode: Mode,
  selectedLowString: string,
  visibleRange: VisibleRange,
): TriadMatch[] {
  const startStringIndex = strings.findIndex((stringName) => stringName === selectedLowString)

  if (startStringIndex === -1 || startStringIndex > strings.length - 3) {
    return []
  }

  const selectedStringIndices = [
    startStringIndex,
    startStringIndex + 1,
    startStringIndex + 2,
  ]
  const visibleFrets = Array.from(
    { length: visibleRange.end - visibleRange.start + 1 },
    (_, index) => visibleRange.start + index,
  )

  return getTriadInversions(selectedNote, selectedMode)
    .map((inversion) => {
      const positions = inversion.notes.map((note, index) => {
        const stringIndex = selectedStringIndices[index]
        const fret = visibleFrets.find(
          (visibleFret) => getNoteForStringFret(stringIndex, visibleFret) === note,
        )

        return fret === undefined
          ? null
          : {
              stringIndex,
              fret,
              note,
              isRoot: note === selectedNote,
            }
      })

      if (positions.some((position) => position === null)) {
        return null
      }

      return {
        label: inversion.label,
        notes: inversion.notes,
        positions: positions as TriadPosition[],
      }
    })
    .filter((match): match is TriadMatch => match !== null)
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function createSvgConfig(): SvgConfig {
  const width = 960
  const height = 380
  const left = 64
  const right = 24
  const top = 40
  const bottom = 52
  const boardWidth = width - left - right
  const boardHeight = 260
  const stringPositions = strings.map(
    (_, index) => top + (boardHeight / (strings.length - 1)) * index,
  )
  const fretPositions = fretNumbers.map(
    (fret) => left + (fret / totalFrets) * boardWidth,
  )

  return {
    width,
    height,
    left,
    right,
    top,
    bottom,
    boardWidth,
    boardHeight,
    stringPositions,
    fretPositions,
    clickWidth: Math.max(32, boardWidth / 14),
  }
}

export function getVisibleRange(selectedFret: number | null): VisibleRange {
  if (selectedFret === null) {
    return { start: 0, end: totalFrets }
  }

  return {
    start: clamp(selectedFret - 3, 0, totalFrets),
    end: clamp(selectedFret + 3, 0, totalFrets),
  }
}

export function getVisibleArea(
  selectedFret: number | null,
  svgConfig: SvgConfig,
): VisibleArea {
  if (selectedFret === null) {
    return { x: 0, width: svgConfig.width }
  }

  const windowSize = 7
  const startFret = clamp(selectedFret - 3, 0, totalFrets - (windowSize - 1))
  const endFret = Math.min(startFret + windowSize - 1, totalFrets)
  const startX = svgConfig.fretPositions[startFret]
  const endX = svgConfig.fretPositions[endFret]
  const width = Math.max(32, endX - startX + 24)
  const x = clamp(startX - 12, 0, svgConfig.width - width)

  return { x, width }
}

export function getViewBox(
  selectedFret: number | null,
  visibleArea: VisibleArea,
  svgConfig: SvgConfig,
) {
  if (selectedFret === null) {
    return `0 0 ${svgConfig.width} ${svgConfig.height}`
  }

  return `${visibleArea.x} 0 ${visibleArea.width} ${svgConfig.height}`
}
