import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { EnquiryProvider } from '@/features/enquiry/EnquiryContext'
import { Header } from './Header'

function renderHeader(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <EnquiryProvider><Header /></EnquiryProvider>
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
})

describe('responsive site header', () => {
  it('renders all desktop navigation routes and the phone and estimate actions', () => {
    renderHeader()
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(nav.querySelectorAll('a')).toHaveLength(5)
    expect(screen.getByRole('link', { name: /\(616\) 675-4875/ })).toHaveAttribute('href', 'tel:+16166754875')
    expect(screen.getByRole('button', { name: /Free estimate/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens the mobile menu, sets aria-expanded, and locks page scrolling', async () => {
    renderHeader()
    expect(document.getElementById('mobile-menu')?.hasAttribute('hidden')).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    const mobileNav = await screen.findByRole('navigation', { name: 'Main mobile navigation' })
    expect(screen.getByRole('button', { name: 'Close menu', expanded: true })).toBeInTheDocument()
    expect(mobileNav).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')
    await waitFor(() => expect(within(mobileNav).getByRole('link', { name: 'Home' })).toHaveFocus())
  })

  it('closes on Escape and restores focus to the menu button', async () => {
    renderHeader()
    const menuButton = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(menuButton)
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => expect(menuButton).toHaveFocus(), { timeout: 1000 })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(document.body.style.overflow).toBe('')
  })

  it('closes the menu after a mobile link is selected', async () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    const mobileNav = await screen.findByRole('navigation', { name: 'Main mobile navigation' })
    fireEvent.click(within(mobileNav).getByRole('link', { name: 'Services' }))
    expect(mobileNav).toHaveAttribute('aria-hidden', 'true')
  })

  it('marks the active desktop route with aria-current', () => {
    renderHeader('/services')
    expect(screen.getByRole('navigation', { name: 'Main' }).querySelector('a[href="/services"]')).toHaveAttribute('aria-current', 'page')
  })

  it('marks the selected route as current in the open mobile panel', async () => {
    renderHeader('/services')
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    const mobileNav = await screen.findByRole('navigation', { name: 'Main mobile navigation' })
    expect(within(mobileNav).getByRole('link', { name: 'Services' })).toHaveAttribute('aria-current', 'page')
  })

  it('switches to the solid background after 80px of scroll', async () => {
    const { container } = renderHeader()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 100 })
    fireEvent.scroll(window)
    await waitFor(() => expect(container.querySelector('header')).toHaveClass('bg-water-950/[0.92]'))
  })
})
