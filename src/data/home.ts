import { resolveContent, siteContent } from '@/data/site'

export interface HomeServiceCard {
  id: string
  title: string
  line: string
  icon: 'Droplets' | 'Building2' | 'Wrench'
}

export interface HomeWhyPoint {
  title: string
  line: string
  icon: 'ShieldCheck' | 'Cog' | 'Clock'
}

export interface HomeReviewQuote {
  quote: string
  author: string
}

export const homeData = {
  hero: {
    headline: siteContent.business.tagline.value,
    line: siteContent.business.description.value,
    primaryCta: { text: siteContent.pages.labels.freeEstimate.value, href: '/contact' },
    secondaryCta: { text: siteContent.pages.labels.services.value, href: '/services' },
  },
  services: {
    heading: siteContent.pages.home.serviceHeading.value,
    cards: siteContent.services.slice(0, 3).map((service, index) => ({
      id: service.id.value,
      title: service.title.value,
      line: resolveContent(service.summary) ?? '',
      icon: (['Droplets', 'Building2', 'Wrench'][index] ?? 'Droplets') as HomeServiceCard['icon'],
    })),
    learnMoreText: siteContent.pages.labels.services.value,
  },
  whyUs: {
    heading: siteContent.business.description.value,
    points: [
      { title: siteContent.business.location.value, line: siteContent.business.description.value, icon: 'ShieldCheck' as const },
      { title: siteContent.capabilities.equipment.value, line: siteContent.capabilities.wellDiameter.value, icon: 'Cog' as const },
      { title: siteContent.contact.estimateRequest.value, line: siteContent.business.phoneResponse.value, icon: 'Clock' as const },
    ],
  },
  serviceArea: {
    heading: siteContent.pages.labels.contact.value,
    line: siteContent.areas.coverage.value,
    linkText: siteContent.pages.labels.contact.value,
    linkHref: '/contact',
  },
  reviews: {
    heading: resolveContent(siteContent.about.rating) ?? '',
    quotes: siteContent.about.testimonials.map((item) => ({
      quote: resolveContent(item.quote) ?? '',
      author: resolveContent(item.name) ?? '',
    })),
  },
  contact: {
    heading: siteContent.pages.labels.freeEstimate.value,
    intro: siteContent.contact.estimateRequest.value,
  },
} as const
