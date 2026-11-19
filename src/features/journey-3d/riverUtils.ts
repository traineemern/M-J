export function hasWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export function shouldEnable3DJourney(): boolean {
  if (typeof window === 'undefined') return false
  if (window.innerWidth < 768) return false
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return false
  const nav = navigator as unknown as { connection?: { saveData?: boolean } }
  if (nav.connection?.saveData === true) return false
  return hasWebGLSupport()
}
