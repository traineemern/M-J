import React, { forwardRef, useState } from 'react'
import { motion } from 'motion/react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

function FieldFeedback({ error, helperText, id }: { error?: string; helperText?: string; id: string }) {
  if (error) return <p id={id} aria-live="polite" className="field-error"><AlertCircle aria-hidden="true" size={16} />{error}</p>
  if (helperText) return <p id={id} className="field-hint">{helperText}</p>
  return null
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, helperText, id, onFocus, onBlur, ...props }, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  const feedbackId = `${inputId}-feedback`
  const [focused, setFocused] = useState(false)
  const reduce = useReducedMotion()
  return <div className="form-field-glow w-full">
    {label && <motion.label htmlFor={inputId} className="glass-label mb-1.5 block" animate={{ y: focused ? -2 : 0, color: focused ? '#a5f3fc' : undefined }} transition={{ duration: reduce ? 0.01 : 0.2 }}>{label}{props.required && <span className="ml-1 text-cyan-200">*</span>}</motion.label>}
    <div className="form-control-shell" data-invalid={Boolean(error)}>
      <input id={inputId} ref={ref} onFocus={(event) => { setFocused(true); onFocus?.(event) }} onBlur={(event) => { setFocused(false); onBlur?.(event) }} aria-invalid={Boolean(error)} aria-describedby={error || helperText ? feedbackId : props['aria-describedby']} className={cn('glass-field form-control-glow flex h-11 w-full rounded-lg border px-3.5 py-2 text-base shadow-xs focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50', error && 'is-invalid', className)} {...props} />
    </div>
    <FieldFeedback id={feedbackId} error={error} helperText={helperText} />
  </div>
})
Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, helperText, id, rows = 4, onFocus, onBlur, ...props }, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  const feedbackId = `${inputId}-feedback`
  const [focused, setFocused] = useState(false)
  const reduce = useReducedMotion()
  return <div className="form-field-glow w-full">
    {label && <motion.label htmlFor={inputId} className="glass-label mb-1.5 block" animate={{ y: focused ? -2 : 0, color: focused ? '#a5f3fc' : undefined }} transition={{ duration: reduce ? 0.01 : 0.2 }}>{label}{props.required && <span className="ml-1 text-cyan-200">*</span>}</motion.label>}
    <div className="form-control-shell" data-invalid={Boolean(error)}>
      <textarea id={inputId} ref={ref} rows={rows} onFocus={(event) => { setFocused(true); onFocus?.(event) }} onBlur={(event) => { setFocused(false); onBlur?.(event) }} aria-invalid={Boolean(error)} aria-describedby={error || helperText ? feedbackId : props['aria-describedby']} className={cn('glass-field form-control-glow flex w-full rounded-lg border px-3.5 py-2.5 text-base shadow-xs focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50', error && 'is-invalid', className)} {...props} />
    </div>
    <FieldFeedback id={feedbackId} error={error} helperText={helperText} />
  </div>
})
Textarea.displayName = 'Textarea'
