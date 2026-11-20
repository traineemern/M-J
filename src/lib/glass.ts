export type GlassVariant = 'panel' | 'card' | 'field' | 'button' | 'popup' | 'bar'

export const GLASS_VARIANT_CLASSES: Record<GlassVariant, string> = {
  panel: 'glass-panel',
  card: 'glass-card',
  field: 'glass-field',
  button: 'glass-button',
  popup: 'glass-popup',
  bar: 'glass-bar',
}

export function supportsBackdropFilter() {
  return typeof CSS !== 'undefined' && typeof CSS.supports === 'function' &&
    (CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)'))
}

export function contrastRatio(foreground: string, background: string) {
  const luminance = (hex: string) => {
    const normalized = hex.replace('#', '')
    const channels = [0, 2, 4].map((index) => parseInt(normalized.slice(index, index + 2), 16) / 255)
    const [r, g, b] = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const first = luminance(foreground)
  const second = luminance(background)
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}
