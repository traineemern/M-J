import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VideoJourney } from '../VideoJourney'
import {
  getChapterForTime,
  mapScrollToTime,
  VIDEO_JOURNEY_CHAPTERS,
} from '../videoJourneyChapters'
import * as reducedMotionHook from '@/hooks/useReducedMotion'
import * as isMobileHook from '@/hooks/useIsMobile'

describe('VideoJourney Chapters and Timing Pure Functions', () => {
  it('has exactly 9 defined chapters', () => {
    expect(VIDEO_JOURNEY_CHAPTERS).toHaveLength(9)
  })

  it('maps scroll progress 0 to 1 onto video time 0 to duration', () => {
    const duration = 50.67
    expect(mapScrollToTime(0, duration)).toBe(0)
    expect(mapScrollToTime(0.5, duration)).toBeCloseTo(25.335)
    expect(mapScrollToTime(1, duration)).toBe(50.67)
    // Edge cases: clamp out of bounds
    expect(mapScrollToTime(-0.2, duration)).toBe(0)
    expect(mapScrollToTime(1.5, duration)).toBe(50.67)
    expect(mapScrollToTime(0.5, 0)).toBe(0)
  })

  it('updates chapter labels at required timestamp boundaries', () => {
    // 1. 0.0 to 8.5 s
    expect(getChapterForTime(0).index).toBe(1)
    expect(getChapterForTime(8.4).index).toBe(1)
    expect(getChapterForTime(0).title).toBe('Every project starts on open ground.')

    // 2. updates at 8.5 s -> Chapter 2
    expect(getChapterForTime(8.5).index).toBe(2)
    expect(getChapterForTime(13.9).index).toBe(2)
    expect(getChapterForTime(8.5).title).toBe('Our rig arrives on site.')

    // 3. updates at 14.0 s -> Chapter 3
    expect(getChapterForTime(14.0).index).toBe(3)
    expect(getChapterForTime(16.5).index).toBe(3)
    expect(getChapterForTime(14.0).title).toBe('Our manager walks the site first.')

    // 4. Chapter 4
    expect(getChapterForTime(17.0).index).toBe(4)
    expect(getChapterForTime(23.0).index).toBe(4)
    expect(getChapterForTime(17.0).title).toBe('We check access, ground, and setbacks.')

    // 5. updates at 23.5 s -> Chapter 5
    expect(getChapterForTime(23.5).index).toBe(5)
    expect(getChapterForTime(26.0).index).toBe(5)
    expect(getChapterForTime(23.5).title).toBe('The rig is set and level.')

    // 6. Chapter 6
    expect(getChapterForTime(27.0).index).toBe(6)
    expect(getChapterForTime(34.9).index).toBe(6)
    expect(getChapterForTime(27.0).title).toBe('We drill through every layer.')

    // 7. updates at 35.0 s -> Chapter 7
    expect(getChapterForTime(35.0).index).toBe(7)
    expect(getChapterForTime(40.5).index).toBe(7)
    expect(getChapterForTime(35.0).title).toBe('Water collects at its natural level.')

    // 8. updates at 41.0 s -> Chapter 8
    expect(getChapterForTime(41.0).index).toBe(8)
    expect(getChapterForTime(45.0).index).toBe(8)
    expect(getChapterForTime(41.0).title).toBe('Clean water found.')

    // 9. updates at 45.5 s -> Chapter 9
    expect(getChapterForTime(45.5).index).toBe(9)
    expect(getChapterForTime(50.67).index).toBe(9)
    expect(getChapterForTime(45.5).title).toBe('Clean water, delivered to your home.')
  })
})

describe('VideoJourney Component Rendering and Modes', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders poster before video is ready on desktop', () => {
    vi.spyOn(isMobileHook, 'useIsMobile').mockReturnValue(false)
    vi.spyOn(reducedMotionHook, 'useReducedMotion').mockReturnValue(false)

    render(<VideoJourney />)

    // Poster image is displayed
    const poster = screen.getByAltText('M&J Water Wells drilling site in Casnovia')
    expect(poster).toBeInTheDocument()
    expect(poster).toHaveAttribute('src', '/media/mj-journey-poster.jpg')

    // Chapter 1 is initial badge
    expect(screen.getByText('Chapter 1 of 9')).toBeInTheDocument()

    // Screen reader summary is present
    expect(
      screen.getByText(
        'Our crew walks the site, sets up the rig, drills through each layer, and reaches clean groundwater.'
      )
    ).toBeInTheDocument()
  })

  it('below 1024px, video is not scrubbed and play button is shown', () => {
    vi.spyOn(isMobileHook, 'useIsMobile').mockReturnValue(true) // mobile mode (< 1024px)
    vi.spyOn(reducedMotionHook, 'useReducedMotion').mockReturnValue(false)

    render(<VideoJourney />)

    // Desktop pinned section is NOT rendered
    expect(screen.queryByTestId('desktop-video-journey')).not.toBeInTheDocument()

    // Play journey button is shown with poster
    const playBtn = screen.getByRole('button', { name: /play journey video/i })
    expect(playBtn).toBeInTheDocument()

    const poster = screen.getByAltText('M&J Water Wells crew and rotary rig on site')
    expect(poster).toBeInTheDocument()
    expect(poster).toHaveAttribute('src', '/media/mj-journey-poster.jpg')

    // Clicking play starts mobile playback
    fireEvent.click(playBtn)
    expect(screen.getByLabelText(/Animated drilling video/i)).toBeInTheDocument()
  })

  it('reduced motion shows poster and play button, and no pin or scrub is set', () => {
    vi.spyOn(isMobileHook, 'useIsMobile').mockReturnValue(false) // desktop screen size
    vi.spyOn(reducedMotionHook, 'useReducedMotion').mockReturnValue(true) // reduced motion active

    render(<VideoJourney />)

    // Should fall back to static 16:9 container with Play button, no desktop 500vh pin
    expect(screen.queryByTestId('desktop-video-journey')).not.toBeInTheDocument()

    const playBtn = screen.getByRole('button', { name: /play journey video/i })
    expect(playBtn).toBeInTheDocument()

    const poster = screen.getByAltText('M&J Water Wells crew and rotary rig on site')
    expect(poster).toBeInTheDocument()
  })

  it('does not block sections below it in document flow', () => {
    const { container } = render(
      <div>
        <VideoJourney />
        <section id="next-section" style={{ height: '300px', background: '#fff' }}>
          <h2>Next Section Heading</h2>
        </section>
      </div>
    )

    const nextSection = container.querySelector('#next-section')
    expect(nextSection).toBeInTheDocument()
    expect(screen.getByText('Next Section Heading')).toBeInTheDocument()
  })
})
