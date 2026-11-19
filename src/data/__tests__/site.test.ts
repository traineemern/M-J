import { describe, it, expect } from 'vitest'
import { siteData, mainNavLinks, utilityBarLinks } from '@/data/site'
import { faqData } from '@/data/faq'
import { trustBrands, paymentMethods, animatedStats } from '@/data/brands'

describe('M&J Water Wells site data', () => {
  it('has exact business name "M&J Water Wells"', () => {
    expect(siteData.name).toBe('M&J Water Wells')
  })

  it('has exact phone (616) 675-4875 and clean tap-to-call format', () => {
    expect(siteData.phone).toBe('(616) 675-4875')
    expect(siteData.phoneClean).toBe('+16166754875')
  })

  it('has exact email info@MandJWaterWells.com', () => {
    expect(siteData.email).toBe('info@MandJWaterWells.com')
  })

  it('has exact Casnovia address', () => {
    expect(siteData.address.street).toBe('1036 Truman Avenue')
    expect(siteData.address.city).toBe('Casnovia')
    expect(siteData.address.state).toBe('MI')
    expect(siteData.address.zip).toBe('49318')
  })

  it('has required service areas including Casnovia, Sand Lake, Newaygo, Fremont & Hesperia', () => {
    const areasString = siteData.serviceAreas.join(' ')
    expect(areasString).toContain('Casnovia')
    expect(areasString).toContain('Sand Lake')
    expect(areasString).toContain('Newaygo')
    expect(areasString).toContain('Fremont')
  })

  it('main nav links match exact required labels', () => {
    const labels = mainNavLinks.map((l) => l.label)
    expect(labels).toEqual(['Home', 'Services', 'About', 'FAQ', 'Contact'])
  })

  it('utility bar links include required items', () => {
    const labels = utilityBarLinks.map((l) => l.label)
    expect(labels).toContain('Services')
    expect(labels).toContain('Warranty')
    expect(labels).toContain('Free Estimate')
    expect(labels).toContain('Email Us')
  })

  it('has at least 8 FAQ items', () => {
    expect(faqData.length).toBeGreaterThanOrEqual(8)
  })

  it('lists Goulds, Pentair, Franklin Electric, and Grundfos', () => {
    const brandNames = trustBrands.map((b) => b.name)
    expect(brandNames).toContain('Goulds Water Technology')
    expect(brandNames).toContain('Pentair')
    expect(brandNames).toContain('Franklin Electric')
    expect(brandNames).toContain('Grundfos')
  })

  it('lists accepted payment methods including Square, Visa, Mastercard, AMEX, Discover', () => {
    const methods = paymentMethods.map((p) => p.name)
    expect(methods).toContain('Square')
    expect(methods).toContain('Visa')
    expect(methods).toContain('Mastercard')
    expect(methods).toContain('American Express')
    expect(methods).toContain('Discover')
  })

  it('provides animated counter stats with placeholders marked', () => {
    expect(animatedStats.length).toBeGreaterThanOrEqual(3)
    const yearsStat = animatedStats.find((s) => s.label.includes('Years'))
    expect(yearsStat).toBeDefined()
    expect(yearsStat?.value).toBeGreaterThan(0)
  })
})
