import React, { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Phone, ArrowRight } from 'lucide-react'
import { siteData } from '@/data/site'
import { motionConfig } from '@/lib/motion/config'

interface PhotoBandProps {
  headline?: string
  subtext?: string
}

export const PhotoBand: React.FC<PhotoBandProps> = ({
  headline = 'Quality Rotary Well Drilling Across West Michigan',
  subtext = 'Clean water guaranteed. Serving Casnovia, Sand Lake, and Newaygo.',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const isMobile = useIsMobile()

  useEffect(() => {
    // Parallax disabled on mobile (< 768px) and when prefers-reduced-motion is active
    if (shouldReduceMotion || isMobile) return
    const container = containerRef.current
    const img = imageRef.current
    if (!container || !img || typeof window === 'undefined') return

    let active = true
    let revert = () => {}
    void import('@/lib/motion/gsap').then(({ gsap }) => {
      if (!active) return
      const context = gsap.context(() => {
        gsap.fromTo(
          img,
          { yPercent: -motionConfig.parallax.hero * 50 },
          {
            yPercent: motionConfig.parallax.hero * 50,
            ease: motionConfig.ease.none,
            scrollTrigger: {
              trigger: container,
              start: motionConfig.trigger.parallaxStart,
              end: motionConfig.trigger.parallaxEnd,
              scrub: motionConfig.scrub.parallax,
            },
          },
        )
      }, container)
      revert = () => context.revert()
    })

    return () => {
      active = false
      revert()
    }
  }, [shouldReduceMotion, isMobile])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-water-950 text-white py-16 sm:py-24 my-8"
    >
      {/* Parallax Background Layer with simulated job photo / deep aquifer blue vector scene */}
      <div
        ref={imageRef}
        className="absolute inset-0 -top-[15%] -bottom-[15%] w-full h-[130%] bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at center, rgba(14, 90, 132, 0.45) 0%, rgba(5, 29, 46, 0.95) 100%), linear-gradient(135deg, #0B4466 0%, #051D2E 100%)',
        }}
        aria-hidden="true"
      />

      {/* Dark Overlay Passing WCAG AA Contrast (Luminance ratio > 12:1) */}
      <div
        className="absolute inset-0 bg-water-950/70 backdrop-brightness-75 pointer-events-none"
        aria-hidden="true"
      />

      {/* Foreground Content */}
      <Container className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl sm:text-4xl font-black font-condensed uppercase tracking-tight text-white leading-tight">
          {headline}
        </h2>
        <p className="text-sm sm:text-base text-water-100 font-sans max-w-xl mx-auto leading-relaxed">
          {subtext}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            href={`tel:${siteData.phoneClean}`}
            variant="primary"
            size="md"
            className="font-condensed uppercase tracking-wider"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Call {siteData.phone}</span>
          </Button>
          <Button
            href="/services"
            variant="secondary"
            size="md"
            className="font-condensed uppercase tracking-wider"
          >
            <span>Our Services</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default PhotoBand
