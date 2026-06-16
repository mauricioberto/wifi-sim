import Konva from 'konva'

export class StructuresLayer {
  readonly layer: Konva.Layer

  constructor() {
    this.layer = new Konva.Layer({ name: 'structures' })
  }

  destroy(): void {
    this.layer.destroy()
  }
}
