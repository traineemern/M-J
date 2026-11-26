import { useState, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { ContentText } from '@/components/content/ContentText'
import { HomeReveal } from '@/components/motion/HomeReveal'
import { resolveContent, siteContent } from '@/data/site'

export function Testimonials() {
  const content = siteContent.homepage.testimonials
  const slides = content.reviews.flatMap((review) => {
    const quote = resolveContent(review.quote)
    const name = resolveContent(review.name)
    const town = resolveContent(review.town)
    const rating = resolveContent(review.rating)
    const image = resolveContent(review.image)
    const imageAlt = resolveContent(review.imageAlt)
    return quote && name && town && rating && image && imageAlt
      ? [{ review, quote, name, town, rating, image, imageAlt }]
      : []
  })
  const [active, setActive] = useState(0)

  function goTo(index: number) {
    setActive(Math.min(slides.length - 1, Math.max(0, index)))
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(active + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(active - 1)
    }
  }

  if (!slides.length) return null

  const current = slides[active]
  const googleProfileUrl = resolveContent(content.googleProfileUrl)

  return (
    <section
      className="home-section home-testimonials"
      aria-labelledby="home-testimonials-title"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <HomeReveal className="home-container home-testimonials__grid">
        <div className="home-testimonials__intro">
          <p className="home-eyebrow"><ContentText field={content.eyebrow} /></p>
          <h2 id="home-testimonials-title"><ContentText field={content.heading} /></h2>
          <p className="home-muted"><ContentText field={content.intro} /></p>
          {googleProfileUrl && (
            <a className="home-button home-button--outline" href={googleProfileUrl} target="_blank" rel="noreferrer">
              <ContentText field={content.readMore} /><ArrowRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
        <article
          className="home-testimonial-card"
          key={current.review.id}
          role="group"
          aria-roledescription="slide"
          aria-label={(resolveContent(content.slidePosition) ?? '')
            .replace('{index}', String(active + 1))
            .replace('{total}', String(slides.length))
            .replace('{name}', current.name)}
        >
          <span className="home-testimonial-card__quote-mark" aria-hidden="true">“</span>
          <blockquote><ContentText field={current.review.quote} /></blockquote>
          <div className="home-testimonial-card__rating" aria-label={(resolveContent(content.ratingAria) ?? '').replace('{rating}', String(current.rating))}>
            {Array.from({ length: Math.min(current.rating, 5) }, (_, index) => <Star key={index} size={16} fill="currentColor" aria-hidden="true" />)}
            <ContentText field={current.review.rating} />
          </div>
          <p className="home-testimonial-card__byline">
            <strong><ContentText field={current.review.name} /></strong>
            <span><ContentText field={current.review.town} /></span>
          </p>
          <div className="home-testimonial-card__controls">
            <button type="button" onClick={() => goTo(active - 1)} aria-label={resolveContent(content.previous) ?? ''} disabled={active === 0}>
              <ArrowLeft size={17} aria-hidden="true" />
            </button>
            <div className="home-testimonial-card__pagination">
              <span><ContentText field={siteContent.pages.labels.customerTestimonials} /></span>
              <div className="home-testimonial-card__dots">
                {slides.map((slide, index) => (
                  <button
                    type="button"
                    key={slide.review.id}
                    className={index === active ? 'is-active' : ''}
                    aria-label={(resolveContent(content.dot) ?? '').replace('{index}', String(index + 1))}
                    aria-current={index === active ? 'true' : undefined}
                    onClick={() => goTo(index)}
                  />
                ))}
              </div>
            </div>
            <button type="button" onClick={() => goTo(active + 1)} aria-label={resolveContent(content.next) ?? ''} disabled={active === slides.length - 1}>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </article>
        <div className="home-testimonials__image">
          <img
            key={current.review.id}
            className="home-testimonials__photo"
            src={current.image}
            alt={current.imageAlt}
            width="480"
            height="360"
            loading="lazy"
            decoding="async"
          />
        </div>
      </HomeReveal>
    </section>
  )
}
