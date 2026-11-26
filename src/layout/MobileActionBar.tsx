import { Link } from 'react-router-dom'
import { siteData, siteContent } from '@/data/site'

export function MobileActionBar() {
  return (
    <nav aria-label={siteContent.pages.labels.mobileQuickContact.value} className="mobile-action-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-water-800 bg-water-950/95 p-2 pb-[calc(.5rem+env(safe-area-inset-bottom))] shadow-2xl md:hidden">
        <a
          href={`tel:${siteData.phoneClean}`}
          className="flex min-h-12 items-center justify-center rounded-md border border-water-300 px-3 text-sm font-bold uppercase tracking-wide text-white focus-visible:outline-2"
        >
          {siteContent.homepage.labels.mobileCall.value}
        </a>
        <Link to="/contact" className="flex min-h-12 items-center justify-center rounded-full bg-home-primary px-3 text-sm font-bold uppercase tracking-wide text-white focus-visible:outline-2">
          {siteContent.homepage.hero.quoteCta.value}
        </Link>
    </nav>
  )
}
