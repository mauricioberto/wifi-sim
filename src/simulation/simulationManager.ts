import type { AccessPoint, Structure, Frequency } from '../domain/types'

export interface SimulationResult {
  imageData: ImageData
}

interface PendingParams {
  aps: AccessPoint[]
  structures: Structure[]
  frequency: Frequency
  gridWidth: number
  gridHeight: number
  worldWidth: number
  worldHeight: number
}

export class SimulationManager {
  private worker: Worker | null = null
  private pending = false
  private queued: PendingParams | null = null
  private onResult: ((result: SimulationResult) => void) | null = null

  constructor(onResult: (result: SimulationResult) => void) {
    this.onResult = onResult
    this.createWorker()
  }

  private createWorker(): void {
    this.worker?.terminate()
    this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })

    this.worker.onmessage = (e: MessageEvent<SimulationResult>) => {
      this.pending = false
      this.onResult?.(e.data)

      if (this.queued) {
        const params = this.queued
        this.queued = null
        this.requestSimulation(
          params.aps, params.structures, params.frequency,
          params.gridWidth, params.gridHeight,
          params.worldWidth, params.worldHeight,
        )
      }
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
    if (!this.worker) return

    if (this.pending) {
      this.queued = { aps, structures, frequency, gridWidth, gridHeight, worldWidth, worldHeight }
      this.worker.terminate()
      this.worker = null
      this.pending = false
      this.createWorker()
      this.pending = true
      this.worker!.postMessage(this.queued)
      this.queued = null
      return
    }

    this.pending = true
    this.worker.postMessage({
      aps, structures, frequency, gridWidth, gridHeight, worldWidth, worldHeight,
    })
  }

  destroy(): void {
    this.worker?.terminate()
    this.worker = null
    this.queued = null
  }
}
