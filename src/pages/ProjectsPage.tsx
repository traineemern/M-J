import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowDownRight, ArrowUpRight, MapPin, Plus } from 'lucide-react'
import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { projectsPageData, showProjectSamples } from '@/data/projects'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { Button } from '@/components/ui/Button'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { motionConfig } from '@/lib/motion/config'
import { siteContent } from '@/data/site'

export function ProjectsPage() {
  const [category, setCategory] = useState(siteContent.pages.labels.categoryAll.value)
  const [openId, setOpenId] = useState<string | null>(null)
  const { openEnquiry } = useEnquiry()
  const reduced = useReducedMotion()
  const categories = [siteContent.pages.labels.categoryAll.value, ...projectsPageData.categories]
  const visibleProjects = projectsPageData.items.filter((project) => (
    category === siteContent.pages.labels.categoryAll.value || project.category === category
  ))

  return (
    <>
      <SEO
        title={siteContent.pages.projects.title.value}
        description={siteContent.pages.projects.description.value}
        canonicalUrl="/projects"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/projects', pageName: 'Projects' })}
      />
      <section className="projects-editorial-hero" aria-labelledby="projects-title">
        <div className="projects-editorial-hero__copy">
          <p className="night-eyebrow">{siteContent.pages.projects.heroEyebrow.value}</p>
          <h1 id="projects-title">
            <span>{siteContent.pages.projects.heroFirst.value}</span>
            <span className="night-outline">{siteContent.pages.projects.heroOutlined.value}</span>
          </h1>
          <p>{siteContent.pages.projects.intro.value}</p>
          <a href="#project-gallery" className="projects-editorial-hero__scroll">
            {siteContent.pages.labels.projectGallery.value} <ArrowDownRight size={18} aria-hidden="true" />
          </a>
        </div>
        <figure className="projects-editorial-hero__image">
          <img src="/images/homepage-hero-1920.webp" width="1920" height="1080" fetchPriority="high" alt="" />
        </figure>
        <span className="projects-editorial-hero__counter" aria-hidden="true">01—06</span>
      </section>

      <section className="projects-gallery" id="project-gallery" aria-labelledby="projects-gallery-title">
        <header className="projects-gallery__header">
          <div>
            <p className="night-eyebrow">{siteContent.pages.labels.projectLog.value}</p>
            <h2 id="projects-gallery-title">{siteContent.pages.projects.heading.value}</h2>
          </div>
          <p>{siteContent.pages.projects.intro.value}</p>
        </header>
        <div className="projects-gallery__filters" role="group" aria-label={siteContent.pages.projects.filterLabel.value}>
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? 'is-selected' : ''}
              aria-pressed={category === item}
              onClick={() => {
                setCategory(item)
                setOpenId(null)
              }}
            >
              {item}
            </button>
          ))}
        </div>
        {showProjectSamples && (
          <motion.div layout className="projects-masonry">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleProjects.map((project, index) => {
                const isOpen = openId === project.id
                return (
                  <motion.article
                    layout={!reduced}
                    key={project.id}
                    className={`project-tile project-tile--${index % 4}${isOpen ? ' is-open' : ''}`}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 1 } : { opacity: 0, y: -12 }}
                    transition={{ duration: reduced ? 0 : 0.3, ease: motionConfig.ui.expoOut }}
                  >
                    <div className="project-tile__image">
                      <img src={project.image} width="1200" height="900" loading="lazy" alt="" />
                      <span className="project-tile__category">{project.category}</span>
                    </div>
                    <div className="project-tile__content">
                      <p className="project-tile__location"><MapPin size={15} aria-hidden="true" />{project.location}</p>
                      <h3>{project.title}</h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`project-detail-${project.id}`}
                        aria-label={`${siteContent.pages.projects.projectDetails.value}: ${project.title}`}
                        onClick={() => setOpenId(isOpen ? null : project.id)}
                      >
                        {siteContent.pages.projects.projectDetails.value}
                        <Plus size={19} aria-hidden="true" />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`project-detail-${project.id}`}
                            className="project-tile__detail"
                            initial={reduced ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
                            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
                            exit={reduced ? { opacity: 1 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
                            transition={{ duration: reduced ? 0 : 0.3, ease: motionConfig.ui.expoOut }}
                          >
                            <p>{project.description}</p>
                            <p><span>{siteContent.pages.projects.clientLabel.value}</span>{project.client}</p>
                            <p><span>{siteContent.pages.projects.locationLabel.value}</span>{project.location}</p>
                            <Button type="button" className="night-button night-button--quiet" onClick={() => openEnquiry()}>
                              {siteContent.pages.labels.requestQuote.value} <ArrowUpRight size={16} aria-hidden="true" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </>
  )
}

export default ProjectsPage
