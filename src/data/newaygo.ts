import { siteContent, serviceTowns } from '@/data/site'

export const newaygoPageData = {
  heading: siteContent.business.location.value,
  line: siteContent.business.description.value,
  serviceSummary: siteContent.business.description.value,
  towns: serviceTowns,
} as const
