import { useEffect, useRef } from 'react'
import { Phone, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { ContentText } from '@/components/content/ContentText'
import { homepageNavLinks, resolveContent, siteContent, siteData } from '@/data/site'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => navRef.current?.querySelector<HTMLElement>('a, button')?.focus())

    function trapFocus(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !navRef.current) return
      const focusable = Array.from(navRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', trapFocus)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', trapFocus)
    }
  }, [isOpen, onClose])

  return (
    <div className={`home-mobile-nav-layer${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen}>
      <button
        className="home-mobile-nav-backdrop"
        type="button"
        tabIndex={-1}
        aria-label={resolveContent(siteContent.pages.labels.menuClose) ?? ''}
        onClick={onClose}
      />
      <nav
        ref={navRef}
        id="home-mobile-menu"
        className="home-mobile-nav-panel"
        aria-label={resolveContent(siteContent.homepage.labels.mainNav) ?? ''}
        aria-hidden={!isOpen}
        hidden={!isOpen}
      >
        <div className="home-mobile-nav-top">
          <Link className="home-brand" to="/" onClick={onClose}>
            <img
              src="/images/newlogo.png"
              alt={resolveContent(siteContent.pages.labels.homeLinkAria) ?? ''}
              width={1748}
              height={900}
              className="home-header-logo"
            />
          </Link>
          <button type="button" onClick={onClose} aria-label={resolveContent(siteContent.pages.labels.menuClose) ?? ''}>
            <X size={21} aria-hidden="true" />
          </button>
        </div>
        <div className="home-mobile-nav-links">
          {homepageNavLinks.map((item) => (
            <NavLink key={item.href} to={item.href} end={item.href === '/'} onClick={onClose}>{item.label}</NavLink>
          ))}
        </div>
        <div className="home-mobile-nav-contact">
          <a href={`tel:${siteData.phoneClean}`} onClick={onClose}>
            <Phone size={18} aria-hidden="true" />
            <span><ContentText field={siteContent.pages.labels.callNow} /> · {siteData.phone}</span>
          </a>
          <Link className="home-button home-button--primary" to="/contact" onClick={onClose}>
            <ContentText field={siteContent.homepage.hero.quoteCta} />
          </Link>
        </div>
      </nav>
    </div>
  )
}
