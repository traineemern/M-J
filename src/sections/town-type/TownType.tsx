import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { siteContent } from '@/data/site'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { Section } from '@/shared/components/Section'
import { Button } from '@/components/ui/Button'
import { DisplayHeading } from '@/components/typography/Typography'

export function TownType() {
  const towns = siteContent.areas.towns
    .filter(({ name }) => name.source !== 'verify')
    .map(({ name }) => name.value)
  const [active, setActive] = useState<string>(towns[0] ?? '')
  const { openEnquiry } = useEnquiry()

  return (
    <Section id="areas" className="night-town-type" label={siteContent.pages.labels.serviceArea.value}>
      <DisplayHeading
        level={2}
        lines={[siteContent.business.location.value, siteContent.areas.coverage.value]}
        className="night-town-type__heading"
      />
      <div className="night-town-type__names" role="group" aria-label={siteContent.pages.labels.selectServiceTown.value}>
        {towns.map((town) => (
          <button
            type="button"
            className={active === town ? 'is-active' : ''}
            key={town}
            onMouseEnter={() => setActive(town)}
            onFocus={() => setActive(town)}
            onClick={() => setActive(town)}
            aria-pressed={active === town}
          >
            <span>{town}</span>
          </button>
        ))}
      </div>
      <div className="night-town-type__selected">
        <div><span className="night-eyebrow">{siteContent.pages.labels.selectedArea.value}</span><strong>{active}</strong></div>
        <Button type="button" data-motion="magnetic" className="night-button" onClick={() => openEnquiry(undefined, active)}>
          {siteContent.pages.labels.requestQuote.value} <ArrowUpRight size={17} />
        </Button>
      </div>
    </Section>
  )
}
