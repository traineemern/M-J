import type { RoadmapStepItem } from '@/types'

export const roadmapSteps: RoadmapStepItem[] = [
  {
    step: 1,
    title: 'Free Estimate & Consultation',
    description: 'Fast consultation and Michigan well log review.', // 7 words (< 10)
    iconName: 'Calculator',
    link: '/contact',
    linkText: 'Request an estimate',
    confirmNote: '[CONFIRM: response time within 24 hours]',
  },
  {
    step: 2,
    title: 'Site Visit & Setback Verification',
    description: 'On-site GPS access and septic setback verification.', // 7 words (< 10)
    iconName: 'MapPin',
  },
  {
    step: 3,
    title: 'Health Department Permitting',
    description: 'County health department permit filing and paperwork.', // 7 words (< 10)
    iconName: 'FileCheck',
    confirmNote: '[CONFIRM: permit filing agency]',
  },
  {
    step: 4,
    title: 'Rotary Well Drilling',
    description: 'Precision rotary drilling down to clean water.', // 7 words (< 10)
    iconName: 'Cog',
    link: '#drilling-video',
    linkText: 'Watch it drill',
    confirmNote: '[CONFIRM: standard rotary methods]',
  },
  {
    step: 5,
    title: 'Well Development & Yield Testing',
    description: 'Flow rate, pressure, and water yield testing.', // 7 words (< 10)
    iconName: 'Activity',
  },
  {
    step: 6,
    title: 'Pump & Tank Installation',
    description: 'Submersible pump and constant pressure installation.', // 6 words (< 10)
    iconName: 'Wrench',
    confirmNote: '[CONFIRM: pump brands offered]',
  },
  {
    step: 7,
    title: 'Warranty & Records Handover',
    description: 'Official state well log and warranty handover.', // 7 words (< 10)
    iconName: 'ShieldCheck',
    link: '/warranty',
    linkText: 'View warranty terms',
  },
  {
    step: 8,
    title: 'Ongoing Care & Maintenance',
    description: 'Seasonal maintenance and emergency repair service.', // 6 words (< 10)
    iconName: 'HeartHandshake',
    badge: 'Coming Soon',
    link: '/services',
    linkText: 'Explore service options',
    confirmNote: '[CONFIRM: online customer portal]',
  },
]
