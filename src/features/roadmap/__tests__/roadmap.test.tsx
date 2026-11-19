import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/testUtils'
import { RoadmapFlow } from '../RoadmapFlow'
import { roadmapSteps } from '@/data/roadmap'

describe('Roadmap Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all eight steps in order', () => {
    render(<RoadmapFlow />)

    expect(roadmapSteps).toHaveLength(8)

    roadmapSteps.forEach((step) => {
      // Step numbers exist
      expect(screen.getAllByText(new RegExp(`Step ${step.step}`, 'i'))[0]).toBeInTheDocument()
      // Titles exist
      expect(screen.getAllByText(step.title)[0]).toBeInTheDocument()
    })
  })

  it('"Coming Soon" badge appears only on the steps flagged in the data', () => {
    render(<RoadmapFlow />)

    const comingSoonBadges = screen.getAllByText('Coming Soon')
    const flaggedSteps = roadmapSteps.filter((s) => s.badge === 'Coming Soon')

    expect(comingSoonBadges.length).toBe(flaggedSteps.length)
    expect(flaggedSteps.length).toBe(1)
    expect(flaggedSteps[0].step).toBe(8)
  })

  it('links point to the correct routes (Step 1 -> /contact, Step 7 -> /warranty, Step 8 -> /services)', () => {
    render(<RoadmapFlow />)

    // Step 1 title links to /contact
    const step1Link = screen.getByRole('link', { name: new RegExp(roadmapSteps[0].title, 'i') })
    expect(step1Link).toHaveAttribute('href', '/contact')

    // Step 7 title links to /warranty
    const step7Link = screen.getByRole('link', { name: new RegExp(roadmapSteps[6].title, 'i') })
    expect(step7Link).toHaveAttribute('href', '/warranty')

    // Step 8 title links to /services
    const step8Link = screen.getByRole('link', { name: new RegExp(roadmapSteps[7].title, 'i') })
    expect(step8Link).toHaveAttribute('href', '/services')
  })

  it('renders correctly under reduced-motion mode without animation delay', () => {
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
})
