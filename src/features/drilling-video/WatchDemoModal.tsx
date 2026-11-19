import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Subtitles, ArrowRight } from 'lucide-react'
import { useDrillingVideo } from './DrillingVideoContext'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'

export const WatchDemoModal: React.FC = () => {
  const { isModalOpen, closeModal } = useDrillingVideo()
  const { openEnquiry } = useEnquiry()

  const videoRef = useRef<HTMLVideoElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [captionsOn, setCaptionsOn] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)

  // Handle modal keyboard accessibility & Esc
  useEffect(() => {
    if (!isModalOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Autoplay when modal opens
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
      }
    }, 150)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isModalOpen, closeModal])

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true)
        setHasEnded(false)
      })
    }
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return
    const nextMuted = !isMuted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }, [isMuted])

  const toggleCaptions = useCallback(() => {
    if (!videoRef.current || !videoRef.current.textTracks[0]) return
    const track = videoRef.current.textTracks[0]
    const nextMode = track.mode === 'showing' ? 'hidden' : 'showing'
    track.mode = nextMode
    setCaptionsOn(nextMode === 'showing')
  }, [])

  const handleReplay = useCallback(() => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.play().then(() => {
      setIsPlaying(true)
      setHasEnded(false)
    })
  }, [])

  const handleEnquiry = useCallback(() => {
    closeModal()
    openEnquiry()
  }, [closeModal, openEnquiry])

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
          {/* Backdrop Overlay: click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-water-950/80 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Video Tile Only with Rounded Corners */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="M&J Well Drilling Demo Video"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border-2 border-water-500/30 z-10 ring-1 ring-white/10 group/modal"
          >
            {/* Top Right Corner Cancel Button */}
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close video demo"
              title="Close (Esc)"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 w-10 h-10 rounded-full bg-water-950/85 hover:bg-water-900 active:scale-95 text-white hover:text-water-200 border border-white/25 backdrop-blur-md flex items-center justify-center shadow-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-300"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Video Element Filling the Rounded Tile */}
            <video
              ref={videoRef}
              playsInline
              muted={isMuted}
              poster="/media/mj-drilling-poster.jpg"
              onEnded={() => {
                setHasEnded(true)
                setIsPlaying(false)
              }}
              className="w-full h-full object-contain"
              aria-label="Animated drilling video: a crew sets up, drills, and reaches clean groundwater."
            >
              <source src="/media/mj-drilling.webm" type="video/webm" />
              <source src="/media/mj-drilling.mp4" type="video/mp4" />
              <track
                kind="captions"
                src="/media/mj-drilling.vtt"
                srcLang="en"
                label="English"
                default
              />
            </video>

            {/* End Screen Overlay with Replay and Free Estimate CTA */}
            {hasEnded && (
              <div className="absolute inset-0 bg-water-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
                <h3 className="text-2xl sm:text-3xl font-black font-condensed uppercase tracking-tight text-white mb-2">
                  Ready for Clean Water?
                </h3>
                <p className="text-sm sm:text-base text-water-100 max-w-md mb-6 font-sans">
                  Our Casnovia team provides prompt site visits, accurate logs, and complete rotary well systems.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handleReplay}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-water-700 hover:bg-water-600 active:scale-95 text-white font-condensed font-bold uppercase tracking-wider text-sm transition-all cursor-pointer shadow-md"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Replay Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleEnquiry}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-water-500 hover:bg-water-400 active:scale-95 text-water-950 font-condensed font-bold uppercase tracking-wider text-sm transition-all cursor-pointer shadow-md"
                  >
                    <span>Request Free Estimate</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Controls Bar on Video Tile */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 z-30 bg-water-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-water-700/70 shadow-lg">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="p-1.5 rounded-lg text-white hover:text-water-300 active:scale-90 transition-all cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="p-1.5 rounded-lg text-white hover:text-water-300 active:scale-90 transition-all cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={toggleCaptions}
                aria-label={captionsOn ? 'Turn off captions' : 'Turn on captions'}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  captionsOn ? 'text-aqua bg-water-800' : 'text-white hover:text-water-300'
                }`}
                title="Toggle closed captions"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleReplay}
                aria-label="Replay video"
                className="p-1.5 rounded-lg text-white hover:text-water-300 active:scale-90 transition-all cursor-pointer"
                title="Replay"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default WatchDemoModal
