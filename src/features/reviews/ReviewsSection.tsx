import { Star, ShieldCheck } from 'lucide-react'
import { testimonialsData } from '@/data/testimonials'
import { animatedStats } from '@/data/brands'
import { Container } from '@/components/ui/Container'
import { TestimonialCard } from './TestimonialCard'
import { CountUp } from '@/components/motion/CountUp'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger'

export function ReviewsSection() {
  return (
    <section className="py-16 sm:py-24 bg-water-50/70 border-y border-water-200">
      <Container>
        {/* Animated Counter Stats Bar */}
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-16 border-b border-water-200">
            {animatedStats.map((stat, idx) => (
              <div key={idx} className="text-center sm:text-left bg-white p-5 rounded-xl border border-water-200 shadow-xs">
                <span className="block text-3xl sm:text-4xl font-black text-water-600 font-condensed tracking-tight">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </span>
                <span className="block font-bold text-water-900 text-sm sm:text-base mt-1 font-condensed uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="block text-xs text-water-700 mt-1">
                  {stat.description}
                </span>
                {stat.placeholderNote && (
                  <span className="block text-[10px] text-water-700/70 mt-1 font-medium">
                    {stat.placeholderNote}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Section Heading */}
        <div className="pt-16 pb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-water-100 text-water-800 text-xs font-bold mb-3 font-condensed uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-water-600 text-water-600" />
            <span>Trusted By West Michigan Neighbors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-water-900 tracking-tight font-condensed uppercase">
            Real Reviews From Real Customers
          </h2>
          <p className="mt-3 text-water-800 text-base">
            See why homeowners, dairy farmers, and businesses in Casnovia, Sand Lake, and across West Michigan rely on M&J Water Wells.
          </p>
        </div>

        {/* Testimonials Staggered Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonialsData.map((item) => (
            <StaggerItem key={item.id}>
              <TestimonialCard testimonial={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Local Guarantee Callout */}
        <Reveal delay={0.1}>
          <div className="mt-12 p-6 rounded-2xl bg-white border border-water-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-water-100 text-water-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-aqua" />
              </div>
              <div>
                <h4 className="font-bold text-water-900 text-sm font-condensed uppercase tracking-wider">
                  Our Workmanship & Quality Guarantee
                </h4>
                <p className="text-xs text-water-700">
                  Every well is logged and tested for flow rate and potability according to Michigan Department of Environment, Great Lakes, and Energy (EGLE) standards.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider shrink-0 bg-water-600 px-4 py-2 rounded-lg font-condensed shadow-xs">
              State-Licensed Drilling Contractor
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
