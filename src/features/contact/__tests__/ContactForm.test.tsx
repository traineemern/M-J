import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/testUtils'
import { ContactForm } from '../ContactForm'

describe('ContactForm', () => {
  it('renders form title', () => {
    render(<ContactForm />)
    expect(
      screen.getByText('Get a Free Estimate'),
    ).toBeInTheDocument()
  })

  it('renders all required fields', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/City or Township/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Service Needed/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Project or Problem Description/i)).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    render(<ContactForm />)
    expect(
      screen.getByRole('button', { name: /Send Free Estimate Request/i }),
    ).toBeInTheDocument()
  })

  it('renders consent checkbox', () => {
    render(<ContactForm />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('honeypot field is hidden from view', () => {
    render(<ContactForm />)
    const honeypot = screen.getByLabelText(/Leave this empty/i)
    expect(honeypot).toBeInTheDocument()
    expect(honeypot.closest('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('renders custom title when provided', () => {
    render(<ContactForm title="Custom Title for Test" />)
    expect(screen.getByText('Custom Title for Test')).toBeInTheDocument()
  })
})
