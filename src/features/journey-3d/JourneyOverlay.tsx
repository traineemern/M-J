import React from 'react'
import { Phone } from 'lucide-react'
import { getBeatForProgress } from '@/data/journey'

interface JourneyOverlayProps {
  progress: number
}

function isProgressInTransition(p: number): boolean {
  if (p > 0.17 && p < 0.18) return true
  if (p > 0.28 && p < 0.30) return true
  if (p > 0.465 && p < 0.47) return true
  if (p > 0.535 && p < 0.54) return true
  if (p > 0.705 && p < 0.71) return true
  if (p > 0.825 && p < 0.83) return true
  if (p > 0.905 && p < 0.91) return true
  return false
}

export const JourneyOverlay: React.FC<JourneyOverlayProps> = ({ progress }) => {
  const currentBeat = getBeatForProgress(progress)
  const inTransition = isProgressInTransition(progress)

  // Beat 9 final frame hold (progress >= 0.94)
  const isFinalHold = progress >= 0.94

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-between">
      {/* ================= TOP BAR ================= */}
      <div className="p-4 sm:p-6 flex items-center justify-between">
        {/* Chapter Label: "Chapter n of 9" */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-water-950/80 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-wider font-condensed text-sky-200 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-aqua animate-pulse" />
          <span>Chapter {currentBeat.chapter} of 9</span>
        </div>

        {/* Progress indicator percentage */}
        <div className="hidden sm:block text-xs font-mono font-bold text-water-200/80 px-2.5 py-1 rounded bg-water-950/60 backdrop-blur-sm border border-white/10">
          {Math.round(progress * 100)}%
        </div>
      </div>

      {/* ================= FINAL HOLD OVERLAY (Beat 9) ================= */}
      {isFinalHold && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-water-950/50 backdrop-blur-[2px] transition-opacity duration-500 pointer-events-auto">
          <div className="text-center max-w-md space-y-4">
            <img
              src="/images/mj-mark.svg"
              alt="M&J Water Wells, Casnovia, Michigan"
              width={260}
              height={70}
              className="mx-auto drop-shadow-2xl"
            />
            <p className="text-sm sm:text-base text-water-100 font-sans font-medium drop-shadow">
              Clean, dependable water delivered straight to your home.
            </p>
            <div>
              <a
                href="tel:6166754875"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-condensed font-black text-base uppercase tracking-wider shadow-2xl hover:scale-105 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call (616) 675-4875</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= CAPTION & CONTACT BAR ================= */}
      <div className="flex flex-col items-center w-full pointer-events-auto">
        {/* Captions Box: Exactly one caption at a time, fades out only during transitions */}
        {!isFinalHold && (
          <div className="mb-4 sm:mb-6 max-w-2xl mx-4 text-center">
            <div
              style={{
                opacity: inTransition ? 0 : 1,
                transition: 'opacity 250ms ease-in-out',
              }}
              className="bg-water-50/92 backdrop-blur-md text-water-900 border border-water-200/90 rounded-2xl px-6 py-3.5 shadow-2xl"
            >
              <p className="text-lg sm:text-2xl font-black font-condensed uppercase tracking-tight leading-tight">
                {currentBeat.caption}
              </p>
            </div>
          </div>
        )}

        {/* Contact Bar: Fixed at bottom of stage */}
        <div className="w-full bg-water-950/95 border-t border-white/10 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 text-xs sm:text-sm text-water-200 font-sans">
          <span className="font-medium text-water-100">
            M&amp;J Water Wells | Casnovia, MI
          </span>
          <div className="flex items-center gap-3">
            <a
              href="tel:6166754875"
              className="font-bold text-aqua hover:text-white transition-colors flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call (616) 675-4875</span>
            </a>
            <span className="hidden sm:inline text-water-600">|</span>
            <span className="hidden sm:inline text-water-300">mandjwaterwells.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}
