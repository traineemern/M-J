import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-slate-800 mb-1.5"
          >
            {label}
            {props.required && <span className="text-water-700 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-base text-slate-900 shadow-xs transition-colors',
            'placeholder:text-slate-400',
            'focus-visible:border-water-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-500/20',
            'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50',
            error && 'border-red-600 focus-visible:border-red-600 focus-visible:ring-red-600/20',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm font-medium text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold text-slate-800 mb-1.5"
          >
            {label}
            {props.required && <span className="text-water-700 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            'flex w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-xs transition-colors',
            'placeholder:text-slate-400',
            'focus-visible:border-water-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-500/20',
            'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-50',
            error && 'border-red-600 focus-visible:border-red-600 focus-visible:ring-red-600/20',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm font-medium text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
