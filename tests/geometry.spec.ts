import { describe, it, expect } from 'vitest'
import { distance, pointToSegmentDistance, segmentIntersectsSegment, pointInCircle } from '../src/domain/geometry'

describe('geometry', () => {
  it('distance entre dois pontos', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
  })

  it('distance zero para mesmo ponto', () => {
    expect(distance({ x: 10, y: 20 }, { x: 10, y: 20 })).toBe(0)
  })

  it('pointToSegmentDistance ponto no segmento', () => {
    const d = pointToSegmentDistance({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 10 })
    expect(d).toBe(0)
  })

  it('pointToSegmentDistance ponto fora', () => {
    const d = pointToSegmentDistance({ x: 3, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 10 })
    expect(d).toBe(3)
  })

  it('segmentIntersectsSegment cruzando', () => {
    expect(
      segmentIntersectsSegment(
        { x: 0, y: 0 }, { x: 10, y: 10 },
        { x: 0, y: 10 }, { x: 10, y: 0 },
      )
    ).toBe(true)
  })

  it('segmentIntersectsSegment paralelo', () => {
    expect(
      segmentIntersectsSegment(
        { x: 0, y: 0 }, { x: 10, y: 0 },
        { x: 0, y: 5 }, { x: 10, y: 5 },
      )
    ).toBe(false)
  })

  it('pointInCircle dentro', () => {
    expect(pointInCircle({ x: 0, y: 0 }, 0, 0, 5)).toBe(true)
  })

  it('pointInCircle fora', () => {
    expect(pointInCircle({ x: 10, y: 10 }, 0, 0, 5)).toBe(false)
  })
})
