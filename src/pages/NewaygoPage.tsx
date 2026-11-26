import { ArrowUpRight } from 'lucide-react'
import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { newaygoPageData } from '@/data/newaygo'
import { InnerPageHero } from '@/sections/hero/InnerPageHero'
import { CtaBand } from '@/sections/homepage/CtaBand'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { Button } from '@/components/ui/Button'
import { DisplayHeading } from '@/components/typography/Typography'
import { siteContent } from '@/data/site'

export function NewaygoPage() {
  const { openEnquiry } = useEnquiry()

  return (
    <>
      <SEO
        title={siteContent.pages.newaygo.title.value}
        description={siteContent.pages.newaygo.description.value}
        canonicalUrl="/areas/newaygo"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/areas/newaygo', pageName: 'Newaygo Area' })}
      />
      <InnerPageHero
        variant="newaygo"
        firstLine={siteContent.pages.newaygo.heroFirst.value}
        outlinedLine={siteContent.pages.newaygo.heroOutlined.value}
        description={newaygoPageData.line}
        town={siteContent.business.address.city.value}
        service="new well"
        actionLabel={siteContent.pages.newaygo.requestQuote.value}
      />
      <section className="area-town-block" aria-labelledby="area-town-title">
        <p className="night-eyebrow">{siteContent.pages.newaygo.areaLabel.value}</p>
        <DisplayHeading id="area-town-title" level={2} lines={[newaygoPageData.heading]} />
        <p className="area-town-block__copy" data-motion="subtle">{newaygoPageData.serviceSummary}</p>
        <div className="area-town-block__towns" data-motion="gallery">
          {newaygoPageData.towns.map((town, index) => (
            <span data-motion-item key={town}>
              <i>{String(index + 1).padStart(2, '0')}</i>{town}
            </span>
          ))}
          <span className="area-town-block__region">{siteContent.pages.newaygo.acrossWestMichigan.value}</span>
        </div>
        <Button type="button" data-motion="magnetic" className="night-button" onClick={() => openEnquiry('new well', siteContent.business.address.city.value)}>
          {siteContent.pages.newaygo.requestQuote.value} <ArrowUpRight size={17} />
        </Button>
      </section>
      <CtaBand />
    </>
  )
}

export default NewaygoPage
