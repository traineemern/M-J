import { roadmapSteps } from '@/data/roadmap'
import { RoadmapRoute } from './RoadmapRoute'
import { RoadmapStep } from './RoadmapStep'

const stopRatios = [0, .145, .29, .435, .565, .71, .855, 1]

// Retained as pure geometry helpers for existing callers; the roadmap UI is static.
export function roadmapSnapStops(count = 8) {
  return Array.from({ length: count }, (_, index) => index / (count - 1))
}

export function roadmapStepFromProgress(progress: number, count = 8) {
  return Math.min(count - 1, Math.max(0, Math.round(progress * (count - 1))))
}

export function getRoadmapStopPoints(path: SVGPathElement, ratios = stopRatios) {
  const length = path.getTotalLength()
  return ratios.map((ratio) => path.getPointAtLength(length * ratio))
}

export function RoadmapFlow({ className = '' }: { className?: string }) {
  return (
    <div className={`roadmap-stage ${className}`}>
      <RoadmapRoute />
      <ol className="roadmap-static-grid" aria-label="Eight steps in a well project">
        {roadmapSteps.map((step) => (
          <RoadmapStep key={step.step} step={step} />
        ))}
      </ol>
    </div>
  )
}

export default RoadmapFlow
