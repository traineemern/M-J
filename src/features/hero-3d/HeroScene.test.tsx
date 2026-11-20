import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroScene, canLoadLevelC } from './HeroScene'

describe('HeroScene Level C 3D Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.innerWidth = 1024
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
  })

  it('canLoadLevelC returns true on desktop without reduced motion or data saver', () => {
    window.innerWidth = 1024
    expect(canLoadLevelC()).toBe(true)
  })

  it('canLoadLevelC returns false on mobile below 768px', () => {
    window.innerWidth = 500
    expect(canLoadLevelC()).toBe(false)
  })

  it('canLoadLevelC returns false when prefers-reduced-motion is true', () => {
    window.innerWidth = 1024
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    expect(canLoadLevelC()).toBe(false)
  })

  it('canLoadLevelC returns false when data-saver is enabled', () => {
    window.innerWidth = 1024
    Object.defineProperty(navigator, 'connection', {
      value: { saveData: true },
      configurable: true,
    })
    expect(canLoadLevelC()).toBe(false)
  })

  it('renders static poster image when Level C is disabled on mobile', () => {
    window.innerWidth = 400
    render(<HeroScene />)
    const img = screen.getByRole('img', {
      name: /M&J Water Wells crew and rotary drilling rig/i,
    })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/images/about-team.jpg')
  })
})
