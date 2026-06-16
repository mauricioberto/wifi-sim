import { describe, it, expect } from 'vitest'
import { calculateRSSI, calculateGrid } from '../src/simulation/propagation'
import type { AccessPoint, Structure, Wall } from '../src/domain/types'

describe('calculateRSSI', () => {
  const ap: AccessPoint = {
    id: 'ap1',
    type: 'omni',
    position: { x: 0, y: 0 },
    txPowerDbm: 20,
  }

  it('deve retornar valor finito para ponto próximo', () => {
    const rssi = calculateRSSI(ap, { x: 100, y: 0 }, '2.4', [])
    expect(Number.isFinite(rssi)).toBe(true)
    expect(rssi).toBeLessThan(20)
  })

  it('sinal diminui com distância', () => {
    const rssi1 = calculateRSSI(ap, { x: 100, y: 0 }, '2.4', [])
    const rssi2 = calculateRSSI(ap, { x: 500, y: 0 }, '2.4', [])
    expect(rssi2).toBeLessThan(rssi1)
  })

  it('5GHz tem mais perda que 2.4GHz na mesma distância', () => {
    const rssi24 = calculateRSSI(ap, { x: 300, y: 0 }, '2.4', [])
    const rssi5 = calculateRSSI(ap, { x: 300, y: 0 }, '5', [])
    expect(rssi5).toBeLessThan(rssi24)
  })

  it('AP direcional tem ganho na frente', () => {
    const dirAp: AccessPoint = {
      id: 'ap2',
      type: 'directional',
      position: { x: 0, y: 0 },
      direction: 0,
      beamwidth: 60,
      txPowerDbm: 20,
    }
    const rssiFront = calculateRSSI(dirAp, { x: 200, y: 0 }, '2.4', [])
    const rssiBack = calculateRSSI(dirAp, { x: -200, y: 0 }, '2.4', [])
    expect(rssiFront).toBeGreaterThan(rssiBack)
  })

  it('parede de concreto atenua sinal', () => {
    const wall: Wall = {
      id: 'w1',
      type: 'wall',
      start: { x: 50, y: -100 },
      end: { x: 50, y: 100 },
      thickness: 4,
      material: 'external_wall',
    }
    const rssiSem = calculateRSSI(ap, { x: 200, y: 0 }, '2.4', [])
    const rssiCom = calculateRSSI(ap, { x: 200, y: 0 }, '2.4', [wall])
    expect(rssiCom).toBeLessThan(rssiSem)
  })
})

describe('calculateGrid', () => {
  it('deve retornar grid do tamanho correto', () => {
    const ap: AccessPoint = {
      id: 'ap1',
      type: 'omni',
      position: { x: 100, y: 100 },
      txPowerDbm: 20,
    }
    const grid = calculateGrid([ap], [], '2.4', 10, 10, 200, 200)
    expect(grid).toHaveLength(100)
  })

  it('grid vazio sem APs deve ter valores baixos', () => {
    const grid = calculateGrid([], [], '2.4', 5, 5, 100, 100)
    for (const val of grid) {
      expect(val).toBeLessThanOrEqual(-85)
    }
  })
})
