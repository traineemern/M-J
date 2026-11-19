import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, AlertCircle, Loader2, Send, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { contactFormSchema, type ContactFormValues, SERVICE_OPTIONS } from './schema'
import { useContactSubmit } from './useContactSubmit'
import { siteData } from '@/data/site'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset: resetForm,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      cityTownship: '',
      serviceNeeded: '',
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
    <div
      id={id}
      className={`bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-10 ${className}`}
    >
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-water-700 mb-2 font-condensed">
          Family-Owned • Free Estimates • Fast Scheduling
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-ink-dark tracking-tight font-condensed uppercase">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-ink text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            role="status"
            className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 sm:p-8 text-center space-y-4"
          >
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-condensed uppercase tracking-wide">
              Thank You! We Have Received Your Request.
            </h3>
            <p className="text-sm text-ink max-w-md mx-auto">
              Our Casnovia drilling team has received your information. We are checking the local aquifer depth for your area and will contact you promptly.
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
            className="space-y-5"
            noValidate
          >
            {/* Error Banner with animation */}
            {status === 'error' && errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-water-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Unable to submit form</p>
                  <p className="text-xs mt-0.5 text-red-700">{errorMessage}</p>
                  <p className="text-xs mt-1 text-ink">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Row 2: Email and City / Township */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                required
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="City or Township (Michigan)"
                placeholder="e.g. Casnovia, Sand Lake, Newaygo, Fremont"
                required
                error={errors.cityTownship?.message}
                helperText="Helps us look up Michigan well depth logs"
                {...register('cityTownship')}
              />
            </div>

            {/* Row 3: Service Needed */}
            <div>
              <label
                htmlFor="service-select"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Service Needed <span className="text-water-700">*</span>
              </label>
              <select
                id="service-select"
                className={`flex h-11 w-full rounded-lg border bg-white px-3.5 py-2 text-base text-slate-900 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 ${
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
              {errors.serviceNeeded && (
                <p className="mt-1.5 text-sm font-medium text-red-600">
                  {errors.serviceNeeded.message}
                </p>
              )}
            </div>

            {/* Row 4: Message */}
            <Textarea
              label="Project or Problem Description"
              rows={4}
              placeholder="Tell us about your project: new construction vs replacement well, current water pressure problems, agricultural acreage, or timeframe..."
              required
              error={errors.message?.message}
              {...register('message')}
            />

            {/* Row 5: Consent Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-water-600 focus:ring-water-600 focus:ring-offset-0 cursor-pointer"
                  {...register('consent')}
                />
                <span className="text-xs sm:text-sm text-ink group-hover:text-ink-dark">
                  I agree to allow M&J Water Wells to contact me by phone or email regarding this estimate request. We respect your privacy and never share information.
                </span>
              </label>
              {errors.consent && (
                <p className="mt-1.5 text-sm font-medium text-red-600">
                  {errors.consent.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
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
              <p className="text-center text-xs text-ink-light mt-2.5">
                Prefer speaking directly with a driller right now? Call{' '}
                <a
                  href={`tel:${siteData.phoneClean}`}
                  className="font-bold text-water-700 hover:underline"
                >
                  {siteData.phone}
                </a>
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
