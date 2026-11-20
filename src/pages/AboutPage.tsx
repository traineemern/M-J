import { useState } from 'react'
import { SEO } from '@/lib/seo'
import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BrandMarquee } from '@/features/trust/BrandMarquee'
import { Users, Droplet, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import { FadeUp } from '@/components/motion/FadeUp'
import { CountUp } from '@/components/motion/CountUp'
import { TiltCard } from '@/components/motion/TiltCard'
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger'
import { aboutPageData } from '@/data/about'
import { siteData } from '@/data/site'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { TrustBar } from '@/features/trust/TrustBar'
import { generateLocalBusinessSchema } from '@/lib/seo'
import { aboutSampleData } from '@/data/about.sample'
const showSampleData = import.meta.env.VITE_SHOW_SAMPLE_DATA === 'true'

function SampleBadge() {
  return <span data-sample-badge="true" className="absolute right-2 top-2 z-10 rounded bg-water-950 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">Sample</span>
}

const iconMap = {
  Users,
  Droplet,
  MapPin,
}

export function AboutPage() {
  const { openEnquiry } = useEnquiry()
  const [activeTown, setActiveTown] = useState('Casnovia')
  const [sliderPosition, setSliderPosition] = useState(50)
  const towns = ['Casnovia', 'Sand Lake', 'Newaygo', 'Fremont', 'Hesperia', 'Kent City', 'Cedar Springs', 'Croton']
  const timeline = showSampleData ? aboutSampleData.milestones : ['[CONFIRM year founded] · Family-owned in Casnovia', '[CONFIRM milestone and year]', '[CONFIRM milestone and year]', '[CONFIRM milestone and year]']
  const counters = showSampleData ? aboutSampleData.counters : aboutPageData.counters
  return (
    <div className="font-raleway">
      <SEO
        title="About M&J Water Wells | Family-Owned Well Drilling in Casnovia, MI"
        description="Learn about M&J Water Wells — a family-owned rotary well drilling company in Casnovia, MI serving West Michigan with dependable groundwater systems."
        canonicalUrl="/about"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/about', pageName: 'About' })}
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

      <TrustBar />

      {/* 3 Counters Grid with Level A CountUp & Depth Tilt */}
      <section className="py-12 bg-white border-b border-water-100">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {counters.map((counter, idx) => {
              const counterValue = String(counter.value)
              const numericValue = parseInt(counterValue.replace(/[^0-9]/g, ''), 10)
              const suffix = counterValue.replace(/[0-9,]/g, '')

              return (
                <TiltCard key={counter.id} maxTilt={6} className="h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="glass-card relative p-6 h-full bg-water-50/70 hover:bg-water-50 rounded-2xl border border-water-200 shadow-2xs hover:shadow-lg transition-all card-hover-lift"
                  >
                    {showSampleData && <SampleBadge />}
                    <span className="block text-3xl sm:text-4xl font-black text-water-900 font-condensed tracking-tight">
                      {Number.isFinite(numericValue) ? <CountUp end={numericValue} suffix={suffix} duration={1.6} /> : '[CONFIRM]'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-water-700 font-condensed mt-1 block">
                      {counter.label}
                    </span>
                  </motion.div>
                </TiltCard>
              )
            })}
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

      <section className="bg-water-50 py-14 sm:py-20">
        <Container>
          <h2 className="mb-8 font-condensed text-3xl font-black uppercase text-water-900">Experience timeline</h2>
          <ol className="flex gap-4 overflow-x-auto pb-3">{timeline.map((item, index) => <li key={index} className="relative min-w-64 rounded-2xl border border-water-100 bg-white p-5 pr-20 font-bold text-water-900 shadow-sm">{showSampleData && <SampleBadge />}{item}</li>)}</ol>
        </Container>
      </section>
      <section className="bg-white py-14 sm:py-20" aria-label="Service area map">
        <Container>
          <h2 className="mb-6 font-condensed text-3xl font-black uppercase text-water-900">Interactive service area</h2>
          <div className="grid gap-5 md:grid-cols-[1fr_280px]">
            <div role="group" aria-label="Choose service town" className="grid grid-cols-2 gap-2 sm:grid-cols-4">{towns.map((town) => <button key={town} type="button" aria-pressed={activeTown === town} onClick={() => setActiveTown(town)} className={`glass-chip rounded-xl border p-3 font-bold focus-visible:outline-2 ${activeTown === town ? 'border-water-600 bg-water-700 text-white' : 'border-water-200 bg-water-50 text-water-900'}`}><MapPin className="mx-auto mb-1 size-4" />{town}</button>)}</div>
            <Card aria-live="polite"><h3 className="font-bold text-water-900">{activeTown}</h3><p className="my-2 text-sm text-water-700">Request a quote for work in {activeTown}.</p><Button onClick={() => openEnquiry(undefined, activeTown)}>Request a quote</Button></Card>
          </div>
          <p className="mt-3 text-xs text-water-700">Additional towns: [CONFIRM: service area towns]</p>
        </Container>
      </section>
      <section id="project-gallery" className="bg-water-50 py-14 sm:py-20">
        <Container>
          <h2 className="mb-6 font-condensed text-3xl font-black uppercase text-water-900">Project gallery</h2>
          {showSampleData ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{aboutSampleData.projects.map((project) => <figure key={project.id} className="relative overflow-hidden rounded-2xl border border-water-100 bg-white shadow-sm"><SampleBadge /><img src={project.image} alt="Neutral illustrative sample tile, not a customer property" width={960} height={640} loading="lazy" className="aspect-[4/3] w-full object-cover" /><figcaption className="p-3 text-sm font-bold text-water-800">{project.caption}</figcaption></figure>)}</div> : <><div className="grid grid-cols-2 gap-3 md:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed border-water-300 bg-white p-4 text-center text-sm font-bold text-water-700">[CONFIRM: add job photo]</div>)}</div><p className="mt-3 text-xs text-water-700">Photo captions require owner-confirmed town and job type. No job photos are supplied yet.</p></>}
        </Container>
      </section>
      <section className="bg-white py-14 sm:py-20"><Container>
        <h2 className="mb-6 font-condensed text-3xl font-black uppercase text-water-900">Before and after</h2>
        {showSampleData ? <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-water-100"><SampleBadge /><img src="/images/sample-before.webp" alt="Sample before illustration" width={960} height={640} loading="lazy" className="block w-full" /><img src="/images/sample-after.webp" alt="Sample after illustration" width={960} height={640} loading="lazy" className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }} /><label className="absolute inset-x-4 bottom-4 rounded-xl bg-white/95 p-3 text-sm font-bold text-water-900 shadow"><span className="sr-only">Compare sample before and after</span><input aria-label="Before and after comparison" type="range" min="0" max="100" value={sliderPosition} onChange={(event) => setSliderPosition(Number(event.target.value))} className="w-full accent-water-600" /></label></div> : <Card className="border-dashed text-center">[CONFIRM: approved before and after photo pair]</Card>}
        <h2 className="mb-4 mt-10 font-condensed text-3xl font-black uppercase text-water-900">Trust and credentials</h2>
        {showSampleData ? <div className="grid gap-4 sm:grid-cols-3">{aboutSampleData.trust.map((item) => <Card key={item.id} className="relative"><SampleBadge /><h3 className="font-bold text-water-900">{item.label}</h3><p className="mt-2 text-water-700">{item.value}</p></Card>)}</div> : <Card className="text-center">[CONFIRM: license, insurance, certifications, and memberships]</Card>}
        <h2 className="mb-4 mt-10 font-condensed text-3xl font-black uppercase text-water-900">Customer reviews</h2>
        {showSampleData ? <div className="grid gap-4 md:grid-cols-3">{aboutSampleData.reviews.map((review) => <Card key={review.id} className="relative"><SampleBadge /><p className="text-amber-500" aria-label={`${review.rating} star sample rating`}>{'★'.repeat(review.rating)}</p><blockquote className="mt-3 text-water-800">{review.quote}</blockquote><p className="mt-3 font-bold text-water-900">{review.name}</p></Card>)}</div> : <Card className="text-center">[CONFIRM: review link and owner-approved review details]</Card>}
      </Container></section>
      <section className="bg-water-950 py-12 text-white"><Container className="flex flex-wrap items-center justify-between gap-5"><h2 className="font-condensed text-3xl font-black uppercase">Ready to talk?</h2><div className="flex gap-3"><Button href={`tel:${siteData.phoneClean}`} variant="white">{siteData.phone}</Button><Button href="/contact" variant="primary" pulse>Free estimate</Button></div></Container></section>
    </div>
  )
}

export default AboutPage
