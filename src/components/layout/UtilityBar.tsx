import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import { siteData, siteContent, utilityBarLinks } from '@/data/site'
import { Container } from '@/components/ui/Container'

export function UtilityBar() {
  return (
    <div className="bg-water-800 text-white text-xs py-2 border-b border-water-900 select-none">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-y-1">
          {/* Left: Location & Tagline */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-white">
              <MapPin className="w-3.5 h-3.5 text-aqua" />
              <span>{siteContent.business.location.value} &amp; {siteContent.areas.coverage.value}</span>
            </span>
            <span className="hidden sm:inline-block text-water-400">|</span>
            <span className="hidden sm:inline font-medium text-water-100 italic">
              &ldquo;{siteData.tagline}&rdquo;
            </span>
          </div>

          {/* Right: Utility Links & Direct Email */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4 text-water-100 font-medium">
              {utilityBarLinks.map((link) => (
                link.href.startsWith('mailto:') ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="hover:text-aqua transition-colors flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3 text-aqua" />
                    <span>{link.label}</span>
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="hover:text-aqua transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            <a
              href={`tel:${siteData.phoneClean}`}
              className="md:hidden font-bold text-white hover:text-aqua transition-colors flex items-center gap-1"
              aria-label={`${siteContent.pages.labels.call.value} ${siteData.phone}`}
            >
              <Phone className="w-3 h-3 fill-current text-aqua" />
              <span>{siteData.phone}</span>
            </a>
          </div>
        </div>
      </Container>
    </div>
  )
}
