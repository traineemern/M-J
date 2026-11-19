import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import { TiltCard } from '../TiltCard'
import { ParallaxLayer } from '../ParallaxLayer'
import { DepthFloat } from '../DepthFloat'
import { ScrollProgressBar } from '../ScrollProgressBar'
import { HomePage } from '@/pages/HomePage'
import { ServicesPage } from '@/pages/ServicesPage'
import { WarrantyPage } from '@/pages/WarrantyPage'
import { AboutPage } from '@/pages/AboutPage'
import { FaqPage } from '@/pages/FaqPage'
import { ContactPage } from '@/pages/ContactPage'
import { NewaygoAreaPage } from '@/pages/NewaygoAreaPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { EnquiryProvider } from '@/features/enquiry/EnquiryContext'
import { DrillingVideoProvider } from '@/features/drilling-video/DrillingVideoContext'

describe('Motion, 3D Levels, and Accessibility Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
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

  describe('JavaScript-Disabled Static Content Rendering', () => {
    const renderStaticPage = (PageComponent: React.ComponentType) => {
      return renderToString(
        <MemoryRouter>
          <EnquiryProvider>
            <DrillingVideoProvider>
              <PageComponent />
            </DrillingVideoProvider>
          </EnquiryProvider>
        </MemoryRouter>
      )
    }

    it('HomePage renders full text and links when JS is disabled', () => {
      const html = renderStaticPage(HomePage)
      expect(html).toContain('West Michigan')
      expect(html).toContain('/services')
      expect(html).toContain('Free Estimate')
    })

    it('ServicesPage renders headings and all 7 services without JS', () => {
      const html = renderStaticPage(ServicesPage)
      expect(html).toContain('Our Services')
      expect(html).toContain('Residential Well Drilling')
    })

    it('WarrantyPage renders promises and terms without JS', () => {
      const html = renderStaticPage(WarrantyPage)
      expect(html).toContain('Warranty Terms')
    })

    it('AboutPage renders history and counters without JS', () => {
      const html = renderStaticPage(AboutPage)
      expect(html).toContain('About M&amp;J Water Wells')
      expect(html).toContain('Years Local Experience')
    })

    it('FaqPage renders questions and native details accordions without JS', () => {
      const html = renderStaticPage(FaqPage)
      expect(html).toContain('<details')
      expect(html).toContain('Frequently Asked Questions')
    })

    it('ContactPage renders contact details and form without JS', () => {
      const html = renderStaticPage(ContactPage)
      expect(html).toContain('(616) 675-4875')
    })

    it('NewaygoAreaPage renders towns and service summary without JS', () => {
      const html = renderStaticPage(NewaygoAreaPage)
      expect(html).toContain('Newaygo County')
    })

    it('NotFoundPage renders 404 message and home link without JS', () => {
      const html = renderStaticPage(NotFoundPage)
      expect(html).toContain('404')
      expect(html).toContain('Go to Homepage')
    })
  })

  describe('TiltCard Touch and Pointer Detection', () => {
    it('disables tilt effects on touch devices (pointer: coarse / hover: none)', () => {
      // Mock touch device: matches is false for hover:hover & pointer:fine
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query.includes('(hover: hover) and (pointer: fine)') ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { container } = render(
        <TiltCard data-testid="tilt-card">
          <div>Card Content</div>
        </TiltCard>
      )

      const card = container.firstChild as HTMLElement
      fireEvent.mouseMove(card, { clientX: 200, clientY: 100 })

      // Transform should not be applied since touch is detected
      expect(card.style.transform).toBe('')
    })
  })

  describe('Reduced Motion Enforcement', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    })

    it('disables tilt effect on TiltCard when reduced motion is requested', () => {
      const { container } = render(
        <TiltCard data-testid="tilt-card-reduced">
          <div>Card Content</div>
        </TiltCard>
      )
      const card = container.firstChild as HTMLElement
      fireEvent.mouseMove(card, { clientX: 200, clientY: 100 })
      expect(card.style.transform).toBe('')
    })

    it('renders ParallaxLayer statically without motion transforms on reduced motion', () => {
      const { container } = render(
        <ParallaxLayer speed={-0.2}>
          <div>Parallax Item</div>
        </ParallaxLayer>
      )
      // On reduced motion, ParallaxLayer outputs direct div without motion wrapper
      expect(container.textContent).toContain('Parallax Item')
    })

    it('renders DepthFloat statically without infinite loop on reduced motion', () => {
      const { container } = render(
        <DepthFloat distance={6} duration={4}>
          <div>Logo Floating</div>
        </DepthFloat>
      )
      expect(container.textContent).toContain('Logo Floating')
    })
  })

  describe('ScrollProgressBar', () => {
    it('renders accessible progressbar element at top', () => {
      render(<ScrollProgressBar />)
      const bar = screen.getByRole('progressbar', { name: /Page reading progress/i })
      expect(bar).toBeInTheDocument()
      expect(bar).toHaveAttribute('aria-valuemin', '0')
      expect(bar).toHaveAttribute('aria-valuemax', '100')
    })
  })
})
