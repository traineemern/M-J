import { Link } from 'react-router-dom'
import { motion, type Variants } from 'motion/react'
import { DrillingVideo } from '@/features/drilling-video/DrillingVideo'
import { useDrillingVideo } from '@/features/drilling-video/DrillingVideoContext'
import { TiltCard } from '@/components/motion/TiltCard'
import { ParallaxLayer } from '@/components/motion/ParallaxLayer'
import { FaqCarousel } from '@/features/faq-carousel/FaqCarousel'
import { faqData } from '@/data/faq'
import {
  Droplets,
  Building2,
  Wrench,
  ShieldCheck,
  Cog,
  Clock,
  MapPin,
  ArrowRight,
  Quote,
  Play,
} from 'lucide-react'
import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BrandMarquee } from '@/features/trust/BrandMarquee'
import { ContactForm } from '@/features/contact/ContactForm'
import { FadeUp } from '@/components/motion/FadeUp'
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger'
import { PhotoBand } from '@/components/motion/PhotoBand'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { homeData } from '@/data/home'
import { EASINGS, TRANSFORMS } from '@/lib/motion'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { TypedWord } from '@/features/hero/TypedWord'
import { VideoJourney } from '@/features/video-journey/VideoJourney'

export function HomePage() {
  const { openEnquiry } = useEnquiry()
  const { openModal: openVideoModal } = useDrillingVideo()
  const shouldReduceMotion = useReducedMotion()
  const isMobile = useIsMobile()

  // Headline line-by-line entrance variants (~80ms between lines, under 800ms total)
  const headlineWords = homeData.hero.headline.split(' ')

  const lineVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.35,
        ease: EASINGS.easeOut,
      },
    }),
  }

  return (
    <>
      <SEO
        title="Well Drilling & Pump Service in Casnovia, MI"
        description="M&J Water Wells is West Michigan's rotary well drilling and pump repair specialist serving Casnovia, Sand Lake, Newaygo, and Fremont."
        canonicalUrl="/"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/', pageName: 'Home' })}
      />

      {/* 1. HERO SECTION (Unchanged, with crew photo & TypedWord) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-water-800 via-water-900 to-water-950 text-white py-12 sm:py-16 lg:py-20 z-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Image: Clean crew and rig photo */}
            <div className="order-1 lg:order-2 lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/25 bg-water-950 aspect-video ring-1 ring-white/10 card-hover-lift"
              >
                <img
                  src="/images/mj-crew-photo.jpg"
                  alt="M&J Water Wells crew and rotary drilling rig outside Casnovia headquarters"
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </motion.div>
            </div>

            {/* Typography and CTAs */}
            <div className="order-2 lg:order-1 lg:col-span-6 space-y-5 text-center lg:text-left">
              {/* Line-by-line headline with accessible full text */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black font-condensed uppercase tracking-tight leading-[1.05]">
                <span className="sr-only">{homeData.hero.headline}</span>
                {shouldReduceMotion ? (
                  homeData.hero.headline
                ) : (
                  <span aria-hidden="true" className="inline-block">
                    {headlineWords.map((word, idx) => (
                      <motion.span
                        key={idx}
                        custom={idx}
                        variants={lineVariants}
                        initial="hidden"
                        animate="show"
                        className="inline-block mr-2"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </span>
                )}
                <span className="block text-xl sm:text-2xl text-water-200 mt-2 font-bold normal-case font-sans">
                  Well drilling for{' '}
                  <TypedWord words={['homes', 'farms', 'businesses']} className="text-sky-300 font-bold" />
                </span>
              </h1>

              {/* Subtext fades up */}
              <FadeUp delay={shouldReduceMotion ? 0 : 0.35} duration={0.3}>
                <p className="text-water-100 text-base sm:text-lg leading-relaxed">
                  {homeData.hero.line}
                </p>
              </FadeUp>

              {/* Two CTA Buttons appear last */}
              <FadeUp delay={shouldReduceMotion ? 0 : 0.5} duration={0.3}>
                <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
                  <Button
                    onClick={() => openEnquiry()}
                    variant="primary"
                    size="lg"
                    className="font-condensed uppercase tracking-wider cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    {homeData.hero.primaryCta.text}
                  </Button>
                  <Button
                    onClick={() => openVideoModal()}
                    variant="secondary"
                    size="lg"
                    className="font-condensed uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 bg-water-900/90 text-white border-white/20 hover:bg-water-800"
                  >
                    <Play className="w-4 h-4 fill-current text-sky-400" />
                    <span>Watch Demo</span>
                  </Button>
                </div>
              </FadeUp>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SCROLL-DRIVEN VIDEO JOURNEY (Placed between Hero and Services) */}
      <VideoJourney />

      {/* 3. TRUST LOGOS */}
      <div className="relative z-10 bg-white">
        <BrandMarquee compact={true} />
      </div>

      {/* 4. CORE SERVICES (Normal document flow, relative z-10) */}
      <section id="services" className="relative z-10 py-14 sm:py-18 bg-white border-b border-water-100 scroll-mt-20">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-water-900 font-condensed uppercase tracking-tight">
              {homeData.services.heading}
            </h2>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeData.services.cards.map((card, idx) => {
              const Icon =
                card.icon === 'Droplets'
                  ? Droplets
                  : card.icon === 'Building2'
                    ? Building2
                    : Wrench

              const parallaxSpeed = idx === 1 ? -0.06 : 0.04

              return (
                <StaggerItem key={card.id}>
                  <ParallaxLayer speed={parallaxSpeed} className="h-full">
                    <TiltCard maxTilt={6} className="h-full">
                      <Card
                        variant="default"
                        className="group flex flex-col h-full bg-water-50/50 border border-water-200 hover:border-water-400 hover:shadow-lg transition-all duration-200 rounded-2xl p-6"
                      >
                        <div className="w-12 h-12 rounded-xl bg-water-100 text-water-700 flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105">
                          <motion.div
                            whileHover={
                              isMobile || shouldReduceMotion
                                ? undefined
                                : { x: TRANSFORMS.iconNudgeX }
                            }
                            transition={{ duration: 0.15 }}
                          >
                            <Icon className="w-6 h-6 text-water-600" />
                          </motion.div>
                        </div>
                        <h3 className="text-xl font-bold text-water-900 font-condensed uppercase tracking-wide mb-2">
                          {card.title}
                        </h3>
                        <p className="text-sm text-water-800 leading-relaxed mb-4">
                          {card.line}
                        </p>
                        <div className="mt-auto pt-3 border-t border-water-200/60">
                          <Link
                            to="/services"
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider font-condensed text-water-700 hover:text-water-900 transition-colors"
                          >
                            <span>Learn more</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </Card>
                    </TiltCard>
                  </ParallaxLayer>
                </StaggerItem>
              )
            })}
          </StaggerContainer>

          <div className="text-center mt-8">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-water-700 hover:text-water-900 font-condensed uppercase tracking-wider"
            >
              <span>{homeData.services.learnMoreText}</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* 5. PHOTO BAND */}
      <div className="relative z-10">
        <PhotoBand
          headline="Rotary Well Drilling Across West Michigan"
          subtext="Casnovia-based rotary rigs engineered to reach deep clean aquifers."
        />
      </div>

      {/* 6. WHY US */}
      <section className="relative z-10 py-14 sm:py-18 bg-water-50/70 border-b border-water-100">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-water-900 font-condensed uppercase tracking-tight">
              {homeData.whyUs.heading}
            </h2>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeData.whyUs.points.map((point, idx) => {
              const Icon =
                point.icon === 'ShieldCheck'
                  ? ShieldCheck
                  : point.icon === 'Cog'
                    ? Cog
                    : Clock

              return (
                <StaggerItem key={idx}>
                  <div className="bg-white p-6 rounded-2xl border border-water-200 shadow-2xs flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-water-100 text-water-700 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-aqua" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-water-900 font-condensed uppercase tracking-wide">
                        {point.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-water-800 leading-relaxed">
                        {point.line}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </Container>
      </section>

      {/* 7. SEE HOW WE DRILL (Full Video Player + Crew Photo, normal document flow) */}
      <section id="drilling-video" className="relative z-10 py-14 sm:py-20 bg-water-50/60 border-b border-water-100 scroll-mt-20">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-water-100 text-water-800 text-xs font-bold uppercase tracking-wider font-condensed mb-2">
              On-Site Drilling Precision
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-water-900 font-condensed uppercase tracking-tight">
              See how we drill
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
            {/* Provided Crew & Rig Photo Card */}
            <FadeUp delay={0.1} className="lg:col-span-5 order-2 lg:order-1">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-water-200 shadow-sm space-y-4 card-hover-lift">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-water-200 shadow-inner">
                  <img
                    src="/images/mj-crew-photo.jpg"
                    alt="M&J Water Wells crew with rotary drilling rig in Casnovia"
                    width={800}
                    height={600}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-water-900 font-condensed uppercase tracking-wide">
                    Casnovia Crew &amp; Dual-Rotary Fleet
                  </h3>
                  <p className="text-xs sm:text-sm text-water-800 leading-relaxed mt-1 font-sans">
                    Every well is drilled by our certified Michigan crew with dual-rotary rigs engineered to reach deep, clean groundwater.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Embedded Video Component */}
            <FadeUp delay={0.2} className="lg:col-span-7 order-1 lg:order-2">
              <DrillingVideo />
            </FadeUp>
          </div>
        </Container>
      </section>

      {/* 8. SERVICE AREA */}
      <section className="relative z-10 py-12 bg-white border-b border-water-100">
        <Container>
          <FadeUp className="max-w-2xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-water-100 text-water-800 text-xs font-bold font-condensed uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-aqua" />
              <span>{homeData.serviceArea.heading}</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-water-900 font-condensed">
              {homeData.serviceArea.line}
            </p>
            <div className="pt-1">
              <Link
                to={homeData.serviceArea.linkHref}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider font-condensed text-water-700 hover:text-water-900 transition-colors"
              >
                <span>{homeData.serviceArea.linkText}</span>
              </Link>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* 9. REVIEWS */}
      <section className="relative z-10 py-14 sm:py-18 bg-water-50/70 border-b border-water-100">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-water-900 font-condensed uppercase tracking-tight">
              {homeData.reviews.heading}
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {homeData.reviews.quotes.map((rev, idx) => (
              <FadeUp key={idx} delay={idx * 0.1}>
                <div className="bg-white p-6 rounded-2xl border border-water-200 shadow-2xs relative">
                  <Quote className="w-6 h-6 text-water-300 absolute top-4 right-4" />
                  <p className="text-sm sm:text-base italic text-water-900 leading-relaxed pr-6">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                  <span className="block mt-4 text-xs font-bold text-water-700 font-condensed uppercase tracking-wider">
                    — {rev.author}
                  </span>
                </div>
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>

      {/* 10. COMMON QUESTIONS (3D FAQ Carousel with first 3 items) */}
      <section className="relative z-10 py-14 sm:py-20 bg-white border-b border-water-100 overflow-hidden">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-water-900 font-condensed uppercase tracking-tight">
              Common questions
            </h2>
          </FadeUp>

          <FaqCarousel items={faqData.slice(0, 3)} />

          <div className="mt-8 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider font-condensed text-water-700 hover:text-water-900 transition-colors"
            >
              <span>See all questions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* 11. CONTACT ESTIMATE FORM */}
      <section id="contact-estimate" className="relative z-10 py-14 sm:py-20 bg-water-50/50 scroll-mt-20">
        <Container size="md">
          <ContactForm
            id="estimate-form"
            title={homeData.contact.heading}
            subtitle={homeData.contact.intro}
          />
        </Container>
      </section>
    </>
  )
}

export default HomePage
