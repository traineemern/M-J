import { useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { ContentText } from '@/components/content/ContentText'
import { Button } from '@/components/ui/Button'
import { homepageNavLinks, resolveContent, siteContent } from '@/data/site'
import { MobileNav } from './MobileNav'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function closeMobileMenu() {
    setMobileMenuOpen(false)
    window.setTimeout(() => menuButtonRef.current?.focus(), 0)
  }

  return (
    <>
      <header className="site-header home-site-header fixed inset-x-0 top-0 z-50" data-site-header>
        <div className="home-container home-site-header__inner">
          <Link className="home-brand" to="/" aria-label={resolveContent(siteContent.pages.labels.homeLinkAria) ?? ''}>
            <img
              src="/images/newlogo.png"
              alt={resolveContent(siteContent.pages.labels.homeLinkAria) ?? ''}
              width={1748}
              height={900}
              className="home-header-logo"
            />
          </Link>

          <nav className="home-site-header__nav" aria-label={resolveContent(siteContent.homepage.labels.mainNav) ?? ''}>
            {homepageNavLinks.map((item) => (
              <NavLink key={item.href} to={item.href} end={item.href === '/'}>{item.label}</NavLink>
            ))}
          </nav>

          <div className="home-site-header__action">
            <Button href="/contact" size="sm" className="home-button home-button--primary">
              <ContentText field={siteContent.homepage.hero.quoteCta} />
            </Button>
          </div>
          <button
            ref={menuButtonRef}
            className="home-site-header__menu-button"
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="home-mobile-menu"
            aria-label={resolveContent(mobileMenuOpen ? siteContent.pages.labels.menuClose : siteContent.pages.labels.menuOpen) ?? ''}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
          </button>
        </div>
      </header>
      <MobileNav isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
    </>
  )
}
