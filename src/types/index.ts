export interface SiteInfo {
  name: string
  legalName: string
  tagline: string
  summary: string
  phone: string
  phoneClean: string
  email: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    full: string
  }
  hours: {
    weekdays: string
    saturday: string
    sunday: string
    emergency: string
  }
  serviceAreas: string[]
  primaryArea: string
  payments: string[]
  brands: string[]
  licenseNumberPlaceholder: string
  foundedYearPlaceholder: string
  managerName?: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: 'drilling' | 'pumps' | 'water-quality' | 'pricing-permits'
}

export interface BrandItem {
  name: string
  tagline: string
  role: string
}

export interface ServiceItem {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  features: string[]
  category: 'residential' | 'commercial' | 'farm-irrigation' | 'rotary' | 'repair' | 'pump'
  iconName: string
}

export interface DrillRigItem {
  name: string
  type: string
  description: string
  idealFor: string[]
  specs: string[]
}

export interface DrillingMethodItem {
  name: string
  description: string
  geology: string
  advantages: string[]
}

export interface TestimonialItem {
  id: string
  author: string
  city: string
  rating: number
  text: string
  date: string
  projectType: string
}

export interface ContactFormData {
  name: string
  phone: string
  email: string
  cityTownship: string
  serviceNeeded: string
  message: string
  consent: boolean
  honeypot?: string
}

export interface StatItem {
  label: string
  value: number
  suffix?: string
  description: string
  placeholderNote?: string
}

export interface RoadmapStepItem {
  step: number
  title: string
  description: string
  iconName: string
  link?: string
  linkText?: string
  badge?: string
  confirmNote?: string
}

export interface MetaProps {
  title: string
  description: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  jsonLd?: Record<string, unknown>
}
