import React, { useState } from 'react'
import { z } from 'zod'
import { AlertCircle, Phone, ArrowRight, Loader2 } from 'lucide-react'
import { SuccessCheck } from './SuccessCheck'
import { siteData } from '@/data/site'

const enquirySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Please enter your name (at least 2 characters)' })
    .max(100),
  phone: z
    .string()
    .min(10, { message: 'Please enter a valid phone number with area code' })
    .regex(/^[0-9+()\-.\s]{10,20}$/, { message: 'Please enter a valid phone number' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .max(120),
  cityTownship: z
    .string()
    .min(2, { message: 'Please specify your city or township' })
    .max(80),
  serviceNeeded: z.enum(
    ['new well', 'repair', 'pump service', 'irrigation', 'other'],
    { errorMap: () => ({ message: 'Please select a service' }) },
  ),
  message: z.string().max(2000).optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Please check the box to consent to a callback',
  }),
  honeypot: z.string().max(0, { message: 'Bot detected' }).optional(),
})

export type EnquiryFormValues = z.infer<typeof enquirySchema>

interface EnquiryFormProps {
  initialService?: string
  onSuccess?: () => void
  onClose?: () => void
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialService,
  onClose,
}) => {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormValues, string>>>({})

  const [values, setValues] = useState<{
    name: string
    phone: string
    email: string
    cityTownship: string
    serviceNeeded: string
    message: string
    consent: boolean
    honeypot: string
  }>({
    name: '',
    phone: '',
    email: '',
    cityTownship: '',
    serviceNeeded: initialService || 'new well',
    message: '',
    consent: false,
    honeypot: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name as keyof EnquiryFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = enquirySchema.safeParse(values)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof EnquiryFormValues, string>> = {}
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof EnquiryFormValues
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setFormState('sending')
    setErrorMessage('')

    try {
      const endpoint = import.meta.env.VITE_FORM_ENDPOINT
      const isPlaceholder =
        !endpoint ||
        endpoint.includes('placeholder_form_id') ||
        endpoint.trim() === ''

      if (!isPlaceholder) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            ...result.data,
            source: 'enquiry_popup',
            timestamp: new Date().toISOString(),
          }),
        })

        if (!response.ok) {
          throw new Error('Server returned an error')
        }
      } else {
        // Safe mock submit if endpoint is not configured: simulate 300ms delay
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      setFormState('success')
    } catch {
      setFormState('error')
      setErrorMessage('Something went wrong. Call (616) 675-4875.')
    }
  }

  if (formState === 'success') {
    return (
      <div className="text-center py-6 space-y-4">
        <SuccessCheck />
        <h3 className="text-2xl font-black text-water-900 font-condensed uppercase tracking-tight">
          Estimate Request Received
        </h3>
        <p className="text-base text-water-800 leading-relaxed max-w-sm mx-auto">
          Thanks. We will call you within [CONFIRM hours] hours.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`tel:${siteData.phoneClean}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-water-600 hover:bg-water-700 text-white font-condensed font-bold uppercase tracking-wider text-sm transition-colors"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>Call Now: {siteData.phone}</span>
          </a>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-water-100 hover:bg-water-200 text-water-900 font-condensed font-bold uppercase tracking-wider text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Honeypot field (hidden from screen and tab order) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="enquiry-honeypot">Leave blank</label>
        <input
          id="enquiry-honeypot"
          type="text"
          name="honeypot"
          value={values.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="enquiry-name"
          className="block text-xs font-bold text-water-900 uppercase tracking-wider font-condensed mb-1"
        >
          Full Name <span className="text-water-600">*</span>
        </label>
        <input
          id="enquiry-name"
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="e.g. John Miller"
          className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
            errors.name ? 'border-red-500 bg-red-50/50' : 'border-water-200 bg-white'
          } text-water-900 focus:outline-none focus:ring-2 focus:ring-water-500 transition-colors`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      {/* Phone & Email in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="enquiry-phone"
            className="block text-xs font-bold text-water-900 uppercase tracking-wider font-condensed mb-1"
          >
            Phone Number <span className="text-water-600">*</span>
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            placeholder="(616) 000-0000"
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
              errors.phone ? 'border-red-500 bg-red-50/50' : 'border-water-200 bg-white'
            } text-water-900 focus:outline-none focus:ring-2 focus:ring-water-500 transition-colors`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label
            htmlFor="enquiry-email"
            className="block text-xs font-bold text-water-900 uppercase tracking-wider font-condensed mb-1"
          >
            Email Address <span className="text-water-600">*</span>
          </label>
          <input
            id="enquiry-email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
              errors.email ? 'border-red-500 bg-red-50/50' : 'border-water-200 bg-white'
            } text-water-900 focus:outline-none focus:ring-2 focus:ring-water-500 transition-colors`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>

      {/* City/Township & Service Needed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="enquiry-city"
            className="block text-xs font-bold text-water-900 uppercase tracking-wider font-condensed mb-1"
          >
            City or Township <span className="text-water-600">*</span>
          </label>
          <input
            id="enquiry-city"
            type="text"
            name="cityTownship"
            value={values.cityTownship}
            onChange={handleChange}
            placeholder="e.g. Casnovia, Newaygo"
            className={`w-full px-3.5 py-2.5 text-sm rounded-lg border ${
              errors.cityTownship ? 'border-red-500 bg-red-50/50' : 'border-water-200 bg-white'
            } text-water-900 focus:outline-none focus:ring-2 focus:ring-water-500 transition-colors`}
          />
          {errors.cityTownship && (
            <p className="mt-1 text-xs text-red-600">{errors.cityTownship}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-service"
            className="block text-xs font-bold text-water-900 uppercase tracking-wider font-condensed mb-1"
          >
            Service Needed <span className="text-water-600">*</span>
          </label>
          <select
            id="enquiry-service"
            name="serviceNeeded"
            value={values.serviceNeeded}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-water-200 bg-white text-water-900 focus:outline-none focus:ring-2 focus:ring-water-500 transition-colors"
          >
            <option value="new well">New Well Drilling</option>
            <option value="repair">Well Repair</option>
            <option value="pump service">Pump & Tank Service</option>
            <option value="irrigation">Agricultural & Irrigation</option>
            <option value="other">Other Service</option>
          </select>
          {errors.serviceNeeded && (
            <p className="mt-1 text-xs text-red-600">{errors.serviceNeeded}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="enquiry-message"
          className="block text-xs font-bold text-water-900 uppercase tracking-wider font-condensed mb-1"
        >
          Project Details <span className="text-water-500 font-normal">(optional)</span>
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          rows={2}
          value={values.message}
          onChange={handleChange}
          placeholder="Tell us about your well or water issue..."
          className="w-full px-3.5 py-2 text-sm rounded-lg border border-water-200 bg-white text-water-900 focus:outline-none focus:ring-2 focus:ring-water-500 transition-colors resize-none"
        />
      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start gap-2 pt-1">
        <input
          id="enquiry-consent"
          type="checkbox"
          name="consent"
          checked={values.consent}
          onChange={handleChange}
          className="mt-1 h-4 w-4 rounded border-water-300 text-water-600 focus:ring-water-500 cursor-pointer"
        />
        <label htmlFor="enquiry-consent" className="text-xs text-water-800 leading-snug cursor-pointer">
          I agree to allow M&J Water Wells to contact me regarding my well estimate.
        </label>
      </div>
      {errors.consent && <p className="text-xs text-red-600">{errors.consent}</p>}

      {/* Error state alert */}
      {formState === 'error' && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={formState === 'sending'}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-water-600 hover:bg-water-700 text-white font-condensed font-bold uppercase tracking-wider text-sm transition-colors disabled:opacity-60 cursor-pointer shadow-md"
        >
          {formState === 'sending' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Estimate Request</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default EnquiryForm
