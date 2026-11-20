import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Phone } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { JOURNEY_BEATS } from '@/data/journey'
import { createJourneyTimeline } from './JourneyTimeline'
import { JourneyOverlay } from './JourneyOverlay'
import { JourneyScene } from './JourneyScene'

export function getJourneyFrameLoop(isInView: boolean, isTabVisible: boolean): 'always' | 'never' {
  return isInView && isTabVisible ? 'always' : 'never'
}

function checkWebGL(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

interface JourneyStageProps {
  className?: string
  forcePoster?: boolean
}

export const JourneyStage: React.FC<JourneyStageProps> = ({
  className = '',
  forcePoster = false,
}) => {
  const containerRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const isMobile = useIsMobile(768)

  const [progress, setProgress] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)
  const [lowFpsFallback, setLowFpsFallback] = useState(false)
  const [drawCalls, setDrawCalls] = useState(0)
  const [isTabVisible, setIsTabVisible] = useState(true)

  // Verify WebGL support
  useEffect(() => {
    setWebglSupported(checkWebGL())
  }, [])

  useEffect(() => {
    const updateVisibility = () => setIsTabVisible(!document.hidden)
    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  // Visibility observer: pause R3F render loop when section is off screen
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { rootMargin: '200px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Desktop ScrollTrigger timeline pinning
  useEffect(() => {
    if (shouldReduceMotion || !webglSupported || lowFpsFallback || forcePoster) return
    if (!containerRef.current) return

    const timeline = createJourneyTimeline({
      triggerElement: containerRef.current,
      onUpdate: (p) => {
        setProgress(p)
      },
    })

    return () => {
      timeline.destroy()
    }
  }, [shouldReduceMotion, webglSupported, lowFpsFallback, forcePoster])

  // Mobile FPS Monitor: if FPS < 30 for 2 consecutive seconds below 768px, switch to poster fallback
  useEffect(() => {
    if (!isMobile || lowFpsFallback || shouldReduceMotion) return

    let lastTime = performance.now()
    let frameCount = 0
    let lowFpsDuration = 0

    const checkFps = () => {
      const now = performance.now()
      frameCount++
      if (now - lastTime >= 1000) {
        const fps = (frameCount * 1000) / (now - lastTime)
        if (fps < 30) {
          lowFpsDuration += 1
          if (lowFpsDuration >= 2) {
            setLowFpsFallback(true)
            return
          }
        } else {
          lowFpsDuration = 0
        }
        frameCount = 0
        lastTime = now
      }
      rafId = requestAnimationFrame(checkFps)
    }

    let rafId = requestAnimationFrame(checkFps)
    return () => cancelAnimationFrame(rafId)
  }, [isMobile, lowFpsFallback, shouldReduceMotion])

  const showPosterFallback =
    shouldReduceMotion || !webglSupported || lowFpsFallback || forcePoster

  // =========================================================================
  // REDUCED MOTION / NO WEBGL / LOW-FPS POSTER FALLBACK
  // =========================================================================
  if (showPosterFallback) {
    return (
      <section
        ref={containerRef}
        id="journey-3d-section"
        aria-label="M&J Water Wells: Step-by-Step Well Journey"
        className={`relative py-12 sm:py-20 bg-water-950 text-white border-b border-water-900 ${className}`}
        data-testid="journey-poster-fallback"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-water-900 border border-white/20 text-sky-200 text-xs font-bold uppercase tracking-wider font-condensed mb-3">
              Michigan Well Drilling Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-condensed uppercase tracking-tight text-white">
              Every Project Starts on Open Ground
            </h2>
          </div>

          {/* Static Final Frame Poster */}
          <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-water-50">
            <img
              src="/images/diorama-poster.webp"
              alt="Isometric M&J Water Wells site diorama with a drilling rig, wells, pump house, farmhouse, and pond"
              width={1280}
              height={720}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-2 p-3 sm:p-4 bg-white/90" aria-label="Diorama services">
              {[
                ['Rotary drilling', 'Drilling for homes, farms, and businesses.'],
                ['Pump service', 'Repair and replacement.'],
                ['Clean water', 'Water level [CONFIRM]'],
              ].map(([title, description]) => (
                <div key={title} className="max-w-[230px] rounded-xl border border-water-100 bg-white px-3 py-2 text-left text-water-900 shadow-sm">
                  <p className="text-xs font-black text-water-700">{title}</p>
                  <p className="text-[11px] leading-snug">{description}</p>
                  {title === 'Clean water' && <div className="diorama-progress" aria-hidden="true"><span style={{ width: '100%' }} /></div>}
                  <a href="/services" className="text-[11px] font-bold text-water-700 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-water-700">Learn more</a>
                </div>
              ))}
            </div>
            {/* Centered Brand Overlay */}
            <div className="absolute inset-0 bg-water-950/40 flex flex-col items-center justify-center p-6 text-center">
              <img
                src="/images/mj-mark.svg"
                alt="M&J Water Wells, Casnovia, Michigan"
                width={240}
                height={64}
                className="drop-shadow-2xl mb-4"
              />
              <a
                href="tel:6166754875"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-condensed font-black text-sm uppercase tracking-wider shadow-xl transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call (616) 675-4875</span>
              </a>
            </div>
          </div>

          {/* All 9 Captions as an Ordered Static List */}
          <div className="mt-10 bg-water-900/60 rounded-3xl border border-white/10 p-6 sm:p-8">
            <h3 className="text-lg font-bold font-condensed uppercase tracking-wider text-sky-200 mb-4">
              9-Stage Rotary Drilling Sequence:
            </h3>
            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {JOURNEY_BEATS.map((beat) => (
                <li
                  key={beat.id}
                  className="bg-water-950/60 p-4 rounded-2xl border border-white/10 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {beat.chapter}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white font-condensed uppercase tracking-wide">
                      {beat.caption}
                    </p>
                    <p className="text-xs text-water-300 font-sans mt-1">
                      {beat.modelsDescription}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    )
  }

  // =========================================================================
  // REAL-TIME 3D PINNED STAGE (Desktop & Smooth Mobile)
  // =========================================================================
  return (
    <section
      ref={containerRef}
      id="journey-3d-section"
      aria-label="Real-time 3D Journey: M&J Drilling"
      data-draw-calls={drawCalls}
      className={`relative h-screen w-full bg-water-950 text-white overflow-hidden ${className}`}
      data-testid="journey-3d-stage"
    >
      {/* Viewport Sticky Stage */}
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
        {/* Real-time 3D Canvas */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-water-50 via-white to-water-100">
          <Canvas
            onCreated={({ gl }) => gl.domElement.setAttribute('aria-hidden', 'true')}
            gl={{
              alpha: true,
              antialias: !isMobile,
              powerPreference: 'high-performance',
            }}
            dpr={isMobile ? 1 : 1.5}
            shadows={!isMobile}
            camera={{ fov: 30, near: 0.1, far: 150, position: [38, 30, 38] }}
            frameloop={getJourneyFrameLoop(isInView, isTabVisible)}
          >
            <Suspense fallback={null}>
              <JourneyScene
                progress={progress}
                onDrawCallCount={(calls) => setDrawCalls(calls)}
                isMobile={isMobile}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* HTML Overlays (Captions, Chapter pill, Contact bar, Layer labels) */}
        <JourneyOverlay progress={progress} />
      </div>
    </section>
  )
}

export default JourneyStage
