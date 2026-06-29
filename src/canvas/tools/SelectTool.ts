import Konva from 'konva'
import { useToolStore } from '../../state/toolStore'
import { useProjectStore } from '../../state/projectStore'
import type { BackgroundImageLayer } from '../layers/BackgroundImageLayer'

export class SelectTool {
  private stage: Konva.Stage
  private bgImageLayer: BackgroundImageLayer

  constructor(stage: Konva.Stage, bgImageLayer: BackgroundImageLayer) {
    this.stage = stage
    this.bgImageLayer = bgImageLayer
    this.setup()
  }

  private setup(): void {
    this.stage.on('mousedown', (e) => {
      if (useToolStore.getState().activeTool !== 'select') return

      const target = e.target

      if (target === this.stage) {
        this.deselectAll()
        return
      }

      // Don't interfere with transformer anchors
      let node: Konva.Node | null = target
      while (node && node !== this.stage) {
        if (node instanceof Konva.Transformer) return
        node = node.getParent()
      }

      if (target.name() === 'bg-image') {
        if (this.bgImageLayer.hasImage()) {
          this.selectBgImage()
        }
        return
      }

      const id = target.id()
      if (id) {
        useProjectStore.getState().selectIds([id])
        this.bgImageLayer.deselect()
      } else {
        this.deselectAll()
      }
    })
  }

  private selectBgImage(): void {
    useProjectStore.getState().clearSelection()
    this.bgImageLayer.select()
  }

  private deselectAll(): void {
    useProjectStore.getState().clearSelection()
    this.bgImageLayer.deselect()
  }

  destroy(): void {
    this.stage.off('mousedown')
  }
}
