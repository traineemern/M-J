import React, { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { AlertCircle, Phone, ArrowRight, Loader2 } from 'lucide-react'
import { SuccessCheck } from './SuccessCheck'
import { siteContent, siteData } from '@/data/site'
import { Button } from '@/components/ui/Button'
import { shakeMotionTarget } from '@/lib/motion/useMotion'

const enquirySchema = z.object({
  name: z
    .string()
    .min(2, { message: siteContent.contact.form.validation.name.value })
    .max(100),
  phone: z
    .string()
    .min(10, { message: siteContent.contact.form.validation.phone.value })
    .regex(/^[0-9+()\-.\s]{10,20}$/, { message: siteContent.contact.form.validation.phoneFormat.value }),
  email: z
    .string()
    .email({ message: siteContent.contact.form.validation.email.value })
    .max(120),
  cityTownship: z
    .string()
    .min(2, { message: siteContent.contact.form.validation.city.value })
    .max(80),
  serviceNeeded: z.enum(
    ['new well', 'repair', 'pump service', 'irrigation', 'other'],
    { errorMap: () => ({ message: siteContent.contact.form.validation.service.value }) },
  ),
  preferredTime: z.enum(['morning', 'afternoon', 'evening']).or(z.literal('')).optional(),
  message: z.string().max(2000).optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: siteContent.contact.form.validation.consent.value,
  }),
  honeypot: z.string().max(0, { message: 'Bot detected' }).optional(),
})

function FieldError({ children, id }: { children: string; id?: string }) {
  return <p id={id} role="alert" className="field-error"><AlertCircle aria-hidden="true" size={16} />{children}</p>
}

export type EnquiryFormValues = z.infer<typeof enquirySchema>

