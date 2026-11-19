import { SEO } from '@/lib/seo'
import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BrandMarquee } from '@/features/trust/BrandMarquee'
import { Users, Droplet, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import { FadeUp } from '@/components/motion/FadeUp'
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger'
import { aboutPageData } from '@/data/about'
import { siteData } from '@/data/site'

const iconMap = {
  Users,
  Droplet,
  MapPin,
}

export function AboutPage() {
  return (
    <div className="font-raleway">
      <SEO
        title="About M&J Water Wells | Family-Owned Well Drilling in Casnovia, MI"
        description="Learn about M&J Water Wells — a family-owned rotary well drilling company in Casnovia, MI serving West Michigan with dependable groundwater systems."
        canonicalUrl="/about"
      />

      {/* Page Hero with Motion */}
      <section className="relative overflow-hidden bg-gradient-to-br from-water-800 via-water-900 to-water-950 text-white py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <FadeUp className="lg:col-span-6 text-center lg:text-left space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-water-700/60 text-water-200 border border-water-600/50 text-xs font-bold uppercase tracking-wider font-condensed">
                <Sparkles className="w-3.5 h-3.5 text-aqua" />
                <span>Casnovia, Michigan Local Heritage</span>
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-condensed uppercase leading-tight">
                {aboutPageData.heading}
              </h1>
              <p className="text-base sm:text-lg text-water-100 font-sans leading-relaxed">
                {aboutPageData.story}
              </p>
              <div className="pt-2 flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button
                  href={`tel:${siteData.phoneClean}`}
                  variant="primary"
                  size="lg"
                  className="font-condensed uppercase tracking-wider cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>{aboutPageData.primaryCta.text}</span>
                </Button>
                <Button
                  href="/#contact-estimate"
                  variant="secondary"
                  size="lg"
                  className="font-condensed uppercase tracking-wider"
                >
                  <span>Request Estimate</span>
                </Button>
              </div>
            </FadeUp>

            {/* Team Photo Card with floating badge */}
            <FadeUp delay={0.2} className="lg:col-span-6">
              <motion.div
                whileHover={{ scale: 1.015 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 bg-water-950 aspect-[16/10] ring-1 ring-white/10"
              >
                <img
                  src="/images/about-team.jpg"
                  alt="M&J Water Wells family crew and rotary drill rig outside Casnovia facility"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-water-950/80 via-transparent to-transparent flex items-end p-5">
                  <div className="flex items-center gap-3 bg-water-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                    <ShieldCheck className="w-5 h-5 text-aqua shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white uppercase font-condensed tracking-wider">
                        Casnovia Headquarters
                      </p>
                      <p className="text-[11px] text-water-200">
                        Owner-operated crew with certified dual-rotary rig fleet
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </FadeUp>
          </div>
        </Container>
      </section>

      {/* 3 Counters Grid with Motion */}
      <section className="py-12 bg-white border-b border-water-100">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {aboutPageData.counters.map((counter, idx) => (
              <motion.div
                key={counter.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 bg-water-50/70 hover:bg-water-50 rounded-2xl border border-water-200 shadow-2xs transition-all card-hover-lift"
              >
                <span className="block text-3xl sm:text-4xl font-black text-water-900 font-condensed tracking-tight">
                  {counter.value}
                </span>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-water-700 font-condensed mt-1 block">
                  {counter.label}
                </span>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Highlights */}
      <section className="py-14 sm:py-20 bg-water-50/40">
        <Container>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {aboutPageData.highlights.map((item, idx) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] || Users

              return (
                <StaggerItem key={idx}>
                  <Card variant="interactive" className="p-6 text-center h-full bg-white card-hover-lift">
                    <div className="w-12 h-12 rounded-xl bg-water-100 text-water-700 flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-water-900 font-condensed uppercase tracking-wide mb-1">
                      {item.title}
                    </h2>
                    <p className="text-sm text-water-800 leading-relaxed font-sans">
                      {item.line}
                    </p>
                  </Card>
                </StaggerItem>
              )
            })}
          </StaggerContainer>

          {/* Primary Action: Call */}
          <div className="text-center">
            <Button
              href={`tel:${siteData.phoneClean}`}
              variant="primary"
              size="lg"
              className="font-condensed uppercase tracking-wider"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>{aboutPageData.primaryCta.text}</span>
            </Button>
          </div>
        </Container>
      </section>

      {/* Trust Brands */}
      <BrandMarquee compact={true} />
    </div>
  )
}

export default AboutPage
