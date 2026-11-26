import { useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ContentText } from '@/components/content/ContentText'
import { HomeReveal } from '@/components/motion/HomeReveal'
import { resolveContent, siteContent } from '@/data/site'

export function ProjectsCarousel() {
  const content = siteContent.homepage.projects
  const viewportRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const projects = content.photos.flatMap((item) => {
    const image = resolveContent(item.image)
    const title = resolveContent(item.title)
    const alt = resolveContent(item.alt)
    return image && title && alt ? [{ ...item, image, title, alt, titleField: item.title }] : []
  })

  function goTo(index: number) {
    const viewport = viewportRef.current
    const card = viewport?.children.item(index) as HTMLElement | null
    if (!viewport || !card) return
    viewport.scrollTo({ left: card.offsetLeft - viewport.offsetLeft, behavior: 'smooth' })
    setActive(index)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(Math.min(projects.length - 1, active + 1))
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(Math.max(0, active - 1))
    }
  }

  if (!projects.length) return null

  return (
    <section className="home-section home-projects" aria-labelledby="home-projects-title">
      <div className="home-container">
        <HomeReveal className="home-projects__header">
          <div>
            <p className="home-eyebrow"><ContentText field={content.eyebrow} /></p>
            <h2 id="home-projects-title"><ContentText field={content.heading} /></h2>
            <p className="home-muted"><ContentText field={content.intro} /></p>
          </div>
        </HomeReveal>
        <HomeReveal className="home-projects__carousel-reveal">
          <div
            className="home-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label={resolveContent(siteContent.homepage.labels.carousel) ?? ''}
            tabIndex={0}
            onKeyDown={onKeyDown}
          >
            <div className="home-carousel__viewport" ref={viewportRef}>
              {projects.map((project, index) => (
                <article
                  className="home-project-card"
                  key={project.title}
                  role="group"
                  aria-roledescription={resolveContent(content.slideLabel) ?? ''}
                  aria-label={(resolveContent(siteContent.homepage.labels.projectSlidePosition) ?? '')
                    .replace('{index}', String(index + 1))
                    .replace('{total}', String(projects.length))
                    .replace('{title}', project.title)}
                >
                  <div>
                    <span
                      className="home-project-card__image"
                      role="img"
                      aria-label={project.alt}
                      style={{
                        backgroundImage: `url("${project.image}")`,
                        backgroundPosition: `${project.x}% ${project.y}%`,
                      }}
                    />
                    <span className="home-project-card__title"><ContentText field={project.titleField} /></span>
                  </div>
                </article>
              ))}
            </div>
            <div className="home-carousel__controls">
              <button type="button" onClick={() => goTo(Math.max(0, active - 1))} aria-label={resolveContent(content.previous) ?? ''} disabled={active === 0}>
                <ArrowLeft size={17} aria-hidden="true" />
              </button>
              <div className="home-carousel__dots" aria-label={resolveContent(siteContent.homepage.labels.dot) ?? ''}>
                {projects.map((project, index) => (
                  <button
                    type="button"
                    key={project.title}
                    className={index === active ? 'is-active' : ''}
                    aria-label={(resolveContent(siteContent.homepage.labels.projectDotPosition) ?? '')
                      .replace('{index}', String(index + 1))}
                    aria-current={index === active ? 'true' : undefined}
                    onClick={() => goTo(index)}
                  >
                    <span className="sr-only">{project.title}</span>
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => goTo(Math.min(projects.length - 1, active + 1))} aria-label={resolveContent(content.next) ?? ''} disabled={active === projects.length - 1}>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        </HomeReveal>
      </div>
    </section>
  )
}
