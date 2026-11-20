import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, AlertCircle, Loader2, Send, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { contactFormSchema, type ContactFormValues, SERVICE_OPTIONS } from './schema'
import { useContactSubmit } from './useContactSubmit'
import { siteData } from '@/data/site'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Glass } from '@/components/ui/Glass'

interface ContactFormProps {
  id?: string
  title?: string
  subtitle?: string
  className?: string
}

export function ContactForm({
  id = 'contact-estimate',
  title = 'Get a Free Estimate',
  subtitle = "Tell us about your property location and water needs. We will review Michigan well logs for your area and provide an honest, accurate estimate.",
  className = '',
}: ContactFormProps) {
  const { status, errorMessage, submitForm, reset } = useContactSubmit()
  const isMobile = useIsMobile(640)
  const [step, setStep] = useState<1 | 2>(1)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset: resetForm,
    trigger,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      cityTownship: '',
      serviceNeeded: '',
      preferredTime: undefined,
      message: '',
      consent: false,
      honeypot: '',
    },
  })

  const onSubmit = async (values: ContactFormValues) => {
    const success = await submitForm(values)
    if (success) {
      resetForm()
    }
  }

  return (
    <Glass
      id={id}
      variant="panel"
      shimmer
      className={`contact-art-panel rounded-2xl border border-white/10 p-6 sm:p-10 ${className}`}
    >
      {/* Header */}
      {(title || subtitle) && <div className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-cyan-200 mb-2 font-condensed">
          Family-Owned • Free Estimates • Fast Scheduling
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-condensed uppercase">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>}

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            role="status"
            className="rounded-xl bg-slate-900 border border-cyan-400/40 p-6 sm:p-8 text-center space-y-4 text-white"
          >
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-condensed uppercase tracking-wide">
              Thank You! We Have Received Your Request.
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Thanks. We will call you within [CONFIRM hours] hours.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  reset()
                  resetForm()
                }}
              >
                Submit Another Request
              </Button>
              <Button
                href={`tel:${siteData.phoneClean}`}
                variant="primary"
                size="sm"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Call Us Now: {siteData.phone}</span>
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="contact-form-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="contact-form-fields space-y-5"
            aria-live="polite"
            noValidate
          >
            {/* Error Banner with animation */}
            {status === 'error' && errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="p-4 rounded-lg bg-red-950/35 border border-red-400/40 text-red-100 text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-water-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Unable to submit form</p>
                  <p className="field-error-text mt-1">{errorMessage}</p>
                  <p className="field-hint mt-1">
                    Please call us directly at{' '}
                    <a
                      href={`tel:${siteData.phoneClean}`}
                      className="font-bold underline text-water-700"
                    >
                      {siteData.phone}
                    </a>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Honeypot field (hidden from view) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website-field">Leave this empty</label>
              <input
                id="website-field"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register('honeypot')}
              />
            </div>

            {/* Row 1: Name and Phone */}
            <div hidden={isMobile && step !== 1} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="e.g. John Miller"
                required
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="(616) 675-4875"
                required
                error={errors.phone?.message}
                helperText="Tap-to-call response line"
                {...register('phone')}
              />
            </div>

            {/* Email is on step two on mobile; town stays on step one. */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div hidden={isMobile && step !== 2}>
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                required
                error={errors.email?.message}
                {...register('email')}
              />
              </div>
              <div hidden={isMobile && step !== 1}>
              <Input
                label="City or Township (Michigan)"
                placeholder="e.g. Casnovia, Sand Lake, Newaygo, Fremont"
                required
                error={errors.cityTownship?.message}
                helperText="Helps us look up Michigan well depth logs"
                {...register('cityTownship')}
              />
              </div>
            </div>

            {/* Row 3: Service Needed */}
            <div hidden={isMobile && step !== 2}>
              <label
                htmlFor="service-select"
                className="glass-label mb-1.5 block"
              >
                Service Needed <span className="text-water-700">*</span>
              </label>
              <select
                id="service-select"
                aria-invalid={Boolean(errors.serviceNeeded)}
                className={`contact-select form-control-glow flex h-11 w-full rounded-lg border bg-transparent px-3.5 py-2 text-base text-white shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                  errors.serviceNeeded
                    ? 'border-red-600 focus-visible:border-red-600 focus-visible:ring-red-600/20'
                    : 'border-slate-300 focus-visible:border-water-600 focus-visible:ring-water-500/20'
                }`}
                defaultValue=""
                {...register('serviceNeeded')}
              >
                <option value="" disabled>
                  Select a well or pump service...
                </option>
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.serviceNeeded && <p className="field-error mt-1.5"><AlertCircle size={16} aria-hidden="true" />{errors.serviceNeeded.message}</p>}
            </div>

            <div hidden={isMobile && step !== 2}>
              <label htmlFor="preferred-time" className="glass-label mb-1.5 block">Preferred contact time</label>
              <select id="preferred-time" className="contact-select form-control-glow flex h-11 w-full rounded-lg border border-slate-500 bg-transparent px-3.5 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-500" {...register('preferredTime')}>
                <option value="">No preference</option><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option>
              </select>
            </div>

            {/* Row 4: Message */}
            <div hidden={isMobile && step !== 2}>
            <Textarea
              label="Project or Problem Description"
              rows={4}
              placeholder="Tell us about your project: new construction vs replacement well, current water pressure problems, agricultural acreage, or timeframe..."
              required
              error={errors.message?.message}
              {...register('message')}
            />
            </div>

            {/* Row 5: Consent Checkbox */}
            <div hidden={isMobile && step !== 2} className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="mt-1 size-5 rounded border-2 border-white text-aqua accent-aqua focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
                  {...register('consent')}
                />
                <span className="glass-consent-text">
                  I agree to allow M&J Water Wells to contact me by phone or email regarding this estimate request.
                </span>
              </label>
              {errors.consent && <p aria-live="polite" className="field-error mt-1.5"><AlertCircle size={16} aria-hidden="true" />{errors.consent.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              {isMobile && <div className="mb-4" aria-label={`Step ${step} of 2`}><div className="mb-1 text-xs font-bold uppercase text-water-700">Step {step} of 2</div><div className="contact-progress h-2 overflow-hidden rounded-full bg-water-100" style={{ '--progress': step === 1 ? '50%' : '100%' } as React.CSSProperties}><div className={`h-full bg-water-600 transition-[width] ${step === 1 ? 'w-1/2' : 'w-full'}`} /></div></div>}
              {isMobile && step === 1 ? <Button type="button" className="w-full" onClick={async () => { const valid = await trigger(['name', 'phone', 'cityTownship']); if (valid) setStep(2) }}>Next</Button> : null}
              {isMobile && step === 2 ? <Button type="button" variant="outline" className="mb-3 w-full" onClick={() => setStep(1)}>Back</Button> : null}
              {(!isMobile || step === 2) && <>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting || status === 'submitting'}
                className="w-full text-base sm:text-lg font-condensed uppercase tracking-wider"
              >
                {isSubmitting || status === 'submitting' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Your Estimate Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Free Estimate Request</span>
                  </>
                )}
              </Button>
              <p className="text-center text-[13px] text-slate-300 mt-2.5">
                Prefer speaking directly with a driller right now? Call{' '}
                <a
                  href={`tel:${siteData.phoneClean}`}
                  className="font-bold text-water-700 hover:underline"
                >
                  {siteData.phone}
                </a>
              </p>
              </>}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Glass>
  )
}
