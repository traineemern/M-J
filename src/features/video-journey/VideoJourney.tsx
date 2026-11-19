import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Volume2, VolumeX } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import {
  getChapterForTime,
  mapScrollToTime,
  VIDEO_JOURNEY_CHAPTERS,
  type VideoChapter,
} from './videoJourneyChapters'

interface VideoJourneyProps {
  className?: string
}

export const VideoJourney: React.FC<VideoJourneyProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const shouldReduceMotion = useReducedMotion()
  const isMobile = useIsMobile(1024) // below 1024px is mobile / tablet
  const [isFinePointer, setIsFinePointer] = useState(true)

  // Scrub and state values
  const [progress, setProgress] = useState(0)
  const [chapter, setChapter] = useState<VideoChapter>(VIDEO_JOURNEY_CHAPTERS[0])
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isInView, setIsInView] = useState(false)

  // Mobile / Manual play state
  const [isManualPlaying, setIsManualPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  // Detect pointer capability
  useEffect(() => {
    if (typeof window === 'undefined') return
    const fineMq = window.matchMedia?.('(pointer: fine)')
    const coarseMq = window.matchMedia?.('(pointer: coarse)')

    const updatePointer = () => {
      if (fineMq?.matches) {
        setIsFinePointer(true)
      } else if (coarseMq?.matches) {
        setIsFinePointer(false)
      } else {
        setIsFinePointer(true)
      }
    }

    updatePointer()
    fineMq?.addEventListener?.('change', updatePointer)
    coarseMq?.addEventListener?.('change', updatePointer)
    return () => {
      fineMq?.removeEventListener?.('change', updatePointer)
      coarseMq?.removeEventListener?.('change', updatePointer)
    }
  }, [])

  const isDesktopScrub = !isMobile && isFinePointer && !shouldReduceMotion

  // Preload video when within 300px of viewport
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (videoRef.current && videoRef.current.preload === 'none') {
            videoRef.current.preload = 'metadata'
          }
        }
      },
      { rootMargin: '300px' }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Desktop GSAP ScrollTrigger Scrub
  useEffect(() => {
    if (!isDesktopScrub) return

    let stInstance: any = null
    let isCancelled = false

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (isCancelled || !containerRef.current) return
        gsap.registerPlugin(ScrollTrigger)

        const video = videoRef.current
        if (video) {
          video.muted = true
          video.pause()
        }

        stInstance = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 0.3,
          onUpdate: (self) => {
            const p = self.progress
            setProgress(p)

            if (video && video.readyState >= 2) {
              const duration = video.duration || 50.67
              const targetTime = mapScrollToTime(p, duration)
              if (typeof video.fastSeek === 'function') {
                video.fastSeek(targetTime)
              } else {
                video.currentTime = targetTime
              }
              setChapter(getChapterForTime(targetTime))
            }

            // 3D Transforms (Desktop only):
            // 1. Entrance: rotateX(10deg) -> 0deg, scale 0.92 -> 1 over first 15% (0 -> 0.15)
            let rotX = 0
            let scale = 1
            if (p < 0.15) {
              const entranceP = p / 0.15
              rotX = 10 * (1 - entranceP)
              scale = 0.92 + (1 - 0.92) * entranceP
            }

            // 2. Descent: chapters 6 to 7 (27s to 41s, progress 27/50.67 to 41/50.67)
            let rotY = 0
            const descentStart = 27 / 50.67
            const descentEnd = 41 / 50.67
            if (p >= descentStart && p <= descentEnd) {
              const descentP = (p - descentStart) / (descentEnd - descentStart)
              rotY = Math.sin(descentP * Math.PI) * -3
            }

            // Clamp max rotation to 10 deg
            rotX = Math.max(-10, Math.min(10, rotX))
            rotY = Math.max(-10, Math.min(10, rotY))

            if (frameRef.current) {
              frameRef.current.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`
              const shadowY = 25 + (p < 0.15 ? (1 - p / 0.15) * 15 : 0)
              frameRef.current.style.boxShadow = `0 ${shadowY}px 50px -10px rgba(8, 28, 48, 0.45)`
            }
          },
        })

        // Refresh when fonts or layout settle
        if (document.fonts?.ready) {
          document.fonts.ready.then(() => ScrollTrigger.refresh())
        }
      }
    )

    return () => {
      isCancelled = true
      if (stInstance) {
        stInstance.kill()
      }
    }
  }, [isDesktopScrub])

  const handleLoadedMetadata = useCallback(() => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      ScrollTrigger.refresh()
    }).catch(() => {})
  }, [])

  const handleCanPlayThrough = useCallback(() => {
    setIsVideoReady(true)
  }, [])

  const startMobilePlay = () => {
    setIsManualPlaying(true)
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.muted = false
        setIsMuted(false)
        videoRef.current.play().catch(() => {
          // Fallback if browser requires user gesture or mute
          if (videoRef.current) {
            videoRef.current.muted = true
            setIsMuted(true)
            videoRef.current.play().catch(() => {})
          }
        })
      }
    }, 50)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted
      videoRef.current.muted = nextMuted
      setIsMuted(nextMuted)
    }
  }

  // =========================================================================
  // MOBILE / TABLET / REDUCED MOTION VIEW (Fixed 16:9, No Pin, No Scrub)
  // =========================================================================
  if (!isDesktopScrub) {
    return (
      <section
        ref={containerRef}
        id="journey-video-section"
        aria-label="Scroll-driven Journey: M&J Drilling"
        className={`relative py-12 sm:py-16 bg-water-950 text-white border-b border-water-900 ${className}`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-water-900 border border-white/20 text-sky-200 text-xs font-bold uppercase tracking-wider font-condensed mb-2">
              Well Drilling in Action
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-condensed uppercase tracking-tight text-white">
              Watch Our Casnovia Crew at Work
            </h2>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/20 bg-water-900 shadow-2xl">
            {!isManualPlaying ? (
              <div className="relative w-full h-full group">
                <img
                  src="/media/mj-journey-poster.jpg"
                  alt="M&J Water Wells crew and rotary rig on site"
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-water-950/40 flex flex-col items-center justify-center p-4">
                  <button
                    type="button"
                    onClick={startMobilePlay}
                    aria-label="Play journey video"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-sky-300"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                  <span className="mt-4 text-sm font-bold uppercase tracking-wider font-condensed text-white bg-water-950/80 px-3 py-1 rounded-full border border-white/10">
                    Play journey (50s)
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src="/media/mj-journey-mobile.mp4"
                  poster="/media/mj-journey-poster.jpg"
                  controls
                  playsInline
                  autoPlay
                  aria-label="Animated drilling video: a crew sets up, drills, and reaches clean groundwater."
                  className="w-full h-full object-cover"
                >
                  <track
                    kind="captions"
                    src="/media/mj-journey.vtt"
                    srcLang="en"
                    label="English captions"
                    default={false}
                  />
                </video>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="absolute bottom-16 right-4 z-20 p-2 rounded-full bg-water-950/80 text-white hover:bg-water-900 border border-white/20 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-sky-400" /> : <Volume2 className="w-4 h-4 text-white" />}
                </button>
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs sm:text-sm text-water-200 font-sans max-w-xl mx-auto">
            Our crew walks the site, sets up the rig, drills through each layer, and reaches clean groundwater.
          </p>
        </div>
      </section>
    )
  }

  // =========================================================================
  // DESKTOP PINNED SCROLL JOURNEY (100vh pinned stage, +=400% ScrollTrigger range)
  // =========================================================================
  return (
    <section
      ref={containerRef}
      id="journey-video-section"
      aria-label="Scroll-driven Journey: M&J Drilling"
      className={`relative h-screen w-full bg-water-950 text-white overflow-hidden ${className}`}
      data-testid="desktop-video-journey"
    >
      {/* 100vh Stage */}
      <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden z-10 px-4 sm:px-8">
        {/* Top Scroll Progress Line */}
        <div
          className="fixed top-0 left-0 h-1 bg-aqua z-30 transition-none"
          style={{ width: `${Math.round(progress * 100)}%` }}
          aria-hidden="true"
        />

        {/* Top-Left Chapter Indicator */}
        <div className="absolute top-6 left-6 z-30 flex items-center gap-3 select-none">
          <span className="px-3.5 py-1.5 rounded-full bg-water-900/90 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider font-condensed text-sky-200 shadow-lg">
            Chapter {chapter.index} of 9
          </span>
          <span className="text-sm font-sans font-medium text-water-100 drop-shadow-md hidden sm:inline-block">
            {chapter.title}
          </span>
        </div>

        {/* Desktop Direct Play / Keyboard Accessibility Button */}
        <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
          {!isManualPlaying ? (
            <button
              type="button"
              onClick={startMobilePlay}
              aria-label="Play drilling video with controls"
              className="px-3 py-1.5 rounded-full bg-water-900/90 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider font-condensed text-white hover:bg-water-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-aqua"
            >
              <Play className="w-3.5 h-3.5 fill-current text-aqua" />
              <span>Play journey</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              className="px-3 py-1.5 rounded-full bg-water-900/90 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider font-condensed text-white hover:bg-water-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-aqua" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
              <span>{isMuted ? 'Unmute' : 'Muted'}</span>
            </button>
          )}
        </div>

        {/* 3D Perspective Stage Container */}
        <div
          className="relative w-full max-w-5xl flex items-center justify-center pt-8 pb-4"
          style={{ perspective: '1400px' }}
        >
          <div
            ref={frameRef}
            className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/20 bg-water-900 shadow-2xl transition-shadow duration-300"
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: '0 25px 50px -12px rgba(8, 28, 48, 0.45)',
            }}
          >
            {/* Poster shown until readyState >= 4 */}
            {!isVideoReady && (
              <img
                src="/media/mj-journey-poster.jpg"
                alt="M&J Water Wells drilling site in Casnovia"
                width={1280}
                height={720}
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
            )}

            <video
              ref={videoRef}
              src={isManualPlaying ? '/media/mj-journey-desktop.mp4' : '/media/mj-journey-desktop.mp4'}
              poster="/media/mj-journey-poster.jpg"
              muted={isManualPlaying ? isMuted : true}
              playsInline
              preload={isInView ? 'metadata' : 'none'}
              controls={isManualPlaying}
              aria-label="Animated drilling video: a crew sets up, drills, and reaches clean groundwater."
              className="w-full h-full object-cover"
              onLoadedMetadata={handleLoadedMetadata}
              onCanPlayThrough={handleCanPlayThrough}
            >
              <track
                kind="captions"
                src="/media/mj-journey.vtt"
                srcLang="en"
                label="English captions"
                default={false}
              />
            </video>
          </div>
        </div>

        {/* Screen Reader Summary */}
        <p className="mt-2 text-center text-xs sm:text-sm text-water-300 font-sans max-w-xl mx-auto">
          Our crew walks the site, sets up the rig, drills through each layer, and reaches clean groundwater.
        </p>
      </div>
    </section>
  )
}

export default VideoJourney
