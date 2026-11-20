import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { FaqCarousel } from '@/features/faq-carousel/FaqCarousel'
import { Phone } from 'lucide-react'
import { faqPageData } from '@/data/faq'
import { BannerHero } from '@/components/ui/BannerHero'
import { TrustBar } from '@/features/trust/TrustBar'

export function FaqPage() {
  return (
    <>
      <SEO
        title="Frequently Asked Questions | M&J Water Wells"
        description="Answers about well drilling depths, pump repair, and permits in West Michigan. Call (616) 675-4875."
        canonicalUrl="/faq"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/faq', pageName: 'FAQ' })}
      />

      <BannerHero title={faqPageData.heading} image="/images/service-commercial.webp" align="center" />
      <TrustBar />

      {/* Card carousel only */}
      <section className="py-14 sm:py-20 bg-water-50/50 overflow-hidden">
        <Container>
          <FaqCarousel items={faqPageData.faqs} />

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
            <Button href="/contact" variant="outline" size="lg" className="ml-3">Contact page</Button>
          </div>
        </Container>
      </section>
    </>
  )
}

export default FaqPage
