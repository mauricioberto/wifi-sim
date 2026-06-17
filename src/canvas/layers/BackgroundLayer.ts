import Konva from 'konva'

export class BackgroundLayer {
  readonly layer: Konva.Layer
  private gridGroup: Konva.Group
  private image: Konva.Image | null = null
  private gridSize = 20
  private gridEnabled = true

  constructor() {
    this.layer = new Konva.Layer({ name: 'background', listening: false })
    this.gridGroup = new Konva.Group({ name: 'grid' })
    this.layer.add(this.gridGroup)
  }

  setGrid(enabled: boolean, size: number): void {
    this.gridEnabled = enabled
    this.gridSize = size
    this.drawGrid()
  }

  setBackgroundImage(img: HTMLImageElement | null): void {
    if (this.image) {
      this.image.destroy()
      this.image = null
    }
    if (img) {
      const stage = this.layer.getStage()
      const w = stage?.width() ?? img.naturalWidth
      const h = stage?.height() ?? img.naturalHeight
      this.image = new Konva.Image({ image: img, x: 0, y: 0, width: w, height: h })
      this.layer.add(this.image)
      this.image.moveToBottom()
    }
  }

  private drawGrid(): void {
    this.gridGroup.destroyChildren()
    if (!this.gridEnabled) return

    const stage = this.layer.getStage()
    if (!stage) return

    const w = stage.width()
    const h = stage.height()
    const gs = this.gridSize

    for (let x = 0; x < w; x += gs) {
      this.gridGroup.add(new Konva.Line({
        points: [x, 0, x, h],
        stroke: '#e5e7eb',
        strokeWidth: 1,
      }))
    }
    for (let y = 0; y < h; y += gs) {
      this.gridGroup.add(new Konva.Line({
        points: [0, y, w, y],
        stroke: '#e5e7eb',
        strokeWidth: 1,
      }))
    }
  }

  redraw(_stageWidth: number, _stageHeight: number): void {
    this.drawGrid()
  }

  destroy(): void {
    this.layer.destroy()
  }
}
