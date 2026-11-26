import { resolveContent, siteContent } from '@/data/site'
import { projectsPageData } from '@/data/projects'

export const aboutPageData = {
  story: siteContent.about.story.value,
  standards: siteContent.editorial.aboutValues.flatMap((item) => {
    const title = resolveContent(item.title)
    const line = resolveContent(item.line)
    return title && line ? [{ title, line }] : []
  }),
  highlights: siteContent.editorial.aboutValues.flatMap((item) => {
    const title = resolveContent(item.title)
    const line = resolveContent(item.line)
    return title && line ? [{ title, line }] : []
  }),
  counters: siteContent.editorial.aboutStats.flatMap((item) => {
    const value = resolveContent(item.value)
    const label = resolveContent(item.label)
    return value && label ? [{ value, label }] : []
  }),
  equipmentSpecs: [
    resolveContent(siteContent.capabilities.wellDiameter),
    resolveContent(siteContent.capabilities.replacementOrDrillingDiameter),
    resolveContent(siteContent.capabilities.equipment),
  ].filter((value): value is string => Boolean(value)),
  projects: projectsPageData.items,
  rating: resolveContent(siteContent.editorial.aboutRating),
  ratingText: resolveContent(siteContent.editorial.aboutRatingText),
  team: siteContent.editorial.aboutTeam.flatMap((item) => {
    const name = resolveContent(item.name)
    const role = resolveContent(item.role)
    const bio = resolveContent(item.bio)
    const image = resolveContent(item.image)
    return name && role && bio && image ? [{ name, role, bio, image }] : []
  }),
} as const
