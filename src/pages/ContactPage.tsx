import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { ContactForm } from '@/features/contact/ContactForm'
import { Phone, MapPin, Clock, Droplet } from 'lucide-react'
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
      <section className="contact-art-section relative min-h-[calc(100svh-5rem)] overflow-hidden py-14 sm:py-20">
        <Container>
          <div className="grid min-h-[65vh] grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="order-2 lg:order-1">
              <ContactForm id="contact-form" title="" subtitle="" className="mx-auto max-w-xl" />
            </div>
            <div className="contact-art-copy order-1 mx-auto max-w-lg lg:order-2">
              <div className="contact-art-outline">
                <h1 className="contact-art-title"><span>Contact</span><span className="contact-art-title-last"><i aria-hidden="true" />Us</span></h1>
              </div>
              <p className="mt-8 max-w-sm text-sm leading-relaxed text-slate-300 sm:ml-16">
                It is important for us to keep in touch with you. We are ready to answer questions about your well, pump, or project. Tell us what you need and our family team will follow up.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300 sm:ml-16">
                <a className="inline-flex items-center gap-2 hover:text-cyan-200" href={`tel:${contactPageData.phoneClean}`}><Phone className="size-4" />{contactPageData.phone}</a>
                <span className="inline-flex items-center gap-2"><MapPin className="size-4" />{contactPageData.address}</span>
                <span className="inline-flex items-center gap-2"><Clock className="size-4" />Family-owned, free estimates</span>
              </div>
              <Droplet className="contact-art-drop" aria-hidden="true" />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

export default ContactPage
