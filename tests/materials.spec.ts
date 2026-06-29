import { describe, it, expect } from 'vitest'
import { MATERIAL_LIBRARY } from '../src/domain/materials'

describe('MATERIAL_LIBRARY', () => {
  it('deve conter todos os materiais esperados', () => {
    const categories = Object.keys(MATERIAL_LIBRARY)
    expect(categories).toContain('internal_wall')
    expect(categories).toContain('external_wall')
    expect(categories).toContain('glass')
    expect(categories).toContain('door')
    expect(categories).toContain('pallet')
    expect(categories).toContain('column')
  })

  it('deve ter 6 materiais', () => {
    expect(Object.keys(MATERIAL_LIBRARY)).toHaveLength(6)
  })

  it('drywall deve atenuar 5dB em 2.4GHz e 8dB em 5GHz', () => {
    const w = MATERIAL_LIBRARY.internal_wall
    expect(w.attenuation24).toBe(5)
    expect(w.attenuation5).toBe(8)
  })

  it('parede externa deve atenuar mais que drywall', () => {
    const ext = MATERIAL_LIBRARY.external_wall
    const int = MATERIAL_LIBRARY.internal_wall
    expect(ext.attenuation24).toBeGreaterThan(int.attenuation24)
    expect(ext.attenuation5).toBeGreaterThan(int.attenuation5)
  })

  it('vidro deve ter menor atenuação que parede interna', () => {
    const glass = MATERIAL_LIBRARY.glass
    const wall = MATERIAL_LIBRARY.internal_wall
    expect(glass.attenuation24).toBeLessThan(wall.attenuation24)
    expect(glass.attenuation5).toBeLessThan(wall.attenuation5)
  })
})
