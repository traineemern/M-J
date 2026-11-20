import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@/test/testUtils'
import { roadmapSteps } from '@/data/roadmap'
import { RoadmapFlow, getRoadmapStopPoints, roadmapSnapStops, roadmapStepFromProgress } from './RoadmapFlow'

describe('RoadmapFlow', () => {
  it('renders the eight step titles in order in an ordered list', () => {
    render(<RoadmapFlow />)
    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(8)
    roadmapSteps.forEach((step, index) => expect(items[index]).toHaveTextContent(step.title))
  })

  it('maps start and end progress to the first and last stop', () => {
    expect(roadmapStepFromProgress(0)).toBe(0)
    expect(roadmapStepFromProgress(1)).toBe(7)
  })

  it('uses eight evenly spaced snap stops', () => {
    expect(roadmapSnapStops()).toEqual([0, 1/7, 2/7, 3/7, 4/7, 5/7, 6/7, 1])
  })

  it('places every node at the corresponding route point', () => {
    const routePoints = Array.from({ length: 8 }, (_, index) => ({ x: index * 10, y: index * 20 }))
    const path = { getTotalLength: () => 700, getPointAtLength: vi.fn((length: number) => routePoints[Math.round(length / 100)]) } as unknown as SVGPathElement
    const points = getRoadmapStopPoints(path, Array.from({ length: 8 }, (_, index) => index / 7))
    const maxDeviation = Math.max(...points.map((point, index) => Math.hypot(point.x-routePoints[index].x, point.y-routePoints[index].y)))
    expect(maxDeviation).toBeLessThanOrEqual(2)
  })

  it('shows the Coming Soon badge only on step eight', () => {
    render(<RoadmapFlow />)
    const badges = document.querySelectorAll('.roadmap-coming-soon')
    expect(badges).toHaveLength(1)
    expect(badges[0].closest('li')).toHaveTextContent(roadmapSteps[7].title)
  })
})
