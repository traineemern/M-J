import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@/test/testUtils'
import { HomePage } from '../HomePage'
import { AboutPage } from '../AboutPage'
import { FaqPage } from '../FaqPage'
import { ContactForm } from '@/features/contact/ContactForm'
import { Button } from '@/components/ui/Button'
import { env } from '@/lib/env'
import { aboutSampleData } from '@/data/about.sample'
import { Testimonials } from '@/sections/homepage/Testimonials'
import { ServicesGrid } from '@/sections/homepage/ServicesGrid'
import { Header } from '@/layout/Header'
import { servicesShowcaseData } from '@/data/services-showcase'
import { ServicesPage } from '../ServicesPage'
import { ContactPage } from '../ContactPage'

describe('redesign requirements', () => {
  it('removes the drilling story heading from the homepage', () => {
    render(<HomePage />)
    expect(screen.queryByText(/see how we drill/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/frequently asked questions/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/how a project moves forward/i)).not.toBeInTheDocument()
    expect(document.querySelector('.home-availability')).not.toBeInTheDocument()
  })

  it('uses the supplied six-image collage for the homepage project carousel', () => {
    render(<HomePage />)
    const collageTiles = document.querySelectorAll('.home-project-card__image')
    expect(collageTiles).toHaveLength(6)
    collageTiles.forEach((tile) => expect(tile.getAttribute('style')).toContain('project-collage.webp'))
    expect(screen.queryByRole('link', { name: /view all projects/i })).not.toBeInTheDocument()
    expect(document.querySelectorAll('.home-project-card a')).toHaveLength(0)
    expect(document.querySelectorAll('.content-dummy-badge')).toHaveLength(0)
  })

  it('cycles the three supplied customer reviews and paired photos together', () => {
    render(<Testimonials />)
    expect(screen.getByText(/M&I Water Wells did an excellent job installing our new water well/)).toBeInTheDocument()
    expect(screen.getByAltText('Customers standing together in front of an M&J Water Wells drilling rig.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next testimonial' }))
    expect(screen.getByText(/Great experience from start to finish/)).toBeInTheDocument()
    expect(screen.getByAltText('An M&J Water Wells team member shaking hands with a customer beside a drilling rig.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Go to testimonial 3' }))
    expect(screen.getByText(/The team was knowledgeable and professional/)).toBeInTheDocument()
    expect(screen.getByAltText('A family standing beside an M&J Water Wells drilling rig near their home.')).toBeInTheDocument()
  })

  it('uses the supplied team photo and home customer photos in the Services page', async () => {
    expect(servicesShowcaseData.testimonials.map((testimonial) => testimonial.image)).toEqual([
      '/images/customer-couple.webp',
      '/images/customer-handshake.webp',
      '/images/customer-family.webp',
    ])
    render(<ServicesPage />)
    const firstImage = await screen.findByAltText('Customers standing together in front of an M&J Water Wells drilling rig.')
    expect(firstImage).toHaveAttribute('src', '/images/customer-couple.webp')
    const teamImage = screen.getByAltText('M&J Water Wells team members standing in front of their drilling rig.')
    expect(teamImage).toHaveAttribute('src', '/images/about-team.jpg')
  })

  it('removes the Contact page hero section while keeping a page heading', () => {
    render(<ContactPage />)
    expect(document.querySelector('.contact-reference__hero')).not.toBeInTheDocument()
    expect(document.querySelector('.contact-reference__hero-image')).not.toBeInTheDocument()
    expect(document.querySelector('.contact-reference__cards')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Contact M&J Water Wells' })).toBeInTheDocument()
  })

  it('keeps Services as a direct navbar link without a dropdown', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services')
    expect(screen.queryByRole('button', { name: 'Browse services' })).not.toBeInTheDocument()
  })

  it('shows the FAQ category navigation and answers without a List view switch', () => {
    render(<FaqPage />)
    expect(screen.getByAltText('M&J Water Wells office, drilling rig, and service truck in Newaygo.')).toHaveAttribute('src', '/images/faq-office.webp')
    expect(screen.getByRole('navigation', { name: 'Filter questions by category' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /General/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /What services do you offer/ })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.queryByLabelText('List')).not.toBeInTheDocument()
  })

  it('uses the four supplied photos for the homepage services cards', () => {
    render(<ServicesGrid />)
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('.home-service-card > img'))
    expect(images).toHaveLength(4)
    expect(images.map((image) => image.getAttribute('src'))).toEqual([
      '/images/service-drilling-rig.webp',
      '/images/service-farm-well.webp',
      '/images/service-water-flow.webp',
      '/images/service-pressure-tank.webp',
    ])
  })

  it('renders the redesigned About page without the removed equipment section', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { name: /About M&J Water Wells/ })).toBeInTheDocument()
    expect(screen.queryByText('The equipment behind the work.')).not.toBeInTheDocument()
  })

  it('keeps sample content in one data file and does not render dummy badges', () => {
    expect(env.SHOW_SAMPLE_DATA).toBe(false)
    expect(aboutSampleData.counters).toHaveLength(4)
    render(<AboutPage />)
    expect(document.querySelectorAll('.content-dummy-badge')).toHaveLength(0)
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
