import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { DisplayHeading, Lede } from '@/components/typography/Typography'
import { siteContent } from '@/data/site'

interface InnerPageHeroProps {
  variant: 'services' | 'about' | 'faq' | 'contact' | 'warranty' | 'newaygo'
  firstLine: string
  outlinedLine: string
  description: string
  town?: string
  service?: string
  actionLabel?: string
}

export function InnerPageHero({
  variant,
  firstLine,
  outlinedLine,
  description,
  town,
  service,
  actionLabel = siteContent.pages.labels.freeEstimate.value,
}: InnerPageHeroProps) {
  const { openEnquiry } = useEnquiry()
  return (
    <section
      className={`inner-page-hero inner-page-hero--${variant}`}
      data-page-hero={variant}
      aria-labelledby="inner-page-title"
    >
      <div className="inner-page-hero__media" data-motion="hero-media" aria-hidden="true">
        <div className="inner-page-hero__parallax" data-motion="parallax">
          <img
            src="/media/hero-poster.webp"
            width="1920"
            height="1080"
            loading="eager"
            alt=""
          />
        </div>
      </div>
      <div className="inner-page-hero__shade" aria-hidden="true" />
      <div className="inner-page-hero__content" data-motion="hero-text">
        <p className="night-eyebrow">{siteContent.business.name.value.toUpperCase()} / {siteContent.business.location.value.toUpperCase()}</p>
        <DisplayHeading
          id="inner-page-title"
          level={1}
          lines={[firstLine, outlinedLine]}
          outlinedLine={1}
          motionPreset="hero-chars"
          fit
          fitRatio={0.2}
          className="inner-page-hero__title"
        />
        <Lede className="inner-page-hero__description" data-motion="subtle">{description}</Lede>
        <Button
          type="button"
          data-motion="magnetic"
          className="night-button"
          onClick={() => openEnquiry(service, town)}
        >
          {actionLabel} <ArrowUpRight size={17} />
        </Button>
      </div>
    </section>
  )
}