interface EnquiryFormProps {
  initialService?: string
  initialTown?: string
  onSuccess?: () => void
  onClose?: () => void
  source?: string
  className?: string
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialService,
  initialTown,
  onClose,
  source = 'enquiry_popup',
  className = '',
}) => {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error' | 'unconfigured'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormValues, string>>>({})
  const formRef = useRef<HTMLFormElement>(null)

  const [values, setValues] = useState<{
    name: string
    phone: string
    email: string
    cityTownship: string
    serviceNeeded: string
    preferredTime: '' | 'morning' | 'afternoon' | 'evening'
    message: string
    consent: boolean
    honeypot: string
  }>({
    name: '',
    phone: '',
    email: '',
    cityTownship: initialTown || '',
    serviceNeeded: initialService || 'new well',
    preferredTime: '',
    message: '',
    consent: false,
    honeypot: '',
  })

  useEffect(() => {
    setValues((current) => ({
      ...current,
      cityTownship: initialTown ?? current.cityTownship,
      serviceNeeded: initialService ?? current.serviceNeeded,
    }))
  }, [initialService, initialTown])

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
      if (formRef.current) void shakeMotionTarget(formRef.current)
      return
    }

    const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim()
    if (!endpoint || endpoint.includes('placeholder_form_id')) {
      setFormState('unconfigured')
      return
    }

    setFormState('sending')
    setErrorMessage('')

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...result.data,
          source,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Server returned an error')
      }

      setFormState('success')
    } catch {
      setFormState('error')
      setErrorMessage(`${siteContent.contact.form.error.value} ${siteData.phone}.`)
    }
  }

  if (formState === 'unconfigured') {
    return (
      <div className="enquiry-fallback" role="status" aria-live="polite">
        <p>{siteContent.contact.form.phoneFallback.value}</p>
        <a href={`tel:${siteData.phoneClean}`} className="night-button">
          <Phone aria-hidden="true" size={17} /> {siteData.phone}
        </a>
        <button type="button" className="enquiry-fallback__back" onClick={() => setFormState('idle')}>
          {siteContent.contact.form.backToForm.value}
        </button>
      </div>
    )
  }

  if (formState === 'success') {
    return (
      <div className="enquiry-success text-center py-6 space-y-4" role="status" aria-live="polite">
        <SuccessCheck />
        <h3 className="text-2xl font-black text-slate-900 font-condensed uppercase tracking-tight">
          {siteContent.contact.form.successTitle.value}
        </h3>
        <p className="text-base text-slate-700 leading-relaxed max-w-sm mx-auto">
          {siteContent.contact.form.successPrefix.value} {siteContent.contact.responseHours.value} hours.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`tel:${siteData.phoneClean}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-water-600 hover:bg-water-700 text-white font-condensed font-bold uppercase tracking-wider text-sm transition-colors"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>{siteContent.contact.form.callNow.value} {siteData.phone}</span>
          </a>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-condensed font-bold uppercase tracking-wider text-sm transition-colors cursor-pointer"
            >
              {siteContent.contact.form.close.value}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <form ref={formRef} data-shake onSubmit={handleSubmit} noValidate className={`enquiry-form space-y-4 ${className}`} aria-live="polite">
      {/* Honeypot field (hidden from screen and tab order) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="enquiry-honeypot">{siteContent.contact.form.honeypot.value}</label>
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
      <div className="contact-field">
        <label
          htmlFor="enquiry-name"
          className="glass-label mb-1.5 block"
        >
          {siteContent.contact.form.fullName.value} <span className="text-cyan-200">{siteContent.contact.form.required.value}</span>
        </label>
        <input
          id="enquiry-name"
          type="text"
          name="name"
          required
          value={values.name}
          onChange={handleChange}
          placeholder={siteContent.contact.form.namePlaceholder.value}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
          className={`glass-field form-control-glow w-full px-3.5 py-2.5 text-sm rounded-lg border ${
            errors.name ? 'border-red-300 bg-red-950/30' : 'border-slate-400/60 bg-white/5'
          } text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-colors`}
        />
        {errors.name && <FieldError id="enquiry-name-error">{errors.name}</FieldError>}
      </div>

      {/* Phone & Email in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="contact-field">
          <label
            htmlFor="enquiry-phone"
            className="glass-label mb-1.5 block"
          >
            {siteContent.contact.form.phone.value} <span className="text-cyan-200">{siteContent.contact.form.required.value}</span>
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            name="phone"
            required
            value={values.phone}
            onChange={handleChange}
            placeholder={siteContent.contact.form.phonePlaceholder.value}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'enquiry-phone-error' : undefined}
            className={`glass-field form-control-glow w-full px-3.5 py-2.5 text-sm rounded-lg border ${
              errors.phone ? 'border-red-300 bg-red-950/30' : 'border-slate-400/60 bg-white/5'
            } text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-colors`}
          />
          {errors.phone && <FieldError id="enquiry-phone-error">{errors.phone}</FieldError>}
        </div>

        <div className="contact-field">
          <label
            htmlFor="enquiry-email"
            className="glass-label mb-1.5 block"
          >
            {siteContent.contact.form.email.value} <span className="text-cyan-200">{siteContent.contact.form.required.value}</span>
          </label>
          <input
            id="enquiry-email"
            type="email"
            name="email"
            required
            value={values.email}
            onChange={handleChange}
            placeholder={siteContent.contact.form.emailPlaceholder.value}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'enquiry-email-error' : undefined}
            className={`glass-field form-control-glow w-full px-3.5 py-2.5 text-sm rounded-lg border ${
              errors.email ? 'border-red-300 bg-red-950/30' : 'border-slate-400/60 bg-white/5'
            } text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-colors`}
          />
          {errors.email && <FieldError id="enquiry-email-error">{errors.email}</FieldError>}
        </div>
      </div>

      {/* City/Township & Service Needed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="contact-field">
          <label
            htmlFor="enquiry-city"
            className="glass-label mb-1.5 block"
          >
            {siteContent.contact.form.city.value} <span className="text-cyan-200">{siteContent.contact.form.required.value}</span>
          </label>
          <input
            id="enquiry-city"
            type="text"
            name="cityTownship"
            required
            value={values.cityTownship}
            onChange={handleChange}
            placeholder={siteContent.contact.form.cityPlaceholder.value}
            aria-invalid={Boolean(errors.cityTownship)}
            aria-describedby={errors.cityTownship ? 'enquiry-city-error' : undefined}
            className={`glass-field form-control-glow w-full px-3.5 py-2.5 text-sm rounded-lg border ${
              errors.cityTownship ? 'border-red-300 bg-red-950/30' : 'border-slate-400/60 bg-white/5'
            } text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-colors`}
          />
          {errors.cityTownship && <FieldError id="enquiry-city-error">{errors.cityTownship}</FieldError>}
        </div>

        <div className="contact-field">
          <label
            htmlFor="enquiry-service"
            className="glass-label mb-1.5 block"
          >
            {siteContent.contact.form.service.value} <span className="text-cyan-200">{siteContent.contact.form.required.value}</span>
          </label>
          <select
            id="enquiry-service"
            name="serviceNeeded"
            required
            value={values.serviceNeeded}
            onChange={handleChange}
            aria-invalid={Boolean(errors.serviceNeeded)}
            aria-describedby={errors.serviceNeeded ? 'enquiry-service-error' : undefined}
            className="contact-select form-control-glow w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-400/60 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-colors"
          >
            {siteContent.contact.form.serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label.value}</option>
            ))}
          </select>
          {errors.serviceNeeded && <FieldError id="enquiry-service-error">{errors.serviceNeeded}</FieldError>}
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor="enquiry-time" className="glass-label mb-1.5 block">{siteContent.contact.form.preferredTime.value}</label>
        <select
          id="enquiry-time"
          name="preferredTime"
          value={values.preferredTime}
          onChange={handleChange}
          className="contact-select form-control-glow w-full px-3.5 py-2.5 text-sm rounded-lg border"
        >
          {siteContent.contact.form.contactTimes.map((time) => (
            <option key={time.value || 'none'} value={time.value}>{time.label.value}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="contact-field">
        <label
          htmlFor="enquiry-message"
          className="glass-label mb-1.5 block"
        >
          {siteContent.contact.form.message.value} <span className="text-water-700 font-normal">({siteContent.contact.form.optional.value})</span>
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          rows={2}
          value={values.message}
          onChange={handleChange}
          placeholder={siteContent.contact.form.messagePlaceholder.value}
          className="glass-field form-control-glow w-full px-3.5 py-2 text-sm rounded-lg border text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/50 transition-colors resize-none"
        />
      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start gap-2 pt-1">
        <input
          id="enquiry-consent"
          type="checkbox"
          name="consent"
          required
          checked={values.consent}
          onChange={handleChange}
          className="mt-1 size-5 rounded border-2 border-water-700 text-aqua accent-water-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-water-700 cursor-pointer"
        />
        <label htmlFor="enquiry-consent" className="glass-consent-text leading-snug cursor-pointer">
          {siteContent.contact.form.consent.value}
        </label>
      </div>
      {errors.consent && <FieldError>{errors.consent}</FieldError>}

      {/* Error state alert */}
      {formState === 'error' && (
        <div className="p-3 rounded-lg bg-red-950/35 border border-red-400/40 flex items-center gap-2 text-sm text-red-100" role="alert" aria-live="assertive">
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
              <span>{siteContent.contact.form.sending.value}</span>
            </>
          ) : (
            <>
              <span>{siteContent.contact.form.submit.value}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default EnquiryForm
