import { useLayoutEffect, type RefObject } from 'react'
import { motionConfig } from './config'
import { fitText } from './fit'
import { motionPresets, type MotionPreset } from './presets'
import { splitText } from './split'

type GSAPApi = typeof import('./gsap').gsap

interface MotionConditions {
  desktop: boolean
  finePointer: boolean
  reducedMotion: boolean
}

function isMotionPreset(value: string | undefined): value is MotionPreset {
  return value !== undefined && value in motionPresets
}

function animateMagnetic(element: HTMLElement, gsap: GSAPApi, conditions: MotionConditions): () => void {
  if (!conditions.finePointer || conditions.reducedMotion) return () => undefined

  const move = (event: PointerEvent) => {
    const bounds = element.getBoundingClientRect()
    const centerX = bounds.left + bounds.width / 2
    const centerY = bounds.top + bounds.height / 2
    const distanceX = event.clientX - centerX
    const distanceY = event.clientY - centerY
    if (Math.hypot(distanceX, distanceY) > motionConfig.distance.magneticRadius) return
    gsap.to(element, {
      x: (distanceX / motionConfig.distance.magneticRadius) * motionConfig.distance.magneticMax,
      y: (distanceY / motionConfig.distance.magneticRadius) * motionConfig.distance.magneticMax,
      duration: motionConfig.duration.magnetic,
      ease: motionConfig.ease.heading,
      overwrite: true,
    })
  }

  const reset = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: motionConfig.duration.magneticSnap,
      ease: motionConfig.ease.magneticSnap,
      overwrite: true,
    })
  }

  element.addEventListener('pointermove', move)
  element.addEventListener('pointerleave', reset)
  return () => {
    element.removeEventListener('pointermove', move)
    element.removeEventListener('pointerleave', reset)
    gsap.set(element, { clearProps: 'x,y' })
  }
}

function bindSpotlight(element: HTMLElement, conditions: MotionConditions): () => void {
  if (!conditions.finePointer || conditions.reducedMotion) return () => undefined
  const move = (event: PointerEvent) => {
    const bounds = element.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    element.style.setProperty('--spotlight-x', `${x}%`)
    element.style.setProperty('--spotlight-y', `${y}%`)
  }
  element.addEventListener('pointermove', move)
  return () => {
    element.removeEventListener('pointermove', move)
    element.style.removeProperty('--spotlight-x')
    element.style.removeProperty('--spotlight-y')
  }
}

function bindHeroRipple(element: HTMLElement, conditions: MotionConditions): () => void {
  if (!conditions.finePointer || conditions.reducedMotion) return () => undefined
  const chars = Array.from(element.querySelectorAll<HTMLElement>('[data-split-part="char"]')).slice(
    0,
    motionConfig.variation.maxRippleChars,
  )

  const move = (event: PointerEvent) => {
    for (const char of chars) {
      const bounds = char.getBoundingClientRect()
      const centerX = bounds.left + bounds.width / 2
      const centerY = bounds.top + bounds.height / 2
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY)
      const influence = Math.max(0, 1 - distance / motionConfig.distance.rippleRadius)
      const weight =
        motionConfig.variation.weightStart +
        (motionConfig.variation.rippleWeight - motionConfig.variation.weightStart) * influence
      const width =
        motionConfig.variation.widthStart +
        (motionConfig.variation.rippleWidth - motionConfig.variation.widthStart) * influence
      char.style.fontVariationSettings = `"wght" ${weight}, "wdth" ${width}`
    }
  }

  const reset = () => {
    chars.forEach((char) => char.style.removeProperty('font-variation-settings'))
  }

  element.addEventListener('pointermove', move)
  element.addEventListener('pointerleave', reset)
  return () => {
    element.removeEventListener('pointermove', move)
    element.removeEventListener('pointerleave', reset)
    reset()
  }
}

