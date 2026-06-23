import Konva from 'konva'
import type { ToolType, Point, Wall, Pallet, Column, MaterialCategory } from '../../domain/types'
import { MATERIAL_LIBRARY } from '../../domain/materials'
import { useToolStore } from '../../state/toolStore'
import { useProjectStore } from '../../state/projectStore'

let idCounter = 0
function genId(): string {
  return `struct_${++idCounter}_${Date.now()}`
}

export class DrawTool {
  private stage: Konva.Stage
  private previewLayer: Konva.Layer
  private drawing = false
  private startPos: Point | null = null
  private previewShape: Konva.Shape | null = null

  constructor(stage: Konva.Stage) {
    this.stage = stage
    this.previewLayer = new Konva.Layer({ name: 'draw-preview' })
    stage.add(this.previewLayer)
    this.setupEvents()
  }

  private setupEvents(): void {
    this.stage.on('mousedown', (e) => {
      if (e.target !== this.stage) return
      if (this.stage.container().dataset.panning === 'true') return
      const tool = useToolStore.getState().activeTool
      if (tool === 'select' || tool === 'erase' || tool === 'ap-omni' || tool === 'ap-directional') return

      const pos = this.stage.getPointerPosition()
      if (!pos) return

      this.drawing = true
      this.startPos = pos
    })

    this.stage.on('mousemove', () => {
      if (!this.drawing || !this.startPos) return

      const endPos = this.stage.getPointerPosition()
      if (!endPos) return

      const tool = useToolStore.getState().activeTool

      if (this.previewShape) {
        this.previewShape.destroy()
      }

      if (tool === 'column') {
        const radius = Math.max(5, Math.sqrt(
          (endPos.x - this.startPos.x) ** 2 + (endPos.y - this.startPos.y) ** 2
        ))
        this.previewShape = new Konva.Circle({
          x: this.startPos.x,
          y: this.startPos.y,
          radius,
          stroke: '#696969',
          strokeWidth: 2,
          dash: [5, 5],
          fill: 'rgba(105,105,105,0.2)',
        })
      } else if (tool === 'pallet') {
        const x = Math.min(this.startPos.x, endPos.x)
        const y = Math.min(this.startPos.y, endPos.y)
        const w = Math.abs(endPos.x - this.startPos.x)
        const h = Math.abs(endPos.y - this.startPos.y)
        this.previewShape = new Konva.Rect({
          x, y, width: w, height: h,
          stroke: '#A0522D',
          strokeWidth: 2,
          dash: [5, 5],
          fill: 'rgba(160,82,45,0.2)',
        })
      } else {
        this.previewShape = new Konva.Line({
          points: [this.startPos.x, this.startPos.y, endPos.x, endPos.y],
          stroke: this.getStrokeColor(tool),
          strokeWidth: 4,
          dash: [5, 5],
        })
      }

      this.previewLayer.add(this.previewShape)
      this.previewLayer.batchDraw()
    })

    this.stage.on('mouseup', () => {
      if (!this.drawing || !this.startPos) {
        this.drawing = false
        return
      }

      const endPos = this.stage.getPointerPosition()
      if (endPos) {
        const tool = useToolStore.getState().activeTool
        this.commitShape(tool, this.startPos, endPos)
      }

      this.drawing = false
      this.startPos = null
      if (this.previewShape) {
        this.previewShape.destroy()
        this.previewShape = null
      }
      this.previewLayer.batchDraw()
    })
  }

  private getStrokeColor(tool: ToolType): string {
    const map: Partial<Record<ToolType, string>> = {
      wall: MATERIAL_LIBRARY.external_wall.color,
      glass: MATERIAL_LIBRARY.glass.color,
      door: MATERIAL_LIBRARY.door.color,
    }
    return map[tool] ?? '#888'
  }

  private commitShape(tool: ToolType, start: Point, end: Point): void {
    const store = useProjectStore.getState()

    if (tool === 'column') {
      const radius = Math.max(5, Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2))
      const col: Column = {
        id: genId(),
        type: 'column',
        cx: start.x,
        cy: start.y,
        radius,
        material: 'column',
      }
      store.addStructure(col)
    } else if (tool === 'pallet') {
      const x = Math.min(start.x, end.x)
      const y = Math.min(start.y, end.y)
      const w = Math.abs(end.x - start.x) || 10
      const h = Math.abs(end.y - start.y) || 10
      const pal: Pallet = {
        id: genId(),
        type: 'pallet',
        x: x + w / 2,
        y: y + h / 2,
        width: w,
        height: h,
        rotation: 0,
        material: 'pallet',
      }
      store.addStructure(pal)
    } else {
      const materialMap: Record<string, MaterialCategory> = {
        wall: 'external_wall',
        glass: 'glass',
        door: 'door',
      }
      const wallType = tool === 'wall' ? 'wall' as const : tool as 'glass' | 'door'
      const w: Wall = {
        id: genId(),
        type: wallType,
        start,
        end,
        thickness: 4,
        material: materialMap[tool] ?? 'internal_wall',
      }
      store.addStructure(w)
    }
  }

  destroy(): void {
    this.previewLayer.destroy()
  }
}
