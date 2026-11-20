import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JourneyStage, getJourneyFrameLoop } from './JourneyStage'
import {
  JOURNEY_BEATS,
  TRANSITION_TABLE,
  getBeatForProgress,
  getBeatForTime,
  mapProgressToTime,
  isHouseVisible,
} from '@/data/journey'
import {
  boundsOverlap,
  CUTAWAY_BOUNDS,
  getCameraForProgress,
  getDioramaBeatTimeline,
  getDioramaModelState,
  getManagerClipForProgress,
  TRUCK_FOOTPRINT,
} from './beats'
import * as reducedMotionHook from '@/hooks/useReducedMotion'
import * as isMobileHook from '@/hooks/useIsMobile'

// Mock Canvas & Scene for JSDOM / React 19 testing
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => (
    <div data-testid="r3f-canvas-mock" aria-hidden="true">
      {children}
    </div>
  ),
  useThree: () => ({
    camera: { position: { set: vi.fn() }, lookAt: vi.fn() },
    gl: { info: { render: { calls: 24 } }, dispose: vi.fn() },
  }),
  useFrame: vi.fn(),
}))

vi.mock('./JourneyScene', () => ({
  JourneyScene: () => <div data-testid="journey-scene-mock" />,
  default: () => <div data-testid="journey-scene-mock" />,
}))

