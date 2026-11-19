import type { SiteInfo } from '@/types'

export const siteData: SiteInfo = {
  name: 'M&J Water Wells',
  legalName: 'M&J Water Wells Inc.',
  tagline: "West Michigan's Well Drilling Specialists!",
  summary:
    'Local, family-owned and operated full-service rotary well drilling and repair company offering commercial and residential wells and farm and irrigation drilling services.',

  // EXACT BUSINESS PHONE
  phone: '(616) 675-4875',
  phoneClean: '+16166754875',

  // EXACT BUSINESS EMAIL
  email: 'info@MandJWaterWells.com',

  // EXACT BUSINESS ADDRESS
  address: {
    street: '1036 Truman Avenue',
    city: 'Casnovia',
    state: 'MI',
    zip: '49318',
    full: '1036 Truman Avenue, Casnovia, MI 49318',
  },

  // OPERATING HOURS (Placeholders marked for owner confirmation)
  hours: {
    weekdays: 'Monday – Friday: 7:30 AM – 5:30 PM',
    saturday: 'Saturday: 8:00 AM – 1:00 PM',
    sunday: 'Sunday: Closed [Emergency Service Available]',
    emergency: '24/7 Emergency Pump & No-Water Assistance',
  },

  // SERVICE REGIONS
  primaryArea: 'Casnovia, Sand Lake, Newaygo, Fremont & Hesperia, and across West Michigan',
  serviceAreas: [
    'Casnovia & Kent City',
    'Sand Lake & Cedar Springs',
    'Newaygo & Croton',
    'Fremont & Hesperia',
    'Grand Rapids & Rockford',
    'Muskegon & Ravenna',
    'Montcalm & Mecosta Counties',
  ],

  // ACCEPTED PAYMENT METHODS
  payments: [
    'Square',
    'Visa',
    'Mastercard',
    'American Express',
    'Discover',
    'Personal & Business Checks',
  ],

  // INDUSTRY BRAND PARTNERS
  brands: [
    'Goulds Water Technology',
    'Pentair',
    'Franklin Electric',
    'Grundfos',
  ],

  licenseNumberPlaceholder: 'State of Michigan Registered Well Drilling Contractor #MI-WDC-[CONFIRM: license number]',
  foundedYearPlaceholder: '[CONFIRM: founding year]',
  managerName: '[CONFIRM: manager name]',
}

// Consistent navigation links across Header, Footer, and Mobile menu with short labels
export const mainNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export const utilityBarLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Free Estimate', href: '/#contact-estimate' },
  { label: 'Email Us', href: `mailto:${siteData.email}` },
]
