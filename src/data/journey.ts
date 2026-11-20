export interface JourneyBeat {
  id: number
  chapter: number
  timeStart: number
  timeEnd: number
  progressStart: number
  progressEnd: number
  caption: string
  modelsDescription: string
  matchCutTarget: string
  cameraMove: string
}

export const JOURNEY_BEATS: JourneyBeat[] = [
  {
    id: 1,
    chapter: 1,
    timeStart: 0,
    timeEnd: 8.5,
    progressStart: 0.0,
    progressEnd: 0.17,
    caption: 'Every project starts on open ground.',
    modelsDescription: 'Wide high-angle farmland with red barn and dirt track; small M&J truck drives forward toward camera with dust trail',
    matchCutTarget: 'M&J Service Truck',
    cameraMove: 'Wide high-angle dolly forward following dirt track',
  },
  {
    id: 2,
    chapter: 2,
    timeStart: 9,
    timeEnd: 14,
    progressStart: 0.18,
    progressEnd: 0.28,
    caption: 'Our rig arrives on site.',
    modelsDescription: 'Truck arrives at camera, passes lens, and stops parked in center on grass with folded mast',
    matchCutTarget: 'M&J Service Truck (reaches camera, passes lens, parks)',
    cameraMove: 'Camera follows truck as it passes lens, pans to medium side view of parked truck',
  },
  {
    id: 3,
    chapter: 3,
    timeStart: 15,
    timeEnd: 17,
    progressStart: 0.30,
    progressEnd: 0.34,
    caption: 'Our manager walks the site first.',
    modelsDescription: 'Jointed manager in hard hat and safety vest walks in across grass toward camera, truck in background',
    matchCutTarget: 'Truck → Manager entry point at left edge',
    cameraMove: 'Pan left from parked truck to left edge, framing manager walking toward camera at low angle',
  },
  {
    id: 4,
    chapter: 4,
    timeStart: 17,
    timeEnd: 23,
    progressStart: 0.34,
    progressEnd: 0.46,
    caption: 'We check access, ground, and setbacks.',
    modelsDescription: 'Manager stops, kneels to touch ground, places aqua survey flag on stake (flag rises from ground), stands up',
    matchCutTarget: 'Manager stops on spot → Flag position',
    cameraMove: 'Ground-level close medium push-in on manager and flag, foreground soil visible',
  },
  {
    id: 5,
    chapter: 5,
    timeStart: 23.5,
    timeEnd: 26.5,
    progressStart: 0.47,
    progressEnd: 0.53,
    caption: 'The rig is set and level.',
    modelsDescription: 'Stabilizer legs extend to grass; mast raises to vertical on truck bed hinge above flag position',
    matchCutTarget: 'M&J Service Truck & Mast hinge',
    cameraMove: 'Move back from flag to truck side view, tilting up to follow mast rising vertical',
  },
  {
    id: 6,
    chapter: 6,
    timeStart: 27,
    timeEnd: 35,
    progressStart: 0.54,
    progressEnd: 0.70,
    caption: 'We drill through every layer.',
    modelsDescription: 'Drill head lowers pipe onto flag; pipe spins; camera tracks down with drill tip; ground cutaway wipes 4 layers',
    matchCutTarget: 'Flag position & Drill head alignment → Drill tip descending into borehole',
    cameraMove: 'Move to flag position above ground, then track down vertically with drill tip through layers',
  },
  {
    id: 7,
    chapter: 7,
    timeStart: 36,
    timeEnd: 41,
    progressStart: 0.71,
    progressEnd: 0.82,
    caption: 'Water collects at its natural level.',
    modelsDescription: 'Drill lifts out leaving hole; steel casing lowers into hole with slotted screen and gravel pack; water rises inside casing',
    matchCutTarget: 'Borehole / Casing inside cutaway',
    cameraMove: 'Hold at aquifer cutaway depth, framing casing, screen, and rising water column at center',
  },
  {
    id: 8,
    chapter: 8,
    timeStart: 42,
    timeEnd: 45,
    progressStart: 0.83,
    progressEnd: 0.90,
    caption: 'Clean water found.',
    modelsDescription: 'Surface casing top with controlled water splash; manager stands watching casing; horizon visible',
    matchCutTarget: 'Casing top (cutaway to surface)',
    cameraMove: 'Rise smoothly from underground cutaway up to surface, centering on casing top and water splash',
  },
  {
    id: 9,
    chapter: 9,
    timeStart: 45.5,
    timeEnd: 50.6,
    progressStart: 0.91,
    progressEnd: 1.0,
    caption: 'Clean water, delivered to your home.',
    modelsDescription: 'Camera pulls back and right; farmhouse appears; buried pipe from casing to house; manager turns tap; running water stream; brand overlay',
    matchCutTarget: 'Casing → Buried trench pipe → Farmhouse tap',
    cameraMove: 'Pull back and dolly right, revealing farmhouse, buried line, outdoor spigot, and water basin',
  },
]

