import { describe, it, expect } from 'vitest'
import { contactFormSchema, SERVICE_OPTIONS } from '../schema'

describe('contactFormSchema', () => {
  const validData = {
    name: 'John Miller',
    phone: '(616) 675-4875',
    email: 'john@example.com',
    cityTownship: 'Casnovia',
    serviceNeeded: SERVICE_OPTIONS[0],
    message: 'We need a new residential well drilled for our new house build.',
    consent: true,
    honeypot: '',
  }

  it('passes with valid data', () => {
    const result = contactFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails with empty name', () => {
    const result = contactFormSchema.safeParse({ ...validData, name: '' })
    expect(result.success).toBe(false)
  })

  it('fails with invalid email', () => {
    const result = contactFormSchema.safeParse({ ...validData, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('fails with short phone', () => {
    const result = contactFormSchema.safeParse({ ...validData, phone: '123' })
    expect(result.success).toBe(false)
  })

  it('fails when consent is false', () => {
    const result = contactFormSchema.safeParse({ ...validData, consent: false })
    expect(result.success).toBe(false)
  })

  it('fails when honeypot has content (bot detected)', () => {
    const result = contactFormSchema.safeParse({ ...validData, honeypot: 'spambot content' })
    expect(result.success).toBe(false)
  })

  it('fails with missing service selection', () => {
    const result = contactFormSchema.safeParse({ ...validData, serviceNeeded: '' })
    expect(result.success).toBe(false)
  })

  it('fails with too-short message', () => {
    const result = contactFormSchema.safeParse({ ...validData, message: 'short' })
    expect(result.success).toBe(false)
  })
})
