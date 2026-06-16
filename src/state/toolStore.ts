import { create } from 'zustand'
import type { ToolType } from '../domain/types'

interface ToolState {
  activeTool: ToolType
  setActiveTool: (tool: ToolType) => void
}

export const useToolStore = create<ToolState>((set) => ({
  activeTool: 'select',
  setActiveTool: (activeTool) => set({ activeTool }),
}))
