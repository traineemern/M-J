import React, { useState } from 'react'
import { z } from 'zod'
import { AlertCircle, Phone, ArrowRight, Loader2 } from 'lucide-react'
import { SuccessCheck } from './SuccessCheck'
import { siteData } from '@/data/site'
import { Button } from '@/components/ui/Button'

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

function FieldError({ children }: { children: string }) {
  return <p role="alert" className="field-error"><AlertCircle aria-hidden="true" size={16} />{children}</p>
}

export type EnquiryFormValues = z.infer<typeof enquirySchema>

interface EnquiryFormProps {
  initialService?: string
  initialTown?: string
  onSuccess?: () => void
  onClose?: () => void
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialService,
  initialTown,
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
    cityTownship: initialTown || '',
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
        <h3 className="text-2xl font-black text-slate-900 font-condensed uppercase tracking-tight">
          Estimate Request Received
        </h3>
        <p className="text-base text-slate-700 leading-relaxed max-w-sm mx-auto">
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
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-condensed font-bold uppercase tracking-wider text-sm transition-colors cursor-pointer"
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
          className="glass-label mb-1.5 block"
        >
          Full Name <span className="text-cyan-200">*</span>
        </label>
        <input
          id="enquiry-name"
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="e.g. John Miller"
          aria-invalid={Boolean(errors.name)}
          className={`glass-field form-control-glow w-full px-3.5 py-2.5 text-sm rounded-lg border ${
            errors.name ? 'border-red-300 bg-red-950/30' : 'border-slate-400/60 bg-white/5'
          } text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-colors`}
        />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </div>

      {/* Phone & Email in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="enquiry-phone"
            className="glass-label mb-1.5 block"
          >
            Phone Number <span className="text-cyan-200">*</span>
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            placeholder="(616) 000-0000"
            aria-invalid={Boolean(errors.phone)}
            className={`glass-field form-control-glow w-full px-3.5 py-2.5 text-sm rounded-lg border ${
              errors.phone ? 'border-red-300 bg-red-950/30' : 'border-slate-400/60 bg-white/5'
            } text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-colors`}
          />
          {errors.phone && <FieldError>{errors.phone}</FieldError>}
        </div>

        <div>
          <label
            htmlFor="enquiry-email"
            className="glass-label mb-1.5 block"
          >
            Email Address <span className="text-cyan-200">*</span>
          </label>
          <input
            id="enquiry-email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            className={`glass-field form-control-glow w-full px-3.5 py-2.5 text-sm rounded-lg border ${
              errors.email ? 'border-red-300 bg-red-950/30' : 'border-slate-400/60 bg-white/5'
            } text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-colors`}
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </div>
      </div>

      {/* City/Township & Service Needed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="enquiry-city"
            className="glass-label mb-1.5 block"
          >
            City or Township <span className="text-cyan-200">*</span>
          </label>
          <input
            id="enquiry-city"
            type="text"
            name="cityTownship"
            value={values.cityTownship}
            onChange={handleChange}
            placeholder="e.g. Casnovia, Newaygo"
            aria-invalid={Boolean(errors.cityTownship)}
            className={`glass-field form-control-glow w-full px-3.5 py-2.5 text-sm rounded-lg border ${
              errors.cityTownship ? 'border-red-300 bg-red-950/30' : 'border-slate-400/60 bg-white/5'
            } text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-colors`}
          />
          {errors.cityTownship && <FieldError>{errors.cityTownship}</FieldError>}
        </div>

        <div>
          <label
            htmlFor="enquiry-service"
            className="glass-label mb-1.5 block"
          >
            Service Needed <span className="text-cyan-200">*</span>
          </label>
          <select
            id="enquiry-service"
            name="serviceNeeded"
            value={values.serviceNeeded}
            onChange={handleChange}
            className="contact-select form-control-glow w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-400/60 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-colors"
          >
            <option value="new well">New Well Drilling</option>
            <option value="repair">Well Repair</option>
            <option value="pump service">Pump & Tank Service</option>
            <option value="irrigation">Agricultural & Irrigation</option>
            <option value="other">Other Service</option>
          </select>
          {errors.serviceNeeded && <FieldError>{errors.serviceNeeded}</FieldError>}
        </div>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="enquiry-message"
          className="glass-label mb-1.5 block"
        >
          Project Details <span className="text-water-700 font-normal">(optional)</span>
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          rows={2}
          value={values.message}
          onChange={handleChange}
          placeholder="Tell us about your well or water issue..."
          className="glass-field form-control-glow w-full px-3.5 py-2 text-sm rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-colors resize-none"
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
          className="mt-1 size-5 rounded border-2 border-water-700 text-aqua accent-water-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water-700 cursor-pointer"
        />
        <label htmlFor="enquiry-consent" className="glass-consent-text leading-snug cursor-pointer">
          I agree to allow M&J Water Wells to contact me regarding my well estimate.
        </label>
      </div>
      {errors.consent && <FieldError>{errors.consent}</FieldError>}

      {/* Error state alert */}
      {formState === 'error' && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={formState === 'sending'}
          className="w-full rounded-lg font-condensed uppercase tracking-wider text-sm"
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
        </Button>
      </div>
    </form>
  )
}

export default EnquiryForm
