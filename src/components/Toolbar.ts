import { useToolStore } from '../state/toolStore'
import { useProjectStore } from '../state/projectStore'
import type { ToolType } from '../domain/types'

interface ToolButton {
  tool: ToolType
  label: string
  shortcut: string
  icon: string
}

const tools: ToolButton[] = [
  { tool: 'select', label: 'Selecionar', shortcut: 'V', icon: '⬚' },
  { tool: 'wall', label: 'Parede Externa', shortcut: 'W', icon: '▤' },
  { tool: 'glass', label: 'Vidro', shortcut: 'G', icon: '▢' },
  { tool: 'door', label: 'Porta', shortcut: 'D', icon: '⊓' },
  { tool: 'pallet', label: 'Palete', shortcut: 'R', icon: '▬' },
  { tool: 'column', label: 'Coluna', shortcut: 'C', icon: '○' },
  { tool: 'ap-omni', label: 'AP Omni', shortcut: 'O', icon: '◎' },
  { tool: 'ap-directional', label: 'AP Direcional', shortcut: 'X', icon: '→' },
  { tool: 'erase', label: 'Borracha', shortcut: 'E', icon: '✕' },
]

export function renderToolbar(containerId: string): void {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = ''
  container.className = 'w-14 bg-gray-900 flex flex-col items-center py-2 gap-1 z-10 select-none'

  for (const t of tools) {
    const btn = document.createElement('button')
    btn.className = 'w-10 h-10 flex items-center justify-center rounded-lg text-lg hover:bg-gray-700 transition-colors'
    btn.title = `${t.label} (${t.shortcut})`
    btn.dataset.tool = t.tool
    btn.textContent = t.icon

    btn.addEventListener('click', () => {
      useToolStore.getState().setActiveTool(t.tool)
      updateActiveTool()
    })

    container.appendChild(btn)
  }

  const sep = document.createElement('div')
  sep.className = 'w-8 h-px bg-gray-700 my-1'
  container.appendChild(sep)

  const clearBtn = document.createElement('button')
  clearBtn.className = 'w-10 h-10 flex items-center justify-center rounded-lg text-sm text-red-400 hover:bg-gray-700 transition-colors'
  clearBtn.title = 'Limpar Tudo'
  clearBtn.textContent = '🗑'
  clearBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar tudo?')) {
      useProjectStore.getState().resetProject()
    }
  })
  container.appendChild(clearBtn)

  updateActiveTool = () => {
    const active = useToolStore.getState().activeTool
    container.querySelectorAll('button').forEach((b) => {
      if (b.dataset.tool) {
        b.className = b.dataset.tool === active
          ? 'w-10 h-10 flex items-center justify-center rounded-lg text-lg bg-blue-600 text-white'
          : 'w-10 h-10 flex items-center justify-center rounded-lg text-lg hover:bg-gray-700 transition-colors text-gray-300'
      }
    })
  }

  useToolStore.subscribe(() => updateActiveTool())
  updateActiveTool()
}

let updateActiveTool: () => void = () => {}
