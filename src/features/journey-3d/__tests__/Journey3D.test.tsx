import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { JourneyContainer, shouldEnable3DJourney } from '../JourneyContainer'
import { MAX_PARTICLE_COUNT } from '../Chapter5WaterTunnel'
import { DrillingVideoProvider } from '@/features/drilling-video/DrillingVideoContext'
import { EnquiryProvider } from '@/features/enquiry/EnquiryContext'

function renderJourney() {
  return render(
    <MemoryRouter>
      <EnquiryProvider>
        <DrillingVideoProvider>
          <JourneyContainer />
        </DrillingVideoProvider>
      </EnquiryProvider>
    </MemoryRouter>
  )
}

describe('Journey3D and Chapters Specification', () => {
  it('renders all 6 chapters in order with valid section headings', () => {
    renderJourney()

    // Chapter 1: Hero
    expect(
      screen.getByRole('heading', { level: 1, name: /West Michigan's Well Drilling Specialists/i })
    ).toBeInTheDocument()

    // Chapter 2: Reveal
    expect(
      screen.getByRole('heading', { level: 2, name: /Clean water, found on site/i })
    ).toBeInTheDocument()

    // Chapter 3: Services
    expect(
      screen.getByRole('heading', { level: 2, name: /Our Services/i })
    ).toBeInTheDocument()

    // Chapter 4: Descent
    expect(
      screen.getByRole('heading', { level: 2, name: /Descent to Pure Ground Water/i })
    ).toBeInTheDocument()

    // Chapter 5: Water Tunnel
    expect(
      screen.getByRole('heading', { level: 2, name: /Step into clean water/i })
    ).toBeInTheDocument()

    // Chapter 6: Finale
    expect(
      screen.getByRole('heading', { level: 2, name: /Ready for Fresh Well Water/i })
    ).toBeInTheDocument()
  })

  it('contains tap-to-call link in finale chapter', () => {
    renderJourney()
    const callButton = screen.getByRole('link', { name: /Call \(616\) 675-4875/i })
    expect(callButton).toBeInTheDocument()
    expect(callButton).toHaveAttribute('href', 'tel:+16166754875')
  })

  it('guarantees particle count is capped strictly <= 400', () => {
    expect(MAX_PARTICLE_COUNT).toBeLessThanOrEqual(400)
    expect(MAX_PARTICLE_COUNT).toBe(360)
  })

  it('disables 3D journey below 768px width (mobile)', () => {
    const originalInnerWidth = window.innerWidth
    try {
      window.innerWidth = 500
      expect(shouldEnable3DJourney()).toBe(false)
    } finally {
      window.innerWidth = originalInnerWidth
    }
  })

  it('respects prefers-reduced-motion media query', () => {
    const originalMatchMedia = window.matchMedia
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

    try {
      expect(shouldEnable3DJourney()).toBe(false)
    } finally {
      window.matchMedia = originalMatchMedia
    }
  })

  it('falls back safely without throwing when WebGL is unavailable', () => {
    expect(() => {
      renderJourney()
    }).not.toThrow()
  })
})
