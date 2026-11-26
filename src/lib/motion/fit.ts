import { motionConfig } from './config'

interface FitOptions {
  maxViewportHeightRatio?: number
}

export function fitText(element: HTMLElement, options: FitOptions = {}): () => void {
  const ratio = options.maxViewportHeightRatio ?? motionConfig.viewport.headingFitRatio
  let resizeTimer = 0
  let active = true

  const fit = () => {
    if (!active) return
    const lines = Array.from(element.querySelectorAll<HTMLElement>('[data-fit-line]'))
    const availableWidth = element.clientWidth
    if (!availableWidth) return

    for (const line of lines) {
      const previousSize = line.style.fontSize
      const previousWidth = line.style.width
      line.style.fontSize = ''
      const baseSize = Number.parseFloat(window.getComputedStyle(line).fontSize) || 100
      line.style.fontSize = '100px'
      line.style.width = 'max-content'
      const measuredWidth = line.getBoundingClientRect().width
      line.style.fontSize = previousSize
      line.style.width = previousWidth
      if (!measuredWidth) continue
      const fitSize = (availableWidth / measuredWidth) * 100
      const viewportLimit = window.innerHeight * ratio
      line.style.fontSize = `${Math.max(motionConfig.viewport.minimumFittedFontSize, Math.min(fitSize, viewportLimit, baseSize))}px`
    }
  }

  const schedule = () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(fit, motionConfig.resize.debounce)
  }

  const observer = new ResizeObserver(schedule)
  observer.observe(element)
  window.addEventListener('resize', schedule)
  void document.fonts.ready.then(fit)
  fit()

  return () => {
    active = false
    window.clearTimeout(resizeTimer)
    window.removeEventListener('resize', schedule)
    observer.disconnect()
  }
}
