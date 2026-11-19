import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@/test/testUtils'
import { DrillingVideo } from './DrillingVideo'
import { DrillingVideoProvider } from './DrillingVideoContext'
import { WatchDemoModal } from './WatchDemoModal'

describe('DrillingVideo Component & Watch Demo Modal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    // Mock HTMLMediaElement play/pause
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
    window.HTMLMediaElement.prototype.pause = vi.fn()
  })

  it('renders video with poster, webm & mp4 sources, and WebVTT caption track', () => {
    const { container } = render(
      <DrillingVideoProvider>
        <DrillingVideo />
      </DrillingVideoProvider>
    )

    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('poster', '/media/mj-drilling-poster.jpg')
    expect(video).toHaveAttribute('playsinline')

    const sources = container.querySelectorAll('video source')
    expect(sources).toHaveLength(2)
    expect(sources[0]).toHaveAttribute('src', '/media/mj-drilling.webm')
    expect(sources[0]).toHaveAttribute('type', 'video/webm')
    expect(sources[1]).toHaveAttribute('src', '/media/mj-drilling.mp4')
    expect(sources[1]).toHaveAttribute('type', 'video/mp4')

    const track = container.querySelector('video track')
    expect(track).toBeInTheDocument()
    expect(track).toHaveAttribute('kind', 'captions')
    expect(track).toHaveAttribute('src', '/media/mj-drilling.vtt')
    expect(track).toHaveAttribute('srclang', 'en')
  })

  it('renders summary line and disclosure note', () => {
    render(
      <DrillingVideoProvider>
        <DrillingVideo />
      </DrillingVideoProvider>
    )

    expect(
      screen.getByText(/Our crew walks the site, sets up the rig, drills through each layer/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Illustration of the drilling process/i)
    ).toBeInTheDocument()
  })

  it('renders accessible control buttons for Play, Replay, Mute, CC, and Popup', () => {
    render(
      <DrillingVideoProvider>
        <DrillingVideo />
      </DrillingVideoProvider>
    )

    expect(screen.getByRole('button', { name: /Play drilling demonstration video/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Replay video from beginning/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Unmute video audio/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Enable closed captions/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Open Watch Demo popup window/i })).toBeInTheDocument()
  })

  it('toggles play and pause on button click', async () => {
    render(
      <DrillingVideoProvider>
        <DrillingVideo />
      </DrillingVideoProvider>
    )

    const playBtn = screen.getByRole('button', { name: /Play drilling demonstration video/i })
    await act(async () => {
      fireEvent.click(playBtn)
    })
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled()
  })

  it('respects prefers-reduced-motion: does not loop and shows poster with Play Video button', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { container } = render(
      <DrillingVideoProvider>
        <DrillingVideo />
      </DrillingVideoProvider>
    )

    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    // Loop should be false in reduced motion mode
    expect(video).not.toHaveAttribute('loop')

    // Overlay Play button is present
    expect(screen.getByRole('button', { name: /Play drilling demonstration video/i })).toBeInTheDocument()
  })

  it('opens WatchDemoModal popup when clicking Watch Demo button', async () => {
    render(
      <DrillingVideoProvider>
        <DrillingVideo />
        <WatchDemoModal />
      </DrillingVideoProvider>
    )

    // Initially modal is closed
    expect(screen.queryByRole('dialog', { name: /M&J Well Drilling Demo Video/i })).not.toBeInTheDocument()

    // Click popup button
    const popupBtn = screen.getByRole('button', { name: /Open Watch Demo popup window/i })
    await act(async () => {
      fireEvent.click(popupBtn)
    })

    // Modal is now open
    expect(screen.getByRole('dialog', { name: /M&J Well Drilling Demo Video/i })).toBeInTheDocument()

    // Cancel / Close button at top right corner dismisses modal
    const closeBtn = screen.getByRole('button', { name: /Close video demo/i })
    await act(async () => {
      fireEvent.click(closeBtn)
    })

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /M&J Well Drilling Demo Video/i })).not.toBeInTheDocument()
    })
  })
})
