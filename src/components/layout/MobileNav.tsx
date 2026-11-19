import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { X, Phone, Mail, MapPin, ChevronRight } from 'lucide-react'
import { siteData, mainNavLinks } from '@/data/site'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-water-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative z-10 flex flex-col w-4/5 max-w-sm h-full bg-white text-water-900 shadow-2xl p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-water-100">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-water-600 font-bold text-white text-xl font-condensed">
              M&J
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-water-900 leading-tight">
                M&J Water Wells
              </span>
              <span className="text-[11px] text-water-700 uppercase tracking-wider font-semibold">
                Casnovia, MI
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-water-700 hover:text-water-900 hover:bg-water-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-600"
            aria-label="Close navigation menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Links */}
        <nav className="py-6 space-y-2 flex-1">
          {mainNavLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 rounded-lg text-base font-bold transition-colors ${
                  isActive
                    ? 'bg-water-100 text-water-700 border-l-4 border-water-600'
                    : 'text-water-900 hover:bg-water-50 hover:text-water-700'
                }`
              }
            >
              <span>{link.label}</span>
              <ChevronRight className="w-4 h-4 text-water-400" />
            </NavLink>
          ))}
        </nav>

        {/* Contact info in drawer */}
        <div className="pt-6 border-t border-water-100 space-y-4">
          <a
            href={`tel:${siteData.phoneClean}`}
            className="flex items-center justify-center gap-2 p-3 bg-water-600 hover:bg-water-700 text-white font-bold rounded-lg shadow-md transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call: {siteData.phone}</span>
          </a>

          <a
            href={`mailto:${siteData.email}`}
            className="flex items-center gap-3 text-xs text-water-700 hover:text-water-900 transition-colors"
          >
            <Mail className="w-4 h-4 text-aqua shrink-0" />
            <span className="truncate">{siteData.email}</span>
          </a>

          <div className="flex items-start gap-3 text-xs text-water-700">
            <MapPin className="w-4 h-4 text-aqua shrink-0 mt-0.5" />
            <span>{siteData.address.full}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
