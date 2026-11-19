import type { BrandItem, StatItem } from '@/types'

export const trustBrands: BrandItem[] = [
  {
    name: 'Goulds Water Technology',
    tagline: 'Engineered for Performance',
    role: 'Submersible & Centrifugal Water Pumps',
  },
  {
    name: 'Pentair',
    tagline: 'Water Management Solutions',
    role: 'High-Efficiency Tanks & Filtration',
  },
  {
    name: 'Franklin Electric',
    tagline: 'Moving Water Forward',
    role: 'Submersible Motors, Drives & Controls',
  },
  {
    name: 'Grundfos',
    tagline: 'Pioneering Water Solutions',
    role: 'Constant Pressure & Solar Well Systems',
  },
]

export const paymentMethods = [
  { name: 'Square', label: 'Square Secure Payments' },
  { name: 'Visa', label: 'Visa' },
  { name: 'Mastercard', label: 'Mastercard' },
  { name: 'American Express', label: 'American Express' },
  { name: 'Discover', label: 'Discover Card' },
]

export const animatedStats: StatItem[] = [
  {
    label: 'Years in Business',
    value: 40,
    suffix: '+',
    description: 'Decades of deep West Michigan drilling knowledge',
    placeholderNote: '[Owner to confirm exact years in business]',
  },
  {
    label: 'Wells Drilled & Repaired',
    value: 3500,
    suffix: '+',
    description: 'Serving residential, commercial & farm clients',
    placeholderNote: '[Owner to confirm approximate well count]',
  },
  {
    label: 'Feet Drilled',
    value: 350000,
    suffix: '+',
    description: 'Precision rotary penetration through Michigan glacial till',
    placeholderNote: '[Owner to confirm approximate feet drilled]',
  },
  {
    label: 'Emergency Response',
    value: 24,
    suffix: '/7',
    description: 'Rapid dispatch when your home or farm is without water',
    placeholderNote: '24/7 emergency water restoration',
  },
]
