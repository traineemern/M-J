import { siteContent } from '@/data/site'
import { Marquee } from '@/shared/components/Marquee'

const capabilities = [siteContent.services[0].title.value, ...siteContent.partners.brands.map((brand) => brand.value)]

export function CapabilityMarquee() {
  return (
    <section className="capability-band" aria-label={siteContent.pages.labels.capabilityLabel.value}>
      <p className="night-eyebrow">{siteContent.pages.labels.methodsEquipment.value}</p>
      <Marquee className="capability-marquee" label={siteContent.pages.labels.capabilityLabel.value}>
        {capabilities.map((item) => <span key={item}>{item}</span>)}
      </Marquee>
    </section>
  )
}
