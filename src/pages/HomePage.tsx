import { Link } from 'react-router-dom'
import { DrillingVideo } from '@/features/drilling-video/DrillingVideo'
import { FaqCarousel } from '@/features/faq-carousel/FaqCarousel'
import { faqData } from '@/data/faq'
import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { ContactForm } from '@/features/contact/ContactForm'
import { FadeUp } from '@/components/motion/FadeUp'
import { homeData } from '@/data/home'
import { JourneyContainer } from '@/features/journey-3d/JourneyContainer'
import { ArrowRight } from 'lucide-react'

export function HomePage() {
  return (
    <>
      <SEO
        title="Well Drilling & Pump Service in Casnovia, MI"
        description="M&J Water Wells is West Michigan's rotary well drilling and pump repair specialist serving Casnovia, Sand Lake, Newaygo, and Fremont."
        canonicalUrl="/"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/', pageName: 'Home' })}
      />

      {/* 6-CHAPTER SCROLL-DRIVEN 3D JOURNEY (Desktop 3D, Mobile/Reduced Motion Static) */}
      <JourneyContainer />

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

      {/* COMMON QUESTIONS (3D FAQ Carousel with first 3 items) */}
      <section className="py-14 sm:py-20 bg-white border-b border-water-100 overflow-hidden">
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

      {/* CONTACT ESTIMATE FORM */}
      <section id="contact-estimate" className="py-14 sm:py-20 bg-water-50/50">
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
