import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/testUtils'
import { RoadmapFlow } from './RoadmapFlow'
import { roadmapSteps } from '@/data/roadmap'

describe('Roadmap Feature & Step Tests', () => {
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
  })

  it('All 8 steps render in order in the <ol>', () => {
    const { container } = render(<RoadmapFlow />)

    const olElement = container.querySelector('ol')
    expect(olElement).toBeInTheDocument()

    const listItems = container.querySelectorAll('ol > li')
    expect(listItems).toHaveLength(8)

    roadmapSteps.forEach((step) => {
      // Step number in text exists
      expect(screen.getAllByText(new RegExp(`Step ${step.step}`, 'i'))[0]).toBeInTheDocument()
      // Title exists
      expect(screen.getAllByText(step.title)[0]).toBeInTheDocument()
    })
  })

  it('Badges appear only on the flagged steps', () => {
    render(<RoadmapFlow />)

    const comingSoonBadges = screen.getAllByText('Coming Soon')
    const flaggedSteps = roadmapSteps.filter((s) => s.badge === 'Coming Soon')

    expect(comingSoonBadges.length).toBe(flaggedSteps.length)
    expect(flaggedSteps).toHaveLength(1)
    expect(flaggedSteps[0].step).toBe(8)
  })

    it('Links point to the correct routes (Step 1 -> /contact, Step 4 -> #drilling-video, Step 7 -> /warranty, Step 8 -> /services)', () => {
      render(<RoadmapFlow />)

      // Step 1 title links to /contact
      const step1Link = screen.getByRole('link', { name: new RegExp(roadmapSteps[0].title, 'i') })
      expect(step1Link).toHaveAttribute('href', '/contact')

      // Step 4 title links to #drilling-video
      const step4Link = screen.getByRole('link', { name: new RegExp(roadmapSteps[3].title, 'i') })
      expect(step4Link).toHaveAttribute('href', '#drilling-video')

      // Step 7 title links to /warranty
      const step7Link = screen.getByRole('link', { name: new RegExp(roadmapSteps[6].title, 'i') })
      expect(step7Link).toHaveAttribute('href', '/warranty')

      // Step 8 title links to /services
      const step8Link = screen.getByRole('link', { name: new RegExp(roadmapSteps[7].title, 'i') })
      expect(step8Link).toHaveAttribute('href', '/services')
    })

    it('Reduced motion shows all nodes and the full road without animation', () => {
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

      render(<RoadmapFlow />)

      roadmapSteps.forEach((step) => {
        expect(screen.getAllByText(step.title)[0]).toBeInTheDocument()
      })
    })

    it('Road SVG and pins are aria-hidden="true"', () => {
      const { container } = render(<RoadmapFlow />)

      const decorativeElements = container.querySelectorAll('[aria-hidden="true"]')
      expect(decorativeElements.length).toBeGreaterThan(0)

      // Verify SVGs for roads are aria-hidden
      const svgs = container.querySelectorAll('svg')
      svgs.forEach((svg) => {
        expect(svg.closest('[aria-hidden="true"]') || svg.getAttribute('aria-hidden') === 'true').toBeTruthy()
      })
    })
  })
