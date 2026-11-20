import '@testing-library/jest-dom'

// Mock IntersectionObserver for Vitest / JSDOM environment
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []

  disconnect(): void {}
  observe(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
  unobserve(): void {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

// Mock HTMLMediaElement play/pause for JSDOM
if (typeof window !== 'undefined') {
  window.HTMLMediaElement.prototype.play = () => Promise.resolve()
  window.HTMLMediaElement.prototype.pause = () => {}
  window.HTMLMediaElement.prototype.load = () => {}
}

// Mock window.scrollTo
if (typeof window !== 'undefined') {
  window.scrollTo = () => {}
}

// Mock ResizeObserver
class MockResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
if (typeof window !== 'undefined') {
  window.ResizeObserver = MockResizeObserver
}

// Mock Element.prototype.animate for JSDOM (Web Animations API used by AutoAnimate)
if (typeof Element !== 'undefined' && !Element.prototype.animate) {
  Element.prototype.animate = () =>
    ({
      onfinish: null,
      oncancel: null,
      finished: Promise.resolve(),
      cancel: () => {},
      finish: () => {},
      pause: () => {},
      play: () => {},
      reverse: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as Animation
}

// Patch JSDOM removeChild bug for React 19 Suspense placeholder nodes
const origRemoveChild = Node.prototype.removeChild
Node.prototype.removeChild = function <T extends Node>(child: T): T {
  if (child.parentNode !== this) {
    if (child.parentNode) {
      return child.parentNode.removeChild(child)
    }
    return child
  }
  return origRemoveChild.call(this, child) as T
}

// Mock WebGLRenderingContext for JSDOM
if (typeof window !== 'undefined') {
  if (!window.WebGLRenderingContext) {
    window.WebGLRenderingContext = class WebGLRenderingContext {} as unknown as typeof WebGLRenderingContext
  }
  const origGetContext = HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...args: any[]) {
    if (contextId === 'webgl' || contextId === 'experimental-webgl') {
      return {
        getExtension: () => null,
        getParameter: () => 0,
        createTexture: () => ({}),
        bindTexture: () => {},
        texParameteri: () => {},
        viewport: () => {},
        clearColor: () => {},
        clear: () => {},
        enable: () => {},
        disable: () => {},
      }
    }
    return origGetContext ? (origGetContext as any).apply(this, [contextId, ...args]) : null
  } as any
}

// Mock window.matchMedia
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
