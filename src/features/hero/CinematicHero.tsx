import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown } from 'lucide-react'
import { homeData } from '@/data/home'
import { Button } from '@/components/ui/Button'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'

export function CinematicHero() {
  const { openEnquiry } = useEnquiry()
  const [intro, setIntro] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    if (!media.matches) requestAnimationFrame(() => setIntro(true))
    return () => media.removeEventListener('change', sync)
  }, [])

  return (
    <section
      id="home-hero"
      className={`cinematic-hero relative isolate flex min-h-[640px] h-[100svh] w-full items-end overflow-hidden bg-water-950 text-white ${intro && !reduceMotion ? 'is-intro-active' : ''}`}
      aria-labelledby="home-hero-title"
    >
      <img
        className="cinematic-hero__image absolute inset-0 -z-20 h-full w-full object-cover object-[58%_center]"
        src="/images/image.png"
        sizes="100vw"
        alt="M&J Water Wells location and roadside sign in West Michigan"
        width={1920}
        height={795}
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-water-950/65 via-water-950/15 to-water-950" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-water-950/90 via-water-950/45 to-water-950/5" aria-hidden="true" />
      <div className={`cinematic-hero__intro absolute inset-0 -z-0 bg-water-950 ${reduceMotion ? 'hidden' : ''}`} aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-44 pt-28 sm:px-8 sm:pb-28 lg:px-12 lg:pb-32">
        <div className="max-w-6xl">
          <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-water-200 sm:text-sm">
            <span className="h-px w-10 bg-aqua" />
            Family-owned · Casnovia, Michigan
          </p>
          <h1 id="home-hero-title" className="max-w-[1100px] font-condensed text-[clamp(3rem,8vw,6rem)] font-bold uppercase leading-[0.9] tracking-[-0.035em] text-white">
            <span className="hidden min-[768px]:block">
              <span className="cinematic-hero__line"><span>West Michigan&apos;s well</span></span>
              <span className="cinematic-hero__line"><span>drilling specialists</span></span>
            </span>
            <span className="block min-[768px]:hidden">
              <span className="cinematic-hero__line"><span>West Michigan&apos;s</span></span>
              <span className="cinematic-hero__line"><span>well drilling</span></span>
              <span className="cinematic-hero__line"><span>specialists</span></span>
            </span>
          </h1>
          <p className="cinematic-hero__tagline">Well drilling for homes, farms, businesses</p>
          <p className="cinematic-hero__description">
            {homeData.hero.line}
          </p>
          <div className="cinematic-hero__actions mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              pulse
              onClick={() => openEnquiry()}
              variant="primary"
              size="lg"
              className="min-h-12 rounded-md bg-water-600 font-condensed text-base uppercase tracking-wider hover:bg-water-500 focus-visible:ring-2 focus-visible:ring-water-300 focus-visible:ring-offset-2 focus-visible:ring-offset-water-950"
            >
              {homeData.hero.primaryCta.text}
            </Button>
            <Link
              to="/services"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/65 bg-water-950/20 px-6 py-3 font-condensed text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-300 focus-visible:ring-offset-2 focus-visible:ring-offset-water-950"
            >
              See our services
            </Link>
          </div>
        </div>

        <div className="cinematic-hero__service-area absolute inset-x-5 bottom-5 flex items-end justify-between border-t border-aqua/80 pt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 sm:inset-x-8 sm:bottom-7 sm:text-xs lg:inset-x-12">
          <span>{homeData.serviceArea.line}</span>
          <a href="#journey-3d-section" className="ml-4 hidden shrink-0 items-center gap-2 text-white/80 transition-colors hover:text-white sm:inline-flex">
            Scroll <span className="cinematic-scroll-line" aria-hidden="true" /><ArrowDown className="size-3" />
          </a>
        </div>
      </div>
    </section>
  )
}
