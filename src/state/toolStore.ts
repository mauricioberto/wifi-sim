import { createStore } from 'zustand/vanilla'
import type { ToolType } from '../domain/types'

interface ToolState {
  activeTool: ToolType
  setActiveTool: (tool: ToolType) => void
}

export const useToolStore = createStore<ToolState>((set) => ({
  activeTool: 'select',
  setActiveTool: (activeTool) => set({ activeTool }),
}))
