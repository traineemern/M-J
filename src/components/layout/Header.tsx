import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Phone, Menu, Droplet } from 'lucide-react'
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
      {/* Main Sticky Header */}
      {/* Uses transform and opacity only for smooth 60fps performance */}
      <header
        className={`sticky top-0 z-30 transition-[background-color,backdrop-filter,box-shadow,padding] duration-200 border-b ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs py-2 border-water-200/80'
          : 'bg-white py-3.5 border-water-100'
          }`}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-600 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-water-600 to-water-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
                <Droplet className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-water-900 font-condensed uppercase group-hover:text-water-700 transition-colors">
                  M&J Water Wells
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-water-700 -mt-1 font-condensed">
                  Casnovia, Michigan
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {/* Nav links: underline draws in from left to right on hover (CSS transition, 200 ms) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {mainNavLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `relative px-3 py-1.5 text-base font-bold uppercase tracking-wider font-condensed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-600 rounded after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-water-600 after:transition-[width] after:duration-200 ${isActive
                      ? 'text-water-700 after:w-full font-black'
                      : 'text-water-900 hover:text-water-700 after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Phone Number with Gentle 6s Pulse & Primary Action */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={`tel:${siteData.phoneClean}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-water-700 hover:text-water-900 font-bold font-condensed text-base uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-600 animate-pulse-slow cursor-pointer"
                title="Tap to call M&J Water Wells"
              >
                <Phone className="w-4 h-4 text-water-700 fill-current" />
                <span>{siteData.phone}</span>
              </a>
              <Button
                onClick={() => openEnquiry()}
                variant="primary"
                size={isScrolled ? 'sm' : 'md'}
                className="font-condensed uppercase tracking-wider cursor-pointer"
              >
                Free Estimate
              </Button>
            </div>

            {/* Mobile Hamburger Trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={`tel:${siteData.phoneClean}`}
                className="p-2 rounded-lg text-water-700 hover:bg-water-100 transition-colors animate-pulse-slow"
                aria-label="Call (616) 675-4875"
              >
                <Phone className="w-5 h-5 fill-current" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg text-water-900 hover:bg-water-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-600 cursor-pointer"
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
