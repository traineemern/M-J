import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FadeUp } from '@/components/motion/FadeUp'
import { ParallaxLayer } from '@/components/motion/ParallaxLayer'
import { TiltCard } from '@/components/motion/TiltCard'
import { Phone, MapPin, CheckCircle2 } from 'lucide-react'
import { newaygoPageData } from '@/data/newaygo'
import { siteData } from '@/data/site'

export function NewaygoAreaPage() {
  return (
    <>
      <SEO
        title="Newaygo MI Well Drilling | M&J Water Wells"
        description="Rotary well drilling and pump service in Newaygo County, MI. Call (616) 675-4875."
        canonicalUrl="/areas/newaygo"
        jsonLd={generateLocalBusinessSchema({
          pagePath: '/areas/newaygo',
          pageName: 'Newaygo Well Drilling',
        })}
      />

      {/* Hero Section with Background Parallax Layer */}
      <section className="relative overflow-hidden bg-gradient-to-br from-water-800 via-water-900 to-water-950 text-white py-14 sm:py-20">
        <ParallaxLayer speed={-0.12} className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        </ParallaxLayer>
        <Container>
          <FadeUp className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-water-700/60 border border-water-500/40 text-aqua text-xs font-bold font-condensed uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Newaygo County</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-condensed uppercase tracking-tight">
              {newaygoPageData.heading}
            </h1>

            <p className="text-base sm:text-lg text-water-100 font-normal">
              {newaygoPageData.line}
            </p>

            <div className="pt-2">
              <Button
                href={newaygoPageData.primaryCta.href}
                variant="white"
                size="lg"
                className="font-condensed font-bold uppercase tracking-wider shadow-lg"
              >
                <Phone className="w-5 h-5 fill-current" />
                <span>{newaygoPageData.primaryCta.text}</span>
              </Button>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* Towns Served & Summary Section */}
      <section className="py-14 sm:py-20 bg-white">
        <Container size="md">
          <FadeUp className="space-y-8 text-center">
            {/* Map Frame with Level A Depth Shadow & Perspective Tilt */}
            <TiltCard maxTilt={4} className="rounded-2xl shadow-xl shadow-water-900/10">
              <Card variant="accent" className="p-6 sm:p-8 bg-water-50/70 border-water-200">
                <p className="text-base sm:text-lg text-water-900 leading-relaxed font-medium">
                  {newaygoPageData.serviceSummary}
                </p>
              </Card>
            </TiltCard>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-water-900 font-condensed uppercase tracking-tight">
                {newaygoPageData.townsHeading}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                {newaygoPageData.towns.map((town) => (
                  <div
                    key={town}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-water-50 border border-water-100 text-water-800 text-sm font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 text-water-600 shrink-0" />
                    <span>{town}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-water-700 mb-3">
                Need immediate well repair or drilling in Newaygo?
              </p>
              <Button
                href={`tel:${siteData.phoneClean}`}
                variant="primary"
                size="lg"
                className="font-condensed font-bold uppercase tracking-wider shadow-md"
              >
                <Phone className="w-5 h-5 fill-current" />
                <span>{newaygoPageData.primaryCta.text}</span>
              </Button>
            </div>
          </FadeUp>
        </Container>
      </section>
    </>
  )
}
