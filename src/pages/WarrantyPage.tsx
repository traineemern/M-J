import { ArrowUpRight } from 'lucide-react'
import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { warrantyPageData } from '@/data/warranty'
import { InnerPageHero } from '@/sections/hero/InnerPageHero'
import { CtaBand } from '@/sections/homepage/CtaBand'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { Button } from '@/components/ui/Button'
import { resolveContent, siteContent } from '@/data/site'

export function WarrantyPage() {
  const { openEnquiry } = useEnquiry()

  return (
    <>
      <SEO
        title={siteContent.pages.warranty.title.value}
        description={siteContent.pages.warranty.description.value}
        canonicalUrl="/warranty"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/warranty', pageName: 'Warranty' })}
      />
      <InnerPageHero
        variant="warranty"
        firstLine={siteContent.pages.warranty.heroFirst.value}
        outlinedLine={resolveContent(siteContent.pages.warranty.heroOutlined) ?? ''}
        description={warrantyPageData.intro}
      />
      <section className="warranty-promises" data-motion="stagger" aria-label={siteContent.pages.warranty.sectionLabel.value}>
        {warrantyPageData.promises.map((promise, index) => (
          <article className="warranty-promise" data-motion-item key={promise.id}>
            <span className="warranty-promise__number">{String(index + 1).padStart(2, '0')}</span>
            <h2>{promise.title}</h2>
            <p>{promise.line}</p>
            <span className="warranty-promise__mark" aria-hidden="true">+</span>
          </article>
        ))}
      </section>
      <section className="warranty-terms">
        {warrantyPageData.termsAccordion.content && (
          <details>
            <summary>
              <span>{warrantyPageData.termsAccordion.title}</span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </summary>
            <div>{warrantyPageData.termsAccordion.content}</div>
          </details>
        )}
        <Button type="button" data-motion="magnetic" className="night-button" onClick={() => openEnquiry()}>
          {warrantyPageData.primaryCta.text} <ArrowUpRight size={16} />
        </Button>
      </section>
      <CtaBand />
    </>
  )
}

export default WarrantyPage
