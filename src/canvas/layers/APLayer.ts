import Konva from 'konva'
import type { AccessPoint } from '../../domain/types'
import { useProjectStore } from '../../state/projectStore'

export class APLayer {
  readonly layer: Konva.Layer
  private groups: Map<string, Konva.Group> = new Map()

  constructor() {
    this.layer = new Konva.Layer({ name: 'ap' })
  }

  render(aps: AccessPoint[]): void {
    const currentIds = new Set(aps.map((a) => a.id))

    for (const [id, group] of this.groups) {
      if (!currentIds.has(id)) {
        group.destroy()
        this.groups.delete(id)
      }
    }

    for (const ap of aps) {
      if (!this.groups.has(ap.id)) {
        const group = this.createAPGroup(ap)
        this.groups.set(ap.id, group)
        this.layer.add(group)
      }
    }

    this.layer.batchDraw()
  }

  private createAPGroup(ap: AccessPoint): Konva.Group {
    const group = new Konva.Group({ id: ap.id, draggable: true })
    const pos = ap.position

    if (ap.type === 'omni') {
      group.add(new Konva.Circle({
        x: pos.x,
        y: pos.y,
        radius: 14,
        fill: '#2ecc71',
        stroke: '#27ae60',
        strokeWidth: 2,
      }))

      group.add(new Konva.Circle({
        x: pos.x,
        y: pos.y,
        radius: 6,
        fill: '#fff',
      }))

      group.add(new Konva.Text({
        x: pos.x - 4,
        y: pos.y - 4,
        text: 'AP',
        fontSize: 8,
        fill: '#27ae60',
        fontStyle: 'bold',
      }))
    } else {
      const dir = (ap.direction ?? 0)
      const bw = (ap.beamwidth ?? 60)
      const rad = (dir * Math.PI) / 180
      const coneLen = 50

      group.add(new Konva.Circle({
        x: pos.x,
        y: pos.y,
        radius: 14,
        fill: '#e74c3c',
        stroke: '#c0392b',
        strokeWidth: 2,
      }))

      const endX = pos.x + Math.cos(rad) * coneLen
      const endY = pos.y + Math.sin(rad) * coneLen

      group.add(new Konva.Line({
        points: [pos.x, pos.y, endX, endY],
        stroke: '#c0392b',
        strokeWidth: 2,
      }))

      const leftAngle = ((dir - bw / 2) * Math.PI) / 180
      const rightAngle = ((dir + bw / 2) * Math.PI) / 180
      const beamLen = coneLen * 0.8

      const beamPoints: number[] = []
      const steps = 20
      for (let i = 0; i <= steps; i++) {
        const a = leftAngle + (rightAngle - leftAngle) * (i / steps)
        beamPoints.push(pos.x + Math.cos(a) * beamLen, pos.y + Math.sin(a) * beamLen)
      }

      group.add(new Konva.Line({
        points: [pos.x, pos.y, ...beamPoints, pos.x, pos.y],
        fill: 'rgba(231,76,60,0.15)',
        stroke: 'rgba(231,76,60,0.3)',
        strokeWidth: 1,
        closed: true,
      }))
    }

    group.on('dragend', () => {
      const newPos = group.position()
      const updatedAp = { ...ap, position: { x: newPos.x, y: newPos.y } }
      useProjectStore.getState().updateAccessPoint(updatedAp)
    })

    return group
  }

  clear(): void {
    for (const group of this.groups.values()) {
      group.destroy()
    }
    this.groups.clear()
    this.layer.batchDraw()
  }

  destroy(): void {
    this.clear()
    this.layer.destroy()
  }
}
