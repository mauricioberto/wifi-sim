import { useToolStore } from '../state/toolStore'
import { useProjectStore } from '../state/projectStore'

export function setupKeyboardShortcuts(): void {
  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return

    const projectStore = useProjectStore.getState()

    switch (e.key.toLowerCase()) {
      case 'v': useToolStore.getState().setActiveTool('select'); break
      case 'w': useToolStore.getState().setActiveTool('wall'); break
      case 'g': useToolStore.getState().setActiveTool('glass'); break
      case 'd': useToolStore.getState().setActiveTool('door'); break
      case 'r': useToolStore.getState().setActiveTool('pallet'); break
      case 'c': useToolStore.getState().setActiveTool('column'); break
      case 'o': useToolStore.getState().setActiveTool('ap-omni'); break
      case 'x': useToolStore.getState().setActiveTool('ap-directional'); break
      case 'e': useToolStore.getState().setActiveTool('erase'); break
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault()
      if (e.shiftKey) {
        projectStore.redo()
      } else {
        projectStore.undo()
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault()
      projectStore.redo()
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      const selected = useProjectStore.getState().selectedIds
      for (const id of selected) {
        if (id.startsWith('ap_')) projectStore.removeAccessPoint(id)
        else projectStore.removeStructure(id)
      }
      projectStore.clearSelection()
    }
  })
}
