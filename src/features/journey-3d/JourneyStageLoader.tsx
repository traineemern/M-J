import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Phone } from 'lucide-react'
import { JOURNEY_BEATS } from '@/data/journey'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const LazyJourneyStage = React.lazy(() => import('./JourneyStage'))

export const JourneyStageLoader: React.FC = () => {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || ready || !placeholderRef.current) return
    if (!('IntersectionObserver' in window)) {
      const timer = globalThis.setTimeout(() => setReady(true), 1200)
      return () => globalThis.clearTimeout(timer)
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      setReady(true)
      observer.disconnect()
    }, { rootMargin: '0px', threshold: 0.05 })
    observer.observe(placeholderRef.current)
    return () => observer.disconnect()
  }, [reducedMotion, ready])

  if (reducedMotion) {
    return (
      <section className="bg-water-50 px-4 py-10 text-water-900" aria-label="M&J Water Wells: Step-by-Step Well Journey">
        <div className="mx-auto max-w-5xl">
          <div className="relative mb-8 overflow-hidden rounded-3xl border border-water-200 bg-white shadow-xl">
            <img src="/images/diorama-poster.webp" alt="Final site diorama showing the M&J drilling rig, farmhouse, clean water, and outdoor tap" width={1280} height={850} className="aspect-video w-full object-cover" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-2 bg-white/90 p-3">
              {[
                ['Rotary drilling', 'Drilling for homes, farms, and businesses.'],
                ['Pump service', 'Repair and replacement.'],
                ['Clean water', 'Water level [CONFIRM]'],
              ].map(([title, description]) => <div key={title} className="rounded-xl border border-water-100 bg-white p-3 text-sm shadow-sm"><strong className="block text-water-700">{title}</strong><span>{description}</span>{title === 'Clean water' && <div className="diorama-progress" aria-hidden="true"><span style={{ width: '100%' }} /></div>}<a className="ml-2 font-bold underline focus-visible:outline-2" href="/services">Learn more</a></div>)}
            </div>
          </div>
          <img src="/images/mj-mark.svg" alt="M&J Water Wells, Casnovia, Michigan" width={160} height={72} className="mx-auto mb-3 rounded-lg bg-water-900 p-2" />
          <a href="tel:6166754875" className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full bg-water-600 px-6 py-3 font-bold text-white"><Phone size={16} />Call (616) 675-4875</a>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="9-stage rotary drilling sequence">
            {JOURNEY_BEATS.map((beat) => <li key={beat.id} className="rounded-xl border border-water-100 bg-white p-4"><strong className="mr-2 text-water-600">{beat.chapter}</strong>{beat.caption}</li>)}
          </ol>
        </div>
      </section>
    )
  }

  if (!ready) {
    return (
      <div ref={placeholderRef} className="h-screen w-full bg-water-50" aria-hidden="true">
        <img
          src="/images/diorama-poster.webp"
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <Suspense fallback={<div className="h-screen w-full bg-water-50" aria-hidden="true" />}>
      <LazyJourneyStage />
    </Suspense>
  )
}

export default JourneyStageLoader
