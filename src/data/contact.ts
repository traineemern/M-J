import { siteData } from './site'

export const contactPageData = {
  heading: 'Contact Us',
  line: 'Call our Casnovia office or submit an estimate request.', // 9 words (< 15)

  phone: siteData.phone,
  phoneClean: siteData.phoneClean,
  address: siteData.address.full,
  hours: 'Monday – Friday: 7:30 AM – 5:30 PM. 24/7 emergency repair.',

  primaryCta: {
    text: 'Call (616) 675-4875',
    href: `tel:${siteData.phoneClean}`,
  },
} as const
