import { useLayoutEffect, useRef, useState } from 'react'
import { motionConfig } from '@/lib/motion/config'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { siteContent } from '@/data/site'

let introHasRun = false

export function IntroLoader() {
  const [visible, setVisible] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (reducedMotion || introHasRun) return

    try {
      if (window.sessionStorage.getItem('mj-night-rig-intro-seen') === 'true') {
        introHasRun = true
        return
      }
      window.sessionStorage.setItem('mj-night-rig-intro-seen', 'true')
    } catch (error) {
      console.error('Unable to persist the intro-loader session state.', error)
    }

    introHasRun = true
    setVisible(true)
  }, [reducedMotion])

  useLayoutEffect(() => {
    if (!visible || reducedMotion || !loaderRef.current || !counterRef.current || !progressRef.current) return
    let active = true
    let fallbackTimer = 0
    let revert = () => {}

    void import('@/lib/motion/gsap')
      .then(({ gsap }) => {
        if (!active || !loaderRef.current || !counterRef.current || !progressRef.current) return
        const loader = loaderRef.current
        const counter = counterRef.current
        const progressLine = progressRef.current
        const progress = { value: 0 }
        const context = gsap.context(() => {
          gsap.timeline({
            onComplete: () => {
              if (active) setVisible(false)
            },
          })
            .to(progress, {
              value: 100,
              duration: motionConfig.duration.loader,
              ease: motionConfig.ease.loader,
              onUpdate: () => {
                counter.textContent = `${Math.round(progress.value).toString().padStart(2, '0')}`
              },
            })
            .to(progressLine, {
              scaleX: 1,
              duration: motionConfig.duration.loader,
              ease: motionConfig.ease.none,
            }, 0)
            .to(loader, {
              yPercent: -100,
              clipPath: 'inset(0 0 100% 0)',
              duration: motionConfig.duration.loaderExit,
              ease: motionConfig.ease.homeCurtain,
            })
        }, loader)
        revert = () => context.revert()
      })
      .catch((error: unknown) => {
        console.error('The intro loader could not initialize.', error)
        if (active) setVisible(false)
      })

    fallbackTimer = window.setTimeout(
      () => setVisible(false),
      (motionConfig.duration.loader + motionConfig.duration.loaderExit + 1) * 1000,
    )

    return () => {
      active = false
      window.clearTimeout(fallbackTimer)
      revert()
    }
  }, [visible, reducedMotion])

  if (!visible || reducedMotion) return null

  return (
    <div ref={loaderRef} className="intro-loader" aria-hidden="true">
      <p>{siteContent.business.name.value.toUpperCase()} / {siteContent.business.location.value.toUpperCase()}</p>
      <div className="intro-loader__bottom">
        <span>{siteContent.pages.labels.introDescriptor.value}</span>
        <span ref={counterRef}>00</span>
      </div>
      <span ref={progressRef} className="intro-loader__progress" />
    </div>
  )
}
