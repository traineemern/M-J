import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { homeData } from '@/data/home'

const serviceImages = [
  '/images/service-residential.webp',
  '/images/service-commercial.webp',
  '/images/service-pump.webp',
]

export function ServiceBanners() {
  return (
    <div className="service-banners">
      {homeData.services.cards.map((service, index) => (
        <section key={service.id} className="service-banner relative flex min-h-[50svh] items-end overflow-hidden bg-water-950 text-white md:min-h-[70vh]">
          <img
            data-motion="parallax"
            className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
            src={serviceImages[index]}
            alt=""
            aria-hidden="true"
            width={1600}
            height={662}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-water-950/95 via-water-950/70 to-water-950/5" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-water-950/75 via-transparent to-water-950/5" aria-hidden="true" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-20 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
            <div className="max-w-2xl" data-motion="wipe">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-water-200">M&amp;J Water Wells &middot; {String(index + 1).padStart(2, '0')}</p>
              <h2 className="font-condensed text-4xl font-bold uppercase leading-none tracking-tight text-white sm:text-6xl">
                {service.title}
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/90 sm:text-lg">{service.line}</p>
              <Link to="/services" className="mt-6 inline-flex items-center gap-2 border-b border-aqua pb-1 font-condensed text-sm font-bold uppercase tracking-wider text-white transition-colors hover:text-water-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-300">
                Learn more <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
