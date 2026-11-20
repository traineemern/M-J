export const env = {
  FORM_ENDPOINT: import.meta.env.VITE_FORM_ENDPOINT || 'https://formspree.io/f/placeholder_form_id',
  SITE_URL: import.meta.env.VITE_SITE_URL || 'https://mandjwaterwells.com',
  IS_PROD: import.meta.env.PROD,
  SHOW_SAMPLE_DATA: import.meta.env.VITE_SHOW_SAMPLE_DATA === 'true',
} as const
