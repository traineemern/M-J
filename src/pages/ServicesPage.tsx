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
} from 'lucide-react'
import { FadeUp } from '@/components/motion/FadeUp'
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger'
import { TiltCard } from '@/components/motion/TiltCard'
import { Accordion } from '@/components/ui/Accordion'
import { RoadmapFlow } from '@/features/roadmap/RoadmapFlow'
import { DrillingVideo } from '@/features/drilling-video/DrillingVideo'
import { servicesPageData } from '@/data/services'
import { siteData } from '@/data/site'
import { BannerHero } from '@/components/ui/BannerHero'
import { TrustBar } from '@/features/trust/TrustBar'

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
  return (
    <>
      <SEO
        title="Well Drilling & Pump Services | M&J Water Wells"
        description="Rotary well drilling, agricultural irrigation, and 24/7 pump repair across West Michigan. Call (616) 675-4875."
        canonicalUrl="/services"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/services', pageName: 'Services' })}
      />

      <BannerHero title="Our services" description={servicesPageData.intro} image="/images/service-residential.webp" action={{ label: 'Free estimate', href: '/contact' }} />
      <TrustBar />
      <section className="bg-water-900 py-3 text-center text-xs font-bold uppercase tracking-widest text-water-100">{siteData.primaryArea}</section>

      {/* 7 Services Grid with Level B TiltCard */}
      <section className="py-14 sm:py-20 bg-white">
        <Container>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesPageData.services.slice(0, 6).map((service) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap] || Droplet

              return (
                <StaggerItem key={service.id}>
                  <TiltCard maxTilt={7} className="h-full">
                    <Card
                      variant="interactive"
                      className="group flex flex-col h-full bg-water-50/50 border border-water-200 hover:border-water-400 hover:shadow-lg transition-all duration-200 rounded-2xl p-6"
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
                      <a href="#drilling-video" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-water-700 underline underline-offset-4 focus-visible:outline-2">Learn more <ArrowRight className="size-4" /></a>
                    </Card>
                  </TiltCard>
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
              How we drill
            </h2>
          </FadeUp>
          <DrillingVideo id="drilling-video-services" />
        </Container>
      </section>

      {/* Full Roadmap Section with GSAP Scrubbed Road Drawing */}
      <section className="roadmap-section py-16 sm:py-24 border-b border-water-800">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-condensed uppercase tracking-tight">
              8-Step Project Roadmap
            </h2>
          </FadeUp>
          <RoadmapFlow />

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
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-water-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg sm:hidden">
        <Button href={`tel:${siteData.phoneClean}`} variant="outline" className="flex-1">Call</Button>
        <Button href="/contact" variant="primary" pulse className="flex-1">Free estimate</Button>
      </div>
    </>
  )
}

export default ServicesPage
