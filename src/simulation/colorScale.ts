export interface ColorStop {
  threshold: number
  label: string
  color: string
}

export const COLOR_STOPS: ColorStop[] = [
  { threshold: -45, label: '≥ -45', color: '#0064FF' },
  { threshold: -55, label: '-55', color: '#32CD32' },
  { threshold: -65, label: '-65', color: '#FFD700' },
  { threshold: -75, label: '-75', color: '#FFA500' },
  { threshold: -85, label: '-85', color: '#DC3232' },
  { threshold: -Infinity, label: 'sem sinal', color: '#808080' },
]

export function rssiToColor(rssi: number): [number, number, number, number] {
  if (rssi < -85) return [128, 128, 128, 100]
  if (rssi < -75) return [220, 50, 50, 180]
  if (rssi < -65) return [255, 165, 0, 180]
  if (rssi < -55) return [255, 255, 0, 180]
  if (rssi < -45) return [50, 205, 50, 180]
  return [0, 100, 255, 180]
}

export function gridToImageData(
  grid: Float32Array,
  gridWidth: number,
  gridHeight: number,
): ImageData {
  const imageData = new ImageData(gridWidth, gridHeight)
  const data = imageData.data

  for (let i = 0; i < grid.length; i++) {
    const [r, g, b, a] = rssiToColor(grid[i])
    const idx = i * 4
    data[idx] = r
    data[idx + 1] = g
    data[idx + 2] = b
    data[idx + 3] = a
  }

  return imageData
}
