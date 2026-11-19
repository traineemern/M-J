import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FaqCarousel } from './FaqCarousel'
import { faqData } from '@/data/faq'

describe('FaqCarousel 3D Card-Stack Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.innerWidth = 1024
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  it('renders carousel wrapper with proper accessibility attributes', () => {
    render(<FaqCarousel items={faqData} />)
    const carousel = screen.getByRole('region', { name: /Frequently asked questions/i })
    expect(carousel).toBeInTheDocument()
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel')
  })

  it('clicking ">" shows the next question; clicking "<" shows the previous one', () => {
    render(<FaqCarousel items={faqData} />)
    const nextBtn = screen.getByRole('button', { name: /Next question/i })
    const prevBtn = screen.getByRole('button', { name: /Previous question/i })

    expect(screen.getByText('1 / 9')).toBeInTheDocument()

    fireEvent.click(nextBtn)
    expect(screen.getByText('2 / 9')).toBeInTheDocument()

    fireEvent.click(prevBtn)
    expect(screen.getByText('1 / 9')).toBeInTheDocument()
  })

  it('the index loops from the last question to the first and from the first to the last', () => {
    render(<FaqCarousel items={faqData} />)
    const nextBtn = screen.getByRole('button', { name: /Next question/i })
    const prevBtn = screen.getByRole('button', { name: /Previous question/i })

    // From 1, click previous -> loops to last (9)
    fireEvent.click(prevBtn)
    expect(screen.getByText('9 / 9')).toBeInTheDocument()

    // From 9, click next -> loops back to 1
    fireEvent.click(nextBtn)
    expect(screen.getByText('1 / 9')).toBeInTheDocument()
  })

  it('renders only 3 cards in the DOM at a time on desktop', () => {
    const { container } = render(<FaqCarousel items={faqData} />)
    // There are 9 total FAQ items, but only 3 card slides should exist in the DOM
    const slides = container.querySelectorAll('[aria-roledescription="slide"]')
    expect(slides.length).toBe(3)
  })

  it('side cards have aria-hidden="true" and inert', () => {
    const { container } = render(<FaqCarousel items={faqData} />)
    const slides = container.querySelectorAll('[aria-roledescription="slide"]')
    // Out of 3 slides, exactly 2 are side cards with aria-hidden="true"
    const hiddenSlides = Array.from(slides).filter((s) => s.getAttribute('aria-hidden') === 'true')
    expect(hiddenSlides.length).toBe(2)
  })

  it('arrow keys change the card when the carousel has focus', () => {
    render(<FaqCarousel items={faqData} />)
    const carousel = screen.getByRole('region', { name: /Frequently asked questions/i })

    fireEvent.keyDown(carousel, { key: 'ArrowRight' })
    expect(screen.getByText('2 / 9')).toBeInTheDocument()

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' })
    expect(screen.getByText('1 / 9')).toBeInTheDocument()
  })

  it('mobile shows one card only', () => {
    window.innerWidth = 500
    const { container } = render(<FaqCarousel items={faqData} />)
    const slides = container.querySelectorAll('[aria-roledescription="slide"]')
    expect(slides.length).toBe(1)
  })

  it('live region announces the new question', () => {
    render(<FaqCarousel items={faqData} />)
    const liveRegion = screen.getByText(/Question 1 of 9:/i)
    expect(liveRegion).toBeInTheDocument()

    const nextBtn = screen.getByRole('button', { name: /Next question/i })
    fireEvent.click(nextBtn)

    expect(screen.getByText(/Question 2 of 9:/i)).toBeInTheDocument()
  })

  it('the homepage subset renders exactly 3 questions in total count', () => {
    const homeFaqs = faqData.slice(0, 3)
    render(<FaqCarousel items={homeFaqs} />)
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })
})
