export interface CameraConfig {
  position: [number, number, number]
  target: [number, number, number]
}

export type DioramaModelState =
  | 'open-ground'
  | 'truck-arrival'
  | 'manager-walk'
  | 'manager-ground-check'
  | 'rig-setup'
  | 'drilling'
  | 'groundwater'
  | 'water-splash'
  | 'home-delivery'

export interface DioramaBeatTimeline {
  beat: number
  cutaway: boolean
  water: boolean
  labels: string[]
  layerProgress: number
  casingProgress: number
  cutawayOpacity: number
}

export const TRUCK_FOOTPRINT = { minX: -11.5, maxX: -6.5, minZ: -1.1, maxZ: 1.1 }
export const CUTAWAY_BOUNDS = { minX: 0.5, maxX: 4.5, minZ: 3, maxZ: 7 }

export function boundsOverlap(a: typeof TRUCK_FOOTPRINT, b: typeof CUTAWAY_BOUNDS): boolean {
  return a.minX < b.maxX && a.maxX > b.minX && a.minZ < b.maxZ && a.maxZ > b.minZ
}

export function getDioramaBeatTimeline(progress: number): DioramaBeatTimeline {
  const p = Math.max(0, Math.min(1, progress))
  const beat = p < 0.18 ? 1 : p < 0.30 ? 2 : p < 0.34 ? 3 : p < 0.465 ? 4 : p < 0.54 ? 5 : p < 0.71 ? 6 : p < 0.83 ? 7 : p < 0.91 ? 8 : 9
  const cutaway = p >= 0.54 && p < 0.97
  const water = p >= 0.73
  const layerProgress = p < 0.54 ? 0 : THREE_LERP_CLAMP(p, 0.54, 0.70)
  const labels = !cutaway || p >= 0.83 ? [] : [
    ...(layerProgress >= 0.2 ? ['TOP SOIL'] : []),
    ...(layerProgress >= 0.48 ? ['SUB SOIL'] : []),
    ...(layerProgress >= 0.76 ? ['BED ROCK'] : []),
    ...(water ? ['GROUND WATER'] : []),
  ]
  return {
    beat,
    cutaway,
    water,
    labels,
    layerProgress,
    casingProgress: p < 0.71 ? 0 : THREE_LERP_CLAMP(p, 0.71, 0.76),
    cutawayOpacity: p < 0.91 ? 1 : 1 - THREE_LERP_CLAMP(p, 0.91, 0.97),
  }
}

function THREE_LERP_CLAMP(value: number, start: number, end: number): number {
  return Math.max(0, Math.min(1, (value - start) / (end - start)))
}

export type ManagerClip = 'idle' | 'walk' | 'kneel' | 'standUp' | 'look' | 'clipboard'

export function getManagerClipForProgress(progress: number): ManagerClip | null {
  const p = Math.max(0, Math.min(1, progress))
  if (p < 0.30) return null
  if (p < 0.32) return 'walk'
  if (p < 0.34) return 'idle'
  if (p < 0.40) return 'kneel'
  if (p < 0.465) return 'standUp'
  if (p < 0.83) return 'clipboard'
  if (p < 0.91) return 'look'
  if (p < 0.97) return 'walk'
  return 'idle'
}

export function getDioramaModelState(progress: number): DioramaModelState {
  const p = Math.max(0, Math.min(1, progress))
  if (p < 0.18) return 'open-ground'
  if (p < 0.30) return 'truck-arrival'
  if (p < 0.34) return 'manager-walk'
  if (p < 0.46) return 'manager-ground-check'
  if (p < 0.54) return 'rig-setup'
  if (p < 0.71) return 'drilling'
  if (p < 0.83) return 'groundwater'
  if (p < 0.91) return 'water-splash'
  return 'home-delivery'
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function smoothStep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t))
  return clamped * clamped * (3 - 2 * clamped)
}

/**
 * Returns smoothly interpolated camera position and look-at target for any progress 0..1.
 * Complies with continuous camera rules:
 * - Horizon visible in beats 1, 2, 3, 5, 8, 9
 * - Drill tip or casing kept at center of frame in beats 6 and 7
 * - Continuous smooth ease-in-out movement without hard cuts
 */