export async function shakeMotionTarget(element: HTMLElement): Promise<void> {
  if (!element.isConnected || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const { gsap } = await import('./gsap')
  gsap.fromTo(
    element,
    { x: 0 },
    {
      keyframes: [{ x: motionConfig.distance.shakeX }, { x: -motionConfig.distance.shakeX }, { x: 0 }],
      duration: motionConfig.duration.shake,
      ease: motionConfig.ease.shake,
      overwrite: true,
    },
  )
}

export function useMotion(rootRef: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const conditions: MotionConditions = {
      desktop: window.matchMedia(`(min-width: ${motionConfig.viewport.desktop}px)`).matches,
      finePointer: window.matchMedia('(pointer: fine)').matches,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    }
    const splits = splitText(root)
    const splitResizeObserver = new ResizeObserver(() => splits.forEach((split) => split.reSplit()))
    splitResizeObserver.observe(root)
    const fitCleanups = Array.from(root.querySelectorAll<HTMLElement>('[data-fit-text]'), (element) =>
      fitText(element, {
        maxViewportHeightRatio: Number(element.dataset.fitRatio) || motionConfig.viewport.headingFitRatio,
      }),
    )
    let active = true
    let cleanupMotion: () => void = () => {}
    void document.fonts.ready.then(() => {
      if (active) splits.forEach((split) => split.reSplit())
    })

    if (!conditions.reducedMotion) {
      void import('./gsap').then(({ gsap, ScrollTrigger }) => {
        if (!active) return
        const cleanupInteractions: Array<() => void> = []
        let refreshTimer = 0
        const refresh = () => ScrollTrigger.refresh()

        const context = gsap.context(() => {
          root.querySelectorAll<HTMLElement>('[data-count]').forEach((element) => {
            const end = Number(element.dataset.count)
            if (!Number.isFinite(end)) return
            const suffix = element.dataset.countSuffix ?? ''
            const duration = Number(element.dataset.countDuration) || motionConfig.duration.counter
            const value = { current: 0 }
            const render = () => {
              element.textContent = `${Math.round(value.current).toLocaleString()}${suffix}`
            }
            render()
            gsap.to(value, {
              current: end,
              duration,
              ease: motionConfig.ease.counter,
              onUpdate: render,
              scrollTrigger: {
                trigger: element,
                start: motionConfig.trigger.stats,
                once: true,
              },
            })
          })

          const progressBar = document.querySelector<HTMLElement>('[data-scroll-progress]')
          if (progressBar) {
            gsap.fromTo(
              progressBar,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: motionConfig.ease.none,
                scrollTrigger: {
                  trigger: document.documentElement,
                  start: 'top top',
                  end: 'bottom bottom',
                  scrub: motionConfig.scrub.progress,
                },
              },
            )
          }

          root.querySelectorAll<HTMLElement>('[data-motion]').forEach((element) => {
            const presetName = element.dataset.motion
            if (!isMotionPreset(presetName)) return

            if (presetName === 'magnetic') {
              cleanupInteractions.push(animateMagnetic(element, gsap, conditions))
              return
            }
            if (presetName === 'spotlight') {
              cleanupInteractions.push(bindSpotlight(element, conditions))
              return
            }

            const preset = motionPresets[presetName]
            const splitTargets =
              presetName === 'words'
                ? element.querySelectorAll<HTMLElement>('[data-split-part="word"]')
                : presetName === 'hero-chars'
                  ? Array.from(element.querySelectorAll<HTMLElement>('[data-split-part="char"]')).slice(
                      0,
                      motionConfig.variation.maxRippleChars,
                    )
                  : null
            const motionItems = element.querySelectorAll<HTMLElement>('[data-motion-item]')
            const targets: Element[] = splitTargets
              ? Array.from(splitTargets)
              : motionItems.length
                ? Array.from(motionItems)
                : [element]
            const from = { ...preset.from }
            const to = { ...preset.to }
            if (presetName === 'columns' && !conditions.desktop) {
              from.x = 0
              from.y = motionConfig.distance.mobileColumnY
            } else if (presetName === 'columns' && element.dataset.motionDirection === 'left') {
              from.x = -motionConfig.distance.columnX
            }
            if (
              (presetName === 'parallax' || presetName === 'owner-parallax' || presetName === 'quote-mark') &&
              (!conditions.desktop || !conditions.finePointer)
            ) {
              return
            }
            if (presetName === 'hero-chars' && element.hasAttribute('data-hero-ripple')) {
              cleanupInteractions.push(bindHeroRipple(element, conditions))
            }
            if (presetName === 'hero-media' && root.dataset.pageMotion === 'home') {
              to.delay = motionConfig.timings.loaderHomeOffset
            }
            if (presetName === 'hero-chars' && root.dataset.pageMotion === 'home') {
              to.delay = motionConfig.duration.homeMedia + motionConfig.duration.homeCurtain
            } else if (presetName === 'hero-chars' || presetName === 'hero-media') {
              to.delay = motionConfig.timings.innerPageAfterCurtain
            }
            if (presetName === 'hero-chars' && root.dataset.pageMotion !== 'home') {
              const pagePreset =
                motionConfig.pageHero[root.dataset.pageMotion as keyof typeof motionConfig.pageHero]
              if (pagePreset) {
                from.xPercent = pagePreset.xPercent
                from.yPercent = pagePreset.yPercent
                from.scale = pagePreset.scale
                from.transformOrigin = '50% 50%'
                to.xPercent = 0
                to.yPercent = 0
                to.scale = 1
                to.duration = pagePreset.duration
                to.stagger = pagePreset.stagger
              }
            }

            const scrollTrigger = {
              trigger: element,
              start: preset.trigger,
              ...(preset.scrub === undefined ? {} : { scrub: preset.scrub }),
              ...(preset.once ? { once: true } : {}),
              ...(presetName === 'hero-text' ||
              presetName === 'parallax' ||
              presetName === 'owner-parallax' ||
              presetName === 'quote-mark'
                ? { end: motionConfig.trigger.heroEnd }
                : {}),
              ...(preset.toggleActions ? { toggleActions: preset.toggleActions } : {}),
            }
            gsap.fromTo(targets, from, { ...to, scrollTrigger })
          })

          const header = document.querySelector<HTMLElement>('[data-site-header]')
          if (header && root.dataset.pageMotion === 'home') {
            ScrollTrigger.create({
              start: motionConfig.trigger.headerSolid,
              onEnter: () => {
                header.classList.add('is-scrolled', 'glass-bar--strong', 'bg-water-950/[0.92]')
              },
              onLeaveBack: () => {
                header.classList.remove('is-scrolled', 'glass-bar--strong', 'bg-water-950/[0.92]')
              },
            })
          }

          if (header && !document.documentElement.hasAttribute('data-header-animated')) {
            const brand = header.querySelector<HTMLElement>('[data-header-brand]')
            const navigation = header.querySelectorAll<HTMLElement>('[data-header-nav] > a')
            const actions = header.querySelectorAll<HTMLElement>('[data-header-actions] > *')
            const headerItems = [brand, ...Array.from(navigation), ...Array.from(actions)].filter(
              (item): item is HTMLElement => item !== null,
            )
            document.documentElement.setAttribute('data-header-animated', 'true')
            gsap.fromTo(
              headerItems,
              { y: motionConfig.distance.subtleY, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: motionConfig.duration.subtle,
                ease: motionConfig.ease.subtle,
                stagger: motionConfig.stagger.nav,
                delay: motionConfig.timings.loaderLine,
              },
            )
          }
        }, root)

        const failsafe = window.setTimeout(() => {
          context.revert()
          resizeObserver.disconnect()
          window.removeEventListener('load', refresh)
          cleanupInteractions.forEach((cleanup) => cleanup())
          root.querySelectorAll<HTMLElement>('[data-motion]').forEach((element) => {
            gsap.set(element, { clearProps: 'transform,opacity,clipPath' })
          })
          root.querySelectorAll<HTMLElement>('[data-count]').forEach((element) => {
            const end = Number(element.dataset.count)
            if (Number.isFinite(end)) {
              element.textContent = `${end.toLocaleString()}${element.dataset.countSuffix ?? ''}`
            }
          })
        }, motionConfig.timings.failsafe * 1000)

        const resizeObserver = new ResizeObserver(() => {
          window.clearTimeout(refreshTimer)
          refreshTimer = window.setTimeout(refresh, motionConfig.resize.debounce)
        })
        resizeObserver.observe(root)
        window.addEventListener('load', refresh, { once: true })
        void document.fonts.ready.then(() => {
          if (active) refresh()
        })

        cleanupMotion = () => {
          window.clearTimeout(failsafe)
          window.clearTimeout(refreshTimer)
          window.removeEventListener('load', refresh)
          resizeObserver.disconnect()
          context.revert()
          cleanupInteractions.forEach((cleanup) => cleanup())
        }
      }).catch((error: unknown) => {
        if (active) console.error('Page motion could not initialize.', error)
      })
    }

    return () => {
      active = false
      cleanupMotion()
      splitResizeObserver.disconnect()
      fitCleanups.forEach((cleanup) => cleanup())
      splits.forEach((split) => split.revert())
    }
  }, [rootRef])
}
