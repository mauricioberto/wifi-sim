import Konva from 'konva'
import type { BackgroundImageTransform } from '../../domain/types'
import { useProjectStore } from '../../state/projectStore'

export class BackgroundImageLayer {
  readonly layer: Konva.Layer
  private konvaImage: Konva.Image | null = null
  private transformer: Konva.Transformer | null = null
  constructor() {
    this.layer = new Konva.Layer({ name: 'bg-image' })
  }

  setImage(dataUrl: string, transform: BackgroundImageTransform): void {
    const img = new window.Image()
    img.onload = () => this.createImage(img, transform)
    img.src = dataUrl
  }

  private createImage(img: HTMLImageElement, transform: BackgroundImageTransform): void {
    this.clearImage()

    this.konvaImage = new Konva.Image({
      image: img,
      x: transform.x,
      y: transform.y,
      width: img.naturalWidth,
      height: img.naturalHeight,
      scaleX: transform.scaleX,
      scaleY: transform.scaleY,
      rotation: transform.rotation ?? 0,
      draggable: false,
      name: 'bg-image',
    })

    this.konvaImage.on('dragend', () => {
      const pos = this.konvaImage!.position()
      const scale = this.konvaImage!.scale()
      useProjectStore.getState().setBackgroundTransform({
        x: pos.x,
        y: pos.y,
        scaleX: scale.x,
        scaleY: scale.y,
        rotation: this.konvaImage!.rotation(),
      })
    })

    this.konvaImage.on('transformend', () => {
      const pos = this.konvaImage!.position()
      const scale = this.konvaImage!.scale()
      useProjectStore.getState().setBackgroundTransform({
        x: pos.x,
        y: pos.y,
        scaleX: scale.x,
        scaleY: scale.y,
        rotation: this.konvaImage!.rotation(),
      })
    })

    this.layer.add(this.konvaImage)
    this.layer.batchDraw()
  }

  applyTransform(transform: BackgroundImageTransform): void {
    if (!this.konvaImage) return
    this.konvaImage.position({ x: transform.x, y: transform.y })
    this.konvaImage.scale({ x: transform.scaleX, y: transform.scaleY })
    this.konvaImage.rotation(transform.rotation ?? 0)
    this.layer.batchDraw()
  }

  clearImage(): void {
    this.deselect()
    if (this.konvaImage) {
      this.konvaImage.destroy()
      this.konvaImage = null
    }
    this.layer.batchDraw()
  }

  select(): void {
    if (!this.konvaImage || this.transformer) return

    this.konvaImage.draggable(true)

    this.transformer = new Konva.Transformer({
      nodes: [this.konvaImage],
      rotateEnabled: true,
      enabledAnchors: [
        'top-left', 'top-right', 'bottom-left', 'bottom-right',
        'middle-left', 'middle-right', 'top-center', 'bottom-center',
      ],
      borderStroke: '#333',
      borderStrokeWidth: 1,
      anchorFill: '#fff',
      anchorStroke: '#333',
      anchorSize: 8,
      keepRatio: false,
    })

    this.layer.add(this.transformer)
    this.layer.batchDraw()
  }

  deselect(): void {
    if (this.konvaImage) {
      this.konvaImage.draggable(false)
    }
    if (this.transformer) {
      this.transformer.detach()
      this.transformer.destroy()
      this.transformer = null
    }
    this.layer.batchDraw()
  }

  hasImage(): boolean {
    return this.konvaImage !== null
  }

  getImageNode(): Konva.Image | null {
    return this.konvaImage
  }

  destroy(): void {
    this.clearImage()
    this.layer.destroy()
  }
}
