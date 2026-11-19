import { useEffect } from 'react'
import { env } from './env'
import type { MetaProps } from '@/types'

export function SEO({
  title,
  description,
  canonicalUrl,
  ogImage = '/images/og-preview.webp',
  ogType = 'website',
  jsonLd,
}: MetaProps) {
  const fullTitle = `${title} | M&J Water Wells Casnovia, MI`
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
    name: 'M&J Water Wells',
    alternateName: 'M and J Water Wells',
    url: `${env.SITE_URL}${options?.pagePath || ''}`,
    telephone: '(616) 675-4875',
    email: 'info@MandJWaterWells.com',
    priceRange: '$$',
    description:
      "West Michigan's rotary well drilling and repair company in Casnovia, MI. Commercial, residential, farm, and irrigation drilling.",
    paymentAccepted: 'Cash, Credit Card, Square, Visa, Mastercard, American Express, Discover, Check',
    currenciesAccepted: 'USD',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1036 Truman Avenue',
      addressLocality: 'Casnovia',
      addressRegion: 'MI',
      postalCode: '49318',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '43.2356',
      longitude: '-85.7892',
    },
    areaServed: [
      { '@type': 'City', name: 'Casnovia' },
      { '@type': 'City', name: 'Sand Lake' },
      { '@type': 'City', name: 'Newaygo' },
      { '@type': 'City', name: 'Fremont' },
      { '@type': 'City', name: 'Hesperia' },
      { '@type': 'City', name: 'Cedar Springs' },
      { '@type': 'City', name: 'Grand Rapids' },
      { '@type': 'AdministrativeArea', name: 'Kent County' },
      { '@type': 'AdministrativeArea', name: 'Newaygo County' },
      { '@type': 'AdministrativeArea', name: 'Muskegon County' },
      { '@type': 'AdministrativeArea', name: 'Ottawa County' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:30',
        closes: '17:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '13:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Well Drilling & Repair Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Residential Rotary Well Drilling',
            description: 'Custom well drilling for Casnovia and West Michigan homes.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Commercial & Municipal Well Drilling',
            description: 'High-capacity production wells for facilities and developments.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Farm & Irrigation Well Drilling',
            description: 'High-yield rotary irrigation wells for farms and orchards.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '24/7 Water Well Pump Repair',
            description: 'Emergency pump replacement using Goulds, Pentair, and Franklin Electric.',
          },
        },
      ],
    },
  }
}
