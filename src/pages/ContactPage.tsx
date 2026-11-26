import { useState } from 'react'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { resolveContent, siteContent, siteData, serviceTowns } from '@/data/site'

import { EnquiryForm } from '@/features/enquiry/EnquiryForm'

export function ContactPage() {
  const [selectedTown, setSelectedTown] = useState('')
  const weekdays = resolveContent(siteContent.contact.businessHours.weekdays)
  const saturday = resolveContent(siteContent.contact.businessHours.saturday)

  return (
    <>
      <SEO
        title={siteContent.pages.contact.title.value}
        description={siteContent.pages.contact.description.value}
        canonicalUrl="/contact"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/contact', pageName: 'Contact' })}
      />
      <header className="contact-reference__page-heading">
        <p className="night-eyebrow">{siteContent.pages.contact.contactLabel.value}</p>
        <h1 id="contact-title">{siteContent.pages.contact.title.value}</h1>
      </header>

      <section className="contact-reference__cards" aria-label={siteContent.pages.contact.detailsLabel.value}>
        <article>
          <span className="contact-reference__card-icon"><MapPin size={20} aria-hidden="true" /></span>
          <div>
            <p className="night-eyebrow">{siteContent.pages.labels.addressHeading.value}</p>
            <address>{siteData.address.full}</address>
          </div>
        </article>
        <article>
          <span className="contact-reference__card-icon"><Phone size={20} aria-hidden="true" /></span>
          <div>
            <p className="night-eyebrow">{siteContent.pages.labels.phoneHeading.value}</p>
            <a href={`tel:${siteData.phoneClean}`}>{siteData.phone}</a>
          </div>
        </article>
        <article>
          <span className="contact-reference__card-icon"><Mail size={20} aria-hidden="true" /></span>
          <div>
            <p className="night-eyebrow">{siteContent.pages.labels.emailHeading.value}</p>
            <a href={`mailto:${siteData.email}`}>{siteData.email}</a>
          </div>
        </article>
      </section>

      <section className="contact-reference__content" aria-label={siteContent.pages.contact.contactAria.value}>
        <div className="contact-reference__form">
          <p className="night-eyebrow">{siteContent.pages.contact.projectLabel.value}</p>
          <h2>{siteContent.pages.contact.projectHeading.value}</h2>
          <p className="contact-reference__form-intro">{siteContent.contact.form.intro.value}</p>
          <EnquiryForm initialTown={selectedTown} source="contact_page" />
        </div>

        <aside className="contact-reference__area">
          <div className="contact-reference__area-heading">
            <p className="night-eyebrow">{siteContent.pages.contact.selectTown.value}</p>
            <h2>{siteContent.pages.contact.acrossWestMichigan.value}</h2>
            <p>{siteContent.pages.contact.mapLabel.value}</p>
          </div>
          <figure className="contact-area-diagram">
            <svg viewBox="0 0 640 300" role="img" aria-labelledby="contact-map-title contact-map-desc">
              <title id="contact-map-title">{siteContent.pages.labels.serviceArea.value}</title>
              <desc id="contact-map-desc">{siteContent.pages.contact.mapLabel.value}</desc>
              <path className="contact-area-diagram__land" d="M37 68 112 31l98 18 42-19 94 29 40-12 91 33 126-11 0 183H37Z" />
              <path className="contact-area-diagram__route" d="M109 192 208 129l111 48 93-83 128 50M208 129l72-72m39 120 43 75m50-158 27 131m101-81 33 67" />
              <circle className="contact-area-diagram__hub" cx="319" cy="177" r="13" />
              <circle className="contact-area-diagram__node" cx="109" cy="192" r="6" />
              <circle className="contact-area-diagram__node" cx="208" cy="129" r="6" />
              <circle className="contact-area-diagram__node" cx="391" cy="94" r="6" />
              <circle className="contact-area-diagram__node" cx="519" cy="144" r="6" />
              <circle className="contact-area-diagram__node" cx="362" cy="252" r="6" />
            </svg>
          </figure>
          <div className="contact-service-area__towns" aria-label={siteContent.pages.labels.selectServiceTown.value}>
            {serviceTowns.map((town) => (
              <button
                type="button"
                key={town}
                className={selectedTown === town ? 'is-selected' : ''}
                onClick={() => setSelectedTown(town)}
                aria-pressed={selectedTown === town}
              >
                {town}
              </button>
            ))}
          </div>
          {selectedTown && (
            <p className="contact-reference__selected-town" aria-live="polite">
              {selectedTown} <ArrowUpRight size={16} aria-hidden="true" />
            </p>
          )}
        </aside>
      </section>

      <section className="contact-reference__details" aria-label={siteContent.pages.contact.detailsLabel.value}>
        <div>
          <p className="night-eyebrow">{siteContent.pages.labels.hours.value}</p>
          {weekdays && <p>{weekdays}</p>}
          {saturday && <p>{saturday}</p>}
        </div>
        <div>
          <p className="night-eyebrow">{siteContent.pages.labels.payments.value}</p>
          <p>{siteContent.partners.payments.map((method) => method.value).join(' / ')}</p>
        </div>
      </section>
   
    </>
  )
}

export default ContactPage
