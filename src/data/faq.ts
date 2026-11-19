export interface FaqItem {
  id: string
  question: string
  answer: string // MUST be under 25 words
}

export const faqPageData = {
  heading: 'Frequently Asked Questions',

  faqs: [
    {
      id: 'depth',
      question: 'How deep are wells drilled in West Michigan?',
      answer: 'Most residential wells range from 60 to 220 feet depending on parcel location and geology. [CONFIRM: depth range].', // 17 words (< 25)
    },
    {
      id: 'rotary',
      question: 'Why choose rotary well drilling?',
      answer: 'Rotary drilling rapidly cuts through dense clay and rock, completing most home wells in a single day.', // 17 words (< 25)
    },
    {
      id: 'signs',
      question: 'What are signs of a failing well pump?',
      answer: 'Sputtering faucets, low water pressure, constant pump clicking, or total water loss signal pump failure.', // 15 words (< 25)
    },
    {
      id: 'permits',
      question: 'Do I need a well permit in Michigan?',
      answer: 'Yes. County health departments require permits for new wells. M&J prepares and submits the paperwork.', // 16 words (< 25)
    },
    {
      id: 'constant-pressure',
      question: 'What is a constant pressure system?',
      answer: 'A variable-speed controller keeps water pressure steady across all faucets, mimicking city water pressure.', // 14 words (< 25)
    },
    {
      id: 'sizes',
      question: 'What well sizes do you drill?',
      answer: 'We drill 4-inch and 5-inch residential wells, plus 6-inch to 12-inch commercial and agricultural wells.', // 15 words (< 25)
    },
    {
      id: 'water-quality',
      question: 'Can you fix sulfur smell or iron in water?',
      answer: 'Yes. We test water and install proven filtration systems to remove iron and sulfur odors.', // 15 words (< 25)
    },
    {
      id: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, Amex, Discover), checks, and cash with free estimates.', // 16 words (< 25)
    },
    {
      id: 'emergency',
      question: 'What happens during a no-water emergency?',
      answer: 'Call (616) 675-4875 immediately. We dispatch fully equipped service trucks for same-day emergency repairs.', // 14 words (< 25)
    },
  ] as FaqItem[],

  bottomCta: {
    text: 'Still have a question? Call us',
    phone: '(616) 675-4875',
    href: 'tel:+16166754875',
  },
} as const

export const faqData = faqPageData.faqs
