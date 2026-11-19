import React from 'react'
import { motion } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface RoadmapRouteProps {
  hoveredStep: number | null
}

export const RoadmapRoute: React.FC<RoadmapRouteProps> = ({ hoveredStep }) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      {/* ============================================================== */}
      {/* 1. DESKTOP SVG ROAD (>= 1024px, 4-col x 2-row snake)           */}
      {/* Nodes: Row 1 (1->2->3->4 at y=52), Row 2 (5->6->7->8 at y=280) */}
      {/* ============================================================== */}
      <svg
        className="hidden lg:block absolute inset-0 w-full h-full"
        viewBox="0 0 960 450"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#082F48" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Start Pin above Step 1 (at x=120, y=14) */}
        <g transform="translate(120, 14)" filter="url(#pinShadow)">
          <rect x="-24" y="-12" width="48" height="20" rx="10" fill="#0E5A84" />
          <text
            x="0"
            y="2"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            START
          </text>
          <line x1="0" y1="8" x2="0" y2="38" stroke="#0E5A84" strokeWidth="2.5" strokeDasharray="3 3" />
        </g>

        {/* Finish Pin after Step 8 (at x=45, y=280) */}
        <g transform="translate(45, 280)" filter="url(#pinShadow)">
          <rect x="-26" y="-10" width="52" height="20" rx="10" fill="#0E5A84" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            FINISH
          </text>
          <line x1="26" y1="0" x2="75" y2="0" stroke="#0E5A84" strokeWidth="2.5" strokeDasharray="3 3" />
        </g>

        {/* Main Dashed Road through node centers:
            Row 1 (L->R): (120,52) -> (360,52) -> (600,52) -> (840,52)
            Right curved turn from Row 1 to Row 2: (840,52) arc to (840,280)
            Row 2 (R->L): (840,280) -> (600,280) -> (360,280) -> (120,280)
        */}
        <motion.path
          data-road-path=""
          d="M 120,52 L 360,52 L 600,52 L 840,52 C 925,52 925,280 840,280 L 600,280 L 360,280 L 120,280"
          stroke={hoveredStep !== null ? '#1270A3' : '#A9DCF0'}
          strokeWidth="3.5"
          strokeDasharray="7 7"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </svg>

      {/* ============================================================== */}
      {/* 2. TABLET SVG ROAD (640px to 1023px, 2-col x 4-row snake)       */}
      {/* ============================================================== */}
      <svg
        className="hidden sm:block lg:hidden absolute inset-0 w-full h-full"
        viewBox="0 0 640 700"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Start Pin */}
        <g transform="translate(160, 20)">
          <rect x="-22" y="-10" width="44" height="18" rx="9" fill="#0E5A84" />
          <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
            START
          </text>
        </g>

        {/* Finish Pin */}
        <g transform="translate(80, 555)">
          <rect x="-24" y="-10" width="48" height="18" rx="9" fill="#0E5A84" />
          <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
            FINISH
          </text>
        </g>

        {/* Tablet Snake Road */}
        <motion.path
          data-road-path=""
          d="M 160,75 L 480,75 C 540,75 540,235 480,235 L 160,235 C 100,235 100,395 160,395 L 480,395 C 540,395 540,555 480,555 L 160,555"
          stroke={hoveredStep !== null ? '#1270A3' : '#A9DCF0'}
          strokeWidth="3"
          strokeDasharray="6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </svg>

      {/* ============================================================== */}
      {/* 3. MOBILE VERTICAL ROAD LINE (< 640px)                          */}
      {/* 2px vertical line at x=20px (left-5)                            */}
      {/* ============================================================== */}
      <div className="block sm:hidden absolute left-5 top-4 bottom-4 w-[2px] bg-water-300" />
    </div>
  )
}
