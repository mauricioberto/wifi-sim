import { createStore } from 'zustand/vanilla'
import type { Frequency, GridSettings } from '../domain/types'

interface SettingsState {
  frequency: Frequency
  grid: GridSettings
  heatmapVisible: boolean
  heatmapResolution: number
  autoRecalculate: boolean
  setFrequency: (freq: Frequency) => void
  setGrid: (grid: Partial<GridSettings>) => void
  toggleHeatmap: () => void
  setHeatmapResolution: (res: number) => void
  setAutoRecalculate: (val: boolean) => void
}

export const useSettingsStore = createStore<SettingsState>((set) => ({
  frequency: '2.4',
  grid: { enabled: true, size: 20 },
  heatmapVisible: true,
  heatmapResolution: 200,
  autoRecalculate: true,
  setFrequency: (frequency) => set({ frequency }),
  setGrid: (partial) => set((s) => ({ grid: { ...s.grid, ...partial } })),
  toggleHeatmap: () => set((s) => ({ heatmapVisible: !s.heatmapVisible })),
  setHeatmapResolution: (heatmapResolution) => set({ heatmapResolution }),
  setAutoRecalculate: (autoRecalculate) => set({ autoRecalculate }),
}))
