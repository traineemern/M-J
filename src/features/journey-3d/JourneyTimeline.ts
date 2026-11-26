import type { MutableRefObject } from 'react'
import { motionConfig } from '@/lib/motion/config'

export interface JourneyTimelineOptions {
  triggerElement: HTMLElement
  maxProgress: MutableRefObject<number>
  onUpdate: (progress: number) => void
}

export async function createJourneyTimeline({
  triggerElement,
  maxProgress,
  onUpdate,
}: JourneyTimelineOptions) {
  const { ScrollTrigger } = await import('@/lib/motion/gsap')
  const scrollTrigger = ScrollTrigger.create({
    trigger: triggerElement,
    start: motionConfig.trigger.railStart,
    end: '+=400%',
    pin: true,
    onUpdate: (self) => {
      const next = Math.max(maxProgress.current, self.progress)
      maxProgress.current = next
      onUpdate(next)
    },
  })

  void document.fonts.ready.then(() => ScrollTrigger.refresh())

  return {
    scrollTrigger,
    destroy: () => scrollTrigger.kill(),
    refresh: () => ScrollTrigger.refresh(),
  }
}
