import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenisInstance: Lenis | null = null

export function canEnableLenis(): boolean {
  if (typeof window === 'undefined') return false
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return isDesktop && hasFinePointer && !prefersReduced
}

export function initSmoothScroll(): (() => void) | undefined {
  if (!canEnableLenis()) {
    return undefined
  }

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    touchMultiplier: 0,
  })
  lenisInstance = lenis
  if (typeof window !== 'undefined') {
    ;(window as any).__lenis = lenis
  }

  // Connect Lenis to GSAP ScrollTrigger on scroll
  lenis.on('scroll', () => {
    ScrollTrigger.update()
  })

  // Drive Lenis from GSAP's ticker
  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(tickerCallback)
  gsap.ticker.lagSmoothing(0)

  // Anchor links (#drilling-video, #faq, etc.) scroll with lenis.scrollTo
  const handleAnchorClick = (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest('a')
    if (!target) return
    const href = target.getAttribute('href')
    if (href && href.startsWith('#') && href.length > 1) {
      const element = document.querySelector(href)
      if (element) {
        e.preventDefault()
        lenis.scrollTo(element as HTMLElement, { offset: -70 })
      }
    }
  }
  document.addEventListener('click', handleAnchorClick)

  return () => {
    document.removeEventListener('click', handleAnchorClick)
    gsap.ticker.remove(tickerCallback)
    lenis.destroy()
    lenisInstance = null
  }
}

export function getLenis(): Lenis | null {
  return lenisInstance
}
