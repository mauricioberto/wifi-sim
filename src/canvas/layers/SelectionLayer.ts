import Konva from 'konva'

export class SelectionLayer {
  readonly layer: Konva.Layer

  constructor() {
    this.layer = new Konva.Layer({ name: 'selection', listening: false })
  }

  destroy(): void {
    this.layer.destroy()
  }
}
