import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { MutableRefObject } from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface JourneyTimelineOptions {
  triggerElement: HTMLElement
  maxProgress: MutableRefObject<number>
  onUpdate: (progress: number) => void
}

export function createJourneyTimeline({ triggerElement, maxProgress, onUpdate }: JourneyTimelineOptions) {
  const st = ScrollTrigger.create({
    trigger: triggerElement,
    start: 'top top',
    end: '+=400%',
    pin: true,
    onUpdate: (self) => {
      const next = Math.max(maxProgress.current, self.progress)
      maxProgress.current = next
      onUpdate(next)
    },
  })

  // Refresh when fonts are loaded
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh()
    }).catch(() => {})
  }

  return {
    scrollTrigger: st,
    destroy: () => {
      st.kill()
    },
    refresh: () => {
      ScrollTrigger.refresh()
    },
  }
}
