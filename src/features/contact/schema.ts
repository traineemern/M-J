import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Please enter your full name (at least 2 characters)' })
    .max(100, { message: 'Name must be 100 characters or fewer' }),
  phone: z
    .string()
    .min(10, { message: 'Please enter a valid phone number with area code' })
    .regex(/^[0-9+()\-.\s]{10,20}$/, {
      message: 'Please enter a valid phone number (e.g. 616-675-4875)',
    }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .max(120, { message: 'Email must be 120 characters or fewer' }),
  cityTownship: z
    .string()
    .min(2, { message: 'Please specify your city or township (e.g. Casnovia, Sand Lake, Newaygo)' })
    .max(80, { message: 'City/township must be 80 characters or fewer' }),
  serviceNeeded: z
    .string()
    .min(1, { message: 'Please select the service needed' }),
  preferredTime: z.enum(['morning', 'afternoon', 'evening']).optional(),
  message: z
    .string()
    .min(10, { message: 'Please provide a brief description of your project or problem (at least 10 characters)' })
    .max(2000, { message: 'Message cannot exceed 2000 characters' }),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to allow M&J Water Wells to contact you regarding your inquiry',
  }),
  // Honeypot field (hidden from genuine users to catch spam bots)
  honeypot: z.string().max(0, { message: 'Bot detected' }).optional(),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

export const SERVICE_OPTIONS = [
  'New Well (Residential, Commercial, or Replacement)',
  'Repair (Casing, Low Flow, or Rehabilitation)',
  'Pump Service (No Water, Low Pressure, or Tank Replacement)',
  'Irrigation (Farm, Field, Orchard, or Nursery)',
  'Other Well or Pump Service',
]
