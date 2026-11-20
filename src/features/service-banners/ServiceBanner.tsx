import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { homeData } from '@/data/home'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const serviceImages = [
  '/images/service-residential.webp',
  '/images/service-commercial.webp',
  '/images/service-pump.webp',
]

export function ServiceBanners() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    let alive = true
    const triggers: Array<{ kill: () => void }> = []
    let observer: IntersectionObserver | undefined
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const copyBlocks = sectionRef.current.querySelectorAll<HTMLElement>('[data-mask-reveal]')
      copyBlocks.forEach((block) => block.classList.add('mask-pending'))
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.remove('mask-pending')
          observer?.unobserve(entry.target)
        })
      }, { threshold: 0.2 })
      copyBlocks.forEach((block) => observer?.observe(block))
    }
    if (reduceMotion || window.matchMedia('(max-width: 767px)').matches) {
      return () => { alive = false; observer?.disconnect() }
    }
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (!alive || !sectionRef.current) return
      gsap.registerPlugin(ScrollTrigger)
      sectionRef.current.querySelectorAll<HTMLElement>('[data-banner-image]').forEach((image) => {
        const tween = gsap.fromTo(image, { scale: 1.04, yPercent: 4 }, {
          scale: 1, yPercent: -4,
          ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'center center', scrub: true },
        })
        triggers.push(tween.scrollTrigger as unknown as { kill: () => void })
      })
    }).catch((error) => console.error('Service banner motion failed to load', error))
    return () => {
      alive = false
      observer?.disconnect()
      triggers.forEach((trigger) => trigger?.kill())
    }
  }, [reduceMotion])

  return (
    <div ref={sectionRef} className="service-banners">
      {homeData.services.cards.map((service, index) => (
        <section key={service.id} className="service-banner relative flex min-h-[50svh] items-end overflow-hidden bg-water-950 text-white md:min-h-[70vh]">
          <img
            data-banner-image
            className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
            src={serviceImages[index]}
            alt=""
            aria-hidden="true"
            width={1600}
            height={662}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-water-950/95 via-water-950/70 to-water-950/5" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-water-950/75 via-transparent to-water-950/5" aria-hidden="true" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-20 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
            <div className="max-w-2xl" data-mask-reveal>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-water-200">M&amp;J Water Wells &middot; {String(index + 1).padStart(2, '0')}</p>
              <h2 className="font-condensed text-4xl font-bold uppercase leading-none tracking-tight text-white sm:text-6xl">
                {service.title}
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/90 sm:text-lg">{service.line}</p>
              <Link to="/services" className="mt-6 inline-flex items-center gap-2 border-b border-aqua pb-1 font-condensed text-sm font-bold uppercase tracking-wider text-white transition-colors hover:text-water-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-300">
                Learn more <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
