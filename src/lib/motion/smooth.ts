import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { motionConfig } from './config'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

let lenisInstance: Lenis | null = null

export function canEnableSmoothScroll(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(min-width: 1024px)').matches &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function initSmoothScroll(): (() => void) | undefined {
  if (!canEnableSmoothScroll()) return undefined

  const lenis = new Lenis({
    lerp: motionConfig.smoothScroll.lerp,
    smoothWheel: true,
    syncTouch: false,
  })
  lenisInstance = lenis
  window.__lenis = lenis
  lenis.on('scroll', () => ScrollTrigger.update())

  const ticker = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(ticker)
  gsap.ticker.lagSmoothing(0)

  const handleAnchorClick = (event: MouseEvent) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const anchor = target.closest('a[href^="#"]')
    const hash = anchor?.getAttribute('href')
    if (!hash || hash === '#') return
    const destination = document.querySelector(hash)
    if (!destination) return
    event.preventDefault()
    lenis.scrollTo(destination, { offset: motionConfig.smoothScroll.anchorOffset })
  }

  document.addEventListener('click', handleAnchorClick)

  return () => {
    document.removeEventListener('click', handleAnchorClick)
    gsap.ticker.remove(ticker)
    lenis.destroy()
    lenisInstance = null
    if (window.__lenis === lenis) delete window.__lenis
  }
}

export function getLenis(): Lenis | null {
  return lenisInstance
}
