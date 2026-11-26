import { ArrowRight, Check, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContentText } from '@/components/content/ContentText'
import { HomeReveal } from '@/components/motion/HomeReveal'
import { resolveContent, siteContent } from '@/data/site'

export function WhyChooseUs({ onWatchVideo }: { onWatchVideo: () => void }) {
  const content = siteContent.homepage.whyUs
  const checklist = content.checklist.filter((item) => resolveContent(item.label) !== undefined)

  return (
    <section className="home-section home-why" aria-labelledby="home-why-title">
      <HomeReveal className="home-container home-why__grid">
        <button type="button" className="home-work-panel" onClick={onWatchVideo}>
          <img
            src={resolveContent(content.workImage) ?? ''}
            alt={resolveContent(content.workImageAlt) ?? ''}
            width="960"
            height="640"
            loading="lazy"
          />
          <span className="home-work-panel__shade" aria-hidden="true" />
          <span className="home-work-panel__play"><Play size={19} fill="currentColor" aria-hidden="true" /></span>
          <span className="home-work-panel__copy">
            <strong><ContentText field={content.workTitle} /></strong>
            <span><ContentText field={content.workSubtitle} /></span>
          </span>
        </button>
        <div className="home-why__copy">
          <p className="home-eyebrow"><ContentText field={content.eyebrow} /></p>
          <h2 id="home-why-title">
            <span><ContentText field={content.headingFirst} /></span>
            <span className="home-text-blue"><ContentText field={content.headingLast} /></span>
          </h2>
          <p className="home-muted"><ContentText field={content.description} /></p>
          <ul className="home-checklist">
            {checklist.map((item, index) => (
              <li key={index}><Check size={15} aria-hidden="true" /><ContentText field={item.label} /></li>
            ))}
          </ul>
          <Link className="home-button home-button--outline" to="/about">
            <ContentText field={content.aboutCta} /><ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <aside className="home-map-card">
          <svg className="home-map-card__map" viewBox="0 0 220 210" role="img" aria-label={resolveContent(content.mapAlt) ?? ''}>
            <defs>
              <pattern id="home-map-dots" width="7" height="7" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.25" fill="currentColor" />
              </pattern>
            </defs>
            <path
              d="M92 11 109 18 115 30 126 36 130 52 143 57 149 73 163 79 168 95 183 103 184 116 176 129 171 144 161 155 150 163 140 178 130 188 123 181 121 166 111 156 108 142 97 132 94 118 83 105 81 90 72 77 73 61 80 48 78 35 87 27Z"
              fill="url(#home-map-dots)"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="2 4"
            />
            <circle className="home-map-card__pin-halo" cx="113" cy="116" r="14" />
            <circle className="home-map-card__pin" cx="113" cy="116" r="5" />
          </svg>
          <div className="home-map-card__copy">
            <strong><ContentText field={content.mapTitle} /></strong>
            <span><ContentText field={content.mapTownLine} /></span>
          </div>
          <span className="home-map-card__location"><span aria-hidden="true" /> <ContentText field={content.mapPinLabel} /></span>
        </aside>
      </HomeReveal>
    </section>
  )
}
