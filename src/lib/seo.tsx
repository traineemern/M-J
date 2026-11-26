import { useEffect } from 'react'
import { env } from './env'
import type { MetaProps } from '@/types'
import { siteContent } from '@/data/site'

export function SEO({
  title,
  description,
  canonicalUrl,
  ogImage = '/media/hero-poster.webp',
  ogType = 'website',
  jsonLd,
}: MetaProps) {
  const fullTitle = `${title} | ${siteContent.business.name.value} ${siteContent.business.location.value}`
  const fullUrl = canonicalUrl ? `${env.SITE_URL}${canonicalUrl}` : env.SITE_URL
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${env.SITE_URL}${ogImage}`

  useEffect(() => {
    document.title = fullTitle

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let el = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attribute, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description)
    setMeta('og:title', fullTitle, true)
    setMeta('og:description', description, true)
    setMeta('og:url', fullUrl, true)
    setMeta('og:type', ogType, true)
    setMeta('og:image', fullOgImage, true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', description)
    setMeta('twitter:image', fullOgImage)

    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!linkCanonical) {
      linkCanonical = document.createElement('link')
      linkCanonical.setAttribute('rel', 'canonical')
      document.head.appendChild(linkCanonical)
    }
    linkCanonical.setAttribute('href', fullUrl)
  }, [fullTitle, description, fullUrl, fullOgImage, ogType])

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullOgImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  )
}

export function generateLocalBusinessSchema(options?: {
  pagePath?: string
  pageName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteContent.business.name.value,
    url: `${env.SITE_URL}${options?.pagePath || ''}`,
    telephone: siteContent.business.phone.value,
    email: siteContent.business.email.value,
    description: siteContent.business.description.value,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteContent.business.address.street.source === 'legacy'
        ? siteContent.business.address.street.value
        : undefined,
      addressLocality: siteContent.business.address.city.value,
      addressRegion: siteContent.business.address.state.value,
      postalCode: siteContent.business.address.zip.source === 'legacy'
        ? siteContent.business.address.zip.value
        : undefined,
      addressCountry: 'US',
    },
    areaServed: [
      ...siteContent.areas.towns
        .filter(({ name }) => name.source === 'legacy')
        .map(({ name }) => name.value),
      siteContent.areas.coverage.value,
    ],
  }
}
