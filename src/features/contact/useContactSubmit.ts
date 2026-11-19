import { useState } from 'react'
import { env } from '@/lib/env'
import type { ContactFormValues } from './schema'

export interface SubmitState {
  status: 'idle' | 'submitting' | 'success' | 'error'
  errorMessage: string | null
}

export function useContactSubmit() {
  const [state, setState] = useState<SubmitState>({
    status: 'idle',
    errorMessage: null,
  })

  const submitForm = async (data: ContactFormValues): Promise<boolean> => {
    // Check honeypot: if filled, quietly drop without alerting bot
    if (data.honeypot && data.honeypot.trim() !== '') {
      setState({ status: 'success', errorMessage: null })
      return true
    }

    setState({ status: 'submitting', errorMessage: null })

    try {
      // Check if endpoint is still a dummy placeholder in dev/demo
      const isPlaceholder =
        env.FORM_ENDPOINT.includes('placeholder_form_id') ||
        env.FORM_ENDPOINT === ''

      if (isPlaceholder) {
        // In local development or before owner adds their Formspree ID, simulate successful submission
        await new Promise((resolve) => setTimeout(resolve, 800))
        console.info('[M&M Wells Contact Form Demo Submission]:', data)
        setState({ status: 'success', errorMessage: null })
        return true
      }

      // Live submission to Formspree or similar backend endpoint
      const response = await fetch(env.FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          cityTownship: data.cityTownship,
          serviceNeeded: data.serviceNeeded,
          message: data.message,
          consent: data.consent,
          _subject: `New Well Drilling Inquiry from ${data.name} (${data.cityTownship})`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errorMsg =
          errorData?.error ||
          errorData?.errors?.map((e: { message: string }) => e.message).join(', ') ||
          'Submission failed. Please call our office directly.'
        throw new Error(errorMsg)
      }

      setState({ status: 'success', errorMessage: null })
      return true
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please call our office directly.'
      setState({ status: 'error', errorMessage: message })
      return false
    }
  }

  const reset = () => {
    setState({ status: 'idle', errorMessage: null })
  }

  return {
    ...state,
    submitForm,
    reset,
  }
}
