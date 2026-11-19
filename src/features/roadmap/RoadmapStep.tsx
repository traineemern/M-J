import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Calculator,
  MapPin,
  FileCheck,
  Cog,
  Activity,
  Wrench,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react'
import type { RoadmapStepItem } from '@/types'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { useDrillingVideo } from '@/features/drilling-video/DrillingVideoContext'

const iconMap = {
  Calculator,
  MapPin,
  FileCheck,
  Cog,
  Activity,
  Wrench,
  ShieldCheck,
  HeartHandshake,
}

// Explicit Tailwind classes for tablet (2x4 snake) and desktop (4x2 snake)
const gridPlacementClasses: Record<number, string> = {
  1: 'sm:col-start-1 sm:row-start-1 lg:col-start-1 lg:row-start-1',
  2: 'sm:col-start-2 sm:row-start-1 lg:col-start-2 lg:row-start-1',
  3: 'sm:col-start-2 sm:row-start-2 lg:col-start-3 lg:row-start-1',
  4: 'sm:col-start-1 sm:row-start-2 lg:col-start-4 lg:row-start-1',
  5: 'sm:col-start-1 sm:row-start-3 lg:col-start-4 lg:row-start-2',
  6: 'sm:col-start-2 sm:row-start-3 lg:col-start-3 lg:row-start-2',
  7: 'sm:col-start-2 sm:row-start-4 lg:col-start-2 lg:row-start-2',
  8: 'sm:col-start-1 sm:row-start-4 lg:col-start-1 lg:row-start-2',
}

interface RoadmapStepProps {
  step: RoadmapStepItem
  index: number
  shouldReduceMotion: boolean
  onHover?: (stepNumber: number | null) => void
}

export const RoadmapStep: React.FC<RoadmapStepProps> = ({
  step,
  index,
  shouldReduceMotion,
  onHover,
}) => {
  const { openEnquiry } = useEnquiry()
  let openVideoModal: (() => void) | undefined
  try {
    const videoCtx = useDrillingVideo()
    openVideoModal = videoCtx.openModal
  } catch {
    // optional fallback if rendered outside provider
  }
  const IconComponent = iconMap[step.iconName as keyof typeof iconMap] || Cog
  const isHashLink = step.link?.startsWith('#')

  const titleLinkClasses =
    'hover:text-water-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-700 focus-visible:ring-offset-2 rounded transition-colors duration-150 inline-block'

  const renderTitle = () => {
    // Step 1 triggers the Enquiry popup on click while preserving /contact link for fallback & SEO
    if (step.step === 1) {
      return (
        <h3 className="text-base sm:text-[17px] font-black font-condensed uppercase tracking-tight leading-tight">
          <Link
            to="/contact"
            onClick={(e) => {
              e.preventDefault()
              openEnquiry()
            }}
            className={`${titleLinkClasses} text-water-900 cursor-pointer text-left sm:text-center`}
            aria-label={`${step.title} (request an estimate)`}
          >
            {step.title}
          </Link>
        </h3>
      )
    }

    // Step 4 opens the Watch Demo Modal and scrolls to the video section
    if (step.step === 4) {
      return (
        <h3 className="text-base sm:text-[17px] font-black font-condensed uppercase tracking-tight leading-tight">
          <a
            href="#drilling-video"
            onClick={() => {
              const el = document.getElementById('drilling-video')
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' })
              }
              if (openVideoModal) {
                openVideoModal()
              }
            }}
            className={`${titleLinkClasses} text-water-900 cursor-pointer`}
            aria-label={`${step.title} (watch drilling video)`}
          >
            {step.title}
          </a>
        </h3>
      )
    }

    if (!step.link) {
      return (
        <h3 className="text-base sm:text-[17px] font-black text-water-900 font-condensed uppercase tracking-tight leading-tight">
          {step.title}
        </h3>
      )
    }

    if (isHashLink) {
      return (
        <h3 className="text-base sm:text-[17px] font-black font-condensed uppercase tracking-tight leading-tight">
          <a
            href={step.link}
            className={`${titleLinkClasses} text-water-900`}
            aria-label={`${step.title} (go to drilling demonstration)`}
          >
            {step.title}
          </a>
        </h3>
      )
    }

    return (
      <h3 className="text-base sm:text-[17px] font-black font-condensed uppercase tracking-tight leading-tight">
        <Link
          to={step.link}
          className={`${titleLinkClasses} text-water-900`}
          aria-label={`${step.title} (view ${step.linkText || 'details'})`}
        >
          {step.title}
        </Link>
      </h3>
    )
  }

  const gridClass = gridPlacementClasses[step.step] || ''

  return (
    <motion.li
      className={`group relative flex flex-row sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 sm:gap-0 ${gridClass}`}
      onMouseEnter={() => onHover?.(step.step)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(step.step)}
      onBlur={() => onHover?.(null)}
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.35,
        delay: index * 0.08, // 80ms sequential stagger
        ease: 'easeOut',
      }}
    >
      {/* Numbered Node with 3D Depth Lift Effect on Active/Hover */}
      <div
        aria-hidden="true"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-water-600 text-white flex items-center justify-center shrink-0 relative shadow-sm ring-4 ring-white z-20 sm:mb-1.5 transition-all duration-200 group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:shadow-[0_12px_24px_-4px_rgba(2,132,199,0.45)] group-hover:ring-sky-300 cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <IconComponent className="w-5 h-5 text-white transition-transform duration-200 group-hover:scale-105" />
        {/* Step Number Badge */}
        <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-water-800 text-white text-[10px] sm:text-[11px] font-black flex items-center justify-center ring-1 sm:ring-2 ring-white shadow-xs">
          {step.step}
        </span>
      </div>

      {/* Content Container:
          - Mobile: compact card with 12px padding (p-3), water-50 background, rounded-xl
          - Tablet/Desktop: borderless, transparent, centered text below node (never overlaps road)
      */}
      <div className="flex-1 w-full bg-water-50/90 sm:bg-transparent border border-water-200/80 sm:border-none rounded-xl p-3 sm:p-0 shadow-2xs sm:shadow-none">
        {/* Header row / badge */}
        <div className="flex items-center justify-between sm:justify-center gap-2 mb-1 sm:mb-0.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-water-700 font-condensed block">
            Step {step.step}
          </span>
          {step.badge && (
            <span className="inline-block px-2 py-0.5 rounded-full bg-water-100 text-water-800 border border-water-200 text-[10px] font-bold font-condensed tracking-wider uppercase">
              {step.badge}
            </span>
          )}
        </div>

        {/* Title: 16px on mobile, 18px bold on desktop */}
        <div className="mb-1 sm:mb-0.5">{renderTitle()}</div>

        {/* Description: 14px on mobile, 15px minimum on desktop (water-900 at 90%) */}
        <p className="text-sm sm:text-[15px] font-condensed text-water-900/90 leading-tight sm:leading-[1.2] max-w-none">
          {step.description}
        </p>
      </div>
    </motion.li>
  )
}
