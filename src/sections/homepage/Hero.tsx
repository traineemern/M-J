import { ArrowDown, ArrowRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContentText } from '@/components/content/ContentText'
import { siteContent, resolveContent } from '@/data/site'

interface HeroProps {
  onWatchVideo: () => void
}

export function Hero({ onWatchVideo }: HeroProps) {
  const content = siteContent.homepage.hero

  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__image-wrap">
        <img
          className="home-hero__image"
          src={resolveContent(content.image) ?? ''}
          alt={resolveContent(content.imageAlt) ?? ''}
          width="1920"
          height="800"
          fetchPriority="high"
        />
      </div>
      <div className="home-hero__shade" aria-hidden="true" />
      <div className="home-container home-hero__inner">
        <div className="home-hero__copy">
          <p className="home-eyebrow"><ContentText field={content.eyebrow} /></p>
          <h1 id="home-hero-title" className="home-hero__title">
            <span><ContentText field={content.firstLine} /></span>
            <span className="home-text-blue"><ContentText field={content.secondLine} /></span>
          </h1>
          <p className="home-hero__description">
            <ContentText field={content.description} />
            <span className="home-hero__supporting"><ContentText field={content.supportingLine} /></span>
          </p>
          <div className="home-hero__actions">
            <Link to="/contact" className="home-button home-button--primary">
              <ContentText field={content.quoteCta} /><ArrowRight size={17} aria-hidden="true" />
            </Link>
            <button type="button" className="home-button home-button--play" onClick={onWatchVideo}>
              <span className="home-play-icon"><Play size={14} fill="currentColor" aria-hidden="true" /></span>
              <ContentText field={content.processCta} />
            </button>
          </div>
        </div>
        <a className="home-scroll-indicator" href="#home-services">
          <span><ArrowDown size={16} aria-hidden="true" /></span>
          <ContentText field={content.scrollLabel} />
        </a>
      </div>
    </section>
  )
}
