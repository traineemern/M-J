import { Phone, Clock } from 'lucide-react'
import { siteData } from '@/data/site'

export function PhoneCTA() {
  return (
    <aside
      aria-label="Call emergency contact"
      className="fixed bottom-0 left-0 right-0 z-40 bg-water-950/95 backdrop-blur-md border-t border-water-800 p-3 shadow-2xl md:hidden"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-water-300 flex items-center gap-1 font-condensed">
            <Clock className="w-3 h-3 text-aqua" /> Casnovia Dispatch
          </span>
          <span className="text-xs text-slate-200 font-semibold truncate">
            No Water? Call Now
          </span>
        </div>
        <a
          href={`tel:${siteData.phoneClean}`}
          className="flex items-center justify-center gap-2 bg-water-600 hover:bg-water-700 active:bg-water-800 text-white font-bold px-4 py-2.5 rounded-lg text-sm shadow-md transition-colors shrink-0 font-condensed uppercase tracking-wider"
          aria-label={`Call M&J Water Wells at ${siteData.phone}`}
        >
          <Phone className="w-4 h-4 fill-current animate-bounce" />
          <span>{siteData.phone}</span>
        </a>
      </div>
    </aside>
  )
}
