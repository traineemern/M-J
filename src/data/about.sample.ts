export const aboutSampleData = {
  counters: [
    { id: 'years', label: 'Years in business', value: 12 },
    { id: 'wells', label: 'Wells drilled', value: 240 },
    { id: 'rigs', label: 'Rigs in service', value: 3 },
    { id: 'towns', label: 'Service towns', value: 8 },
  ],
  milestones: [
    '2014: Sample milestone, first rig',
    '2017: Sample milestone, first pump service crew',
    '2020: Sample milestone, expanded service area',
    '2024: Sample milestone, new drilling rig',
  ],
  projects: Array.from({ length: 6 }, (_, index) => ({
    id: `sample-job-${index + 1}`,
    caption: 'Sample job, Sample Town, residential well.',
    image: '/images/sample-before.webp',
  })),
  reviews: Array.from({ length: 3 }, (_, index) => ({
    id: `sample-review-${index + 1}`,
    quote: 'Sample review text for layout only.',
    rating: 5,
    name: 'Sample Customer',
  })),
  trust: [
    { id: 'license', label: 'Licensed', value: 'SAMPLE-000' },
    { id: 'insurance', label: 'Insured', value: 'SAMPLE-000' },
    { id: 'since', label: 'Since', value: '2014 (SAMPLE)' },
  ],
} as const
