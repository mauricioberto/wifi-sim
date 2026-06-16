import Konva from 'konva'

export class APLayer {
  readonly layer: Konva.Layer

  constructor() {
    this.layer = new Konva.Layer({ name: 'ap' })
  }

  destroy(): void {
    this.layer.destroy()
  }
}