export interface TransitionInfo {
  fromBeat: number
  toBeat: number
  progressMidpoint: number
  matchCutTarget: string
  cameraTransition: string
}

export const TRANSITION_TABLE: TransitionInfo[] = [
  {
    fromBeat: 1,
    toBeat: 2,
    progressMidpoint: 0.175,
    matchCutTarget: 'M&J Service Truck (camera follows past lens to parked truck)',
    cameraTransition: 'Camera follows moving truck past lens, settles on parked side view',
  },
  {
    fromBeat: 2,
    toBeat: 3,
    progressMidpoint: 0.29,
    matchCutTarget: 'Truck → Manager entry point (left edge)',
    cameraTransition: 'Camera pans smoothly from parked truck to left frame where manager enters',
  },
  {
    fromBeat: 3,
    toBeat: 4,
    progressMidpoint: 0.34,
    matchCutTarget: 'Manager stops on drilling spot',
    cameraTransition: 'Camera tracks manager as he stops, pushes in to close ground-level view',
  },
  {
    fromBeat: 4,
    toBeat: 5,
    progressMidpoint: 0.465,
    matchCutTarget: 'Truck & Mast hinge',
    cameraTransition: 'Camera moves back from flag to truck as stabilizer legs lower and mast raises',
  },
  {
    fromBeat: 5,
    toBeat: 6,
    progressMidpoint: 0.535,
    matchCutTarget: 'Flag position & Drill head',
    cameraTransition: 'Camera moves from mast top to flag directly below drill pipe, then tracks down with tip',
  },
  {
    fromBeat: 6,
    toBeat: 7,
    progressMidpoint: 0.705,
    matchCutTarget: 'Borehole (drill lifts out, casing lowers into same hole)',
    cameraTransition: 'Camera holds at aquifer depth as drill retracts and casing lowers into identical borehole',
  },
  {
    fromBeat: 7,
    toBeat: 8,
    progressMidpoint: 0.825,
    matchCutTarget: 'Casing top (camera rises from cutaway to surface)',
    cameraTransition: 'Camera rises smoothly along casing column from depth -4.2 up to surface collar at +0.4',
  },
  {
    fromBeat: 8,
    toBeat: 9,
    progressMidpoint: 0.905,
    matchCutTarget: 'Casing collar → Buried pipe line → House tap',
    cameraTransition: 'Camera pulls back and dollies right, following buried trench to farmhouse spigot',
  },
]

/**
 * Maps scroll progress (0 to 1) to the active beat.
 * Clamps out-of-bounds progress values.
 */
export function getBeatForProgress(progress: number): JourneyBeat {
  const p = Math.max(0, Math.min(1, progress))
  if (p < 0.175) return JOURNEY_BEATS[0]
  if (p < 0.29) return JOURNEY_BEATS[1]
  if (p < 0.34) return JOURNEY_BEATS[2]
  if (p < 0.465) return JOURNEY_BEATS[3]
  if (p < 0.535) return JOURNEY_BEATS[4]
  if (p < 0.705) return JOURNEY_BEATS[5]
  if (p < 0.825) return JOURNEY_BEATS[6]
  if (p < 0.905) return JOURNEY_BEATS[7]
  return JOURNEY_BEATS[8]
}

/**
 * Checks whether the Farmhouse model should be visible in the scene graph.
 * Per spec: The house is removed from beats 1 to 8, appearing ONLY in beat 9.
 */
export function isHouseVisible(progress: number): boolean {
  return progress >= 0.905
}

/**
 * Maps time in seconds (0 to 50.6s) to the active beat.
 * Checks from last to first so exact boundary timestamps match the starting beat.
 */
export function getBeatForTime(time: number): JourneyBeat {
  const t = Math.max(0, Math.min(50.6, time))
  for (let i = JOURNEY_BEATS.length - 1; i >= 0; i--) {
    if (t >= JOURNEY_BEATS[i].timeStart) {
      return JOURNEY_BEATS[i]
    }
  }
  return JOURNEY_BEATS[0]
}

/**
 * Maps progress (0 to 1) linearly to seconds (0 to 50.6).
 */
export function mapProgressToTime(progress: number): number {
  return Math.max(0, Math.min(1, progress)) * 50.6
}