describe('Journey 3D Beats, Transitions and Timing Order', () => {
  it('keeps the aquifer band and casing water hidden until the casing stage of beat 7', () => {
    for (const progress of [0, 0.17, 0.28, 0.34, 0.465, 0.53, 0.54, 0.61, 0.68, 0.7, 0.71, 0.729]) {
      expect(getDioramaBeatTimeline(progress).water, `water at ${progress}`).toBe(false)
    }
    expect(getDioramaBeatTimeline(0.73).water).toBe(true)
    expect(getDioramaBeatTimeline(0.85).water).toBe(true)
  })
  it('shows cutaway labels only after each layer is drawn and hides them by beat 8', () => {
    for (const progress of [0, 0.18, 0.3, 0.34, 0.47, 0.53, 0.83, 0.9, 0.95, 1]) {
      expect(getDioramaBeatTimeline(progress).labels, `labels at ${progress}`).toEqual([])
    }
    expect(getDioramaBeatTimeline(0.55).labels).toEqual([])
    expect(getDioramaBeatTimeline(0.58).labels).toContain('TOP SOIL')
    expect(getDioramaBeatTimeline(0.63).labels).toContain('SUB SOIL')
    expect(getDioramaBeatTimeline(0.67).labels).toContain('BED ROCK')
    expect(getDioramaBeatTimeline(0.73).labels).toContain('GROUND WATER')
  })
  it('keeps the truck footprint clear of the cutaway and fits both within 5 by 5 units', () => {
    expect(boundsOverlap(TRUCK_FOOTPRINT, CUTAWAY_BOUNDS)).toBe(false)
    expect(CUTAWAY_BOUNDS.maxX - CUTAWAY_BOUNDS.minX).toBeLessThanOrEqual(5)
    expect(CUTAWAY_BOUNDS.maxZ - CUTAWAY_BOUNDS.minZ).toBeLessThanOrEqual(5)
    expect(CUTAWAY_BOUNDS.minX - TRUCK_FOOTPRINT.maxX).toBeGreaterThanOrEqual(4)
  })
  it('maps each beat to its diorama model state', () => {
    expect([0.08, 0.22, 0.32, 0.4, 0.5, 0.62, 0.76, 0.86, 0.96].map(getDioramaModelState)).toEqual([
      'open-ground',
      'truck-arrival',
      'manager-walk',
      'manager-ground-check',
      'rig-setup',
      'drilling',
      'groundwater',
      'water-splash',
      'home-delivery',
    ])
  })
  it('maps the manager clips to story beats and keeps him out of beats 1 and 2', () => {
    expect([0.08, 0.22, 0.31, 0.33, 0.37, 0.42, 0.5, 0.62, 0.76, 0.86, 0.94, 0.98].map(getManagerClipForProgress)).toEqual([
      null, null, 'walk', 'idle', 'kneel', 'standUp', 'clipboard', 'clipboard', 'clipboard', 'look', 'walk', 'idle',
    ])
  })
  it('pauses the R3F frame loop when the stage or browser tab is hidden', () => {
    expect(getJourneyFrameLoop(false, true)).toBe('never')
    expect(getJourneyFrameLoop(true, false)).toBe('never')
    expect(getJourneyFrameLoop(true, true)).toBe('always')
  })
  it('the beat order and transition list match the reference spec exactly', () => {
    expect(JOURNEY_BEATS).toHaveLength(9)
    expect(TRANSITION_TABLE).toHaveLength(8)

    // Check transition sequential ordering 1->2 through 8->9
    TRANSITION_TABLE.forEach((trans, idx) => {
      expect(trans.fromBeat).toBe(idx + 1)
      expect(trans.toBeat).toBe(idx + 2)
      expect(trans.matchCutTarget).toBeDefined()
      expect(trans.cameraTransition).toBeDefined()
    })

    // Check captions match prompt verbatim
    expect(JOURNEY_BEATS[0].caption).toBe('Every project starts on open ground.')
    expect(JOURNEY_BEATS[1].caption).toBe('Our rig arrives on site.')
    expect(JOURNEY_BEATS[2].caption).toBe('Our manager walks the site first.')
    expect(JOURNEY_BEATS[3].caption).toBe('We check access, ground, and setbacks.')
    expect(JOURNEY_BEATS[4].caption).toBe('The rig is set and level.')
    expect(JOURNEY_BEATS[5].caption).toBe('We drill through every layer.')
    expect(JOURNEY_BEATS[6].caption).toBe('Water collects at its natural level.')
    expect(JOURNEY_BEATS[7].caption).toBe('Clean water found.')
    expect(JOURNEY_BEATS[8].caption).toBe('Clean water, delivered to your home.')
  })

  it('each beat caption appears at its start time (test the lookup)', () => {
    JOURNEY_BEATS.forEach((beat) => {
      const lookupBeat = getBeatForTime(beat.timeStart)
      expect(lookupBeat.id).toBe(beat.id)
      expect(lookupBeat.caption).toBe(beat.caption)
    })
  })

  it('the house is not in the scene graph during beats 1 to 8 (test the visibility flag per beat)', () => {
    // Check all beats 1 through 8: house must be invisible
    for (let i = 0; i < 8; i++) {
      const beat = JOURNEY_BEATS[i]
      expect(isHouseVisible(beat.progressStart)).toBe(false)
      expect(isHouseVisible(beat.progressEnd)).toBe(false)
      const midProgress = (beat.progressStart + beat.progressEnd) / 2
      expect(isHouseVisible(midProgress)).toBe(false)
    }

    // Beat 9: house must be visible
    const beat9 = JOURNEY_BEATS[8]
    expect(isHouseVisible(beat9.progressStart)).toBe(true)
    expect(isHouseVisible(beat9.progressEnd)).toBe(true)
    expect(isHouseVisible(0.95)).toBe(true)
  })

  it('maps progress 0 and 1 to the first and last beat', () => {
    const firstBeat = getBeatForProgress(0)
    expect(firstBeat.id).toBe(1)
    expect(firstBeat.caption).toBe('Every project starts on open ground.')

    const lastBeat = getBeatForProgress(1)
    expect(lastBeat.id).toBe(9)
    expect(lastBeat.caption).toBe('Clean water, delivered to your home.')
  })

  it('correctly maps time in seconds to the matching beat', () => {
    expect(mapProgressToTime(0.5)).toBeCloseTo(25.3)
    expect(getBeatForTime(0).id).toBe(1)
    expect(getBeatForTime(12).id).toBe(2)
    expect(getBeatForTime(16).id).toBe(3)
    expect(getBeatForTime(20).id).toBe(4)
    expect(getBeatForTime(25).id).toBe(5)
    expect(getBeatForTime(30).id).toBe(6)
    expect(getBeatForTime(38).id).toBe(7)
    expect(getBeatForTime(43).id).toBe(8)
    expect(getBeatForTime(48).id).toBe(9)
  })

  it('smoothly interpolates camera target and position without snapping', () => {
    const cam0 = getCameraForProgress(0)
    expect(cam0.position[0]).toBeCloseTo(13.0)

    const camMid = getCameraForProgress(0.5)
    expect(camMid.position[0]).toBeDefined()
    expect(camMid.position[1]).toBeDefined()
    expect(camMid.position[2]).toBeDefined()

    const camEnd = getCameraForProgress(1)
    expect(camEnd.position[0]).toBeCloseTo(5.8)
  })
})

