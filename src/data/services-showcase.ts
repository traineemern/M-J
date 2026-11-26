import type { Tagged } from '@/data/site'
import { resolveContent, siteContent } from '@/data/site'

const sample = <T,>(value: T, note: string): Tagged<T> => ({
  value,
  source: 'dummy',
  note: `TODO: owner to review. ${note}`,
  availability: 'development-only',
})

const asset = <T,>(value: T): Tagged<T> => ({
  value,
  source: 'legacy',
  availability: 'all',
})

const serviceShowcaseSamples = {
  categories: [
    { title: sample('Residential Well Drilling', 'Replace with approved service-card wording.'), icon: sample('home', 'Icon is illustrative.'), image: sample('/images/service-residential.webp', 'Confirm this image and category pairing.'), serviceIndex: sample(0, 'Confirm the related service.') },
    { title: sample('Commercial Well Drilling', 'Replace with approved service-card wording.'), icon: sample('building', 'Icon is illustrative.'), image: sample('/images/service-commercial.webp', 'Confirm this image and category pairing.'), serviceIndex: sample(1, 'Confirm the related service.') },
    { title: sample('Agricultural Well Drilling', 'Replace with approved service-card wording.'), icon: sample('tractor', 'Icon is illustrative.'), image: sample('/images/homepage-hero-960.webp', 'Confirm this image and category pairing.'), serviceIndex: sample(1, 'Confirm the related service.') },
    { title: sample('Pump Installation', 'Replace with approved service-card wording.'), icon: sample('pump', 'Icon is illustrative.'), image: sample('/images/service-pump.webp', 'Confirm this image and category pairing.'), serviceIndex: sample(3, 'Confirm the related service.') },
    { title: sample('Well Rehabilitation', 'Replace with approved service-card wording.'), icon: sample('rehabilitation', 'Icon is illustrative.'), image: sample('/images/service-commercial.webp', 'Confirm this image and category pairing.'), serviceIndex: sample(5, 'Confirm the related service.') },
    { title: sample('Trenching & Water Lines', 'Replace with approved service-card wording.'), icon: sample('trenching', 'Icon is illustrative.'), image: sample('/images/service-residential.webp', 'Confirm this image and category pairing.'), serviceIndex: sample(8, 'Confirm the related service.') },
  ],
  featuredBenefits: [
    sample('Safe, clean drinking water', 'Replace with a confirmed customer benefit.'),
    sample('Minimal property disruption', 'Replace with a confirmed customer benefit.'),
    sample('Competitive project pricing', 'Replace with a confirmed customer benefit.'),
  ],
  process: {
    heading: sample('A Simple, Proven Process', 'Replace with owner-approved process copy.'),
    intro: sample('From consultation to completion, we make the well-drilling process easy to understand.', 'Confirm this process statement.'),
    steps: [
      { title: sample('Consultation', 'Confirm this process step.'), description: sample('Discuss your needs and site requirements.', 'Confirm this process description.'), icon: sample('message', 'Icon is illustrative.') },
      { title: sample('Site Evaluation', 'Confirm this process step.'), description: sample('Review the location and project plan.', 'Confirm this process description.'), icon: sample('map', 'Icon is illustrative.') },
      { title: sample('Drilling', 'Confirm this process step.'), description: sample('Complete the drilling work for the project.', 'Confirm this process description.'), icon: sample('drill', 'Icon is illustrative.') },
      { title: sample('Testing', 'Confirm this process step.'), description: sample('Check the completed water system.', 'Confirm this process description.'), icon: sample('droplet', 'Icon is illustrative.') },
      { title: sample('Completion', 'Confirm this process step.'), description: sample('Review the finished work and next steps.', 'Confirm this process description.'), icon: sample('check', 'Icon is illustrative.') },
    ],
  },
  whyChoose: {
    heading: sample('Trusted. Experienced. Local.', 'Confirm this company-positioning statement.'),
    description: sample('With years of experience in Michigan, our local team works across West Michigan on well and water-system projects.', 'Confirm all experience and coverage claims before publication.'),
    bullets: [
      sample('Local, family-owned operation', 'Confirm this wording.'),
      sample('Residential, commercial, farm, and irrigation work', 'Confirm this service summary.'),
      sample('Well drilling, repair, and pump service', 'Confirm this service summary.'),
      sample('Quality workmanship, project after project', 'Confirm this quality claim.'),
    ],
    image: asset('/images/about-team.jpg'),
    imageAlt: asset('M&J Water Wells team members standing in front of their drilling rig.'),
    stats: [
      { value: sample('20+', 'Illustrative statistic; confirm years in business.'), label: sample('Years of Experience', 'Confirm this statistic label.') },
      { value: sample('5K+', 'Illustrative statistic; confirm customer count.'), label: sample('Happy Customers', 'Confirm this statistic label.') },
      { value: sample('100%', 'Illustrative statistic; confirm satisfaction claim.'), label: sample('Satisfaction Guarantee', 'Confirm this statistic label.') },
    ],
  },
} as const

function resolveSample<T>(field: Tagged<T>): T | undefined {
  return resolveContent(field)
}

export const servicesShowcaseData = {
  categories: serviceShowcaseSamples.categories.flatMap((item) => {
    const title = resolveSample(item.title)
    const icon = resolveSample(item.icon)
    const image = resolveSample(item.image)
    const serviceIndex = resolveSample(item.serviceIndex)
    return title && icon && image && serviceIndex !== undefined
      ? [{ title, icon, image, serviceIndex }]
      : []
  }),
  featuredBenefits: serviceShowcaseSamples.featuredBenefits.flatMap((item) => {
    const value = resolveSample(item)
    return value ? [value] : []
  }),
  process: {
    heading: resolveSample(serviceShowcaseSamples.process.heading),
    intro: resolveSample(serviceShowcaseSamples.process.intro),
    steps: serviceShowcaseSamples.process.steps.flatMap((item) => {
      const title = resolveSample(item.title)
      const description = resolveSample(item.description)
      const icon = resolveSample(item.icon)
      return title && description && icon ? [{ title, description, icon }] : []
    }),
  },
  whyChoose: {
    heading: resolveSample(serviceShowcaseSamples.whyChoose.heading),
    description: resolveSample(serviceShowcaseSamples.whyChoose.description),
    bullets: serviceShowcaseSamples.whyChoose.bullets.flatMap((item) => {
      const value = resolveSample(item)
      return value ? [value] : []
    }),
    image: resolveSample(serviceShowcaseSamples.whyChoose.image),
    imageAlt: resolveSample(serviceShowcaseSamples.whyChoose.imageAlt),
    stats: serviceShowcaseSamples.whyChoose.stats.flatMap((item) => {
      const value = resolveSample(item.value)
      const label = resolveSample(item.label)
      return value && label ? [{ value, label }] : []
    }),
  },
  testimonials: siteContent.homepage.testimonials.reviews.flatMap((item) => {
    const name = resolveSample(item.name)
    const location = resolveSample(item.town)
    const quote = resolveSample(item.quote)
    const image = resolveSample(item.image)
    const imageAlt = resolveSample(item.imageAlt)
    return name && location && quote && image && imageAlt
      ? [{ name, location, quote, image, imageAlt }]
      : []
  }),
} as const
