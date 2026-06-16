import { describe, it, expect } from 'vitest'
import { raycastObstacles } from '../src/simulation/raycast'
import type { Wall, Pallet, Column } from '../src/domain/types'

describe('raycastObstacles', () => {
  const origin = { x: 0, y: 0 }
  const target = { x: 200, y: 0 }

  it('sem obstáculos atenua 0', () => {
    const att = raycastObstacles(origin, target, [], '2.4')
    expect(att).toBe(0)
  })

  it('parede de concreto no caminho atenua', () => {
    const wall: Wall = {
      id: 'w1',
      type: 'wall',
      start: { x: 100, y: -50 },
      end: { x: 100, y: 50 },
      thickness: 4,
      material: 'external_wall',
    }
    const att = raycastObstacles(origin, target, [wall], '2.4')
    expect(att).toBeGreaterThan(0)
  })

  it('parede fora do caminho não atenua', () => {
    const wall: Wall = {
      id: 'w1',
      type: 'wall',
      start: { x: 100, y: 200 },
      end: { x: 100, y: 300 },
      thickness: 4,
      material: 'external_wall',
    }
    const att = raycastObstacles(origin, target, [wall], '2.4')
    expect(att).toBe(0)
  })

  it('atenuação 5GHz > 2.4GHz', () => {
    const wall: Wall = {
      id: 'w1',
      type: 'wall',
      start: { x: 100, y: -50 },
      end: { x: 100, y: 50 },
      thickness: 4,
      material: 'external_wall',
    }
    const att24 = raycastObstacles(origin, target, [wall], '2.4')
    const att5 = raycastObstacles(origin, target, [wall], '5')
    expect(att5).toBeGreaterThan(att24)
  })

  it('coluna no caminho atenua', () => {
    const col: Column = {
      id: 'c1',
      type: 'column',
      cx: 100,
      cy: 0,
      radius: 10,
      material: 'column',
    }
    const att = raycastObstacles(origin, target, [col], '2.4')
    expect(att).toBeGreaterThan(0)
  })
})
