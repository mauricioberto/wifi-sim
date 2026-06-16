import Konva from 'konva'

export class HeatmapLayer {
  readonly layer: Konva.Layer

  constructor() {
    this.layer = new Konva.Layer({ name: 'heatmap', listening: false })
  }

  setVisible(visible: boolean): void {
    this.layer.visible(visible)
  }

  destroy(): void {
    this.layer.destroy()
  }
}
