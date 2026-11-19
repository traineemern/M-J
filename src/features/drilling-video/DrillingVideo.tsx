import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Subtitles,
  Maximize2,
  Sparkles,
} from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useDrillingVideo } from './DrillingVideoContext'

interface DrillingVideoProps {
  className?: string
  showSummary?: boolean
  id?: string
}

export const DrillingVideo: React.FC<DrillingVideoProps> = ({
  className = '',
  showSummary = true,
  id = 'drilling-video',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { openModal } = useDrillingVideo()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [captionsOn, setCaptionsOn] = useState(false)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)

  // 1. Preload strategy: switch to 'auto' when within 200px of viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true)
      return
    }

    const preloadObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsNearViewport(true)
          preloadObserver.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    preloadObserver.observe(el)
    return () => preloadObserver.disconnect()
  }, [])

  // 2. Autoplay / pause strategy based on 50% viewport visibility
  useEffect(() => {
    const el = containerRef.current
    const video = videoRef.current
    if (!el || !video || typeof IntersectionObserver === 'undefined') return

    // Never autoplay if prefers-reduced-motion is active
    if (shouldReduceMotion) return

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.intersectionRatio >= 0.5) {
          // Play only if user hasn't explicitly paused it
          if (!userInteracted || isPlaying) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false))
          }
        } else {
          // Pause when scrolling away
          video.pause()
          setIsPlaying(false)
        }
      },
      { threshold: [0, 0.5, 1.0] }
    )

    visibilityObserver.observe(el)
    return () => visibilityObserver.disconnect()
  }, [shouldReduceMotion, userInteracted, isPlaying])

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setUserInteracted(true)

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  // Replay from beginning
  const handleReplay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setUserInteracted(true)
    video.currentTime = 0
    video
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }, [])

  // Mute toggle
  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setIsMuted(nextMuted)
  }, [])

  // Captions toggle (hidden by default)
  const toggleCaptions = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.textTracks || video.textTracks.length === 0) return
    const track = video.textTracks[0]
    const nextMode = track.mode === 'showing' ? 'hidden' : 'showing'
    track.mode = nextMode
    setCaptionsOn(nextMode === 'showing')
  }, [])

  return (
    <div id={id} ref={containerRef} className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Video Container (Strict 16:9 aspect ratio prevents CLS) */}
      <div className="relative group aspect-video w-full rounded-3xl overflow-hidden bg-water-950 shadow-2xl border-2 border-water-300/40 ring-1 ring-white/10 card-hover-lift">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-3xl"
          poster="/media/mj-drilling-poster.jpg"
          playsInline
          muted={isMuted}
          loop={!shouldReduceMotion}
          preload={isNearViewport ? 'auto' : 'none'}
          aria-label="M&J Water Wells rotary well drilling process video demonstration"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="/media/mj-drilling.webm" type="video/webm" />
          <source src="/media/mj-drilling.mp4" type="video/mp4" />
          <track
            kind="captions"
            src="/media/mj-drilling.vtt"
            srcLang="en"
            label="English"
            default={false}
          />
          Your browser does not support HTML5 video.
        </video>

        {/* Big Center Play Button Overlay (when paused or reduced motion) */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-water-950/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity">
            <button
              type="button"
              onClick={togglePlay}
              className="group/btn flex items-center gap-3 px-6 py-3.5 rounded-full bg-water-600/95 hover:bg-water-500 text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-water-300"
              aria-label="Play drilling demonstration video"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              </div>
              <span className="font-condensed font-bold uppercase tracking-wider text-base sm:text-lg">
                Play Video
              </span>
            </button>
          </div>
        )}

        {/* Video Control Bar (Visible on hover, focus-within, paused, or touch) */}
        <div
          className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-water-950/90 via-water-950/60 to-transparent p-3 sm:p-4 flex items-center justify-between transition-opacity duration-200 ${
            isPlaying ? 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100' : 'opacity-100'
          }`}
        >
          {/* Left Controls: Play/Pause, Replay */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="w-9 h-9 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-300"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="w-9 h-9 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-300"
              aria-label="Replay video from beginning"
              title="Replay"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="w-9 h-9 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-300"
              aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Right Controls: Captions, Watch in Popup / Modal */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleCaptions}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-condensed font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-300 ${
                captionsOn
                  ? 'bg-water-500 text-white'
                  : 'bg-white/15 hover:bg-white/25 text-white/90'
              }`}
              aria-label={captionsOn ? 'Disable closed captions' : 'Enable closed captions'}
              title={captionsOn ? 'Captions On' : 'Captions Off'}
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CC</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (videoRef.current) videoRef.current.pause()
                openModal()
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-water-600 hover:bg-water-500 text-white text-xs font-condensed font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-300"
              aria-label="Open Watch Demo popup window"
              title="Watch in popup"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Watch Demo Pop-up</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary line & Disclosure note below video */}
      {showSummary && (
        <div className="mt-4 px-2 sm:px-4 space-y-2 text-center">
          <p className="text-base sm:text-lg font-bold text-water-900 font-condensed leading-snug">
            Our crew walks the site, sets up the rig, drills through each layer, and reaches clean groundwater.
          </p>
          <p className="text-xs sm:text-sm text-water-700 font-sans italic">
            Illustration of the drilling process. Actual well depth and conditions vary by site.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-water-100 hover:bg-water-200 text-water-900 font-condensed font-bold uppercase tracking-wider text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-water-600" />
              <span>Open Interactive Demo Modal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DrillingVideo
