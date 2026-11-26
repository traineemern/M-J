import { resolveContent, siteContent } from '@/data/site'

export type FaqCategory = string

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: FaqCategory
  sample: boolean
}

export const faqPageData = {
  heading: siteContent.pages.faq.title.value,
  description: siteContent.pages.faq.description.value,
  faqs: siteContent.faq.flatMap((item) => {
    const question = resolveContent(item.question)
    const answer = resolveContent(item.answer)
    const category = resolveContent(item.category)
    if (!question || !answer || !category) return []
    return [{
      id: item.id.value,
      question,
      answer,
      category: category as FaqCategory,
      sample: item.question.source === 'dummy' || item.answer.source === 'dummy',
    }]
  }),
}

export const faqCategories = siteContent.pages.faq.defaultCategories.map((item) => item.value)
export const faqData = faqPageData.faqs
