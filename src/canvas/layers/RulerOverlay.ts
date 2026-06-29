import { WORLD_SIZE } from '../../constants'

const LEFT_RULER = 40
const BOTTOM_RULER = 28
const NICE_INTERVALS = [0.5, 1, 2, 5, 10, 20, 50] as const

export class RulerOverlay {
  private bottomCanvas: HTMLCanvasElement
  private leftCanvas: HTMLCanvasElement
  private cornerEl: HTMLDivElement
  constructor(container: HTMLElement) {
    this.bottomCanvas = document.createElement('canvas')
    this.bottomCanvas.style.position = 'absolute'
    this.bottomCanvas.style.left = `${LEFT_RULER}px`
    this.bottomCanvas.style.bottom = '0px'
    this.bottomCanvas.style.pointerEvents = 'none'
    this.bottomCanvas.style.zIndex = '10'

    this.leftCanvas = document.createElement('canvas')
    this.leftCanvas.style.position = 'absolute'
    this.leftCanvas.style.left = '0px'
    this.leftCanvas.style.top = '0px'
    this.leftCanvas.style.pointerEvents = 'none'
    this.leftCanvas.style.zIndex = '10'

    this.cornerEl = document.createElement('div')
    this.cornerEl.style.position = 'absolute'
    this.cornerEl.style.left = '0px'
    this.cornerEl.style.bottom = '0px'
    this.cornerEl.style.width = `${LEFT_RULER}px`
    this.cornerEl.style.height = `${BOTTOM_RULER}px`
    this.cornerEl.style.backgroundColor = '#ffffff'
    this.cornerEl.style.borderTop = '1px solid #d1d5db'
    this.cornerEl.style.display = 'flex'
    this.cornerEl.style.alignItems = 'flex-end'
    this.cornerEl.style.justifyContent = 'center'
    this.cornerEl.style.paddingBottom = '2px'
    this.cornerEl.style.fontSize = '10px'
    this.cornerEl.style.color = '#6b7280'
    this.cornerEl.style.fontFamily = 'sans-serif'
    this.cornerEl.style.pointerEvents = 'none'
    this.cornerEl.style.zIndex = '10'
    this.cornerEl.textContent = 'm'

    container.appendChild(this.leftCanvas)
    container.appendChild(this.bottomCanvas)
    container.appendChild(this.cornerEl)
  }

  update(stageX: number, stageY: number, scale: number, vpW: number, vpH: number): void {
    const bw = Math.max(1, Math.round(vpW - LEFT_RULER))
    const bh = BOTTOM_RULER
    const lw = LEFT_RULER
    const lh = Math.max(1, Math.round(vpH - BOTTOM_RULER))

    if (this.bottomCanvas.width !== bw || this.bottomCanvas.height !== bh) {
      this.bottomCanvas.width = bw
      this.bottomCanvas.height = bh
    }
    if (this.leftCanvas.width !== lw || this.leftCanvas.height !== lh) {
      this.leftCanvas.width = lw
      this.leftCanvas.height = lh
    }

    this.drawBottomRuler(stageX, scale, vpW)
    this.drawLeftRuler(stageY, scale, vpH)
  }

  private drawBottomRuler(stageX: number, scale: number, vpW: number): void {
    const ctx = this.bottomCanvas.getContext('2d')!
    const w = this.bottomCanvas.width
    const h = this.bottomCanvas.height
    ctx.clearRect(0, 0, w, h)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)

    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, 0.5)
    ctx.lineTo(w, 0.5)
    ctx.stroke()

    const leftWorld = -stageX / scale
    const rightWorld = (vpW - stageX) / scale
    const lo = Math.max(0, leftWorld)
    const hi = Math.min(WORLD_SIZE, rightWorld)
    if (lo >= hi) return

    const pxPerMeter = 100 * scale
    const rawInterval = 80 / Math.abs(pxPerMeter)
    const intervalMeters = NICE_INTERVALS.find(i => i >= rawInterval) ?? 50
    const intervalPx = intervalMeters * 100

    ctx.strokeStyle = '#6b7280'
    ctx.lineWidth = 1
    ctx.fillStyle = '#374151'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'

    const firstTick = Math.ceil(lo / intervalPx) * intervalPx
    for (let wx = firstTick; wx <= hi; wx += intervalPx) {
      const rulerX = wx * scale + stageX - LEFT_RULER
      if (rulerX < 0 || rulerX > w) continue
      ctx.beginPath()
      ctx.moveTo(rulerX, h - 1)
      ctx.lineTo(rulerX, 5)
      ctx.stroke()
      ctx.fillText(`${Math.round(wx / 100)}`, rulerX, h - 6)
    }
  }

  private drawLeftRuler(stageY: number, scale: number, vpH: number): void {
    const ctx = this.leftCanvas.getContext('2d')!
    const w = this.leftCanvas.width
    const h = this.leftCanvas.height
    ctx.clearRect(0, 0, w, h)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)

    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(w - 0.5, 0)
    ctx.lineTo(w - 0.5, h)
    ctx.stroke()

    const topWorld = -stageY / scale
    const bottomWorld = (vpH - stageY) / scale
    const lo = Math.max(0, topWorld)
    const hi = Math.min(WORLD_SIZE, bottomWorld)
    if (lo >= hi) return

    const pxPerMeter = 100 * scale
    const rawInterval = 80 / Math.abs(pxPerMeter)
    const intervalMeters = NICE_INTERVALS.find(i => i >= rawInterval) ?? 50
    const intervalPx = intervalMeters * 100

    ctx.strokeStyle = '#6b7280'
    ctx.lineWidth = 1
    ctx.fillStyle = '#374151'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'

    const firstTick = Math.ceil(lo / intervalPx) * intervalPx
    for (let wy = firstTick; wy <= hi; wy += intervalPx) {
      const rulerY = wy * scale + stageY
      if (rulerY < 0 || rulerY > h) continue
      ctx.beginPath()
      ctx.moveTo(w - 1, rulerY)
      ctx.lineTo(5, rulerY)
      ctx.stroke()
      ctx.fillText(`${Math.round((WORLD_SIZE - wy) / 100)}`, w - 7, rulerY)
    }
  }

  destroy(): void {
    this.bottomCanvas.remove()
    this.leftCanvas.remove()
    this.cornerEl.remove()
  }
}
