import { roadmapSteps } from '@/data/roadmap'
import { RoadmapRoute } from './RoadmapRoute'
import { RoadmapStep } from './RoadmapStep'

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
