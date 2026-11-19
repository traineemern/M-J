import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Phone, Menu } from 'lucide-react'
import { siteData, mainNavLinks } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { MobileNav } from './MobileNav'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'

export function Header() {
  const { openEnquiry } = useEnquiry()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Shrinks and gains backdrop blur after 80px of scroll
      if (window.scrollY > 80) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Main Sticky Header in Blue Water Theme */}
      <header
        className={`sticky top-0 z-30 transition-[background-color,backdrop-filter,box-shadow,padding] duration-200 border-b ${
          isScrolled
            ? 'bg-water-900/95 backdrop-blur-md shadow-md py-2 border-water-800/80 text-white'
            : 'bg-water-900 py-3 sm:py-3.5 border-water-800 text-white'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Brand Logo: White Logo with Light-Blue Outline on Blue Background */}
            <Link
              to="/"
              className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-300 rounded-lg p-0.5"
            >
              <img
                src="/images/mj-logo-white.png"
                alt="M&J Water Wells, Casnovia, Michigan"
                width={220}
                height={48}
                className="h-9 sm:h-11 w-auto min-w-[160px] max-w-[220px] object-contain group-hover:scale-102 transition-transform duration-200"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {mainNavLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `relative px-3 py-1.5 text-base font-bold uppercase tracking-wider font-condensed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-sky-400 after:transition-[width] after:duration-200 ${
                      isActive
                        ? 'text-white after:w-full font-black'
                        : 'text-water-100 hover:text-white after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Phone Number with Gentle Pulse & Primary Action */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={`tel:${siteData.phoneClean}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-water-100 hover:text-white font-bold font-condensed text-base uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 cursor-pointer"
                title="Tap to call M&J Water Wells"
              >
                <Phone className="w-4 h-4 text-sky-400 fill-current" />
                <span>{siteData.phone}</span>
              </a>
              <Button
                onClick={() => openEnquiry()}
                variant="primary"
                size={isScrolled ? 'sm' : 'md'}
                className="font-condensed uppercase tracking-wider cursor-pointer shadow-sm hover:shadow-md"
              >
                Free Estimate
              </Button>
            </div>

            {/* Mobile Actions & Hamburger Trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={`tel:${siteData.phoneClean}`}
                className="p-2 rounded-lg text-water-100 hover:text-white hover:bg-water-800 transition-colors"
                aria-label="Call (616) 675-4875"
              >
                <Phone className="w-5 h-5 fill-current text-sky-400" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg text-white hover:bg-water-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  )
}
