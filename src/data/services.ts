export interface CompactServiceItem {
  id: string
  title: string // 2 to 4 words
  line: string // <= 15 words
  icon: string
}

export const servicesPageData = {
  heading: 'Our Services',
  intro: 'Rotary drilling, water pumps, and emergency well service.', // 8 words

  services: [
    {
      id: 'residential',
      title: 'Residential Well Drilling',
      line: 'Complete drinking water well systems for West Michigan homes.',
      icon: 'Home',
    },
    {
      id: 'commercial',
      title: 'Commercial Well Drilling',
      line: 'High-capacity production wells engineered for commercial operations.',
      icon: 'Building2',
    },
    {
      id: 'farm-irrigation',
      title: 'Farm & Irrigation Wells',
      line: 'High-volume agricultural water systems for farms and livestock.',
      icon: 'Tractor',
    },
    {
      id: 'repair-surging',
      title: 'Well Repair & Surging',
      line: 'Screen cleaning, casing repair, and emergency well restoration.',
      icon: 'ShieldCheck',
    },
    {
      id: 'pump-service',
      title: 'Submersible Pump Service',
      line: 'Rapid pump diagnostics, repair, and replacement.',
      icon: 'Wrench',
    },
    {
      id: 'constant-pressure',
      title: 'Constant Pressure Systems',
      line: 'Steady water pressure powered by variable-frequency drives.',
      icon: 'Activity',
    },
    {
      id: 'water-testing',
      title: 'Water Quality Testing',
      line: 'Certified potability sampling and comprehensive mineral analysis.',
      icon: 'Droplet',
    },
  ] as CompactServiceItem[],

  accordions: [
    {
      id: 'drill-methods',
      title: 'Drilling Methods & Rig Details',
      content:
        'We utilize air rotary, mud rotary, and reverse circulation drilling. Our fleet includes rotary and dual-rotary rigs designed to penetrate dense glacial till and bedrock quickly. [CONFIRM: standard rig specifications].',
    },
    {
      id: 'pump-details',
      title: 'Pump & Pressure Tank Details',
      content:
        'We install premium submersible pumps and constant pressure systems from Goulds Water Technology, Pentair, Franklin Electric, and Grundfos. Same-day emergency no-water dispatch available.',
    },
  ],
} as const
