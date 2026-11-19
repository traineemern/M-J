import { SEO } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Accordion } from '@/components/ui/Accordion'
import { Phone } from 'lucide-react'
import { FadeUp } from '@/components/motion/FadeUp'
import { faqPageData } from '@/data/faq'

export function FaqPage() {
  const accordionItems = faqPageData.faqs.map((faq) => ({
    id: faq.id,
    title: faq.question,
    content: faq.answer,
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

      {/* Questions Only Section with Native <details> Accordion */}
      <section className="py-14 sm:py-20 bg-white">
        <Container size="md">
          <Accordion items={accordionItems} />

          {/* Bottom Action: Still have a question? Call us */}
          <div className="mt-12 text-center pt-8 border-t border-water-100">
            <p className="text-base text-water-800 font-condensed uppercase tracking-wider font-bold mb-3">
              {faqPageData.bottomCta.text}
            </p>
            <Button
              href={faqPageData.bottomCta.href}
              variant="primary"
              size="lg"
              className="font-condensed uppercase tracking-wider"
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
