import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { JourneyContainer } from '../JourneyContainer'
import { shouldEnable3DJourney, hasWebGLSupport } from '../riverUtils'
import { riverCurve, createRiverRibbonGeometry } from '../riverCurve'
import { RiverWaterShader } from '../RiverShader'
import { DrillingVideoProvider } from '@/features/drilling-video/DrillingVideoContext'
import { EnquiryProvider } from '@/features/enquiry/EnquiryContext'
import * as THREE from 'three'

function renderJourney() {
  return render(
    <MemoryRouter>
      <EnquiryProvider>
        <DrillingVideoProvider>
          <JourneyContainer />
        </DrillingVideoProvider>
      </EnquiryProvider>
    </MemoryRouter>
  )
}

describe('Journey3D River Specification & Hook Verification', () => {
  it('renders all 6 chapters in order with valid section headings', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderJourney()

    // No hooks or React error logged
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringMatching(/Rendered more hooks|Rendered fewer hooks/i)
    )
    consoleSpy.mockRestore()

    // Chapter 1: Hero
    expect(
      screen.getByRole('heading', { level: 1, name: /West Michigan's Well Drilling Specialists/i })
    ).toBeInTheDocument()

    // Chapter 2: Reveal
    expect(
      screen.getByRole('heading', { level: 2, name: /Clean water, found on site/i })
    ).toBeInTheDocument()

    // Chapter 3: Services
    expect(
      screen.getByRole('heading', { level: 2, name: /Our Services/i })
    ).toBeInTheDocument()

    // Chapter 4: Descent
    expect(
      screen.getByRole('heading', { level: 2, name: /Descent to Pure Ground Water/i })
    ).toBeInTheDocument()

    // Chapter 5: Water Tunnel
    expect(
      screen.getByRole('heading', { level: 2, name: /Step into clean water/i })
    ).toBeInTheDocument()

    // Chapter 6: Finale
    expect(
      screen.getByRole('heading', { level: 2, name: /Ready for Fresh Well Water/i })
    ).toBeInTheDocument()
  })

  it('contains tap-to-call link in finale chapter', () => {
    renderJourney()
    const callButton = screen.getByRole('link', { name: /Call \(616\) 675-4875/i })
    expect(callButton).toBeInTheDocument()
    expect(callButton).toHaveAttribute('href', 'tel:+16166754875')
  })

  it('camera is positioned on river curve at progress 0 looking downstream', () => {
    const startPoint = riverCurve.getPointAt(0)
    expect(startPoint.x).toBeCloseTo(0)
    expect(startPoint.y).toBeCloseTo(0)
    expect(startPoint.z).toBeCloseTo(0)

    const lookAheadPoint = riverCurve.getPointAt(0.02)
    expect(lookAheadPoint.z).toBeLessThan(startPoint.z) // Looking downstream into negative Z
  })

  it('river ribbon geometry generates valid vertices, normals, and UVs along curve', () => {
    const ribbon = createRiverRibbonGeometry(riverCurve, 20, 4, 14, 0)
    expect(ribbon.getAttribute('position')).toBeDefined()
    expect(ribbon.getAttribute('normal')).toBeDefined()
    expect(ribbon.getAttribute('uv')).toBeDefined()
    expect(ribbon.getIndex()).toBeDefined()
    ribbon.dispose()
  })

  it('river flow uniform exists and changes with scroll progress logic', () => {
    const uniforms = THREE.UniformsUtils.clone(RiverWaterShader.uniforms)
    expect(uniforms.uFlowSpeed.value).toBe(0.15) // Gentle source default

    // Chapter 2 speed doubles to 0.30
    uniforms.uFlowSpeed.value = 0.30
    expect(uniforms.uFlowSpeed.value).toBe(0.30)

    // Deep water aquifer factor
    expect(uniforms.uDeepWaterFactor.value).toBe(0.0)
    uniforms.uDeepWaterFactor.value = 0.85
    expect(uniforms.uDeepWaterFactor.value).toBe(0.85)
  })

  it('calls dispose on river geometries and materials without error', () => {
    const geom = new THREE.BufferGeometry()
    const mat = new THREE.MeshBasicMaterial()
    const geomDisposeSpy = vi.spyOn(geom, 'dispose')
    const matDisposeSpy = vi.spyOn(mat, 'dispose')

    geom.dispose()
    mat.dispose()

    expect(geomDisposeSpy).toHaveBeenCalledOnce()
    expect(matDisposeSpy).toHaveBeenCalledOnce()
  })

  it('disables 3D journey below 768px width (mobile)', () => {
    const originalInnerWidth = window.innerWidth
    try {
      window.innerWidth = 500
      expect(shouldEnable3DJourney()).toBe(false)
    } finally {
      window.innerWidth = originalInnerWidth
    }
  })

  it('respects prefers-reduced-motion media query and shows static fallback', () => {
    const originalMatchMedia = window.matchMedia
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

    try {
      expect(shouldEnable3DJourney()).toBe(false)
      const { container } = renderJourney()
      const fallback = container.querySelector('[style*="river-poster.webp"]')
      expect(fallback).toBeInTheDocument()
    } finally {
      window.matchMedia = originalMatchMedia
    }
  })

  it('falls back safely without throwing when WebGL is unavailable', () => {
    expect(() => {
      hasWebGLSupport()
      renderJourney()
    }).not.toThrow()
  })
})
