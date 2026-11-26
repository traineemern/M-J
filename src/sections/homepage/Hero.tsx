import { useRef, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowRight, MapPin, Play } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ContentText } from '@/components/content/ContentText'
import { siteContent, resolveContent } from '@/data/site'

interface HeroProps {
  onWatchVideo: () => void
}

export function Hero({ onWatchVideo }: HeroProps) {
  const content = siteContent.homepage.hero
  const [zip, setZip] = useState('')
  const [zipError, setZipError] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  function submitZip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^\d{5}$/.test(zip)) {
      setZipError(true)
      inputRef.current?.focus()
      return
    }

    setZipError(false)
    // This forwards the ZIP to Contact only; live availability requires backend work.
    navigate(`/contact?zip=${encodeURIComponent(zip)}`)
  }

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
        <aside className="home-availability glass-panel" aria-labelledby="availability-heading">
          <h2 id="availability-heading"><MapPin size={19} aria-hidden="true" /><ContentText field={content.availabilityTitle} /></h2>
          <form onSubmit={submitZip} noValidate>
            <label className="sr-only" htmlFor="availability-zip"><ContentText field={content.zipLabel} /></label>
            <input
              ref={inputRef}
              id="availability-zip"
              name="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              pattern="[0-9]{5}"
              placeholder={resolveContent(content.zipPlaceholder) ?? ''}
              value={zip}
              onChange={(event) => {
                setZip(event.target.value.replace(/\D/g, '').slice(0, 5))
                setZipError(false)
              }}
              aria-invalid={zipError}
              aria-describedby={zipError ? 'availability-zip-error' : undefined}
            />
            <button type="submit" aria-label={resolveContent(content.zipSubmit) ?? undefined}>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </form>
          {zipError && <p id="availability-zip-error" className="home-form-error"><ContentText field={siteContent.homepage.labels.zipError} /></p>}
          <p className="home-availability__serving"><span aria-hidden="true" /><ContentText field={content.servingLine} /></p>
        </aside>
        <a className="home-scroll-indicator" href="#home-services">
          <span><ArrowDown size={16} aria-hidden="true" /></span>
          <ContentText field={content.scrollLabel} />
        </a>
      </div>
    </section>
  )
}
