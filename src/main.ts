import './style.css'
import { CanvasStage } from './canvas/Stage'
import { renderToolbar } from './components/Toolbar'
import { renderLegend } from './components/Legend'
import { renderSettingsPanel } from './components/SettingsPanel'
import { setupKeyboardShortcuts } from './components/KeyboardShortcuts'
import { useSettingsStore } from './state/settingsStore'
import { useProjectStore } from './state/projectStore'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <div class="flex h-full w-full">
    <div id="toolbar" class="z-10"></div>
    <div id="canvas-container" class="flex-1 relative bg-white overflow-hidden"></div>
    <div id="settings-panel"></div>
  </div>
  <div id="legend"></div>
`

renderToolbar('toolbar')
renderSettingsPanel('settings-panel')
renderLegend('legend')
setupKeyboardShortcuts()

const canvas = new CanvasStage('canvas-container')

useSettingsStore.subscribe((s) => {
  canvas.background.setGrid(s.grid.enabled, s.grid.size)
  canvas.heatmap.setVisible(s.heatmapVisible)
})

useProjectStore.subscribe(() => {
  canvas.background.redraw(canvas.stage.width(), canvas.stage.height())
})
