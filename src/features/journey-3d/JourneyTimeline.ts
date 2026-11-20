import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface JourneyTimelineOptions {
  triggerElement: HTMLElement
  onUpdate: (progress: number) => void
}

export function createJourneyTimeline({ triggerElement, onUpdate }: JourneyTimelineOptions) {
  const st = ScrollTrigger.create({
    trigger: triggerElement,
    start: 'top top',
    end: '+=400%',
    pin: true,
    scrub: 0.3,
    onUpdate: (self) => {
      onUpdate(self.progress)
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
