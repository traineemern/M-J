import React, { useRef, useState, useEffect } from 'react'
import type { FaqItem } from '@/data/faq'
import { FaqCard } from './FaqCard'
import { FaqArrowButton } from './FaqArrowButton'
import { useCarouselIndex } from './useCarouselIndex'
import { useIsMobile } from '@/hooks/useIsMobile'

interface FaqCarouselProps {
  items: FaqItem[]
  className?: string
}

export const FaqCarousel: React.FC<FaqCarouselProps> = ({ items, className = '' }) => {
  const isMobileHook = useIsMobile()
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Double check window width for SSR/hydration consistency
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isMobileHook])

  const total = items.length
  const { currentIndex, prevIndex, nextIndex, goToNext, goToPrev } = useCarouselIndex(total)

  // Keyboard navigation when carousel or its contents have focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goToPrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      goToNext()
    }
  }

  if (total === 0) return null

  const currentItem = items[currentIndex]
  const prevItem = items[prevIndex]
  const nextItem = items[nextIndex]

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Frequently asked questions"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full max-w-4xl mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-400 rounded-3xl ${className}`}
    >
      {/* Screen-reader live region announcing question updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {`Question ${currentIndex + 1} of ${total}: ${currentItem.question}`}
      </div>

      {/* Main 3D Card Stack Container (300px height) */}
      <div className="relative w-full h-[320px] flex items-center justify-center [perspective:1200px]">
        {/* Desktop: Centered Arrow Buttons at edges */}
        {!isMobile && total > 1 && (
          <>
            <div className="absolute left-0 sm:-left-6 lg:-left-12 z-30">
              <FaqArrowButton direction="prev" onClick={goToPrev} />
            </div>
            <div className="absolute right-0 sm:-right-6 lg:-right-12 z-30">
              <FaqArrowButton direction="next" onClick={goToNext} />
            </div>
          </>
        )}

        {/* Card Rendering:
            - Desktop: ONLY 3 cards in DOM (prev, current, next)
            - Mobile: ONLY 1 card in DOM (current)
        */}
        {!isMobile ? (
          <div className="relative w-full max-w-[520px] h-[300px] flex items-center justify-center">
            {total > 1 && (
              <FaqCard
                key={`prev-${prevItem.id}`}
                item={prevItem}
                position="prev"
                index={prevIndex}
                total={total}
                isMobile={false}
              />
            )}
            <FaqCard
              key={`curr-${currentItem.id}`}
              item={currentItem}
              position="current"
              index={currentIndex}
              total={total}
              isMobile={false}
            />
            {total > 2 && (
              <FaqCard
                key={`next-${nextItem.id}`}
                item={nextItem}
                position="next"
                index={nextIndex}
                total={total}
                isMobile={false}
              />
            )}
          </div>
        ) : (
          <div className="w-full px-4 flex justify-center">
            <FaqCard
              key={`mobile-${currentItem.id}`}
              item={currentItem}
              position="current"
              index={currentIndex}
              total={total}
              isMobile={true}
              onSwipeNext={goToNext}
              onSwipePrev={goToPrev}
            />
          </div>
        )}
      </div>

      {/* Controls & Counter Row */}
      {/* Desktop: Counter below stack */}
      {!isMobile ? (
        <div className="mt-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-water-50 border border-water-200 text-water-800 text-xs font-black font-condensed tracking-wider">
            {currentIndex + 1} / {total}
          </span>
        </div>
      ) : (
        /* Mobile: Arrows sit under the card, side by side, with counter between them */
        <div className="mt-4 flex items-center justify-center gap-4">
          <FaqArrowButton direction="prev" onClick={goToPrev} />
          <span className="px-3.5 py-1.5 rounded-full bg-water-50 border border-water-200 text-water-800 text-xs font-black font-condensed tracking-wider min-w-[54px] text-center">
            {currentIndex + 1} / {total}
          </span>
          <FaqArrowButton direction="next" onClick={goToNext} />
        </div>
      )}
    </div>
  )
}

export default FaqCarousel
