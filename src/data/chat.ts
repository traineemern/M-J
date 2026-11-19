export interface ChatAction {
  type: 'enquiry' | 'call' | 'link'
  label: string
  href?: string
}

export interface ChatQuestionItem {
  id: string
  question: string
  answer: string
  action?: ChatAction
}

export interface ChatData {
  managerName: string
  managerRole: string
  initialGreeting: string
  fallbackNote: string
  fallbackButtonText: string
  questions: ChatQuestionItem[]
}

export const chatData: ChatData = {
  managerName: '[CONFIRM: manager name]',
  managerRole: 'Site Manager, M&J Water Wells',
  initialGreeting: "Hi, I'm [CONFIRM: manager name] from M&J. What can I help you with?",
  fallbackNote: "Something else? Leave your details and we'll call you back.",
  fallbackButtonText: 'Request a callback',
  questions: [
    {
      id: 'cost',
      question: 'How much does a well cost?',
      answer:
        'It depends on depth and ground. I can give you a real number after a quick site visit. Want me to set one up? [CONFIRM: cost answer]',
      action: {
        type: 'enquiry',
        label: 'Request a quote',
      },
    },
    {
      id: 'depth',
      question: 'How deep do you drill?',
      answer:
        'Most of our wells in this area go down based on the ground and water we find. Each site is different. [CONFIRM typical depth range].',
    },
    {
      id: 'warranty',
      question: 'Do you offer a warranty?',
      answer:
        'Yes. Every well comes with a warranty. Here are the details. [CONFIRM: warranty answer]',
      action: {
        type: 'link',
        label: 'View warranty details',
        href: '/warranty',
      },
    },
    {
      id: 'pumps',
      question: 'Do you service pumps?',
      answer:
        'Yes, we repair and replace pumps and pressure systems. Call us if your water stops. [CONFIRM: pump service answer]',
      action: {
        type: 'call',
        label: 'Call (616) 675-4875',
        href: 'tel:+16166754875',
      },
    },
    {
      id: 'areas',
      question: 'What areas do you cover?',
      answer:
        'We work across West Michigan, including Casnovia, Sand Lake, Newaygo, and Fremont. [CONFIRM: service areas]',
      action: {
        type: 'link',
        label: 'View service areas',
        href: '/areas/newaygo',
      },
    },
    {
      id: 'quote',
      question: 'How do I get a quote?',
      answer:
        "Tell me a little about your property and I'll set up a quote. [CONFIRM: quote process]",
      action: {
        type: 'enquiry',
        label: 'Request a quote',
      },
    },
    {
      id: 'payments',
      question: 'Do you take cards?',
      answer: 'Yes, we accept all major credit cards. [CONFIRM: payment methods]',
    },
    {
      id: 'talk',
      question: 'Talk to a person',
      answer:
        'Of course. Call us at (616) 675-4875 and we will answer. [CONFIRM: phone support hours]',
      action: {
        type: 'call',
        label: 'Call now',
        href: 'tel:+16166754875',
      },
    },
  ],
}