export function getCameraForProgress(progress: number): CameraConfig {
  const p = Math.max(0, Math.min(1, progress))

  // BEAT 1 (0.00 to 0.17): Wide high angle, dolly forward following dirt track
  if (p < 0.175) {
    const t = smoothStep(p / 0.17)
    return {
      position: [
        lerp(13.0, 7.5, t),
        lerp(8.5, 4.8, t),
        lerp(21.0, 13.5, t),
      ],
      target: [
        lerp(-3.0, -1.0, t),
        lerp(1.0, 1.0, t),
        lerp(0.0, 0.0, t),
      ],
    }
  }

  // TRANSITION 1 -> 2 (0.17 to 0.18): Camera follows truck as it passes lens and parks
  if (p < 0.18) {
    const t = smoothStep((p - 0.17) / 0.01)
    return {
      position: [
        lerp(7.5, 5.2, t),
        lerp(4.8, 2.8, t),
        lerp(13.5, 7.5, t),
      ],
      target: [
        lerp(-1.0, 0.0, t),
        lerp(1.0, 1.1, t),
        0,
      ],
    }
  }

  // BEAT 2 (0.18 to 0.28): Medium side view of parked truck on grass
  if (p < 0.28) {
    return {
      position: [5.2, 2.8, 7.5],
      target: [0.0, 1.1, 0.0],
    }
  }

  // TRANSITION 2 -> 3 (0.28 to 0.30): Camera pans smoothly from truck to left edge
  if (p < 0.30) {
    const t = smoothStep((p - 0.28) / 0.02)
    return {
      position: [
        lerp(5.2, 2.4, t),
        lerp(2.8, 1.9, t),
        lerp(7.5, 5.6, t),
      ],
      target: [
        lerp(0.0, 0.6, t),
        lerp(1.1, 1.1, t),
        lerp(0.0, 0.9, t),
      ],
    }
  }

  // BEAT 3 (0.30 to 0.34): Manager walks in from left toward camera, truck behind
  if (p < 0.34) {
    const t = smoothStep((p - 0.30) / 0.04)
    return {
      position: [
        lerp(2.4, 2.2, t),
        lerp(1.9, 1.5, t),
        lerp(5.6, 4.4, t),
      ],
      target: [0.6, 1.0, 0.6],
    }
  }

  // BEAT 4 (0.34 to 0.46): Ground level close-medium on manager & flag position
  if (p < 0.465) {
    const t = smoothStep((p - 0.34) / 0.125)
    return {
      position: [
        lerp(2.2, 2.0, t),
        lerp(1.5, 0.75, t),
        lerp(4.4, 2.6, t),
      ],
      target: [
        0.6,
        lerp(1.0, 0.35, t),
        0.0,
      ],
    }
  }

  // TRANSITION 4 -> 5 (0.465 to 0.47): Camera moves back from flag to truck side view
  if (p < 0.47) {
    const t = smoothStep((p - 0.465) / 0.005)
    return {
      position: [
        lerp(2.0, 6.0, t),
        lerp(0.75, 3.4, t),
        lerp(2.6, 7.0, t),
      ],
      target: [
        0.6,
        lerp(0.35, 2.4, t),
        0.0,
      ],
    }
  }

  // BEAT 5 (0.47 to 0.53): Side view of truck, outriggers lowering, mast raising vertical
  if (p < 0.535) {
    return {
      position: [6.0, 3.4, 7.0],
      target: [0.6, 2.4, 0.0],
    }
  }

  // TRANSITION 5 -> 6 (0.535 to 0.54): Camera moves from mast top to flag / drill head alignment
  if (p < 0.54) {
    const t = smoothStep((p - 0.535) / 0.005)
    return {
      position: [
        lerp(6.0, 0.6, t),
        lerp(3.4, 1.2, t),
        lerp(7.0, 4.2, t),
      ],
      target: [
        0.6,
        lerp(2.4, 0.2, t),
        0.0,
      ],
    }
  }

  // BEAT 6 (0.54 to 0.70): Drilling through earth
  // 0.54 to 0.58: Drill head lowers pipe onto flag at surface
  // 0.58 to 0.70: Camera tracks down vertically with drill tip into the ground!
  if (p < 0.705) {
    if (p <= 0.58) {
      return {
        position: [0.6, 1.2, 4.2],
        target: [0.6, 0.2, 0.0],
      }
    }
    // Action 2: Tracking down with drill tip
    const drillProgress = (p - 0.58) / 0.12 // 0 to 1
    const drillTipY = -drillProgress * 6.5
    const camY = Math.min(-0.2, drillTipY + 0.3)
    return {
      position: [0.6, camY, 4.6],
      target: [0.6, drillTipY, 0.0],
    }
  }

  // BEAT 7 (0.71 to 0.82): Camera held at aquifer cutaway depth; casing & rising water at center
  if (p < 0.825) {
    return {
      position: [0.6, -4.2, 4.8],
      target: [0.6, -4.2, 0.0],
    }
  }

  // TRANSITION 7 -> 8 (0.825 to 0.83): Camera rises smoothly from cutaway to surface casing top
  if (p < 0.83) {
    const t = smoothStep((p - 0.825) / 0.005)
    return {
      position: [
        0.6,
        lerp(-4.2, 1.4, t),
        lerp(4.8, 3.8, t),
      ],
      target: [
        0.6,
        lerp(-4.2, 0.4, t),
        0.0,
      ],
    }
  }

  // BEAT 8 (0.83 to 0.90): Surface view; casing top & water splash at center; manager watching
  if (p < 0.905) {
    return {
      position: [0.6, 1.4, 3.8],
      target: [0.6, 0.4, 0.0],
    }
  }

  // TRANSITION 8 -> 9 & BEAT 9 (0.905 to 1.00):
  // Camera pulls back and moves right toward farmhouse, following buried trench to tap
  const t = smoothStep((p - 0.905) / 0.095)
  return {
    position: [
      lerp(0.6, 5.8, t),
      lerp(1.4, 2.6, t),
      lerp(3.8, 7.8, t),
    ],
    target: [
      lerp(0.6, 4.6, t),
      lerp(0.4, 1.1, t),
      0.0,
    ],
  }
}
