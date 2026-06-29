import Konva from 'konva'

export class SelectionLayer {
  readonly layer: Konva.Layer
  private highlightRect: Konva.Rect | null = null

  constructor() {
    this.layer = new Konva.Layer({ name: 'selection', listening: false })
  }

  highlight(ids: string[]): void {
    if (this.highlightRect) {
      this.highlightRect.destroy()
      this.highlightRect = null
    }

    if (ids.length === 0 || !this.layer.getStage()) {
      this.layer.batchDraw()
      return
    }

    const stage = this.layer.getStage()!
    const shapes: Konva.Node[] = []

    for (const id of ids) {
      const node = stage.findOne('#' + id)
      if (node) shapes.push(node)
    }

    if (shapes.length === 0) {
      this.layer.batchDraw()
      return
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    for (const shape of shapes) {
      const rect = shape.getClientRect({ relativeTo: stage })
      minX = Math.min(minX, rect.x)
      minY = Math.min(minY, rect.y)
      maxX = Math.max(maxX, rect.x + rect.width)
      maxY = Math.max(maxY, rect.y + rect.height)
    }

    const pad = 4
    this.highlightRect = new Konva.Rect({
      x: minX - pad,
      y: minY - pad,
      width: maxX - minX + pad * 2,
      height: maxY - minY + pad * 2,
      stroke: '#3b82f6',
      strokeWidth: 2,
      dash: [4, 4],
      listening: false,
      fill: 'rgba(59,130,246,0.08)',
      cornerRadius: 2,
    })

    this.layer.add(this.highlightRect)
    this.layer.batchDraw()
  }

  destroy(): void {
    this.layer.destroy()
  }
}
