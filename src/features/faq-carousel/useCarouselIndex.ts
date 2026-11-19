import { useState, useCallback } from 'react'

export interface UseCarouselIndexResult {
  currentIndex: number
  direction: number // 1 for next, -1 for prev
  prevIndex: number
  nextIndex: number
  goToNext: () => void
  goToPrev: () => void
  goToIndex: (index: number) => void
}

/**
 * Custom hook to handle circular modular navigation for carousels.
 * Supports infinite looping in both forward and backward directions.
 */
export function useCarouselIndex(total: number, initialIndex: number = 0): UseCarouselIndexResult {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [direction, setDirection] = useState<number>(0)

  const goToNext = useCallback(() => {
    if (total <= 0) return
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  const goToPrev = useCallback(() => {
    if (total <= 0) return
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  const goToIndex = useCallback(
    (index: number) => {
      if (total <= 0) return
      const normalized = ((index % total) + total) % total
      setDirection(normalized > currentIndex ? 1 : -1)
      setCurrentIndex(normalized)
    },
    [total, currentIndex]
  )

  const prevIndex = total > 0 ? (currentIndex - 1 + total) % total : 0
  const nextIndex = total > 0 ? (currentIndex + 1) % total : 0

  return {
    currentIndex,
    direction,
    prevIndex,
    nextIndex,
    goToNext,
    goToPrev,
    goToIndex,
  }
}

export default useCarouselIndex
