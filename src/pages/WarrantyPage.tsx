import { SEO } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ShieldCheck, Wrench, FileText, ArrowRight } from 'lucide-react'
import { FadeUp } from '@/components/motion/FadeUp'
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger'
import { Accordion } from '@/components/ui/Accordion'
import { warrantyPageData } from '@/data/warranty'

const iconMap = {
  ShieldCheck,
  Wrench,
  FileText,
}

export function WarrantyPage() {
  return (
    <>
      <SEO
        title="Well Drilling Warranty Terms | West Michigan"
        description="M&J Water Wells warranty terms for rotary well drilling, pump installations, and equipment in West Michigan."
        canonicalUrl="/warranty"
      />

      {/* Page Hero */}
      <section className="bg-gradient-to-b from-water-700 to-water-900 text-white py-14 sm:py-18">
        <Container size="md">
          <FadeUp className="text-center space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-condensed uppercase">
              {warrantyPageData.heading}
            </h1>
            <p className="text-base sm:text-lg text-water-100 max-w-xl mx-auto font-sans leading-relaxed">
              {warrantyPageData.intro}
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* 3 Key Promises */}
      <section className="py-14 sm:py-20 bg-white">
        <Container size="md">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {warrantyPageData.promises.map((promise) => {
              const Icon = iconMap[promise.icon as keyof typeof iconMap] || ShieldCheck

              return (
                <StaggerItem key={promise.id}>
                  <Card variant="interactive" className="h-full p-6 text-center border-t-4 border-t-water-600 bg-water-50/40">
                    <div className="w-12 h-12 rounded-xl bg-water-100 text-water-700 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-water-900 font-condensed uppercase tracking-wide mb-1.5">
                      {promise.title}
                    </h2>
                    <p className="text-sm text-water-800 leading-relaxed font-sans">
                      {promise.line}
                    </p>
                  </Card>
                </StaggerItem>
              )
            })}
          </StaggerContainer>

          {/* Full Terms Accordion */}
          <div className="max-w-2xl mx-auto mb-10">
            <Accordion items={[warrantyPageData.termsAccordion]} />
          </div>

          {/* Primary Action */}
          <div className="text-center">
            <Button
              href={warrantyPageData.primaryCta.href}
              variant="primary"
              size="lg"
              className="font-condensed uppercase tracking-wider"
            >
              <span>{warrantyPageData.primaryCta.text}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}

export default WarrantyPage
