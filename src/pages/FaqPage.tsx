import { useMemo, useState } from 'react'
import { ArrowRight, CircleHelp, Drill, MapPin, Tag, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContentText } from '@/components/content/ContentText'
import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { resolveContent, siteContent } from '@/data/site'

const categoryIcons = [CircleHelp, Drill, Tag, Wrench, MapPin]

export function FaqPage() {
  const content = siteContent.pages.faq
  const [activeCategory, setActiveCategory] = useState<string>(content.categoryTabs[0]?.id ?? '')
  const [openQuestion, setOpenQuestion] = useState<string | null>(siteContent.faq[0]?.id.value ?? null)
  const categories = content.categoryTabs
  const visibleFaqs = useMemo(() => siteContent.faq.flatMap((item) => {
    const question = resolveContent(item.question)
    const answer = resolveContent(item.answer)
    const category = resolveContent(item.category)
    if (!question || !answer || !category || category !== activeCategory) return []
    return [{ item, id: item.id.value }]
  }), [activeCategory])
  const totalFaqs = siteContent.faq.filter((item) =>
    resolveContent(item.question) && resolveContent(item.answer),
  ).length

  return (
    <>
      <SEO
        title={content.title.value}
        description={content.description.value}
        canonicalUrl="/faq"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/faq', pageName: 'FAQ' })}
      />
      <section className="faq-showcase-hero" aria-labelledby="faq-showcase-title">
        <img
          src={resolveContent(content.showcaseImage) ?? ''}
          alt={resolveContent(content.showcaseImageAlt) ?? ''}
          width="1280"
          height="850"
          fetchPriority="high"
        />
        <div className="faq-showcase-hero__shade" aria-hidden="true" />
        <div className="faq-showcase-hero__copy">
          <p className="home-eyebrow"><ContentText field={content.showcaseEyebrow} /></p>
          <h1 id="faq-showcase-title"><ContentText field={content.showcaseTitle} /></h1>
          <p><ContentText field={content.showcaseIntro} /></p>
          <a className="faq-showcase-hero__jump" href="#faq-questions">
            <ContentText field={content.questionsLabel} /><ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="faq-showcase" id="faq-questions" aria-labelledby="faq-showcase-list-title">
        <div className="faq-showcase__heading">
          <div>
            <p className="home-eyebrow"><ContentText field={content.questionsLabel} /></p>
            <h2 id="faq-showcase-list-title"><ContentText field={content.questionsHeading} /></h2>
          </div>
          <p aria-live="polite">
            {String(visibleFaqs.length).padStart(2, '0')} / {String(totalFaqs).padStart(2, '0')}
            <span> <ContentText field={content.resultCount} /></span>
          </p>
        </div>

        <div className="faq-showcase__layout">
          <nav className="faq-showcase__categories" aria-label={resolveContent(content.categoryLabel) ?? ''}>
            <h3><ContentText field={content.categoriesTitle} /></h3>
            {categories.map((category, index) => {
              const Icon = categoryIcons[index] ?? CircleHelp
              return (
                <button
                  type="button"
                  key={category.id}
                  className={activeCategory === category.id ? 'is-active' : ''}
                  aria-pressed={activeCategory === category.id}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setOpenQuestion(null)
                  }}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span><ContentText field={category.label} /></span>
                </button>
              )
            })}
          </nav>

          <div className="faq-showcase__questions">
            {visibleFaqs.map(({ item, id }, index) => {
              const isOpen = openQuestion === id
              return (
                <article className={`faq-showcase__item${isOpen ? ' is-open' : ''}`} key={id}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${id}`}
                      onClick={() => setOpenQuestion(isOpen ? null : id)}
                    >
                      <span className="faq-showcase__question-index">{String(index + 1).padStart(2, '0')}</span>
                      <span><ContentText field={item.question} /></span>
                      <span className="faq-showcase__toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                    </button>
                  </h3>
                  {isOpen && (
                    <div className="faq-showcase__answer" id={`faq-answer-${id}`}>
                      <ContentText field={item.answer} />
                    </div>
                  )}
                </article>
              )
            })}
            {visibleFaqs.length === 0 && (
              <p className="faq-showcase__empty"><ContentText field={content.noQuestionsMatch} /></p>
            )}
          </div>
        </div>

        <aside className="faq-showcase__contact">
          <span className="faq-showcase__contact-icon"><CircleHelp size={25} aria-hidden="true" /></span>
          <div>
            <h2><ContentText field={content.contactPrompt} /></h2>
            <p><ContentText field={content.contactIntro} /></p>
          </div>
          <Link className="home-button home-button--outline" to="/contact">
            <ContentText field={content.contactCta} /><ArrowRight size={16} aria-hidden="true" />
          </Link>
        </aside>
      </section>
    </>
  )
}

export default FaqPage