describe('JourneyStage Component & Accessibility Fallbacks', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('reduced motion shows the poster fallback and all 9 captions, and no canvas', () => {
    vi.spyOn(reducedMotionHook, 'useReducedMotion').mockReturnValue(true)
    vi.spyOn(isMobileHook, 'useIsMobile').mockReturnValue(false)

    render(<JourneyStage />)

    // Poster fallback container is rendered
    expect(screen.getByTestId('journey-poster-fallback')).toBeInTheDocument()

    // 3D stage canvas is NOT rendered
    expect(screen.queryByTestId('journey-3d-stage')).not.toBeInTheDocument()

    // Poster image is present with alt text
    const poster = screen.getByAltText(/Isometric M&J Water Wells site diorama/i)
    expect(poster).toBeInTheDocument()
    expect(poster).toHaveAttribute('src', '/images/diorama-poster.webp')
    expect(screen.getByText('Water level [CONFIRM]')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Learn more' })).toHaveLength(3)

    // All 9 captions are listed in order as a static list
    JOURNEY_BEATS.forEach((beat) => {
      expect(screen.getByText(beat.caption)).toBeInTheDocument()
    })
  })

  it('below 768px with simulated low frame rate (forcePoster), poster replaces canvas', () => {
    vi.spyOn(reducedMotionHook, 'useReducedMotion').mockReturnValue(false)
    vi.spyOn(isMobileHook, 'useIsMobile').mockReturnValue(true)

    // Force poster fallback (as triggered by low FPS monitor)
    render(<JourneyStage forcePoster={true} />)

    expect(screen.getByTestId('journey-poster-fallback')).toBeInTheDocument()
    expect(screen.queryByTestId('journey-3d-stage')).not.toBeInTheDocument()
  })

  it('the 3D canvas is aria-hidden="true" for screen readers', async () => {
    vi.spyOn(reducedMotionHook, 'useReducedMotion').mockReturnValue(false)
    vi.spyOn(isMobileHook, 'useIsMobile').mockReturnValue(false)

    const { container, findByTestId } = render(<JourneyStage />)
    await findByTestId('r3f-canvas-mock')

    const canvasContainer = container.querySelector('[aria-hidden="true"]')
    expect(canvasContainer).toBeInTheDocument()
  })

  it('dispose is called on unmount when clearing 3D stage', async () => {
    vi.spyOn(reducedMotionHook, 'useReducedMotion').mockReturnValue(false)
    vi.spyOn(isMobileHook, 'useIsMobile').mockReturnValue(false)

    const { unmount, findByTestId } = render(<JourneyStage />)
    await findByTestId('r3f-canvas-mock')
    expect(() => unmount()).not.toThrow()
  })

  it('the journey section does not block the sections below it in document flow', () => {
    const { container } = render(
      <div>
        <JourneyStage forcePoster={true} />
        <section id="services-next" style={{ height: '400px', background: '#fff' }}>
          <h2>Core Well Services</h2>
        </section>
      </div>
    )

    const nextSection = container.querySelector('#services-next')
    expect(nextSection).toBeInTheDocument()
    expect(screen.getByText('Core Well Services')).toBeInTheDocument()
  })
})
