import { useState } from 'react'
import { SEO } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { FaqCarousel } from '@/features/faq-carousel/FaqCarousel'
import { Accordion } from '@/components/ui/Accordion'
import { AnimatedList } from '@/components/motion/AnimatedList'
import { Phone, List, Grid3X3 } from 'lucide-react'
import { FadeUp } from '@/components/motion/FadeUp'
import { faqPageData } from '@/data/faq'

export function FaqPage() {
  const [viewMode, setViewMode] = useState<'carousel' | 'list'>('carousel')

  const accordionItems = faqPageData.faqs.map((f) => ({
    id: f.id,
    title: f.question,
    content: f.answer,
  }))

  return (
    <>
      <SEO
        title="Frequently Asked Questions | M&J Water Wells"
        description="Answers about well drilling depths, pump repair, and permits in West Michigan. Call (616) 675-4875."
        canonicalUrl="/faq"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-water-700 to-water-900 text-white py-14 sm:py-18">
        <Container size="md">
          <FadeUp className="text-center">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-condensed uppercase">
              {faqPageData.heading}
            </h1>
          </FadeUp>
        </Container>
      </section>

      {/* 3D Card-Stack Carousel or List View Section */}
      <section className="py-14 sm:py-20 bg-water-50/50 overflow-hidden">
        <Container>
          {/* Mode Switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-xl bg-water-100 p-1 border border-water-200">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-condensed uppercase tracking-wider transition-colors cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-water-700 text-white shadow-xs'
                    : 'text-water-700 hover:text-water-900'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span>3D Carousel</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-condensed uppercase tracking-wider transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-water-700 text-white shadow-xs'
                    : 'text-water-700 hover:text-water-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
            </div>
          </div>

          {viewMode === 'carousel' ? (
            <FaqCarousel items={faqPageData.faqs} />
          ) : (
            <div className="max-w-3xl mx-auto">
              <AnimatedList duration={200}>
                <Accordion items={accordionItems} />
              </AnimatedList>
            </div>
          )}

          {/* Bottom Action: Still have a question? Call us */}
          <div className="mt-14 text-center pt-8 border-t border-water-200/80 max-w-md mx-auto">
            <p className="text-base text-water-800 font-condensed uppercase tracking-wider font-bold mb-3">
              {faqPageData.bottomCta.text}
            </p>
            <Button
              href={faqPageData.bottomCta.href}
              variant="primary"
              size="lg"
              className="font-condensed uppercase tracking-wider shadow-md hover:shadow-lg"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>{faqPageData.bottomCta.phone}</span>
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}

export default FaqPage
