import { Section } from '@/shared/components/Section'
import { Marquee } from '@/shared/components/Marquee'
import { sampleData, showSampleData } from '@/data/sample'
import { siteContent } from '@/data/site'
import { DisplayHeading, Eyebrow } from '@/components/typography/Typography'

export function StatBand() {
  return (
    <Section id="expertise" className="night-statband">
      <div className="night-statband__heading">
        <Eyebrow className="night-eyebrow">{siteContent.pages.labels.experience.value}</Eyebrow>
        <DisplayHeading level={2} lines={[siteContent.pages.home.sectionHeading.value]} className="typo-display--section" />
        <p>{siteContent.capabilities.equipment.value}</p>
      </div>
      <div className="night-stats">
        {showSampleData ? sampleData.stats.map((stat, index) => (
          <article className="night-stat" key={stat.label}>
            <span className="night-stat__index">0{index + 1}</span>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        )) : null}
      </div>
      <div className="night-credentials">
        <p className="night-eyebrow">{siteContent.pages.labels.capabilities.value}</p>
        <Marquee className="night-credentials__marquee">
          <span>{siteContent.capabilities.wellDiameter.value}</span>
          <span>{siteContent.capabilities.replacementOrDrillingDiameter.value}</span>
          <span>{siteContent.capabilities.equipment.value}</span>
        </Marquee>
      </div>
    </Section>
  )
}
