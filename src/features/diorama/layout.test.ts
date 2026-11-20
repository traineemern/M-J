import { describe, expect, it } from 'vitest'
import { DIORAMA_LAYOUT, PLATFORM, validateDioramaLayout } from './layout'

describe('surface diorama grid', () => {
  it('keeps every recorded footprint on the platform without overlaps', () => {
    expect(validateDioramaLayout()).toEqual([])
    expect(DIORAMA_LAYOUT.every((item) => Math.abs(item.x) + item.width / 2 <= PLATFORM.width / 2 && Math.abs(item.z) + item.depth / 2 <= PLATFORM.depth / 2)).toBe(true)
  })

  it('places all well heads on one shared ground plane', () => {
    const wells = DIORAMA_LAYOUT.filter((item) => item.id.startsWith('well-head-'))
    expect(wells).toHaveLength(3)
    expect(new Set(wells.map((item) => item.z))).toEqual(new Set([-3]))
  })

  it('detects overlaps and objects beyond the platform', () => {
    expect(validateDioramaLayout([
      { id: 'a', x: 0, z: 0, width: 2, depth: 2, rotation: 0, platform: true },
      { id: 'b', x: 1, z: 0, width: 2, depth: 2, rotation: 0, platform: true },
      { id: 'edge', x: 21, z: 0, width: 2, depth: 2, rotation: 0, platform: true },
    ])).toEqual(expect.arrayContaining(['a overlaps b', 'edge: extends beyond the platform']))
  })
})
