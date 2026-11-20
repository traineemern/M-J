import { Droplet, MapPin } from 'lucide-react'
import { siteData } from '@/data/site'

export function TrustBar() {
  return <div className="border-y border-water-100 bg-white py-4"><div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-3 px-5 text-xs font-bold uppercase tracking-wider text-water-800 sm:text-sm"><span className="inline-flex items-center gap-2"><Droplet className="size-4 text-aqua" />Family-owned</span><span className="inline-flex items-center gap-2"><MapPin className="size-4 text-aqua" />Locally serving West Michigan</span><span className="sr-only">{siteData.licenseNumberPlaceholder}</span></div></div>
}
