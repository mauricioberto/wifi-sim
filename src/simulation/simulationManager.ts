import type { AccessPoint, Structure, Frequency } from '../domain/types'

export interface SimulationResult {
  imageData: ImageData
}

export class SimulationManager {
  private worker: Worker | null = null
  private pending = false
  private onResult: ((result: SimulationResult) => void) | null = null

  constructor(onResult: (result: SimulationResult) => void) {
    this.onResult = onResult
    this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })

    this.worker.onmessage = (e: MessageEvent<SimulationResult>) => {
      this.pending = false
      this.onResult?.(e.data)
    }
  }

  requestSimulation(
    aps: AccessPoint[],
    structures: Structure[],
    frequency: Frequency,
    gridWidth: number,
    gridHeight: number,
    worldWidth: number,
    worldHeight: number,
  ): void {
    if (this.pending || !this.worker) return
    this.pending = true

    this.worker.postMessage({
      aps,
      structures,
      frequency,
      gridWidth,
      gridHeight,
      worldWidth,
      worldHeight,
    })
  }

  destroy(): void {
    this.worker?.terminate()
    this.worker = null
  }
}
