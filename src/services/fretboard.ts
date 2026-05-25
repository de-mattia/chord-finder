export const strings = ['E', 'A', 'D', 'G', 'B', 'e']
export const totalFrets = 15
export const fretNumbers = Array.from({ length: totalFrets + 1 }, (_, index) => index)
export const markerFrets = [3, 5, 7, 9, 12, 15]

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
