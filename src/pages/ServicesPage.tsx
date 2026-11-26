import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Drill,
  Droplet,
  Droplets,
  House,
  MapPin,
  MessageSquare,
  Play,
  Shovel,
  Tractor,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { nightRigServices } from '@/data/services'
import { servicesShowcaseData } from '@/data/services-showcase'
import { siteData, siteContent } from '@/data/site'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { motionConfig } from '@/lib/motion/config'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

const serviceIcons: Record<string, LucideIcon> = {
  home: House,
  building: Building2,
  tractor: Tractor,
  pump: Wrench,
  rehabilitation: Droplets,
  trenching: Shovel,
}

const processIcons: Record<string, LucideIcon> = {
  message: MessageSquare,
  map: MapPin,
  drill: Drill,
  droplet: Droplet,
  check: Check,
}

const fallbackServiceCards = nightRigServices.slice(0, 6).map((service, index) => ({
  title: service.title,
  icon: ['home', 'building', 'tractor', 'pump', 'rehabilitation', 'trenching'][index] ?? 'home',
  image: service.image,
  serviceIndex: index,
}))

export function ServicesPage() {
  const { openEnquiry } = useEnquiry()
  const reduced = useReducedMotion()
  const sampleCards = servicesShowcaseData.categories
  const cards = sampleCards.length ? sampleCards : fallbackServiceCards
  const testimonials = servicesShowcaseData.testimonials
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [paused, setPaused] = useState(false)
  const [overviewOpen, setOverviewOpen] = useState(false)

  useEffect(() => {
    if (reduced || paused || testimonials.length < 2) return
    const timer = window.setInterval(
      () => setActiveTestimonial((current) => (current + 1) % testimonials.length),
      motionConfig.marquee.quoteAutoplay,
    )
    return () => window.clearInterval(timer)
  }, [paused, reduced, testimonials.length])

  const moveTestimonial = (delta: number) => {
    setActiveTestimonial((current) => (current + delta + testimonials.length) % testimonials.length)
  }

  const activeQuote = testimonials[activeTestimonial]
  const featuredService = nightRigServices[0]

  return (
    <div className="services-reference">
      <SEO
        title={siteContent.pages.services.title.value}
        description={siteContent.pages.services.description.value}
        canonicalUrl="/services"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/services', pageName: 'Services' })}
      />

      <section className="services-reference__hero" aria-labelledby="services-title">
        <img
          className="services-reference__hero-image"
          src="/images/service-pump.webp"
          width="960"
          height="640"
          fetchPriority="high"
          alt=""
        />
        <div className="services-reference__hero-shade" aria-hidden="true" />
        <div className="services-reference__hero-copy">
          <p className="services-reference__eyebrow">{siteContent.pages.services.heroEyebrow.value}<span /></p>
          <h1 id="services-title">
            <span>{siteContent.pages.services.heroFirst.value}</span>
            <span>{siteContent.pages.services.heroOutlined.value}</span>
          </h1>
          <p className="services-reference__hero-intro">{siteContent.pages.services.description.value}</p>
          <div className="services-reference__hero-actions">
            <Button type="button" className="services-reference__button" onClick={() => openEnquiry('new well')}>
              {siteContent.pages.labels.requestQuote.value} <ArrowRight size={16} aria-hidden="true" />
            </Button>
            <button type="button" className="services-reference__watch" onClick={() => setOverviewOpen(true)}>
              <span><Play size={14} fill="currentColor" aria-hidden="true" /></span>
              {siteContent.pages.services.watchOverview.value}
            </button>
          </div>
        </div>
        <span className="services-reference__hero-index" aria-hidden="true">01 / 06</span>
      </section>

      <section className="services-reference__overview" id="service-list" aria-labelledby="services-overview-title">
        <div className="services-reference__overview-copy">
          <p className="services-reference__eyebrow">{siteContent.pages.services.heroEyebrow.value}<span /></p>
          <h2 id="services-overview-title">{siteContent.pages.services.sectionHeading.value}</h2>
          <p>{siteContent.pages.services.description.value}</p>
          <details className="services-reference__all-services">
            <summary>{siteContent.pages.services.exploreAll.value}<ArrowRight size={16} aria-hidden="true" /></summary>
            <ul>
              {nightRigServices.map((service) => (
                <li key={service.id}>
                  <span>{service.title}</span>
                  <button type="button" onClick={() => openEnquiry(service.enquiryService)}>
                    {siteContent.pages.labels.requestQuote.value}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        </div>
        <div className="services-reference__categories" aria-label={siteContent.pages.services.sectionHeading.value}>
          {cards.map((card, index) => {
            const Icon = serviceIcons[card.icon] ?? Drill
            const target = nightRigServices[card.serviceIndex]
            return (
              <button
                type="button"
                className="services-reference__category"
                key={`${card.title}-${index}`}
                onClick={() => openEnquiry(target?.enquiryService ?? 'new well')}
                aria-label={`${card.title}: ${siteContent.pages.labels.requestQuote.value}`}
              >
                <Icon size={34} strokeWidth={1.7} aria-hidden="true" />
                <span>{card.title}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="services-reference__featured" aria-labelledby="featured-service-title">
        <div className="services-reference__featured-copy">
          <p className="services-reference__eyebrow">
            {siteContent.pages.services.featuredEyebrow.value}
          </p>
          <h2 id="featured-service-title">{sampleCards[0]?.title ?? featuredService?.title}</h2>
          <p>{featuredService?.line || siteContent.pages.services.description.value}</p>
          {servicesShowcaseData.featuredBenefits.length > 0 && (
            <ul className="services-reference__benefits">
              {servicesShowcaseData.featuredBenefits.map((benefit) => (
                <li key={benefit}><CircleCheck size={17} fill="currentColor" aria-hidden="true" /><span>{benefit}</span></li>
              ))}
            </ul>
          )}
          <Button type="button" className="services-reference__button" onClick={() => openEnquiry(featuredService?.enquiryService ?? 'new well')}>
            {siteContent.pages.labels.requestQuote.value} <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
        <figure className="services-reference__featured-image">
          <img
            src={featuredService?.image || '/images/homepage-hero-960.webp'}
            width="960"
            height="640"
            loading="lazy"
            alt=""
          />
          <span className="services-reference__image-corner" aria-hidden="true" />
        </figure>
      </section>

      {servicesShowcaseData.process.steps.length > 0 && (
        <section className="services-reference__process" id="service-process" aria-labelledby="service-process-title">
          <p className="services-reference__eyebrow">{siteContent.pages.services.processEyebrow.value}<span /></p>
          <h2 id="service-process-title">{servicesShowcaseData.process.heading}</h2>
          <p className="services-reference__process-intro">{servicesShowcaseData.process.intro}</p>
          <ol className="services-reference__steps">
            {servicesShowcaseData.process.steps.map((step, index) => {
              const Icon = processIcons[step.icon] ?? Check
              return (
                <li key={step.title}>
                  <span className="services-reference__step-icon"><Icon size={22} aria-hidden="true" /></span>
                  {index < servicesShowcaseData.process.steps.length - 1 && <ArrowRight className="services-reference__step-arrow" size={18} aria-hidden="true" />}
                  <h3>{index + 1}. {step.title}</h3>
                  <p>{step.description}</p>
                </li>
              )
            })}
          </ol>
        </section>
      )}

      <section className="services-reference__why" aria-labelledby="services-why-title">
        <figure className="services-reference__why-image">
          <img
            src={servicesShowcaseData.whyChoose.image ?? '/images/service-commercial.webp'}
            width="960"
            height="640"
            loading="lazy"
            alt={servicesShowcaseData.whyChoose.imageAlt ?? ''}
          />
        </figure>
        <div className="services-reference__why-copy">
          <p className="services-reference__eyebrow">
            {siteContent.pages.services.whyEyebrow.value}<span />
          </p>
          <h2 id="services-why-title">{servicesShowcaseData.whyChoose.heading ?? siteContent.pages.about.valuesHeading.value}</h2>
          <p>{servicesShowcaseData.whyChoose.description ?? siteContent.business.description.value}</p>
          {servicesShowcaseData.whyChoose.bullets.length > 0 ? (
            <ul className="services-reference__why-list">
              {servicesShowcaseData.whyChoose.bullets.map((item) => (
                <li key={item}><CircleCheck size={16} fill="currentColor" aria-hidden="true" /><span>{item}</span></li>
              ))}
            </ul>
          ) : (
            <p className="services-reference__why-real">{siteContent.pages.services.capabilityStatement.value}</p>
          )}
          <Link className="services-reference__button" to="/about">
            {siteContent.pages.about.title.value} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="services-reference__stats" aria-label={siteContent.pages.labels.experience.value}>
          {servicesShowcaseData.whyChoose.stats.map((stat) => (
            <div className="services-reference__stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {activeQuote && (
        <section
          className="services-reference__testimonials"
          aria-labelledby="services-testimonials-title"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false)
          }}
        >
          <div className="services-reference__testimonial-backdrop" aria-hidden="true" />
          <div className="services-reference__testimonial-heading">
            <p className="services-reference__eyebrow">{siteContent.pages.services.testimonialsEyebrow.value}<span /></p>
            <h2 id="services-testimonials-title">{siteContent.pages.services.testimonialsHeading.value}</h2>
            <p>{siteContent.business.tagline.value}</p>
          </div>
          <div className="services-reference__testimonial-controls">
            <button type="button" onClick={() => moveTestimonial(-1)} aria-label={siteContent.pages.labels.previousTestimonial.value}>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <div className="services-reference__testimonial-card" role="group" aria-roledescription="slide">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="services-reference__testimonial-inner"
                  key={activeTestimonial}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 1 } : { opacity: 0, y: -12 }}
                  transition={{ duration: reduced ? 0 : motionConfig.duration.subtle, ease: motionConfig.ui.expoOut }}
                >
                  <img
                    src={activeQuote.image}
                    width="120"
                    height="120"
                    loading="lazy"
                    alt={activeQuote.imageAlt}
                  />
                  <div>
                    <p className="services-reference__quote">{activeQuote.quote}</p>
                    <p className="services-reference__quote-author">— {activeQuote.name}</p>
                    <p className="services-reference__quote-location">{activeQuote.location}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <button type="button" onClick={() => moveTestimonial(1)} aria-label={siteContent.pages.labels.nextTestimonial.value}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="services-reference__testimonial-dots" role="group" aria-label={siteContent.pages.labels.customerTestimonials.value}>
            {testimonials.map((testimonial, index) => (
              <button
                type="button"
                key={testimonial.name}
                className={index === activeTestimonial ? 'is-active' : ''}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`${siteContent.pages.labels.customerTestimonials.value} ${index + 1}`}
                aria-current={index === activeTestimonial}
              />
            ))}
          </div>
        </section>
      )}

      <section className="services-reference__closing" aria-labelledby="services-closing-title">
        <div className="services-reference__closing-shade" aria-hidden="true" />
        <div className="services-reference__closing-copy">
          <p className="services-reference__eyebrow">{siteContent.pages.labels.closingIndex.value}</p>
          <h2 id="services-closing-title">Ready to Get Started?</h2>
          <p>{siteContent.business.description.value}</p>
          <Button type="button" className="services-reference__button" onClick={() => openEnquiry()}>
            {siteContent.pages.labels.requestQuote.value} <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
        <a className="services-reference__closing-phone" href={`tel:${siteData.phoneClean}`}>
          <span>{siteContent.pages.labels.call.value}</span>
          {siteData.phone}
        </a>
      </section>
      <Modal
        isOpen={overviewOpen}
        onClose={() => setOverviewOpen(false)}
        title={siteContent.pages.services.watchOverview.value}
        className="services-video-modal"
      >
        <video className="services-video-modal__player" controls autoPlay playsInline preload="metadata" poster="/media/mj-drilling-poster.jpg">
          <source src="/media/mj-drilling.mp4" type="video/mp4" />
          <track kind="captions" src="/media/mj-drilling.vtt" srcLang="en" label="English" />
          {siteContent.pages.services.videoFallback.value}
        </video>
      </Modal>
    </div>
  )
}

export default ServicesPage
