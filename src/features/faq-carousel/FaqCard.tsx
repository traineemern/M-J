import React from 'react'
import { motion, type PanInfo } from 'motion/react'
import { Phone } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { FaqItem } from '@/data/faq'

export type CardPosition = 'current' | 'prev' | 'next'

interface FaqCardProps {
  item: FaqItem
  position: CardPosition
  index: number
  total: number
  isMobile: boolean
  onSwipeNext?: () => void
  onSwipePrev?: () => void
}

export const FaqCard: React.FC<FaqCardProps> = ({
  item,
  position,
  index,
  total,
  isMobile,
  onSwipeNext,
  onSwipePrev,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const isCurrent = position === 'current'
  const isPrev = position === 'prev'
  const isNext = position === 'next'

  // Spring physics for position: stiffness 260, damping 28
  const springTransition = {
    type: 'spring' as const,
    stiffness: 260,
    damping: 28,
  }

  // Handle mobile swipe drag
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile) return
    const threshold = 60
    if (info.offset.x > threshold && onSwipePrev) {
      onSwipePrev()
    } else if (info.offset.x < -threshold && onSwipeNext) {
      onSwipeNext()
    }
  }

  // Animation variants
  if (shouldReduceMotion) {
    return (
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`Question ${index + 1} of ${total}`}
        aria-hidden={!isCurrent ? 'true' : undefined}
        inert={!isCurrent ? true : undefined}
        className={`w-full max-w-[520px] h-[300px] p-6 sm:p-8 bg-white border border-water-100 rounded-2xl shadow-lg flex flex-col justify-between transition-opacity duration-150 ${
          isCurrent ? 'opacity-100 z-20' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div>
          <h3 className="text-[18px] sm:text-[20px] font-bold text-water-900 leading-snug">
            {item.question}
          </h3>
          {isCurrent && (
            <p className="mt-4 text-base text-water-900/90 leading-relaxed font-sans">
              {item.answer}
            </p>
          )}
        </div>

        {isCurrent && (
          <div className="pt-4 border-t border-water-100/80">
            <a
              href="tel:+16166754875"
              className="inline-flex items-center gap-2 text-water-600 hover:text-water-800 font-bold font-condensed uppercase tracking-wider text-sm transition-colors"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Call (616) 675-4875</span>
            </a>
          </div>
        )}
      </div>
    )
  }

  // Mobile rendering (single card with drag swipe & subtle 6deg tilt)
  if (isMobile) {
    if (!isCurrent) return null

    return (
      <motion.div
        role="group"
        aria-roledescription="slide"
        aria-label={`Question ${index + 1} of ${total}`}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, scale: 0.95, rotateY: 6 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.95, rotateY: -6 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-[520px] h-[300px] p-6 bg-white border border-water-100 rounded-2xl shadow-xl shadow-water-900/20 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
      >
        <div>
          <h3 className="text-[18px] font-bold text-water-900 leading-snug">
            {item.question}
          </h3>
          <p className="mt-4 text-base text-water-900/90 leading-relaxed font-sans">
            {item.answer}
          </p>
        </div>

        <div className="pt-4 border-t border-water-100/80">
          <a
            href="tel:+16166754875"
            className="inline-flex items-center gap-2 text-water-600 hover:text-water-800 font-bold font-condensed uppercase tracking-wider text-sm transition-colors"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Call (616) 675-4875</span>
          </a>
        </div>
      </motion.div>
    )
  }

  // Desktop 3D Card Stack Variants
  // Center: x 0, scale 1, rotateY 0, blur 0px, opacity 1
  // Left: x -28%, scale 0.88, rotateY 6deg, blur 3px, opacity 0.60
  // Right: x 28%, scale 0.88, rotateY -6deg, blur 3px, opacity 0.60
  const getDesktopStyles = () => {
    if (isCurrent) {
      return {
        x: '0%',
        scale: 1,
        rotateY: 0,
        filter: 'blur(0px)',
        opacity: 1,
        zIndex: 20,
        boxShadow: '0 20px 32px -8px rgba(8, 47, 72, 0.20), 0 4px 12px -2px rgba(8, 47, 72, 0.08)',
      }
    }
    if (isPrev) {
      return {
        x: '-28%',
        scale: 0.88,
        rotateY: 6,
        filter: 'blur(3px)',
        opacity: 0.6,
        zIndex: 10,
        boxShadow: '0 10px 20px -6px rgba(8, 47, 72, 0.12)',
      }
    }
    if (isNext) {
      return {
        x: '28%',
        scale: 0.88,
        rotateY: -6,
        filter: 'blur(3px)',
        opacity: 0.6,
        zIndex: 10,
        boxShadow: '0 10px 20px -6px rgba(8, 47, 72, 0.12)',
      }
    }
    return {
      x: '0%',
      scale: 0.8,
      rotateY: 0,
      filter: 'blur(5px)',
      opacity: 0,
      zIndex: 0,
    }
  }

  const desktopStyles = getDesktopStyles()

  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={`Question ${index + 1} of ${total}`}
      aria-hidden={!isCurrent ? 'true' : undefined}
      inert={!isCurrent ? true : undefined}
      animate={desktopStyles}
      transition={{
        x: springTransition,
        scale: springTransition,
        rotateY: springTransition,
        opacity: { duration: 0.35, ease: 'easeOut' },
        filter: { duration: 0.45, ease: 'easeOut' },
      }}
      style={{
        transformStyle: 'preserve-3d',
        transformOrigin: isPrev ? 'center right' : isNext ? 'center left' : 'center center',
      }}
      className="absolute top-0 w-full max-w-[520px] h-[300px] p-6 sm:p-8 bg-white border border-water-100 rounded-2xl flex flex-col justify-between select-none"
    >
      <div>
        <h3 className="text-[18px] sm:text-[20px] font-bold text-water-900 leading-snug">
          {item.question}
        </h3>
        {/* Current card shows full answer; side cards show question only */}
        {isCurrent && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="mt-4 text-base text-water-900/90 leading-relaxed font-sans"
          >
            {item.answer}
          </motion.p>
        )}
      </div>

      {/* Under answer on current card: "Call (616) 675-4875" button in water-600 */}
      {isCurrent && (
        <div className="pt-4 border-t border-water-100/80">
          <a
            href="tel:+16166754875"
            className="inline-flex items-center gap-2 text-water-600 hover:text-water-800 font-bold font-condensed uppercase tracking-wider text-sm transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Call (616) 675-4875</span>
          </a>
        </div>
      )}
    </motion.div>
  )
}

export default FaqCard
