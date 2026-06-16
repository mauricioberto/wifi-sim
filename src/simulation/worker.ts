import { calculateGrid } from './propagation'
import { gridToImageData } from './colorScale'
import type { AccessPoint, Structure, Frequency } from '../domain/types'

interface WorkerMessage {
  aps: AccessPoint[]
  structures: Structure[]
  frequency: Frequency
  gridWidth: number
  gridHeight: number
  worldWidth: number
  worldHeight: number
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { aps, structures, frequency, gridWidth, gridHeight, worldWidth, worldHeight } = e.data

  const grid = calculateGrid(aps, structures, frequency, gridWidth, gridHeight, worldWidth, worldHeight)
  const imageData = gridToImageData(grid, gridWidth, gridHeight)

  const transferable = imageData.data.buffer as ArrayBuffer
  self.postMessage({ imageData }, [transferable])
}
