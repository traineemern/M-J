import { Link } from 'react-router-dom'
import { SEO } from '@/lib/seo'
import { DisplayHeading } from '@/components/typography/Typography'
import { mainNavLinks, siteContent } from '@/data/site'

export function NotFoundPage() {
  return (
    <>
      <SEO
        title={siteContent.pages.notFound.title.value}
        description={siteContent.pages.notFound.description.value}
        canonicalUrl="/"
      />
      <section className="not-found-page" aria-labelledby="not-found-title">
        <p className="night-eyebrow">{siteContent.pages.notFound.eyebrow.value}</p>
        <DisplayHeading id="not-found-title" level={1} lines={['404']} outlinedLine={0} className="not-found-code" />
        <p>{siteContent.pages.notFound.message.value}</p>
        <nav aria-label={siteContent.pages.notFound.navLabel.value}>
          {mainNavLinks.filter(({ href }) => ['/', '/services', '/contact'].includes(href)).map((link) => (
            <Link key={link.href} to={link.href}>{link.label}</Link>
          ))}
        </nav>
      </section>
    </>
  )
}

export default NotFoundPage
