export type MotionLevel = 'Level A' | 'Level B' | 'Level C'

export interface PageMotionConfig {
  path: string
  name: string
  levels: MotionLevel[]
  effects: string[]
  kbEstimateGzip: number
  description: string
}

export const motionPageSettings: Record<string, PageMotionConfig> = {
  '/': {
    path: '/',
    name: 'Home',
    levels: ['Level A', 'Level B'],
    effects: [
      'Top scroll progress bar (100% on page end)',
      'Clean crew photo image hero card (Level C 3D sim dropped to photo)',
      'Level B 3D card-stack carousel for common questions (first 3 questions)',
      'Level B 3D card perspective tilt on hover and scroll parallax on 3 services',
      'Roadmap 3D active node lift and path draw',
      'Drilling video player with rounded 3D modal',
      'Floating manager chat 8s depth shadow pulse',
    ],
    kbEstimateGzip: 6.2,
    description: 'Clean crew photo hero, 3D FAQ card-stack carousel, service card perspective tilt, and roadmap node lift.',
  },
  '/services': {
    path: '/services',
    name: 'Services',
    levels: ['Level A', 'Level B'],
    effects: [
      'Top scroll progress bar',
      'Level B GSAP ScrollTrigger header 3D rotation (ScrollTilt)',
      'Service grid 3D perspective tilt on hover and layered parallax',
      'Accordion depth lift and dynamic shadow on expansion',
      'Floating manager chat 8s depth shadow pulse',
    ],
    kbEstimateGzip: 4.8,
    description: 'Scroll-linked header rotation with GSAP ScrollTrigger and interactive card depth tilt.',
  },
  '/warranty': {
    path: '/warranty',
    name: 'Warranty',
    levels: ['Level A'],
    effects: [
      'Top scroll progress bar',
      'Level A perspective tilt on three warranty promise cards (hover-only)',
      'Hover-only tilt disabled on touch devices via pointer media query',
      'Floating manager chat 8s depth shadow pulse',
    ],
    kbEstimateGzip: 1.6,
    description: 'Level A CSS/pointer perspective tilt on promise cards.',
  },
  '/about': {
    path: '/about',
    name: 'About',
    levels: ['Level A'],
    effects: [
      'Top scroll progress bar',
      'Level A depth shadows and scroll-linked numeric counter increment',
      'Floating manager chat 8s depth shadow pulse',
    ],
    kbEstimateGzip: 1.4,
    description: 'Level A depth shadows with scroll counter reveals.',
  },
  '/faq': {
    path: '/faq',
    name: 'FAQ',
    levels: ['Level A'],
    effects: [
      'Top scroll progress bar',
      'Level A subtle depth lift and shadow on accordion row expansion',
      'Floating manager chat 8s depth shadow pulse',
    ],
    kbEstimateGzip: 1.2,
    description: 'Level A depth lift on question accordion trigger.',
  },
  '/contact': {
    path: '/contact',
    name: 'Contact',
    levels: ['Level A'],
    effects: [
      'Top scroll progress bar',
      'Level A subtle 3D perspective tilt and depth shadow on form container',
      'Enquiry popup scale and opacity entrance',
      'Floating manager chat 8s depth shadow pulse',
    ],
    kbEstimateGzip: 1.5,
    description: 'Level A perspective depth shadow on contact card.',
  },
  '/areas/newaygo': {
    path: '/areas/newaygo',
    name: 'Service Areas (Newaygo)',
    levels: ['Level A'],
    effects: [
      'Top scroll progress bar',
      'Level A map frame depth shadow',
      'ParallaxLayer on background panel',
      'Floating manager chat 8s depth shadow pulse',
    ],
    kbEstimateGzip: 1.8,
    description: 'Level A background parallax layer and map frame depth.',
  },
  '/404': {
    path: '/404',
    name: 'Not Found',
    levels: ['Level A'],
    effects: [
      'Top scroll progress bar',
      'DepthFloat single slow floating animation on logo (up/down 6px, 4s loop, pauses on hover and reduced motion)',
    ],
    kbEstimateGzip: 1.1,
    description: 'Level A gentle floating depth loop on 404 brand mark.',
  },
}
