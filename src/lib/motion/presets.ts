import { motionConfig } from './config'

export type MotionPreset =
  | 'heading'
  | 'image'
  | 'wipe'
  | 'cards'
  | 'stats'
  | 'columns'
  | 'subtle'
  | 'gallery'
  | 'stagger'
  | 'cascade'
  | 'words'
  | 'focus'
  | 'divider'
  | 'parallax'
  | 'owner-parallax'
  | 'hero-text'
  | 'hero-media'
  | 'hero-chars'
  | 'nav-items'
  | 'magnetic'
  | 'spotlight'
  | 'shake'
  | 'process-line'
  | 'quote-mark'

export interface MotionPresetConfig {
  from: gsap.TweenVars
  to: gsap.TweenVars
  trigger: string
  scrub?: number | boolean
  toggleActions?: string
  once?: boolean
}

export const motionPresets: Record<MotionPreset, MotionPresetConfig> = {
  heading: {
    from: {
      y: motionConfig.distance.headingY,
      opacity: 0,
      fontVariationSettings: `"wght" ${motionConfig.variation.weightStart}, "wdth" ${motionConfig.variation.widthStart}`,
    },
    to: {
      y: 0,
      opacity: 1,
      fontVariationSettings: `"wght" ${motionConfig.variation.weightEnd}, "wdth" ${motionConfig.variation.widthEnd}`,
      duration: motionConfig.duration.heading,
      ease: motionConfig.ease.heading,
    },
    trigger: motionConfig.trigger.heading,
    toggleActions: 'play none none reverse',
  },
  image: {
    from: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
    to: { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: motionConfig.duration.image, ease: motionConfig.ease.image },
    trigger: motionConfig.trigger.image,
    toggleActions: 'play none none reverse',
  },
  wipe: {
    from: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
    to: { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: motionConfig.duration.wipe, ease: motionConfig.ease.wipe },
    trigger: motionConfig.trigger.wipe,
    toggleActions: 'play none none reverse',
  },
  cards: {
    from: { y: motionConfig.distance.cardY, opacity: 0 },
    to: { y: 0, opacity: 1, duration: motionConfig.duration.cards, ease: motionConfig.ease.cards, stagger: motionConfig.stagger.row },
    trigger: motionConfig.trigger.cards,
    toggleActions: 'play none none reverse',
  },
  stats: {
    from: { scale: motionConfig.variation.statsScaleStart, opacity: 0 },
    to: { scale: 1, opacity: 1, duration: motionConfig.duration.stats, ease: motionConfig.ease.stats, stagger: motionConfig.stagger.stats },
    trigger: motionConfig.trigger.stats,
    toggleActions: 'play none none reverse',
    once: true,
  },
  columns: {
    from: { x: motionConfig.distance.columnX, opacity: 0 },
    to: { x: 0, opacity: 1, duration: motionConfig.duration.columns, ease: motionConfig.ease.columns },
    trigger: motionConfig.trigger.columns,
    toggleActions: 'play none none reverse',
  },
  subtle: {
    from: { y: motionConfig.distance.subtleY, opacity: 0 },
    to: { y: 0, opacity: 1, duration: motionConfig.duration.subtle, ease: motionConfig.ease.subtle },
    trigger: motionConfig.trigger.subtle,
    toggleActions: 'play none none reverse',
  },
  gallery: {
    from: { y: motionConfig.distance.galleryY, opacity: 0 },
    to: { y: 0, opacity: 1, duration: motionConfig.duration.gallery, ease: motionConfig.ease.gallery, stagger: motionConfig.stagger.gallery },
    trigger: motionConfig.trigger.gallery,
    toggleActions: 'play none none reverse',
  },
  stagger: {
    from: { y: motionConfig.distance.staggerY, opacity: 0 },
    to: { y: 0, opacity: 1, duration: motionConfig.duration.stagger, ease: motionConfig.ease.stagger, stagger: motionConfig.stagger.row },
    trigger: motionConfig.trigger.stagger,
    toggleActions: 'play none none reverse',
  },
  cascade: {
    from: { x: motionConfig.distance.cascadeX, opacity: 0 },
    to: { x: 0, opacity: 1, duration: motionConfig.duration.cascade, ease: motionConfig.ease.cascade, stagger: motionConfig.stagger.cascade },
    trigger: motionConfig.trigger.cascade,
    toggleActions: 'play none none reverse',
  },
  words: {
    from: { opacity: motionConfig.variation.wordOpacityStart },
    to: { opacity: 1, duration: motionConfig.scrub.words, stagger: motionConfig.stagger.words, ease: motionConfig.ease.none },
    trigger: motionConfig.trigger.wordsStart,
    scrub: motionConfig.scrub.words,
  },
  focus: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: motionConfig.duration.subtle, ease: motionConfig.ease.subtle },
    trigger: motionConfig.trigger.focusStart,
    toggleActions: 'play none none reverse',
  },
  divider: {
    from: { clipPath: 'inset(0 100% 0 0)' },
    to: { clipPath: 'inset(0 0 0 0)', ease: motionConfig.ease.none },
    trigger: motionConfig.trigger.dividerStart,
    scrub: motionConfig.scrub.divider,
  },
  parallax: {
    from: { yPercent: -motionConfig.parallax.hero * 50 },
    to: { yPercent: motionConfig.parallax.hero * 50, ease: motionConfig.ease.none },
    trigger: motionConfig.trigger.parallaxStart,
    scrub: motionConfig.scrub.parallax,
  },
  'owner-parallax': {
    from: { yPercent: -motionConfig.parallax.owner * 50 },
    to: { yPercent: motionConfig.parallax.owner * 50, ease: motionConfig.ease.none },
    trigger: motionConfig.trigger.parallaxStart,
    scrub: motionConfig.scrub.parallax,
  },
  'hero-text': {
    from: { y: 0, opacity: 1 },
    to: { y: -motionConfig.distance.heroTextY, opacity: 0, ease: motionConfig.ease.none },
    trigger: motionConfig.trigger.heroStart,
    scrub: motionConfig.scrub.hero,
  },
  'hero-media': {
    from: { scale: motionConfig.variation.heroMediaScaleStart, opacity: 0 },
    to: { scale: 1, opacity: 1, duration: motionConfig.duration.homeMedia, ease: motionConfig.ease.homeMedia },
    trigger: motionConfig.trigger.heroStart,
    toggleActions: 'play none none reverse',
  },
  'hero-chars': {
    from: {
      yPercent: 110,
      opacity: 0,
      fontVariationSettings: `"wght" ${motionConfig.variation.weightStart}, "wdth" ${motionConfig.variation.widthStart}`,
    },
    to: {
      yPercent: 0,
      opacity: 1,
      fontVariationSettings: `"wght" ${motionConfig.variation.weightEnd}, "wdth" ${motionConfig.variation.widthEnd}`,
      duration: motionConfig.duration.heroChars,
      ease: motionConfig.ease.heroChars,
      stagger: motionConfig.stagger.heroChars,
    },
    trigger: motionConfig.trigger.heading,
    toggleActions: 'play none none reverse',
  },
  'nav-items': {
    from: { y: motionConfig.distance.subtleY, opacity: 0 },
    to: { y: 0, opacity: 1, duration: motionConfig.duration.subtle, ease: motionConfig.ease.subtle, stagger: motionConfig.stagger.nav },
    trigger: motionConfig.trigger.subtle,
    toggleActions: 'play none none reverse',
  },
  magnetic: {
    from: { x: 0, y: 0 },
    to: { x: 0, y: 0, duration: motionConfig.duration.magneticSnap, ease: motionConfig.ease.magneticSnap },
    trigger: motionConfig.trigger.subtle,
  },
  spotlight: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: motionConfig.duration.subtle },
    trigger: motionConfig.trigger.subtle,
  },
  shake: {
    from: { x: 0 },
    to: { x: 0, duration: motionConfig.duration.shake, ease: motionConfig.ease.shake },
    trigger: motionConfig.trigger.subtle,
  },
  'process-line': {
    from: { clipPath: 'inset(0 100% 0 0)' },
    to: { clipPath: 'inset(0 0 0 0)', duration: motionConfig.duration.wipe, ease: motionConfig.ease.wipe },
    trigger: motionConfig.trigger.wipe,
    toggleActions: 'play none none reverse',
  },
  'quote-mark': {
    from: { yPercent: -motionConfig.parallax.quote * 50 },
    to: { yPercent: motionConfig.parallax.quote * 50, ease: motionConfig.ease.none },
    trigger: motionConfig.trigger.parallaxStart,
    scrub: motionConfig.scrub.parallax,
  },
}
