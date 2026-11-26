import type { BrandItem, StatItem } from '@/types'
import { siteContent } from '@/data/site'

export const trustBrands: BrandItem[] = siteContent.partners.brands.map((brand) => ({
  name: brand.value,
  tagline: '',
  role: '',
}))

export const paymentMethods = siteContent.partners.payments.map((method) => ({
  name: method.value,
  label: method.value,
}))

export const animatedStats: StatItem[] = []
