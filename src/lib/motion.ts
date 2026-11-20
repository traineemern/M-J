/**
 * Shared motion design tokens and easing constants for M&J Water Wells.
 * Follows the 60fps transform/opacity constraint and respects prefers-reduced-motion.
 */

export const EASINGS = {
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const,
  springSnappy: { type: 'spring', stiffness: 400, damping: 25 } as const,
  springGentle: { type: 'spring', stiffness: 200, damping: 20 } as const,
}

export const DURATIONS = {
  micro: 0.15,
  fast: 0.2,
  normal: 0.35,
  reveal: 0.45,
  page: 0.2,
}

export const MOTION_PRESETS = {
  glowIn: { duration: 0.25, ease: 'easeOut' },
  glowOut: { duration: 0.2, ease: 'easeIn' },
  liftHover: { duration: 0.2, ease: 'easeOut' },
  pressDown: { duration: 0.1, ease: 'easeOut' },
  labelUp: { duration: 0.2, ease: 'easeOut' },
} as const

export const STAGGERS = {
  hero: 0.08,
  grid: 0.08,
  nav: 0.05,
}

export const TRANSFORMS = {
  revealY: 16,
  cardHoverY: -4,
  iconNudgeX: 2,
  buttonPressScale: 0.97,
  buttonHoverScale: 1.02,
}
