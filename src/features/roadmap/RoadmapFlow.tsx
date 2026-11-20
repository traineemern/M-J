import { useCallback, useEffect, useRef, useState } from 'react'
import { Activity, Calculator, Cog, Droplet, FileCheck, HeartHandshake, MapPin, ShieldCheck, Truck, Wrench } from 'lucide-react'
import { roadmapSteps } from '@/data/roadmap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const routePath = 'M 70 90 H 530 C 585 90 585 180 530 180 H 70'
const stopRatios = [0, .145, .29, .435, .565, .71, .855, 1]
const icons = [Calculator, MapPin, FileCheck, Cog, Activity, Wrench, ShieldCheck, HeartHandshake]

export function roadmapSnapStops(count = 8) {
  return Array.from({ length: count }, (_, index) => index / (count - 1))
}

export function roadmapStepFromProgress(progress: number, count = 8) {
  return Math.min(count - 1, Math.max(0, Math.round(progress * (count - 1))))
}

export function getRoadmapStopPoints(path: SVGPathElement, ratios = stopRatios) {
  const length = path.getTotalLength()
  return ratios.map((ratio) => path.getPointAtLength(length * ratio))
}

export function RoadmapFlow({ className = '' }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)
  const mobileMarkerRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [activeStep, setActiveStep] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)
  const lastAnnounced = useRef(-1)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    try {
      const length = path.getTotalLength()
      path.style.strokeDasharray = `${length}`
      path.style.strokeDashoffset = `${length}`
      setPoints(getRoadmapStopPoints(path).map(({ x, y }) => ({ x, y })))
    } catch { /* SVG path measurement unavailable in SSR */ }
  }, [])

  useEffect(() => {
    const query = window.matchMedia?.('(min-width: 1024px)')
    if (!query) return
    const sync = () => setIsDesktop(query.matches)
    sync()
    query.addEventListener?.('change', sync)
    return () => query.removeEventListener?.('change', sync)
  }, [])

  const update = useCallback((progress: number) => {
    const path = pathRef.current
    if (!path) {
      const next = roadmapStepFromProgress(progress)
      setActiveStep((current) => current === next ? current : next)
      return
    }
    const length = path.getTotalLength()
    const segment = Math.min(6, Math.floor(progress * 7))
    const segmentProgress = Math.min(1, Math.max(0, progress * 7 - segment))
    const routeProgress = stopRatios[segment] + (stopRatios[segment + 1] - stopRatios[segment]) * segmentProgress
    const point = path.getPointAtLength(length * routeProgress)
    if (markerRef.current) {
      markerRef.current.style.left = `${point.x / 600 * 100}%`
      markerRef.current.style.top = `${point.y / 210 * 100}%`
    }
    path.style.strokeDashoffset = `${length * (1 - routeProgress)}`
    if (progressRef.current) progressRef.current.style.width = `${progress * 100}%`
    if (!window.matchMedia('(min-width: 1024px)').matches && mobileMarkerRef.current) {
      mobileMarkerRef.current.style.top = `${progress * 100}%`
    }
    const next = roadmapStepFromProgress(progress)
    setActiveStep((current) => current === next ? current : next)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || shouldReduceMotion) return
    let disposed = false
    let trigger: { kill: () => void } | undefined
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return
      gsap.registerPlugin(ScrollTrigger)
      const desktop = window.matchMedia('(min-width: 1024px)').matches
      trigger = ScrollTrigger.create({
        trigger: root,
        start: desktop ? 'top 72px' : 'top 75%',
        end: desktop ? '+=700%' : 'bottom 70%',
        pin: desktop,
        scrub: desktop ? false : 0.6,
        ...(desktop ? { snap: { snapTo: roadmapSnapStops(), duration: .3, ease: 'power2.out' } } : {}),
        onUpdate: (self) => update(self.progress),
      })
      if (desktop) update(0)
    }).catch((error) => console.error('Roadmap animation failed to load', error))
    return () => { disposed = true; trigger?.kill() }
  }, [shouldReduceMotion, update])

  useEffect(() => {
    if (lastAnnounced.current === activeStep) return
    lastAnnounced.current = activeStep
  }, [activeStep])

  const focusStep = (index: number) => {
    const root = rootRef.current
    if (!root || shouldReduceMotion || !window.matchMedia('(min-width: 1024px)').matches) return
    const start = root.getBoundingClientRect().top + window.scrollY - 72
    const scrollSpan = window.innerHeight * 7
    window.scrollTo({ top: start + scrollSpan * index / 7, behavior: 'smooth' })
  }

  const progress = shouldReduceMotion ? 1 : activeStep / 7
  const active = roadmapSteps[activeStep]
  const ActiveIcon = icons[activeStep] ?? Truck
  return (
    <div ref={rootRef} className={`roadmap-stage ${shouldReduceMotion ? 'roadmap-reduced' : ''} ${className}`}>
      <div className="roadmap-desktop-stage">
        <div className="roadmap-stage-head"><span aria-live="polite">Step {activeStep + 1} of 8</span><div className="roadmap-progress"><i ref={progressRef} style={{ width: `${progress * 100}%` }} /></div></div>
        <div className="roadmap-scene">
          <div className="roadmap-route-wrap" aria-hidden="true">
            <svg ref={svgRef} viewBox="0 0 600 210" preserveAspectRatio="none" className="roadmap-route-svg">
              <path d={routePath} className="roadmap-route-base" />
              <path ref={pathRef} d={routePath} className="roadmap-route-visited" />
            </svg>
            {points.map((point, index) => { const NodeIcon = icons[index]; return <span key={index} className={`roadmap-node ${index === activeStep ? 'is-active' : ''}`} style={{ left: `${point.x / 600 * 100}%`, top: `${point.y / 210 * 100}%` }}><NodeIcon size={18} /><span>{index + 1}</span></span> })}
            {points.length > 0 && <span className={`roadmap-finish-pill ${activeStep === 7 ? 'is-active' : ''}`} style={{ left: `${points[7].x / 600 * 100}%`, top: `${points[7].y / 210 * 100}%` }}>Finish</span>}
            <div ref={markerRef} className="roadmap-truck-marker"><Truck size={19} /></div>
          </div>
            <div className="glass-card roadmap-active-card" key={active.step}>
            <div className="roadmap-active-icon"><ActiveIcon size={24} /></div>
            <span className="roadmap-step-label">Step {active.step}</span>
            <h3>{active.link ? <a href={active.link} onFocus={() => focusStep(activeStep)}>{active.title}</a> : active.title}</h3>
            <p>{active.description}</p>
            {active.badge && <span className="roadmap-coming-soon">{active.badge}</span>}
          </div>
        </div>
      </div>
      <ol className="roadmap-mobile-list" aria-hidden={isDesktop}>
        <li className="roadmap-mobile-marker-track" aria-hidden="true"><span ref={mobileMarkerRef} className="roadmap-mobile-marker"><Droplet size={16} fill="currentColor" /></span></li>
        {roadmapSteps.map((step, index) => {
          const Icon = icons[index]
          return <li key={step.step} className={index <= activeStep ? 'is-active' : ''} aria-current={index === activeStep ? 'step' : undefined}>
            <span className="roadmap-mobile-node" aria-hidden="true"><Icon size={18} /><b>{step.step}</b></span>
            <div className="glass-card roadmap-mobile-card"><span className="roadmap-step-label">Step {step.step}</span><h3>{step.link ? <a href={step.link} onFocus={() => focusStep(index)}>{step.title}</a> : step.title}</h3><p>{step.description}</p>{step.badge && <span className="roadmap-coming-soon">{step.badge}</span>}</div>
          </li>
        })}
        <li className="roadmap-mobile-finish" aria-hidden="true">Finish</li>
      </ol>
      <ol className="sr-only roadmap-semantic-list" aria-label="Eight steps in a well project" aria-hidden={!isDesktop}>
        {roadmapSteps.map((step, index) => <li key={step.step} aria-current={index === activeStep ? 'step' : undefined}><span>Step {step.step}. </span><strong>{step.link ? <a href={step.link} onFocus={() => focusStep(index)}>{step.title}</a> : step.title}</strong><span> {step.description}</span>{step.badge && <span> {step.badge}</span>}</li>)}
      </ol>
      <span className="sr-only" aria-live="polite">Step {activeStep + 1} of 8: {active.title}.</span>
    </div>
  )
}

export default RoadmapFlow
