import { resolveContent, siteContent } from '@/data/site'

export const projectsPageData = {
  categories: siteContent.projects.categories.map((category) => category.value),
  items: siteContent.projects.items.flatMap((item) => {
    const title = resolveContent(item.title)
    const category = resolveContent(item.category)
    const location = resolveContent(item.location)
    const client = resolveContent(item.client)
    const description = resolveContent(item.description)
    const image = resolveContent(item.image)
    return title && category && location && client && description && image
      ? [{
          id: item.id.value,
          title,
          category,
          location,
          client,
          description,
          image,
        }]
      : []
  }),
} as const

export const showProjectSamples = import.meta.env.DEV && import.meta.env.VITE_SHOW_SAMPLE_DATA === 'true'
