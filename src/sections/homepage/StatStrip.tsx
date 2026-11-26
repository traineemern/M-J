import { Droplets, House, ShieldCheck } from 'lucide-react'
import { ContentText } from '@/components/content/ContentText'
import { siteContent, resolveContent } from '@/data/site'

const icons = [Droplets, House, ShieldCheck]

export function StatStrip() {
  const stats = siteContent.homepage.stats
  if (!import.meta.env.DEV || !stats.some((stat) => resolveContent(stat.value) !== undefined)) return null

  // TODO: Remove the development-only sample figures after owner verification.
  return (
    <section className="home-stat-strip" aria-label={resolveContent(siteContent.homepage.labels.developmentStats) ?? ''}>
      <div className="home-container home-stat-strip__inner">
        {stats.map((stat, index) => {
          const Icon = icons[index]
          return (
            <article className="home-stat" key={index}>
              {Icon && <Icon size={20} aria-hidden="true" />}
              <strong><ContentText field={stat.value} /></strong>
              <span><ContentText field={stat.label} /></span>
            </article>
          )
        })}
      </div>
    </section>
  )
}
