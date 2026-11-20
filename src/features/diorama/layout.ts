export interface DioramaFootprint {
  id: string
  x: number
  z: number
  width: number
  depth: number
  rotation: number
  platform?: boolean
  group?: string
}

export const PLATFORM = { width: 40, depth: 28, top: 0.05 } as const

// Object coordinates are centers on a one unit grid. The rig station includes
// the flag, whose pole intentionally shares the drill's grid cell.
export const DIORAMA_LAYOUT: DioramaFootprint[] = [
  { id: 'farmhouse', x: -13, z: -7, width: 5, depth: 4, rotation: 0, platform: true },
  { id: 'pump-house', x: -14, z: 6, width: 5, depth: 4, rotation: 0, platform: true },
  { id: 'storage-tank', x: 13, z: -7, width: 4, depth: 4, rotation: 0, platform: true },
  { id: 'well-head-1', x: -10, z: -3, width: 1, depth: 1, rotation: 0, platform: true },
  { id: 'well-head-2', x: -7, z: -3, width: 1, depth: 1, rotation: 0, platform: true },
  { id: 'well-head-3', x: -4, z: -3, width: 1, depth: 1, rotation: 0, platform: true },
  { id: 'truck', x: -8, z: 0, width: 5, depth: 2, rotation: 0, platform: true },
  { id: 'drill-rig-and-flag', x: 3, z: 5, width: 5, depth: 4, rotation: 0, platform: true, group: 'drill-station' },
  { id: 'pond', x: 12, z: 6, width: 8, depth: 8, rotation: 0, platform: true },
  ...[
    ['tree-nw', -18, -12], ['tree-ne', 18, -12],
    ['tree-sw', -18, 12], ['tree-se', 18, 12],
  ].map(([id, x, z]) => ({ id: id as string, x: x as number, z: z as number, width: 1, depth: 1, rotation: 0, platform: true })),
  ...[-10, -6, -2, 2, 6, 10].map((x, index) => ({ id: `fence-n-${index}`, x, z: -13, width: 2, depth: 1, rotation: 0, platform: true })),
  ...[-10, -6, -2, 2, 6, 10].map((x, index) => ({ id: `fence-s-${index}`, x, z: 13, width: 2, depth: 1, rotation: 0, platform: true })),
]

function bounds(item: DioramaFootprint) {
  const angle = (item.rotation * Math.PI) / 180
  const width = Math.abs(item.width * Math.cos(angle)) + Math.abs(item.depth * Math.sin(angle))
  const depth = Math.abs(item.depth * Math.cos(angle)) + Math.abs(item.width * Math.sin(angle))
  return { left: item.x - width / 2, right: item.x + width / 2, back: item.z - depth / 2, front: item.z + depth / 2 }
}

export function validateDioramaLayout(layout = DIORAMA_LAYOUT) {
  const errors: string[] = []
  const halfWidth = PLATFORM.width / 2
  const halfDepth = PLATFORM.depth / 2
  for (const item of layout) {
    if (![item.x, item.z, item.width, item.depth, item.rotation].every(Number.isFinite)) errors.push(`${item.id}: non-finite layout value`)
    if (![item.x, item.z].every((value) => Number.isInteger(value))) errors.push(`${item.id}: center is not on the 1-unit grid`)
    if (item.width <= 0 || item.depth <= 0) errors.push(`${item.id}: footprint must have positive dimensions`)
    const b = bounds(item)
    if (item.platform && (b.left < -halfWidth || b.right > halfWidth || b.back < -halfDepth || b.front > halfDepth)) errors.push(`${item.id}: extends beyond the platform`)
  }
  for (let i = 0; i < layout.length; i += 1) {
    for (let j = i + 1; j < layout.length; j += 1) {
      const a = layout[i]
      const b = layout[j]
      if (a.group && a.group === b.group) continue
      const aa = bounds(a)
      const bb = bounds(b)
      if (aa.left < bb.right && aa.right > bb.left && aa.back < bb.front && aa.front > bb.back) errors.push(`${a.id} overlaps ${b.id}`)
    }
  }
  const truck = layout.find((item) => item.id === 'truck')
  if (truck) {
    const a = bounds(truck)
    for (const item of layout) {
      if (item === truck || (truck.group && truck.group === item.group)) continue
      const b = bounds(item)
      const separatedX = Math.max(b.left - a.right, a.left - b.right)
      const separatedZ = Math.max(b.back - a.front, a.back - b.front)
      if (separatedX < 1 && separatedZ < 1) errors.push(`truck is less than 1 unit clear of ${item.id}`)
    }
  }
  return errors
}

export function assertValidDioramaLayout() {
  const errors = validateDioramaLayout()
  if (errors.length) throw new Error(`Invalid diorama layout:\n${errors.map((error) => `- ${error}`).join('\n')}`)
  return true
}
