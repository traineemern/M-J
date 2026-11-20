import { motion } from 'motion/react'
import { ShieldCheck, Cog, Clock } from 'lucide-react'
import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { BrandMarquee } from '@/features/trust/BrandMarquee'
import { FadeUp } from '@/components/motion/FadeUp'
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger'
import { PhotoBand } from '@/components/motion/PhotoBand'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { homeData } from '@/data/home'
import { TRANSFORMS } from '@/lib/motion'
import { JourneyStageLoader } from '@/features/journey-3d/JourneyStageLoader'
import { CinematicHero } from '@/features/hero/CinematicHero'
import { ServiceBanners } from '@/features/service-banners/ServiceBanner'
import { TrustBar } from '@/features/trust/TrustBar'

export function HomePage() {
  const shouldReduceMotion = useReducedMotion()
  const isMobile = useIsMobile()

  return (
    <>
      <SEO
        title="Well Drilling & Pump Service in Casnovia, MI"
        description="M&J Water Wells is West Michigan's rotary well drilling and pump repair specialist serving Casnovia, Sand Lake, Newaygo, and Fremont."
        canonicalUrl="/"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/', pageName: 'Home' })}
      />

      <CinematicHero />
      <TrustBar />
      <JourneyStageLoader />

      <div className="relative z-10 bg-white">
        <BrandMarquee compact />
      </div>

      <section id="services" className="relative z-10 scroll-mt-20 bg-water-950 text-white">
        <div className="px-5 pt-12 text-center sm:px-8 sm:pt-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-water-300">Built for West Michigan</p>
          <h2 className="mt-2 font-condensed text-4xl font-bold uppercase tracking-tight sm:text-5xl">{homeData.services.heading}</h2>
        </div>
        <ServiceBanners />
      </section>

      <div className="relative z-10">
        <PhotoBand headline="Rotary Well Drilling Across West Michigan" subtext="Casnovia-based rotary rigs engineered to reach deep clean aquifers." />
      </div>

      <section className="relative z-10 border-b border-water-100 bg-water-50/70 py-14 sm:py-18">
        <Container>
          <FadeUp className="mx-auto mb-10 max-w-xl text-center">
            <h2 className="font-condensed text-3xl font-black uppercase tracking-tight text-water-900 sm:text-4xl">{homeData.whyUs.heading}</h2>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {homeData.whyUs.points.map((point, index) => {
              const Icon = point.icon === 'ShieldCheck' ? ShieldCheck : point.icon === 'Cog' ? Cog : Clock
              return (
                <StaggerItem key={index}>
                  <div className="flex items-start gap-4 rounded-2xl border border-water-200 bg-white p-6 shadow-2xs">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-water-100 text-water-700">
                      <motion.div whileHover={isMobile || shouldReduceMotion ? undefined : { rotate: TRANSFORMS.iconNudgeX * 8 }} transition={{ duration: 0.2 }}>
                        <Icon className="size-5 text-aqua" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="font-condensed text-base font-bold uppercase tracking-wide text-water-900">{point.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-water-800 sm:text-sm">{point.line}</p>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </Container>
      </section>

      <section className="bg-water-900 py-10 text-white"><Container className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="font-condensed text-2xl font-black uppercase">Warranty information</h2><p className="mt-1 text-sm text-water-100">Review the warranty details for well and pump services.</p></div><a href="/warranty" className="rounded-xl border border-white/70 px-5 py-3 font-bold text-white focus-visible:outline-2">View warranty</a></Container></section>

    </>
  )
}

export default HomePage
