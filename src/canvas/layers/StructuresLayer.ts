import Konva from 'konva'
import type { Structure, Wall, Pallet, Column } from '../../domain/types'
import { MATERIAL_LIBRARY } from '../../domain/materials'

export class StructuresLayer {
  readonly layer: Konva.Layer
  private shapes: Map<string, Konva.Shape> = new Map()

  constructor() {
    this.layer = new Konva.Layer({ name: 'structures' })
  }

  render(structures: Structure[]): void {
    const currentIds = new Set(structures.map((s) => s.id))

    for (const [id, shape] of this.shapes) {
      if (!currentIds.has(id)) {
        shape.destroy()
        this.shapes.delete(id)
      }
    }

    for (const struct of structures) {
      if (!this.shapes.has(struct.id)) {
        const shape = this.createShape(struct)
        if (shape) {
          this.shapes.set(struct.id, shape)
          this.layer.add(shape)
        }
      }
    }

    this.layer.batchDraw()
  }

  private createShape(struct: Structure): Konva.Shape | null {
    switch (struct.type) {
      case 'wall':
      case 'glass':
      case 'door':
        return this.createWallShape(struct as Wall)
      case 'pallet':
        return this.createPalletShape(struct as Pallet)
      case 'column':
        return this.createColumnShape(struct as Column)
    }
  }

  private createWallShape(w: Wall): Konva.Line {
    const mat = MATERIAL_LIBRARY[w.material]
    return new Konva.Line({
      id: w.id,
      points: [w.start.x, w.start.y, w.end.x, w.end.y],
      stroke: mat?.color ?? '#888',
      strokeWidth: w.thickness || 4,
      name: 'structure',
    })
  }

  private createPalletShape(p: Pallet): Konva.Rect {
    const mat = MATERIAL_LIBRARY[p.material]
    return new Konva.Rect({
      id: p.id,
      x: p.x - p.width / 2,
      y: p.y - p.height / 2,
      width: p.width,
      height: p.height,
      rotation: p.rotation,
      fill: mat?.color ?? '#A0522D',
      opacity: 0.5,
      stroke: mat?.color ?? '#A0522D',
      strokeWidth: 2,
      name: 'structure',
    })
  }

  private createColumnShape(c: Column): Konva.Circle {
    const mat = MATERIAL_LIBRARY[c.material]
    return new Konva.Circle({
      id: c.id,
      x: c.cx,
      y: c.cy,
      radius: c.radius,
      fill: mat?.color ?? '#696969',
      opacity: 0.5,
      stroke: mat?.color ?? '#696969',
      strokeWidth: 2,
      name: 'structure',
    })
  }

  clear(): void {
    for (const shape of this.shapes.values()) {
      shape.destroy()
    }
    this.shapes.clear()
    this.layer.batchDraw()
  }

  destroy(): void {
    this.clear()
    this.layer.destroy()
  }
}
