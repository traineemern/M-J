import { describe, it, expect } from 'vitest'
import { homeData } from '../home'
import { servicesPageData } from '../services'
import { warrantyPageData } from '../warranty'
import { aboutPageData } from '../about'
import { faqPageData } from '../faq'
import { contactPageData } from '../contact'
import { newaygoPageData } from '../newaygo'
import { roadmapSteps } from '../roadmap'
import * as fs from 'fs'
import * as path from 'path'

function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length
}

describe('Word Budget & Content Reduction Tests', () => {
  it('Homepage body text is within word budget (target ~120 words)', () => {
    let totalWords = 0
    totalWords += countWords(homeData.hero.line)
    homeData.services.cards.forEach((c) => {
      totalWords += countWords(c.title) + countWords(c.line)
    })
    homeData.whyUs.points.forEach((p) => {
      totalWords += countWords(p.title) + countWords(p.line)
    })
    totalWords += countWords(homeData.serviceArea.line)
    homeData.reviews.quotes.forEach((q) => {
      totalWords += countWords(q.quote)
    })
    totalWords += countWords(homeData.contact.intro)

    console.log(`Homepage word count: ${totalWords}`)
    expect(totalWords).toBeLessThanOrEqual(135)
  })

  it('/services body text is within word budget (target ~150 words)', () => {
    let totalWords = 0
    totalWords += countWords(servicesPageData.intro)
    servicesPageData.services.forEach((s) => {
      totalWords += countWords(s.title) + countWords(s.line)
    })

    console.log(`/services word count: ${totalWords}`)
    expect(totalWords).toBeLessThanOrEqual(165)
  })

  it('/warranty body text is within word budget (target ~100 words)', () => {
    let totalWords = 0
    totalWords += countWords(warrantyPageData.intro)
    warrantyPageData.promises.forEach((p) => {
      totalWords += countWords(p.title) + countWords(p.line)
    })

    console.log(`/warranty word count: ${totalWords}`)
    expect(totalWords).toBeLessThanOrEqual(115)
  })

  it('/about body text is within word budget (target ~100 words)', () => {
    let totalWords = 0
    totalWords += countWords(aboutPageData.story)
    aboutPageData.counters.forEach((c) => {
      totalWords += countWords(c.label)
    })
    aboutPageData.highlights.forEach((h) => {
      totalWords += countWords(h.title) + countWords(h.line)
    })

    console.log(`/about word count: ${totalWords}`)
    expect(totalWords).toBeLessThanOrEqual(115)
  })

  it('Every FAQ answer is under 25 words', () => {
    faqPageData.faqs.forEach((faq) => {
      const words = countWords(faq.answer)
      expect(words).toBeLessThan(25)
    })
  })

  it('/contact body text is under 30 words', () => {
    const totalWords = countWords(contactPageData.line)
    console.log(`/contact word count: ${totalWords}`)
    expect(totalWords).toBeLessThan(30)
  })

  it('/areas/newaygo body text is within word budget (target ~80 words)', () => {
    let totalWords = 0
    totalWords += countWords(newaygoPageData.line)
    totalWords += countWords(newaygoPageData.serviceSummary)
    newaygoPageData.towns.forEach((t) => {
      totalWords += countWords(t)
    })

    console.log(`/areas/newaygo word count: ${totalWords}`)
    expect(totalWords).toBeLessThanOrEqual(95)
  })

  it('Roadmap step descriptions are each under 10 words', () => {
    roadmapSteps.forEach((step) => {
      const words = countWords(step.description)
      expect(words).toBeLessThan(10)
    })
  })

      it('Drilling story captions in WebVTT are each under 8 words', () => {
        const vttPath = path.resolve(__dirname, '../../../public/media/mj-drilling.vtt')
        const vttContent = fs.readFileSync(vttPath, 'utf-8')
        const cueLines = vttContent
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0 && !l.startsWith('WEBVTT') && !l.includes('-->') && !/^\d+$/.test(l))

        expect(cueLines.length).toBeGreaterThan(0)
        cueLines.forEach((caption) => {
          const words = countWords(caption)
          expect(words).toBeLessThan(8)
        })
      })
    })
