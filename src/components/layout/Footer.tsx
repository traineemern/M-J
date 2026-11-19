import { Link } from 'react-router-dom'
import { Droplet, Phone, Mail, MapPin } from 'lucide-react'
import { siteData, mainNavLinks } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { PaymentLogos } from '@/features/trust/PaymentLogos'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-water-950 text-slate-300 pt-12 pb-16 border-t-4 border-water-600">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-water-900">
          {/* Column 1: Company Profile (No paragraph text) */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-water-600 flex items-center justify-center text-white shadow-xs">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight font-condensed uppercase">
                  M&J Water Wells
                </span>
                <span className="text-xs text-aqua font-bold tracking-wider uppercase font-condensed">
                  Casnovia, Michigan
                </span>
              </div>
            </div>
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
          </div>
        </div>
      </Container>
    </footer>
  )
}
