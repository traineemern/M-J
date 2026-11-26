import { resolveContent, siteContent } from '@/data/site'

export const warrantyPageData = {
  heading: siteContent.pages.warranty.heroFirst.value,
  intro: resolveContent(siteContent.warranty.coverage) ?? '',
  promises: [
    { id: 'pumps', title: siteContent.pages.labels.pumps.value, line: resolveContent(siteContent.warranty.coverage) ?? '' },
    { id: 'pressure-tanks', title: siteContent.pages.labels.pressureTanks.value, line: resolveContent(siteContent.warranty.coverage) ?? '' },
    { id: 'length', title: siteContent.pages.labels.length.value, line: resolveContent(siteContent.warranty.years) ?? '' },
  ],
  termsAccordion: {
    id: 'full-terms',
    title: siteContent.pages.warranty.readTerms.value,
    content: resolveContent(siteContent.warranty.terms) ?? '',
  },
  primaryCta: { text: siteContent.pages.labels.freeEstimate.value },
} as const
