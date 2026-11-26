import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { siteContent } from '@/data/site'

export function HeroMedia() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const container = mediaRef.current
    const video = videoRef.current
    if (!container || !video || reduced) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void video.play().catch(() => undefined)
      } else {
        video.pause()
      }
    })
    observer.observe(container)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [reduced])

  return (
    <div className="hero-media" ref={mediaRef} aria-hidden="true">
      <img src="/media/hero-poster.webp" width="1280" height="720" alt="" fetchPriority="high" />
      <video
        ref={videoRef}
        autoPlay={!reduced}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/hero-poster.webp"
        onError={() => setFailed(true)}
      >
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>
      {failed && <span className="hero-media__placeholder">{siteContent.pages.home.heroMediaPlaceholder.value}</span>}
    </div>
  )
}
