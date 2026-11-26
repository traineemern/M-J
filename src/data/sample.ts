import { resolveContent, siteContent } from '@/data/site'

export const sampleData = {
  stats: siteContent.about.counters.map((item) => ({
    value: resolveContent(item.value) ?? '',
    label: resolveContent(item.label) ?? '',
  })),
  projects: siteContent.about.gallery.map((item) => ({
    image: resolveContent(item.image) ?? '',
    type: resolveContent(item.label) ?? '',
  })),
  testimonials: siteContent.about.testimonials.map((item) => ({
    name: resolveContent(item.name) ?? '',
    quote: resolveContent(item.quote) ?? '',
    label: resolveContent(item.label) ?? '',
  })),
}

export const showSampleData = import.meta.env.DEV && import.meta.env.VITE_SHOW_SAMPLE_DATA === 'true'
