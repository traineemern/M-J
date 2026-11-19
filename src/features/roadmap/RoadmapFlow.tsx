import React, { useState } from 'react'
import { roadmapSteps } from '@/data/roadmap'
import { RoadmapRoute } from './RoadmapRoute'
import { RoadmapStep } from './RoadmapStep'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface RoadmapFlowProps {
  className?: string
}

export const RoadmapFlow: React.FC<RoadmapFlowProps> = ({ className = '' }) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={`relative w-full max-w-[960px] mx-auto ${className}`}>
      {/* Decorative SVG Road and Connectors (aria-hidden) */}
      <RoadmapRoute hoveredStep={hoveredStep} />

      {/* Semantic Accessible Ordered List (<ol>) */}
      {/* Responsive layout with CSS breakpoints:
          - Mobile (< 640px): Compact vertical route with 16px (space-y-4) gap
          - Tablet (640-1023px): 2-column x 4-row snake grid
          - Desktop (>= 1024px): 4-column x 2-row route map grid (max-w 960px, height ~420px)
      */}
      <ol className="relative z-10 list-none p-0 m-0 space-y-3.5 sm:space-y-0 sm:grid sm:grid-cols-2 sm:grid-rows-4 sm:gap-x-6 sm:gap-y-6 lg:grid-cols-4 lg:grid-rows-2 lg:gap-x-5 lg:gap-y-6">
        {roadmapSteps.map((step, idx) => (
          <RoadmapStep
            key={step.step}
            step={step}
            index={idx}
            shouldReduceMotion={shouldReduceMotion}
            onHover={setHoveredStep}
          />
        ))}
      </ol>
    </div>
  )
}

export default RoadmapFlow
