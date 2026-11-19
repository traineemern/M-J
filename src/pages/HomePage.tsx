import { Link } from 'react-router-dom'
import { motion, type Variants } from 'motion/react'
import { DrillingVideo } from '@/features/drilling-video/DrillingVideo'
import { useDrillingVideo } from '@/features/drilling-video/DrillingVideoContext'
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

      {/* 1. HERO SECTION (Motion Line-by-Line Entrance) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-water-800 via-water-900 to-water-950 text-white py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Watch Demo Video Card with Provided Photo: order-1 on mobile, order-2 on desktop */}
            <div className="order-1 lg:order-2 lg:col-span-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openVideoModal()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openVideoModal()
                  }
                }}
                className="relative group rounded-3xl overflow-hidden shadow-2xl border-2 border-white/25 bg-water-950 aspect-video cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-water-400 transition-all card-hover-lift ring-1 ring-white/10"
                aria-label="Open Watch Demo popup window"
              >
                <img
                  src="/images/mj-crew-photo.jpg"
                  alt="M&J Water Wells crew and rotary drilling rig outside Casnovia headquarters"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-water-950/90 via-water-950/35 to-transparent flex flex-col justify-end p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-water-500 text-water-950 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-water-400 transition-all duration-300 ring-4 ring-white/30">
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current translate-x-0.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-full bg-water-400/30 text-white border border-water-300/40 backdrop-blur-xs font-condensed">
                          Casnovia Crew & Rig
                        </span>
                        <span className="text-xs text-water-200 font-medium font-sans">0:51 Demo</span>
                      </div>
                      <p className="font-condensed font-black uppercase tracking-wider text-base sm:text-2xl text-white mt-1 drop-shadow-sm">
                        Watch Drilling Demo
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Typography and CTAs */}
            <div className="order-2 lg:order-1 lg:col-span-6 space-y-5 text-center lg:text-left">
              {/* Line-by-line headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black font-condensed uppercase tracking-tight leading-[1.05]">
                {shouldReduceMotion ? (
                  homeData.hero.headline
                ) : (
                  <span className="inline-block">
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
                    className="font-condensed uppercase tracking-wider cursor-pointer"
                  >
                    {homeData.hero.primaryCta.text}
                  </Button>
                  <Button
                    onClick={() => openVideoModal()}
                    variant="secondary"
                    size="lg"
                    className="font-condensed uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Watch Demo</span>
                  </Button>
                </div>
              </FadeUp>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. TRUST LOGOS */}
      <BrandMarquee compact={true} />

      {/* 3. CORE SERVICES (Cards lift 4px and soft shadow; icons nudge 2px) */}
      <section className="py-14 sm:py-18 bg-white border-b border-water-100">
        <Container>
          <FadeUp className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-water-900 font-condensed uppercase tracking-tight">
              {homeData.services.heading}
            </h2>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeData.services.cards.map((card) => {
              const Icon =
                card.icon === 'Droplets'
                  ? Droplets
                  : card.icon === 'Building2'
                    ? Building2
                    : Wrench

              return (
                <StaggerItem key={card.id}>
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
                      variant="default"
                      className="group flex flex-col h-full bg-water-50/50 border border-water-200 hover:border-water-400 hover:shadow-md transition-shadow duration-200 rounded-2xl p-6"
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
                          <Icon className="w-6 h-6" />
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
                  </motion.div>
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

      {/* 4. PHOTO BAND (GSAP ScrollTrigger Parallax) */}
      <PhotoBand
        headline="Rotary Well Drilling Across West Michigan"
        subtext="Casnovia-based rotary rigs engineered to reach deep clean aquifers."
      />

      {/* 5. WHY US */}
      <section className="py-14 sm:py-18 bg-water-50/70 border-b border-water-100">
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

      {/* SEE HOW WE DRILL (Full Video Player + Crew Photo) */}
      <section id="drilling-video" className="py-14 sm:py-20 bg-water-50/60 border-b border-water-100">
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
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-water-900 font-condensed uppercase tracking-wide">
                    Casnovia Crew & Dual-Rotary Fleet
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

      {/* 6. SERVICE AREA */}
      <section className="py-12 bg-white border-b border-water-100">
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

      {/* 7. REVIEWS */}
      <section className="py-14 sm:py-18 bg-water-50/70 border-b border-water-100">
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

      {/* 8. CONTACT FORM */}
      <section id="contact-estimate" className="py-14 sm:py-20 bg-white">
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
