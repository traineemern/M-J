import { siteContent, resolveContent } from '@/data/site'
import type { TestimonialItem } from '@/types'

export const testimonialsData: TestimonialItem[] = siteContent.about.testimonials.map((item, index) => ({
  id: String(index + 1),
  author: resolveContent(item.name) ?? '',
  city: 'PLACEHOLDER',
  rating: 0,
  text: resolveContent(item.quote) ?? '',
  date: '',
  projectType: 'PLACEHOLDER',
}))
