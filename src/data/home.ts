export interface HomeServiceCard {
  id: string
  title: string
  line: string
  icon: 'Droplets' | 'Building2' | 'Wrench'
}

export interface HomeWhyPoint {
  title: string
  line: string
  icon: 'ShieldCheck' | 'Cog' | 'Clock'
}

export interface HomeReviewQuote {
  quote: string
  author: string
}

export const homeData = {
  hero: {
    headline: "West Michigan's well drilling specialists", // 5 words (< 8)
    line: 'Family-owned rotary well drilling, water pumps, and dependable repairs.', // 9 words (< 15)
    primaryCta: {
      text: 'Get a free estimate',
      href: '#contact-estimate',
    },
    secondaryCta: {
      text: 'Our services',
      href: '/services',
    },
  },

  services: {
    heading: 'Our Services', // 2 words
    cards: [
      {
        id: 'residential',
        title: 'Residential Well Drilling', // 3 words
        line: 'Complete home water systems drilled for reliable flow.', // 8 words
        icon: 'Droplets',
      },
      {
        id: 'commercial',
        title: 'Commercial & Agricultural', // 3 words
        line: 'High-capacity irrigation and municipal-grade water supply.', // 6 words
        icon: 'Building2',
      },
      {
        id: 'pump-service',
        title: 'Pump Service & Repair', // 4 words
        line: 'Fast troubleshooting, pump replacement, and pressure tanks.', // 7 words
        icon: 'Wrench',
      },
    ] as HomeServiceCard[],
    learnMoreText: 'View all services →',
  },

  whyUs: {
    heading: 'Why Choose M&J', // 3 words
    points: [
      {
        title: 'Licensed & Insured',
        line: 'State-certified Michigan water well drilling contractor.', // 6 words
        icon: 'ShieldCheck',
      },
      {
        title: 'Rotary Precision',
        line: 'Modern dual-rotary rigs engineered for clean water.', // 7 words
        icon: 'Cog',
      },
      {
        title: 'Fast Local Response',
        line: 'Casnovia crew offering emergency repair across West Michigan.', // 8 words
        icon: 'Clock',
      },
    ] as HomeWhyPoint[],
  },

  serviceArea: {
    heading: 'Service Area', // 2 words
    line: 'Serving Casnovia, Newaygo, Sand Lake, Fremont, and West Michigan.', // 9 words
    linkText: 'Newaygo Coverage →',
    linkHref: '/areas/newaygo',
  },

  reviews: {
    heading: 'Customer Reviews', // 2 words
    quotes: [
      {
        quote: 'M&J restored our water within hours. Fantastic local crew.', // 9 words
        author: 'Dave M., Newaygo',
      },
      {
        quote: 'Clean site, honest pricing, and outstanding water pressure.', // 8 words
        author: 'Sarah K., Casnovia',
      },
    ] as HomeReviewQuote[],
  },

  contact: {
    heading: 'Request an Estimate', // 3 words
    intro: 'Contact our Casnovia team for a free estimate.', // 8 words
  },
} as const
