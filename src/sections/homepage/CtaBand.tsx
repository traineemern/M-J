import { Droplets, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContentText } from '@/components/content/ContentText'
import { siteContent, siteData } from '@/data/site'

export function CtaBand() {
  const content = siteContent.homepage.cta
  return (
    <section className="home-cta-band" aria-labelledby="home-cta-title">
      <div className="home-container home-cta-band__inner">
        <div className="home-cta-band__copy">
          <Droplets size={26} aria-hidden="true" />
          <div>
            <h2 id="home-cta-title"><ContentText field={content.heading} /></h2>
            <p><ContentText field={content.intro} /></p>
          </div>
        </div>
        <Link className="home-button home-button--primary" to="/contact">
          <ContentText field={siteContent.homepage.hero.quoteCta} />
        </Link>
        <div className="home-cta-band__contacts">
          <a href={`tel:${siteData.phoneClean}`}><Phone size={17} aria-hidden="true" /><span><ContentText field={content.phoneLabel} /><strong>{siteData.phone}</strong></span></a>
          <a href={`mailto:${siteData.email}`}><Mail size={17} aria-hidden="true" /><span><ContentText field={content.emailLabel} /><strong>{siteData.email}</strong></span></a>
          <Link to="/contact"><MapPin size={17} aria-hidden="true" /><span><ContentText field={content.locationLabel} /><strong><ContentText field={siteContent.business.location} /></strong></span></Link>
        </div>
      </div>
    </section>
  )
}
