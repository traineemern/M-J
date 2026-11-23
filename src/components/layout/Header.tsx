import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Phone, X } from 'lucide-react'
import { siteData, mainNavLinks } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { MobileNav } from './MobileNav'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function Header() {
  const { openEnquiry } = useEnquiry()
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()
  const isHome = pathname === '/'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const solid = isScrolled || !isHome

  useEffect(() => {
    document.body.classList.toggle('homepage-active', isHome)
    return () => document.body.classList.remove('homepage-active')
  }, [isHome])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => {
    setMobileMenuOpen(false)
    window.setTimeout(() => menuButtonRef.current?.focus(), 170)
  }

  return (
    <>
      <header data-glass-blur="true" className={`site-header glass-bar fixed inset-x-0 top-0 z-50 h-[72px] ${solid ? 'glass-bar--strong bg-water-950/[0.92]' : ''}`}>
        <Container className="h-full max-w-none px-4 sm:px-6 min-[900px]:px-8">
          <div className="relative flex h-full items-center justify-between min-[900px]:grid min-[900px]:grid-cols-[160px_1fr_auto] min-[900px]:gap-5">
            <Link to="/" aria-label="M&J Water Wells home" className="shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-300 focus-visible:ring-offset-2 focus-visible:ring-offset-water-950">
              <img src="/images/mj-original-logo.png" alt="M&J Water Wells" width={160} height={72} className="h-auto w-[96px] object-contain min-[900px]:w-28" />
            </Link>

            <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 min-[900px]:static min-[900px]:flex min-[900px]:translate-x-0 min-[900px]:justify-center min-[900px]:gap-4 xl:gap-6">
              {mainNavLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) => `site-nav-link relative whitespace-nowrap rounded-full px-3 py-2 font-condensed text-sm font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-600 focus-visible:ring-offset-2 ${isActive ? 'is-active' : ''}`}
                >
                  {({ isActive }) => <>
                    {isActive && <motion.span layoutId="active-nav-glass-pill" className="site-nav-active-pill absolute inset-0 rounded-full" transition={{ duration: reduceMotion ? 0 : 0.2 }} aria-hidden="true" />}
                    <span className="relative z-10">{link.label}</span>
                  </>}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center justify-self-end gap-5 min-[900px]:flex">
                <a href={`tel:${siteData.phoneClean}`} className="site-nav-link inline-flex items-center gap-2 whitespace-nowrap rounded-sm text-[15px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-600 focus-visible:ring-offset-2">
                <Phone className="size-4" />{siteData.phone}
              </a>
              <Button type="button" onClick={() => openEnquiry()} pulse size="sm" className="h-10 whitespace-nowrap rounded-full font-condensed text-sm uppercase tracking-wide">Free estimate</Button>
            </div>

            <div className="ml-auto flex items-center min-[900px]:hidden">
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => mobileMenuOpen ? closeMenu() : setMobileMenuOpen(true)}
                className="site-menu-toggle flex size-11 items-center justify-center rounded-md transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-600"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileNav isOpen={mobileMenuOpen} onClose={closeMenu} onEstimate={() => openEnquiry()} />
    </>
  )
}
