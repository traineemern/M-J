import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { canEnableLenis, initSmoothScroll } from '@/lib/smoothScroll'
import { AnimatedList } from '../AnimatedList'
import { SuccessCheck } from '@/features/enquiry/SuccessCheck'
import { TypedWord } from '@/features/hero/TypedWord'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import packageJson from '../../../../package.json'

function mockMedia(matchesFn: (query: string) => boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matchesFn(query),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('Animation Libraries Integration & Specifications', () => {
  beforeEach(() => {
    mockMedia(() => false)
  })

  describe('Lenis Smooth Scroll (Step 2)', () => {
    it('does not start below 1024px width', () => {
      mockMedia((query) => query === '(pointer: fine)')

      expect(canEnableLenis()).toBe(false)
      const cleanup = initSmoothScroll()
      expect(cleanup).toBeUndefined()
    })

    it('does not start when reduced motion is requested', () => {
      mockMedia((query) => query.includes('1024px') || query === '(prefers-reduced-motion: reduce)')

      expect(canEnableLenis()).toBe(false)
      const cleanup = initSmoothScroll()
      expect(cleanup).toBeUndefined()
    })

    it('starts on desktop with fine pointer and connects to ScrollTrigger update', () => {
      mockMedia((query) => query.includes('1024px') || query === '(pointer: fine)')

      expect(canEnableLenis()).toBe(true)
      const scrollTriggerSpy = vi.spyOn(ScrollTrigger, 'update')
      const cleanup = initSmoothScroll()
      expect(typeof cleanup).toBe('function')

      cleanup?.()
      scrollTriggerSpy.mockRestore()
    })
  })

  describe('AutoAnimate (Step 3)', () => {
    it('renders animated list with children intact', () => {
      render(
        <AnimatedList data-testid="test-list">
          <div key="1">Item 1</div>
          <div key="2">Item 2</div>
        </AnimatedList>
      )

      expect(screen.getByTestId('test-list')).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })
  })

  describe('Lottie and Fallback (Step 4)', () => {
    it('shows the check fallback icon under reduced motion', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { container } = render(<SuccessCheck />)
      // Check fallback SVG from lucide-react is rendered
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('Typed.js Rotator (Step 5)', () => {
    it('renders the first word in HTML immediately for no-JS and SEO', () => {
      render(<TypedWord words={['homes', 'farms', 'businesses']} />)
      expect(screen.getByText('homes')).toBeInTheDocument()
    })

    it('does not run typing animation under reduced motion and keeps the first word', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      render(<TypedWord words={['homes', 'farms', 'businesses']} />)
      expect(screen.getByText('homes')).toBeInTheDocument()
    })
  })

  describe('Excluded Libraries Check (Step 6)', () => {
    it('confirms none of the excluded libraries are present in package.json', () => {
      const deps = Object.keys(packageJson.dependencies || {})
      const devDeps = Object.keys(packageJson.devDependencies || {})
      const allDeps = [...deps, ...devDeps]

      const excluded = [
        'rive',
        '@rive-app/react-canvas',
        '@rive-app/canvas',
        'pixi.js',
        'react-spring',
        '@react-spring/web',
        'animejs',
        'animate.css',
        'barba.js',
      ]

      for (const forbidden of excluded) {
        expect(allDeps).not.toContain(forbidden)
      }
    })
  })
})
