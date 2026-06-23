import Konva from 'konva'
import { BackgroundLayer } from './layers/BackgroundLayer'
import { StructuresLayer } from './layers/StructuresLayer'
import { APLayer } from './layers/APLayer'
import { HeatmapLayer } from './layers/HeatmapLayer'
import { SelectionLayer } from './layers/SelectionLayer'
import { DrawTool } from './tools/DrawTool'
import { EraseTool } from './tools/EraseTool'
import { APTool } from './tools/APTool'
import { useProjectStore } from '../state/projectStore'
import { useSettingsStore } from '../state/settingsStore'
import { SimulationManager } from '../simulation/simulationManager'

interface StageState {
  isPanning: boolean
  spacePressed: boolean
  lastPos: { x: number; y: number } | null
  stageAtPanStart: { x: number; y: number } | null
}

export class CanvasStage {
  readonly stage: Konva.Stage
  readonly background: BackgroundLayer
  readonly structures: StructuresLayer
  readonly apLayer: APLayer
  readonly heatmap: HeatmapLayer
  readonly selection: SelectionLayer
  readonly drawTool: DrawTool
  readonly apTool: APTool
  private state: StageState
  private unsubStructures: (() => void) | null = null
  private simManager: SimulationManager
  private debounceTimer: ReturnType<typeof setTimeout> | null = null

  constructor(containerId: string) {
    const container = document.getElementById(containerId) as HTMLDivElement | null
    if (!container) throw new Error(`Container #${containerId} not found`)

    this.stage = new Konva.Stage({
      container,
      width: container.clientWidth,
      height: container.clientHeight,
      draggable: false,
    })

    this.background = new BackgroundLayer()
    this.structures = new StructuresLayer()
    this.apLayer = new APLayer()
    this.heatmap = new HeatmapLayer()
    this.selection = new SelectionLayer()

    this.stage.add(
      this.background.layer,
      this.structures.layer,
      this.apLayer.layer,
      this.heatmap.layer,
      this.selection.layer,
    )

    this.drawTool = new DrawTool(this.stage)
    this.apTool = new APTool(this.stage)
    new EraseTool(this.stage)

    this.simManager = new SimulationManager((result) => {
      const stageBox = this.stage.getClientRect({ relativeTo: this.stage })
      this.heatmap.renderImageData(
        result.imageData,
        stageBox.x, stageBox.y,
        stageBox.width, stageBox.height,
      )
    })

    this.state = { isPanning: false, spacePressed: false, lastPos: null, stageAtPanStart: null }
    this.setupPanZoom()
    this.setupResize()
    this.setupStoreSync()
    const initialBg = useProjectStore.getState().project.backgroundImage
    this.loadBackgroundImage(initialBg)
  }

  private scheduleSimulation(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => this.runSimulation(), 300)
  }

  private runSimulation(): void {
    const project = useProjectStore.getState().project
    const settings = useSettingsStore.getState()
    if (project.accessPoints.length === 0) {
      this.heatmap.clear()
      return
    }

    const res = settings.heatmapResolution
    const stageWidth = this.stage.width()
    const stageHeight = this.stage.height()

    this.simManager.requestSimulation(
      project.accessPoints,
      project.structures,
      project.frequency,
      res,
      res,
      stageWidth,
      stageHeight,
    )
  }

  private loadBackgroundImage(dataUrl?: string): void {
    if (dataUrl) {
      const img = new window.Image()
      img.onload = () => this.background.setBackgroundImage(img)
      img.src = dataUrl
    } else {
      this.background.setBackgroundImage(null)
    }
  }

  private setupStoreSync(): void {
    this.unsubStructures = useProjectStore.subscribe((s) => {
      this.structures.render(s.project.structures)
      this.apLayer.render(s.project.accessPoints)
      this.loadBackgroundImage(s.project.backgroundImage)
      this.scheduleSimulation()
    })
    useSettingsStore.subscribe(() => {
      this.scheduleSimulation()
    })
  }

  private setupPanZoom(): void {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        this.state.spacePressed = true
        this.stage.container().dataset.panning = 'true'
        this.stage.container().style.cursor = 'grab'
      }
    })

    document.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.state.spacePressed = false
        this.state.isPanning = false
        this.state.lastPos = null
        this.state.stageAtPanStart = null
        this.stage.container().dataset.panning = 'false'
        this.stage.container().style.cursor = 'default'
      }
    })

    this.stage.on('mousedown', (e) => {
      if (!this.state.spacePressed) return
      e.evt.preventDefault()
      this.state.isPanning = true
      this.state.lastPos = { x: e.evt.clientX, y: e.evt.clientY }
      this.state.stageAtPanStart = { x: this.stage.x(), y: this.stage.y() }
      this.stage.container().style.cursor = 'grabbing'
      this.stage.draggable(false)
    })

    this.stage.on('mousemove', (e) => {
      if (!this.state.isPanning || !this.state.lastPos || !this.state.stageAtPanStart) return
      const dx = e.evt.clientX - this.state.lastPos.x
      const dy = e.evt.clientY - this.state.lastPos.y
      this.stage.x(this.state.stageAtPanStart.x + dx)
      this.stage.y(this.state.stageAtPanStart.y + dy)
    })

    this.stage.on('mouseup', () => {
      if (this.state.isPanning) {
        this.state.isPanning = false
        this.state.lastPos = null
        this.state.stageAtPanStart = null
        this.stage.container().style.cursor = this.state.spacePressed ? 'grab' : 'default'
      }
    })

    this.stage.on('wheel', (e) => {
      e.evt.preventDefault()
      const oldScale = this.stage.scaleX()
      const scaleBy = 1.05
      const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy

      const pointer = this.stage.getPointerPosition()
      if (!pointer) return

      const mouseX = pointer.x
      const mouseY = pointer.y

      this.stage.scale({ x: Math.max(0.1, Math.min(10, newScale)), y: Math.max(0.1, Math.min(10, newScale)) })

      const newPos = {
        x: mouseX - (mouseX - this.stage.x()) * (this.stage.scaleX() / oldScale),
        y: mouseY - (mouseY - this.stage.y()) * (this.stage.scaleY() / oldScale),
      }
      this.stage.position(newPos)
    })
  }

  private setupResize(): void {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        this.stage.width(width)
        this.stage.height(height)
        this.background.redraw(width, height)
      }
    })
    ro.observe(this.stage.container())
  }

  destroy(): void {
    this.unsubStructures?.()
    this.simManager.destroy()
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this.drawTool.destroy()
    this.apTool.destroy()
    this.background.destroy()
    this.structures.destroy()
    this.apLayer.destroy()
    this.heatmap.destroy()
    this.selection.destroy()
    this.stage.destroy()
  }
}
