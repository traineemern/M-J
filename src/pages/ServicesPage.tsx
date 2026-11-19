import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  Home,
  Building2,
  Tractor,
  ShieldCheck,
  Wrench,
  Activity,
  Droplet,
  ArrowRight,
  Phone,
} from 'lucide-react'
import { FadeUp } from '@/components/motion/FadeUp'
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger'
import { Accordion } from '@/components/ui/Accordion'
import { RoadmapFlow } from '@/features/roadmap/RoadmapFlow'
import { useRoadmapScrollTrigger } from '@/components/motion/ScrollProgressPath'
import { DrillingVideo } from '@/features/drilling-video/DrillingVideo'
import { servicesPageData } from '@/data/services'
import { siteData } from '@/data/site'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { EASINGS, TRANSFORMS } from '@/lib/motion'

const iconMap = {
  Home,
  Building2,
  Tractor,
  ShieldCheck,
  Wrench,
  Activity,
  Droplet,
}

export function ServicesPage() {
  const roadmapContainerRef = useRef<HTMLDivElement>(null)
  const [, setActiveScrollStep] = useState<number>(1)
  const shouldReduceMotion = useReducedMotion()
  const isMobile = useIsMobile()

  // GSAP ScrollTrigger roadmap road drawing (scrub: true)
  useRoadmapScrollTrigger({
    containerRef: roadmapContainerRef,
    pathSelector: 'path',
    onStepProgress: setActiveScrollStep,
  })

  return (
    <>
      <SEO
        title="Well Drilling & Pump Services | M&J Water Wells"
        description="Rotary well drilling, agricultural irrigation, and 24/7 pump repair across West Michigan. Call (616) 675-4875."
        canonicalUrl="/services"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/services', pageName: 'Services' })}
      />

      {/* Page Hero */}
      <section className="bg-gradient-to-b from-water-700 to-water-900 text-white py-14 sm:py-18">
        <Container>
          <FadeUp className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-condensed uppercase leading-tight">
              {servicesPageData.heading}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-water-100 font-sans leading-relaxed">
              {servicesPageData.intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                href="/#contact-estimate"
                variant="white"
                size="md"
                className="font-condensed uppercase tracking-wider"
              >
                <span>Free Estimate</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                href={`tel:${siteData.phoneClean}`}
                variant="secondary"
                size="md"
                className="text-white border-white hover:bg-white/10 font-condensed uppercase tracking-wider"
              >
                <Phone className="w-4 h-4" />
                <span>{siteData.phone}</span>
              </Button>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* 7 Services Grid (Cards lift 4px on hover) */}
      <section className="py-14 sm:py-20 bg-white">
        <Container>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesPageData.services.map((service) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap] || Droplet

              return (
                <StaggerItem key={service.id}>
                  <motion.div
                    whileHover={
                      isMobile || shouldReduceMotion
                        ? undefined
                        : { y: TRANSFORMS.cardHoverY }
                    }
                    transition={{ duration: 0.18, ease: EASINGS.easeOut }}
                    className="h-full"
                  >
                    <Card
                      variant="interactive"
                      className="group flex flex-col h-full bg-water-50/50 border border-water-200 hover:border-water-400 hover:shadow-md transition-shadow duration-200 rounded-2xl p-6"
                    >
                      <div className="w-12 h-12 rounded-xl bg-water-100 text-water-700 flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-water-900 font-condensed uppercase tracking-wide mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-water-800 leading-relaxed font-sans">
                        {service.line}
                      </p>
                    </Card>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>

          {/* Extra Details Accordions (Native <details> & <summary> that start closed) */}
          <div className="mt-12 max-w-3xl mx-auto">
            <Accordion items={servicesPageData.accordions as any} />
          </div>
        </Container>
      </section>

      {/* Drilling Demonstration Video Section */}
      <section id="drilling-video" className="py-14 sm:py-20 bg-water-50/60 border-t border-b border-water-200">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl font-black text-water-900 font-condensed uppercase tracking-tight">
              Rotary Drilling Process
            </h2>
          </FadeUp>
          <DrillingVideo id="drilling-video-services" />
        </Container>
      </section>

      {/* Full Roadmap Section with GSAP Scrubbed Road Drawing */}
      <section className="py-16 sm:py-24 bg-white border-b border-water-200">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-water-900 font-condensed uppercase tracking-tight">
              8-Step Project Roadmap
            </h2>
          </FadeUp>

          <div ref={roadmapContainerRef}>
            <RoadmapFlow />
          </div>

          <div className="mt-12 text-center">
            <Button
              href="/#contact-estimate"
              variant="primary"
              size="lg"
              className="font-condensed uppercase tracking-wider"
            >
              <span>Get a free estimate</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}

export default ServicesPage
