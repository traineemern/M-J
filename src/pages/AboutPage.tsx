import { ArrowDown, ArrowRight, Droplets, MapPin, Users, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContentText } from '@/components/content/ContentText'
import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { resolveContent, siteContent } from '@/data/site'


const valueIcons = [Users, MapPin, Wrench]

export function AboutPage() {
  const content = siteContent.pages.about
  const values = content.showcaseValues.filter((item) => resolveContent(item.title) !== undefined)

  return (
    <>
      <SEO
        title={content.title.value}
        description={content.description.value}
        canonicalUrl="/about"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/about', pageName: 'About M&J' })}
      />
      <section className="about-showcase-hero" aria-labelledby="about-title">
        <img
          src={resolveContent(content.showcaseImage) ?? ''}
          alt={resolveContent(content.showcaseImageAlt) ?? ''}
          width="1024"
          height="576"
          fetchPriority="high"
        />
        <div className="about-showcase-hero__shade" aria-hidden="true" />
        <div className="about-showcase-hero__copy">
          <p className="home-eyebrow"><ContentText field={content.showcaseEyebrow} /></p>
          <h1 id="about-title">
            <span><ContentText field={content.showcaseTitleFirst} /></span>
            <span className="home-text-blue"><ContentText field={content.showcaseTitleSecond} /></span>
          </h1>
          <p><ContentText field={content.showcaseIntro} /></p>
          <a className="home-button home-button--primary" href="#about-story">
            <ContentText field={content.showcaseCta} /><ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="about-showcase-story" id="about-story" aria-labelledby="about-story-title">
        <div className="about-showcase-story__copy">
          <p className="home-eyebrow"><ContentText field={content.showcaseStoryEyebrow} /></p>
          <h2 id="about-story-title"><ContentText field={content.showcaseStoryTitle} /></h2>
          <p><ContentText field={content.showcaseStory} /></p>
          <Link className="home-button home-button--primary" to="/services">
            <ContentText field={siteContent.pages.services.title} /><ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="about-showcase-values">
          {values.map((item, index) => {
            const Icon = valueIcons[index] ?? Droplets
            return (
              <article key={index}>
                <Icon size={25} aria-hidden="true" />
                <h3><ContentText field={item.title} /></h3>
                <p><ContentText field={item.line} /></p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="about-showcase-why" aria-labelledby="about-why-title">
        <div className="about-showcase-why__copy">
          <p className="home-eyebrow"><ContentText field={content.showcaseWhyEyebrow} /></p>
          <h2 id="about-why-title"><ContentText field={content.showcaseWhyTitle} /></h2>
          <p><ContentText field={content.showcaseWhyIntro} /></p>
          <ul>
            <li><Users size={15} aria-hidden="true" /><ContentText field={content.showcaseValues[0].title} /></li>
            <li><Wrench size={15} aria-hidden="true" /><ContentText field={content.showcaseValues[2].title} /></li>
            <li><MapPin size={15} aria-hidden="true" /><ContentText field={siteContent.business.location} /></li>
          </ul>
        </div>
        <img
          src={resolveContent(content.showcaseWhyImage) ?? ''}
          alt={resolveContent(content.showcaseWhyImageAlt) ?? ''}
          width="665"
          height="768"
          loading="lazy"
        />
      </section>
   
    </>
  )
}

export default AboutPage
