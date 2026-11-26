import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { sampleData, showSampleData } from '@/data/sample'
import { Section } from '@/shared/components/Section'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { motionConfig } from '@/lib/motion/config'
import { siteContent } from '@/data/site'

export function QuoteSlider() {
  const reduced = useReducedMotion()
  const entries = showSampleData ? sampleData.testimonials : []
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduced || paused || entries.length < 2) return
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % entries.length),
      motionConfig.marquee.quoteAutoplay,
    )
    return () => window.clearInterval(timer)
  }, [active, entries.length, paused, reduced])

  const move = (delta: number) => setActive((current) => (current + delta + entries.length) % entries.length)
  if (!entries.length) return null
  const entry = entries[active]

  return (
    <Section id="testimonials" className="night-quotes" label={siteContent.pages.labels.customerVoices.value}>
      <div
        className="night-quotes__content"
        role="region"
        aria-roledescription="carousel"
        aria-label={siteContent.pages.labels.customerTestimonials.value}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false)
        }}
      >
        <div className="night-quotes__topline">
          <span>{entry.label}</span>
          <span>{String(active + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}</span>
        </div>
        <span className="night-quotes__mark" aria-hidden="true">“</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.blockquote
            key={active}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -16 }}
            transition={{ duration: reduced ? 0 : motionConfig.duration.subtle, ease: motionConfig.ui.expoOut }}
          >
            {entry.quote}
          </motion.blockquote>
        </AnimatePresence>
        <p className="night-quotes__byline">{entry.name}</p>
        <div className="night-quotes__controls">
          <button type="button" onClick={() => move(-1)} aria-label={siteContent.pages.labels.previousTestimonial.value}><ArrowLeft size={19} /></button>
          <div className="night-quotes__progress" aria-hidden="true"><span key={`${active}-${paused}`} style={{ animationDuration: `${motionConfig.marquee.quoteAutoplay}ms` }} className={paused || reduced ? 'is-paused' : ''} /></div>
          <button type="button" onClick={() => move(1)} aria-label={siteContent.pages.labels.nextTestimonial.value}><ArrowRight size={19} /></button>
        </div>
      </div>
    </Section>
  )
}
