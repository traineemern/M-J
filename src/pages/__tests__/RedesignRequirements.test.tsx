import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@/test/testUtils'
import { HomePage } from '../HomePage'
import { AboutPage } from '../AboutPage'
import { FaqPage } from '../FaqPage'
import { ContactForm } from '@/features/contact/ContactForm'
import { Button } from '@/components/ui/Button'
import { env } from '@/lib/env'
import { aboutSampleData } from '@/data/about.sample'

describe('redesign requirements', () => {
  it('removes the drilling story heading from the homepage', () => {
    render(<HomePage />)
    expect(screen.queryByText(/see how we drill/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/frequently asked questions/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/how a project moves forward/i)).not.toBeInTheDocument()
  })

  it('shows FAQ cards without a List view switch', () => {
    render(<FaqPage />)
    expect(document.querySelector('[aria-roledescription="carousel"]')).toBeInTheDocument()
    expect(screen.queryByLabelText('List')).not.toBeInTheDocument()
  })

  it('shows confirmation placeholders for unverified about counters', () => {
    render(<AboutPage />)
    expect(screen.getAllByText('[CONFIRM]').length).toBeGreaterThanOrEqual(4)
    expect(screen.queryByText('1,500+')).not.toBeInTheDocument()
  })

  it('keeps sample content in one data file and hides every sample badge in test/production mode', () => {
    expect(env.SHOW_SAMPLE_DATA).toBe(false)
    expect(aboutSampleData.counters).toHaveLength(4)
    render(<AboutPage />)
    expect(document.querySelectorAll('[data-sample-badge]')).toHaveLength(0)
  })

  it('keeps the visible focus cue and pauses the primary pulse off screen', () => {
    render(<Button pulse>Glow test</Button>)
    const button = screen.getByRole('button', { name: 'Glow test' })
    expect(button).toHaveClass('ui-button-glow')
    expect(button).not.toHaveClass('ui-button-glow--pulse')
    button.focus()
    expect(button).toHaveFocus()
  })

  it('uses two mobile form steps and keeps Next validation in place', async () => {
    const previous = window.matchMedia
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} })) as typeof window.matchMedia
    window.innerWidth = 375
    render(<ContactForm />)
    expect(screen.getByText('Step 1 of 2')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText(/Please enter your full name/i)).toBeInTheDocument()
    window.matchMedia = previous
  })
})
