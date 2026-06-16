import type { Point, Structure, Wall, Pallet, Column, Frequency } from '../domain/types'
import { MATERIAL_LIBRARY } from '../domain/materials'
import { segmentIntersectsSegment, pointInRotatedRect, pointInCircle } from '../domain/geometry'

function getAttenuation(material: string, freq: Frequency): number {
  const mat = MATERIAL_LIBRARY[material]
  if (!mat) return 0
  return freq === '2.4' ? mat.attenuation24 : mat.attenuation5
}

export function raycastObstacles(
  origin: Point,
  target: Point,
  structures: Structure[],
  frequency: Frequency,
): number {
  let totalAttenuation = 0

  for (const struct of structures) {
    switch (struct.type) {
      case 'wall':
      case 'glass':
      case 'door': {
        const w = struct as Wall
        if (segmentIntersectsSegment(origin, target, w.start, w.end)) {
          totalAttenuation += getAttenuation(w.material, frequency)
        }
        break
      }
      case 'pallet': {
        const p = struct as Pallet
        const steps = 8
        for (let i = 0; i <= steps; i++) {
          const t = i / steps
          const px = origin.x + (target.x - origin.x) * t
          const py = origin.y + (target.y - origin.y) * t
          if (pointInRotatedRect({ x: px, y: py }, p.x, p.y, p.width, p.height, p.rotation)) {
            totalAttenuation += getAttenuation(p.material, frequency)
            break
          }
        }
        break
      }
      case 'column': {
        const c = struct as Column
        const steps = 8
        for (let i = 0; i <= steps; i++) {
          const t = i / steps
          const px = origin.x + (target.x - origin.x) * t
          const py = origin.y + (target.y - origin.y) * t
          if (pointInCircle({ x: px, y: py }, c.cx, c.cy, c.radius)) {
            totalAttenuation += getAttenuation(c.material, frequency)
            break
          }
        }
        break
      }
    }
  }

  return totalAttenuation
}
