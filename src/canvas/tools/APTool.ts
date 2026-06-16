import Konva from 'konva'
import type { Point, AccessPoint } from '../../domain/types'
import { useToolStore } from '../../state/toolStore'
import { useProjectStore } from '../../state/projectStore'

let apIdCounter = 0
function genApId(): string {
  return `ap_${++apIdCounter}_${Date.now()}`
}

export class APTool {
  private stage: Konva.Stage
  private previewLayer: Konva.Layer
  private drawing = false
  private startPos: Point | null = null
  private previewGroup: Konva.Group | null = null

  constructor(stage: Konva.Stage) {
    this.stage = stage
    this.previewLayer = new Konva.Layer({ name: 'ap-preview' })
    stage.add(this.previewLayer)
    this.setup()
  }

  private setup(): void {
    this.stage.on('mousedown', (e) => {
      const tool = useToolStore.getState().activeTool
      if (tool !== 'ap-omni' && tool !== 'ap-directional') return
      if (e.target !== this.stage) return

      const pos = this.stage.getPointerPosition()
      if (!pos) return

      if (tool === 'ap-omni') {
        this.commitOmni(pos)
        return
      }

      this.drawing = true
      this.startPos = pos
    })

    this.stage.on('mousemove', () => {
      if (!this.drawing || !this.startPos) return
      const tool = useToolStore.getState().activeTool
      if (tool !== 'ap-directional') return

      const pos = this.stage.getPointerPosition()
      if (!pos) return

      if (this.previewGroup) {
        this.previewGroup.destroy()
      }

      this.previewGroup = this.createDirectionalPreview(this.startPos, pos)
      this.previewLayer.add(this.previewGroup)
      this.previewLayer.batchDraw()
    })

    this.stage.on('mouseup', () => {
      if (!this.drawing || !this.startPos) return
      const tool = useToolStore.getState().activeTool
      if (tool !== 'ap-directional') return

      const pos = this.stage.getPointerPosition()
      if (pos && this.startPos) {
        this.commitDirectional(this.startPos, pos)
      }

      this.drawing = false
      this.startPos = null
      if (this.previewGroup) {
        this.previewGroup.destroy()
        this.previewGroup = null
      }
      this.previewLayer.batchDraw()
    })
  }

  private commitOmni(pos: Point): void {
    const ap: AccessPoint = {
      id: genApId(),
      type: 'omni',
      position: pos,
      txPowerDbm: 20,
    }
    useProjectStore.getState().addAccessPoint(ap)
  }

  private commitDirectional(start: Point, end: Point): void {
    const dx = end.x - start.x
    const dy = end.y - start.y
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI

    const ap: AccessPoint = {
      id: genApId(),
      type: 'directional',
      position: start,
      direction: ((angle % 360) + 360) % 360,
      beamwidth: 60,
      txPowerDbm: 20,
    }
    useProjectStore.getState().addAccessPoint(ap)
  }

  private createDirectionalPreview(origin: Point, cursor: Point): Konva.Group {
    const group = new Konva.Group()

    const dx = cursor.x - origin.x
    const dy = cursor.y - origin.y
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI
    const distance = Math.sqrt(dx * dx + dy * dy)

    group.add(new Konva.Circle({
      x: origin.x,
      y: origin.y,
      radius: 12,
      stroke: '#e74c3c',
      strokeWidth: 2,
      dash: [3, 3],
      fill: 'rgba(231,76,60,0.2)',
    }))

    if (distance > 5) {
      const len = Math.max(distance, 40)
      const endX = origin.x + Math.cos((angle * Math.PI) / 180) * len
      const endY = origin.y + Math.sin((angle * Math.PI) / 180) * len

      group.add(new Konva.Line({
        points: [origin.x, origin.y, endX, endY],
        stroke: '#e74c3c',
        strokeWidth: 2,
        dash: [5, 5],
      }))

      const bw = 60
      const leftAngle = ((angle - bw / 2) * Math.PI) / 180
      const rightAngle = ((angle + bw / 2) * Math.PI) / 180
      const coneLen = len * 0.6

      group.add(new Konva.Line({
        points: [
          origin.x, origin.y,
          origin.x + Math.cos(leftAngle) * coneLen,
          origin.y + Math.sin(leftAngle) * coneLen,
        ],
        stroke: '#e74c3c',
        strokeWidth: 1,
        dash: [3, 3],
      }))

      group.add(new Konva.Line({
        points: [
          origin.x, origin.y,
          origin.x + Math.cos(rightAngle) * coneLen,
          origin.y + Math.sin(rightAngle) * coneLen,
        ],
        stroke: '#e74c3c',
        strokeWidth: 1,
        dash: [3, 3],
      }))
    }

    return group
  }

  destroy(): void {
    this.previewLayer.destroy()
  }
}
