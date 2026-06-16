import './style.css'
import { CanvasStage } from './canvas/Stage'
import { useSettingsStore } from './state/settingsStore'
import { useProjectStore } from './state/projectStore'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <div class="flex h-full w-full">
    <div id="toolbar" class="w-14 bg-gray-900 flex flex-col items-center py-2 gap-1 z-10"></div>
    <div id="canvas-container" class="flex-1 relative bg-gray-100 overflow-hidden"></div>
    <div id="settings-panel" class="w-72 bg-white border-l border-gray-200 hidden"></div>
  </div>
  <div id="legend" class="absolute bottom-0 left-14 right-0 h-10 bg-white border-t border-gray-200 flex items-center px-4 text-sm text-gray-600">
    Legenda do heatmap
  </div>
`

const canvas = new CanvasStage('canvas-container')

useSettingsStore.subscribe((s) => {
  canvas.background.setGrid(s.grid.enabled, s.grid.size)
})

useProjectStore.subscribe(() => {
  canvas.background.redraw(canvas.stage.width(), canvas.stage.height())
})
