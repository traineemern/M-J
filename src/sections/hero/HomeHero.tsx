import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { resolveContent, serviceTowns, siteContent, siteData } from '@/data/site'
import { Button } from '@/components/ui/Button'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { HeroMedia } from '@/shared/features/hero-media/HeroMedia'
import { MonoLabel } from '@/components/typography/Typography'

export function Hero() {
  const { openEnquiry } = useEnquiry()
  return (
    <header id="top" className="night-hero">
      <div className="night-hero__media">
        <div className="night-hero__parallax"><HeroMedia /></div>
      </div>
      <div className="night-hero__shade" aria-hidden="true" />
      <div className="night-hero__topline">
        <MonoLabel>{siteContent.business.name.value.toUpperCase()}</MonoLabel>
        <MonoLabel>{siteContent.business.location.value.toUpperCase()}</MonoLabel>
      </div>
      <div className="night-hero__content">
        <p className="night-kicker">{siteContent.pages.home.kicker.value}</p>
        <h1 id="home-hero-title" className="night-hero__title">
          {siteContent.pages.home.heroLines.map((line, index) => (
            <span className={index === 1 ? 'night-outline' : ''} key={line.value}>{resolveContent(line)}</span>
          ))}
        </h1>
        <p className="night-hero__intro">{siteContent.business.description.value}</p>
        <div className="night-hero__actions">
          <Button type="button" className="night-button" onClick={() => openEnquiry()}>{siteContent.pages.labels.freeEstimate.value} <ArrowUpRight size={17} /></Button>
          <Button href={`tel:${siteData.phoneClean}`} variant="secondary" className="night-button night-button--quiet">{siteContent.pages.labels.call.value} {siteData.phone}</Button>
        </div>
      </div>
      <div className="night-hero__bottom">
        <a href="#expertise"><ArrowDown size={16} /> {siteContent.pages.home.sectionHeading.value}</a>
        <div className="night-town-ticker" aria-label={siteContent.pages.labels.serviceTowns.value}>
          {serviceTowns.map((town) => <span key={town}>{town}</span>)}
          <span>{siteContent.pages.home.acrossWestMichigan.value}</span>
        </div>
        <span className="night-hero__serial">MJ / WM — 01</span>
      </div>
    </header>
  )
}
