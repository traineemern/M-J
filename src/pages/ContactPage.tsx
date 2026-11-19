import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { ContactForm } from '@/features/contact/ContactForm'
import { Phone, MapPin, Clock } from 'lucide-react'
import { FadeUp } from '@/components/motion/FadeUp'
import { contactPageData } from '@/data/contact'

export function ContactPage() {
  return (
    <>
      <SEO
        title="Contact Us | M&J Water Wells in Casnovia, MI"
        description="Contact M&J Water Wells for a free estimate or emergency pump service in Casnovia and West Michigan. Call (616) 675-4875."
        canonicalUrl="/contact"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/contact', pageName: 'Contact' })}
      />

      {/* Page Hero */}
      <section className="bg-gradient-to-b from-water-700 to-water-900 text-white py-12 sm:py-16">
        <Container>
          <FadeUp className="max-w-xl text-center sm:text-left">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-condensed uppercase">
              {contactPageData.heading}
            </h1>
            <p className="mt-2 text-base text-water-100 font-sans">
              {contactPageData.line}
            </p>
          </FadeUp>
        </Container>
      </section>

      {/* Contact Details & Form */}
      <section className="py-12 sm:py-18 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Direct Info Cards */}
            <div className="lg:col-span-5 space-y-4">
              <Card variant="interactive" className="border-t-4 border-t-water-600 p-5 bg-water-50/40">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-water-100 text-water-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-water-900 text-base font-condensed uppercase">Phone</h2>
                    <a
                      href={`tel:${contactPageData.phoneClean}`}
                      className="text-2xl font-black text-water-700 hover:text-water-900 transition-colors font-condensed"
                    >
                      {contactPageData.phone}
                    </a>
                  </div>
                </div>
              </Card>

              <Card variant="default" className="p-5 bg-white border border-water-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-water-100 text-water-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-water-900 text-base font-condensed uppercase">Address</h2>
                    <p className="text-sm text-water-800 font-sans mt-0.5">{contactPageData.address}</p>
                  </div>
                </div>
              </Card>

              <Card variant="default" className="p-5 bg-white border border-water-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-water-100 text-water-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-water-900 text-base font-condensed uppercase">Hours</h2>
                    <p className="text-sm text-water-800 font-sans mt-0.5">{contactPageData.hours}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm id="contact-form" />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

export default ContactPage
