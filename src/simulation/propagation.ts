import type { AccessPoint, Point, Frequency, Structure } from '../domain/types'
import { raycastObstacles } from './raycast'

function pl0(freqMHz: number): number {
  return 32.4 + 20 * Math.log10(freqMHz)
}

function pathLossExponent(freq: Frequency): number {
  return freq === '2.4' ? 2.8 : 3.2
}

function frequencyMHz(freq: Frequency): number {
  return freq === '2.4' ? 2400 : 5000
}

function directionalGain(ap: AccessPoint, angleDeg: number): number {
  if (ap.type === 'omni') return 0

  const dir = ap.direction ?? 0
  const bw = ap.beamwidth ?? 60
  const diff = Math.abs(angleDeg - dir) % 360
  const normalized = diff > 180 ? 360 - diff : diff

  if (normalized < bw / 2) return 10
  if (normalized < 180 - bw / 2) return -10
  return -20
}

export function calculateRSSI(
  ap: AccessPoint,
  cell: Point,
  frequency: Frequency,
  structures: Structure[],
): number {
  const dx = cell.x - ap.position.x
  const dy = cell.y - ap.position.y
  const distancePixels = Math.sqrt(dx * dx + dy * dy)

  const pixelsPerMeter = 100
  const distanceMeters = Math.max(0.5, distancePixels / pixelsPerMeter)

  const fMHz = frequencyMHz(frequency)
  const loss = pl0(fMHz)
  const n = pathLossExponent(frequency)
  const pathLoss = 10 * n * Math.log10(distanceMeters)

  let attenuation = raycastObstacles(ap.position, cell, structures, frequency)

  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI
  const gain = directionalGain(ap, angleDeg)

  return ap.txPowerDbm + gain - loss - pathLoss - attenuation
}

export function calculateGrid(
  aps: AccessPoint[],
  structures: Structure[],
  frequency: Frequency,
  gridWidth: number,
  gridHeight: number,
  worldWidth: number,
  worldHeight: number,
): Float32Array {
  const size = gridWidth * gridHeight
  const grid = new Float32Array(size)

  const cellW = worldWidth / gridWidth
  const cellH = worldHeight / gridHeight

  for (let gy = 0; gy < gridHeight; gy++) {
    for (let gx = 0; gx < gridWidth; gx++) {
      const cx = gx * cellW + cellW / 2
      const cy = gy * cellH + cellH / 2
      const cell: Point = { x: cx, y: cy }

      let maxRSSI = -Infinity
      for (const ap of aps) {
        const rssi = calculateRSSI(ap, cell, frequency, structures)
        if (rssi > maxRSSI) maxRSSI = rssi
      }

      grid[gy * gridWidth + gx] = maxRSSI === -Infinity ? -100 : maxRSSI
    }
  }

  return grid
}
