export const warrantyPageData = {
  heading: 'Warranty Coverage',
  intro: 'Solid warranty protection backed by local family accountability.', // 8 words

  promises: [
    {
      id: 'workmanship',
      title: 'Workmanship Guarantee',
      line: 'Every well is drilled strictly to Michigan EGLE standards.',
      icon: 'ShieldCheck',
    },
    {
      id: 'equipment',
      title: 'Premium Brand Equipment',
      line: 'Factory warranties on Goulds, Pentair, and Franklin Electric pumps.',
      icon: 'Wrench',
    },
    {
      id: 'records',
      title: 'Official State Records',
      line: 'You receive full lithological well logs and certified lab results.',
      icon: 'FileText',
    },
  ],

  termsAccordion: {
    id: 'full-terms',
    title: 'Read Full Terms',
    content:
      'All rotary well drilling, casing installation, and pump equipment installed by M&J Water Wells carry manufacturer guarantees and labor commitments. Casing and grout seals are guaranteed against surface contamination. [CONFIRM: exact warranty duration in years].',
  },

  primaryCta: {
    text: 'Get a free estimate',
    href: '/#contact-estimate',
  },
} as const
