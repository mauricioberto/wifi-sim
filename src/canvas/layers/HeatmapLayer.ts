import Konva from 'konva'

export class HeatmapLayer {
  readonly layer: Konva.Layer
  private konvaImage: Konva.Image | null = null

  constructor() {
    this.layer = new Konva.Layer({ name: 'heatmap', listening: false })
  }

  renderImageData(imageData: ImageData, x: number, y: number, width: number, height: number): void {
    const canvas = document.createElement('canvas')
    canvas.width = imageData.width
    canvas.height = imageData.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.putImageData(imageData, 0, 0)

    const img = new Image()
    img.onload = () => {
      if (this.konvaImage) {
        this.konvaImage.image(img)
      } else {
        this.konvaImage = new Konva.Image({ image: img, x, y, width, height })
        this.layer.add(this.konvaImage)
      }
      this.layer.batchDraw()
    }
    img.src = canvas.toDataURL()
  }

  clear(): void {
    if (this.konvaImage) {
      this.konvaImage.destroy()
      this.konvaImage = null
    }
    this.layer.batchDraw()
  }

  setVisible(visible: boolean): void {
    this.layer.visible(visible)
    this.layer.batchDraw()
  }

  destroy(): void {
    this.clear()
    this.layer.destroy()
  }
}
