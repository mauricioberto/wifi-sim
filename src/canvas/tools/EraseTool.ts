import Konva from 'konva'
import { useToolStore } from '../../state/toolStore'
import { useProjectStore } from '../../state/projectStore'

export class EraseTool {
  private stage: Konva.Stage

  constructor(stage: Konva.Stage) {
    this.stage = stage
    this.setup()
  }

  private setup(): void {
    this.stage.on('click', (e) => {
      if (useToolStore.getState().activeTool !== 'erase') return
      if (e.target === this.stage) return

      const id = e.target.id()
      if (!id) return

      if (id.startsWith('ap_')) {
        useProjectStore.getState().removeAccessPoint(id)
      } else if (id.startsWith('struct_')) {
        useProjectStore.getState().removeStructure(id)
      }
    })
  }
}
