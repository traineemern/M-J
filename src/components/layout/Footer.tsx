import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import { siteData, mainNavLinks } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { PaymentLogos } from '@/features/trust/PaymentLogos'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-water-950 text-slate-300 pt-12 pb-16 border-t-4 border-water-600">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-water-900">
          {/* Column 1: Company Profile with White Logo */}
          <div className="space-y-3">
            <Link to="/" className="inline-block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-400 rounded-lg">
              <img
                src="/images/mj-mark.svg"
                alt="M&J Water Wells, Casnovia, Michigan"
                width={220}
                height={48}
                loading="lazy"
                className="h-10 w-auto object-contain group-hover:scale-102 transition-transform duration-200"
              />
            </Link>
            <div className="text-xs text-slate-400 font-medium">
              <span>{siteData.licenseNumberPlaceholder}</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <span className="text-white font-bold text-sm tracking-wider uppercase font-condensed block">
              Quick Links
            </span>
            <ul className="space-y-1.5 text-sm">
              {mainNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-aqua transition-colors font-condensed uppercase tracking-wide text-xs font-bold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/warranty"
                  className="text-slate-300 hover:text-aqua transition-colors font-condensed uppercase tracking-wide text-xs font-bold"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  to="/areas/newaygo"
                  className="text-slate-300 hover:text-aqua transition-colors font-condensed uppercase tracking-wide text-xs font-bold"
                >
                  Newaygo Area
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Address */}
          <div className="space-y-3">
            <span className="text-white font-bold text-sm tracking-wider uppercase font-condensed block">
              Contact
            </span>
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${siteData.phoneClean}`}
                className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-aqua shrink-0" />
                <span className="font-bold">{siteData.phone}</span>
              </a>
              <a
                href={`mailto:${siteData.email}`}
                className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-aqua shrink-0" />
                <span>{siteData.email}</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-aqua shrink-0" />
                <span>{siteData.address.full}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Payment & Trust Badges */}
          <div className="space-y-3">
            <span className="text-white font-bold text-sm tracking-wider uppercase font-condensed block">
              Accepted Payments
            </span>
            <PaymentLogos />
          </div>
        </div>

        {/* Dynamic Copyright Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {currentYear} M&J Water Wells Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/warranty" className="hover:text-aqua transition-colors">
              Warranty
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-aqua transition-colors">
              Contact
            </Link>
            <span>[CONFIRM: Google Business link]</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
