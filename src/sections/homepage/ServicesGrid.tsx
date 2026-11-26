import { ArrowRight, Building2, Droplets, House, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContentText } from '@/components/content/ContentText'
import { HomeReveal } from '@/components/motion/HomeReveal'
import { resolveContent, siteContent } from '@/data/site'

const serviceIcons = [House, Building2, Settings, Droplets]

export function ServicesGrid() {
  const content = siteContent.homepage.services
  const cards = content.cards.filter((card) => resolveContent(card.image) && resolveContent(card.title))

  return (
    <section id="home-services" className="home-section home-services" aria-labelledby="home-services-title">
      <div className="home-container">
        <HomeReveal className="home-services__intro">
          <div>
            <p className="home-eyebrow"><ContentText field={content.eyebrow} /></p>
            <h2 id="home-services-title">
              <span><ContentText field={content.headingFirst} /></span>
              <span className="home-text-blue"><ContentText field={content.headingSecond} /></span>
            </h2>
            <p className="home-muted"><ContentText field={content.intro} /></p>
            <Link className="home-button home-button--outline" to="/services">
              <ContentText field={content.explore} /><ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </HomeReveal>
        <HomeReveal className="home-service-grid">
          {cards.map((card, index) => {
            const Icon = serviceIcons[index] ?? Droplets
            return (
              <Link className="home-service-card" to="/services" key={card.id}>
                <img
                  src={resolveContent(card.image) ?? ''}
                  alt={resolveContent(card.alt) ?? ''}
                  width="640"
                  height="420"
                  loading="lazy"
                />
                <span className="home-service-card__shade" aria-hidden="true" />
                <span className="home-service-card__icon"><Icon size={20} aria-hidden="true" /></span>
                <span className="home-service-card__copy">
                  <strong><ContentText field={card.title} /></strong>
                  <span><ContentText field={card.summary} /></span>
                </span>
                <span className="home-service-card__arrow" aria-hidden="true"><ArrowRight size={16} /></span>
              </Link>
            )
          })}
        </HomeReveal>
      </div>
    </section>
  )
}
