import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { nightRigServices } from '@/data/services'
import { siteContent } from '@/data/site'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { Section } from '@/shared/components/Section'
import { DisplayHeading } from '@/components/typography/Typography'
import { SurfaceDiorama } from '@/features/diorama/SurfaceDiorama'

export function StickyServices() {
  const [active, setActive] = useState(0)
  const { openEnquiry } = useEnquiry()
  const activeService = nightRigServices[active] ?? nightRigServices[0]

  return (
    <Section id="services" className="night-services">
      <div className="night-services__heading">
        <p className="night-eyebrow">{siteContent.pages.labels.serviceIndexHome.value}</p>
        <DisplayHeading level={2} lines={[siteContent.pages.home.serviceHeading.value]} />
      </div>
      <div className="night-services__split">
        <div className="night-service-list">
          {nightRigServices.map((service, index) => (
            <article
              key={service.id}
              data-index={index}
              className={`night-service-row${active === index ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              <button type="button" onClick={() => setActive(index)} aria-pressed={active === index}>
                <span className="night-service-row__number">{String(index + 1).padStart(2, '0')}</span>
                <span className="night-service-row__copy">
                  <strong>{service.title}</strong>
                  {service.line && <span>{service.line}</span>}
                </span>
                <ArrowUpRight size={19} aria-hidden="true" />
              </button>
              <div className="night-service-row__mobile-media">
                <img src="/images/diorama-poster.webp" width="1280" height="850" loading="lazy" alt={siteContent.business.name.value} />
                <button type="button" onClick={() => openEnquiry(service.enquiryService)}>
                {siteContent.pages.labels.askAQuestion.value}
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="night-service-display" aria-live="polite">
          <SurfaceDiorama className="night-service-display__diorama" />
          <div className="night-service-display__caption">
            <span>{String(active + 1).padStart(2, '0')}</span>
            <strong>{activeService.title}</strong>
            <button type="button" onClick={() => openEnquiry(activeService.enquiryService)}>
              {siteContent.pages.labels.enquire.value} <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </Section>
  )
}
