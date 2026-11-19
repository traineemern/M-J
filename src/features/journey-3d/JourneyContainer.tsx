import React, { useRef, useState, useEffect, Suspense } from 'react'
import { motion, useScroll } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  Droplets,
  Building2,
  Tractor,
  Activity,
  ShieldCheck,
  Phone,
  Play,
  ArrowRight,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { TiltCard } from '@/components/motion/TiltCard'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useDrillingVideo } from '@/features/drilling-video/DrillingVideoContext'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'

// Lazy load the 3D canvas so Three.js bundle only loads on desktop when allowed
const LazyJourneyCanvas = React.lazy(() => import('./JourneyCanvas'))

export function hasWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export function shouldEnable3DJourney(): boolean {
  if (typeof window === 'undefined') return false
  if (window.innerWidth < 768) return false
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return false
  const nav = navigator as unknown as { connection?: { saveData?: boolean } }
  if (nav.connection?.saveData === true) return false
  return hasWebGLSupport()
}

export const JourneyContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [canRender3D, setCanRender3D] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { openModal: openVideoModal } = useDrillingVideo()
  const { openEnquiry } = useEnquiry()

  // Track overall journey scroll progress (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    setCanRender3D(shouldEnable3DJourney() && !shouldReduceMotion)

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest)
    })

    const handleResize = () => {
      setCanRender3D(shouldEnable3DJourney() && !shouldReduceMotion)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      unsubscribe()
      window.removeEventListener('resize', handleResize)
    }
  }, [scrollYProgress, shouldReduceMotion])

  // Five service cards for Chapter 3
  const services = [
    { title: 'Residential Well Drilling', icon: Droplets, desc: 'Complete drinking water wells for West Michigan homes.' },
    { title: 'Commercial Well Drilling', icon: Building2, desc: 'High-capacity production wells for businesses.' },
    { title: 'Farm & Irrigation Wells', icon: Tractor, desc: 'High-volume agricultural water systems.' },
    { title: 'Emergency Pump Service', icon: Activity, desc: '24/7 rapid water restoration and diagnostics.' },
    { title: 'Water Treatment Systems', icon: ShieldCheck, desc: 'Testing, filtration, and sulfur iron removal.' },
  ]

  // Ground layers for Chapter 4
  const groundLayers = [
    { name: 'Top Soil', depth: '0 – 15 ft', color: 'bg-amber-950/80 border-amber-800' },
    { name: 'Sub Soil', depth: '15 – 60 ft', color: 'bg-yellow-950/80 border-yellow-800' },
    { name: 'Ground Water', depth: '60 – 160 ft', color: 'bg-sky-600/80 border-sky-400' },
    { name: 'Bed Rock', depth: '160+ ft', color: 'bg-slate-900/80 border-slate-700' },
  ]

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${canRender3D ? 'min-h-[600vh]' : 'min-h-auto'}`}
    >
      {/* 3D WebGL Background Scene: Desktop only, under 200KB gzipped, capped at 400 particles */}
      {canRender3D ? (
        <Suspense fallback={null}>
          <LazyJourneyCanvas scrollProgress={scrollProgress} />
        </Suspense>
      ) : (
        /* Static Still Background Fallback for Mobile / Reduced Motion / No WebGL */
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('/images/journey-poster.webp')` }}
          aria-hidden="true"
        />
      )}

      {/* =========================================================================
          CHAPTER 1: Hero (0 to 15%)
          ========================================================================= */}
      <section
        id="chapter-hero"
        aria-label="Chapter 1: West Michigan Well Drilling Specialists"
        className="relative min-h-screen flex items-center justify-center text-water-950 py-20 z-10"
      >
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full bg-water-900 text-water-100 text-xs font-bold uppercase tracking-wider font-condensed shadow-sm">
              Casnovia, MI &amp; West Michigan
            </span>

            <h1 className="text-4xl sm:text-6xl font-black font-condensed uppercase tracking-tight leading-[1.05] text-water-900 drop-shadow-sm">
              West Michigan&apos;s Well Drilling Specialists
            </h1>

            <p className="text-water-800 text-base sm:text-xl max-w-xl mx-auto leading-relaxed font-sans font-medium">
              Family-owned rotary well drilling, water pumps, and dependable repairs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => openEnquiry()}
                variant="primary"
                size="lg"
                className="font-condensed uppercase tracking-wider cursor-pointer shadow-lg hover:shadow-xl"
              >
                Get a Free Estimate
              </Button>
              <Button
                onClick={() => openVideoModal()}
                variant="secondary"
                size="lg"
                className="font-condensed uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 bg-water-900 text-white border-water-700 hover:bg-water-800"
              >
                <Play className="w-4 h-4 fill-current text-sky-400" />
                <span>Watch Demo</span>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          CHAPTER 2: Reveal (15% to 30%)
          ========================================================================= */}
      <section
        id="chapter-reveal"
        aria-label="Chapter 2: Clean Water Reveal"
        className="relative min-h-screen flex items-center justify-center text-white py-20 z-10"
      >
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-6xl font-black font-condensed uppercase tracking-tight text-white drop-shadow-lg"
            >
              Clean water, found on site.
            </motion.h2>
            <p className="text-water-100 text-base sm:text-lg max-w-lg mx-auto">
              Precision borehole rotary drilling targeting Michigan&apos;s purest subterranean aquifers.
            </p>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          CHAPTER 3: Services (30% to 45%)
          ========================================================================= */}
      <section
        id="chapter-services"
        aria-label="Chapter 3: Specialized Services"
        className="relative min-h-screen flex items-center justify-center text-white py-20 z-10"
      >
        <Container>
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-5xl font-black font-condensed uppercase tracking-tight text-white drop-shadow-md">
              Our Services
            </h2>
          </div>

          {/* Five 3D Row Service Cards with Hover Tilt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {services.map((svc, idx) => {
              const Icon = svc.icon
              return (
                <TiltCard key={idx} maxTilt={8} className="h-full">
                  <div className="h-full p-5 rounded-2xl bg-water-900/80 backdrop-blur-md border border-water-700/80 hover:border-sky-400 text-left flex flex-col justify-between shadow-xl transition-all duration-200">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-water-800 text-sky-300 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-white font-condensed uppercase tracking-wide leading-snug mb-1">
                        {svc.title}
                      </h3>
                      <p className="text-xs text-water-200 leading-relaxed font-sans">
                        {svc.desc}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-water-800/80">
                      <Link
                        to="/services"
                        className="inline-flex items-center gap-1 text-xs font-bold font-condensed uppercase tracking-wider text-sky-400 hover:text-white transition-colors"
                      >
                        <span>Learn more</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              )
            })}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          CHAPTER 4: Descent (45% to 65%)
          ========================================================================= */}
      <section
        id="chapter-descent"
        aria-label="Chapter 4: Subterranean Geological Descent"
        className="relative min-h-screen flex items-center justify-center text-white py-20 z-10"
      >
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-sky-950/80 border border-sky-400/40 text-sky-300 text-xs font-bold uppercase tracking-wider font-condensed mb-2">
                Geological Stratum Cutaway
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-condensed uppercase tracking-tight text-white drop-shadow-md">
                Descent to Pure Ground Water
              </h2>
            </div>

            {/* Geological Layer Pill Badges in Order */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {groundLayers.map((layer, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded-full border backdrop-blur-md shadow-md flex items-center gap-2 ${layer.color}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                  <span className="text-sm font-black font-condensed uppercase tracking-wider text-white">
                    {layer.name}
                  </span>
                  <span className="text-[11px] text-water-200 font-sans">
                    ({layer.depth})
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm sm:text-base text-water-100 max-w-lg mx-auto leading-relaxed">
              Our dual-rotary rigs cut straight through clay and boulders to tap the bedrock aquifer, sealed with casing to prevent surface runoff.
            </p>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          CHAPTER 5: Water Tunnel (65% to 85%)
          ========================================================================= */}
      <section
        id="chapter-water-tunnel"
        aria-label="Chapter 5: Water Tunnel Flow"
        className="relative min-h-screen flex items-center justify-center text-white py-20 z-10"
      >
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black font-condensed uppercase tracking-tight text-white drop-shadow-xl">
              Step into clean water.
            </h2>
            <p className="text-base sm:text-lg text-sky-100 max-w-md mx-auto leading-relaxed">
              Pressurized, crystal clear, dependable water flowing directly to your faucets.
            </p>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          CHAPTER 6: Surface and Finale (85% to 100%)
          ========================================================================= */}
      <section
        id="chapter-finale"
        aria-label="Chapter 6: Surface and Finale"
        className="relative min-h-screen flex items-center justify-center text-white py-20 z-10"
      >
        <Container>
          <div className="max-w-md mx-auto text-center space-y-8 relative">
            {/* Soft Ripple Expanding Behind Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-sky-400/30 animate-ping opacity-25 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-sky-400/20 animate-pulse opacity-30 pointer-events-none" />

            {/* M&J White Logo Centered */}
            <div className="flex justify-center relative z-10">
              <img
                src="/images/mj-logo-white.png"
                alt="M&J Water Wells, Casnovia, Michigan"
                width={280}
                height={60}
                className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_4px_16px_rgba(56,189,248,0.5)]"
              />
            </div>

            <div className="space-y-4 relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black font-condensed uppercase tracking-tight text-white">
                Ready for Fresh Well Water?
              </h2>

              {/* Tap to call button */}
              <div>
                <a
                  href="tel:+16166754875"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-water-600 hover:bg-water-500 active:scale-95 text-white font-bold font-condensed uppercase tracking-wider text-lg shadow-xl hover:shadow-2xl transition-all duration-200 border border-white/20"
                >
                  <Phone className="w-5 h-5 fill-current text-sky-300" />
                  <span>Call (616) 675-4875</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default JourneyContainer
