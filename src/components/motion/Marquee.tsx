import React from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface MarqueeProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function Marquee({
  children,
  speed = 30,
  className = '',
}: MarqueeProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      className={`overflow-hidden relative flex select-none group ${className}`}
      tabIndex={0}
      aria-label="Partner brand logos marquee. Press tab to focus or pause."
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-loop {
          animation: marquee ${speed}s linear infinite;
        }
        .group:hover .animate-marquee-loop,
        .group:focus .animate-marquee-loop,
        .group:focus-within .animate-marquee-loop {
          animation-play-state: paused;
        }
      `}</style>
      <div
        className={`flex shrink-0 items-center gap-10 whitespace-nowrap min-w-full ${
          shouldReduceMotion ? 'flex-wrap justify-center' : 'animate-marquee-loop'
        }`}
      >
        {children}
        {!shouldReduceMotion && children}
      </div>
    </div>
  )
}
