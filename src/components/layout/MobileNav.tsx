import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { NavLink } from 'react-router-dom'
import { Phone, X } from 'lucide-react'
import { siteData, mainNavLinks } from '@/data/site'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  onEstimate: () => void
}

export function MobileNav({ isOpen, onClose, onEstimate }: MobileNavProps) {
  const [mounted, setMounted] = useState(isOpen)
  const [closing, setClosing] = useState(false)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', isOpen)
    return () => document.body.classList.remove('mobile-menu-open')
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      setClosing(false)
      document.body.style.overflow = 'hidden'
      window.requestAnimationFrame(() => firstLinkRef.current?.focus())
      return () => { document.body.style.overflow = '' }
    }

    document.body.style.overflow = ''
    if (!mounted) return
    setClosing(true)
    const timeout = window.setTimeout(() => {
      setMounted(false)
      setClosing(false)
    }, reduceMotion ? 0 : 160)
    return () => window.clearTimeout(timeout)
  }, [isOpen, mounted, reduceMotion])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 900px)').matches) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [isOpen, onClose])

  return (
    <div className="mobile-nav-layer" aria-hidden={!isOpen}>
      <button type="button" className={`mobile-nav-backdrop ${isOpen ? 'is-open' : ''}`} onClick={onClose} aria-label="Close menu" tabIndex={isOpen ? 0 : -1} />
      <nav
        id="mobile-menu"
        data-glass-blur="true"
        aria-label="Main mobile navigation"
        aria-hidden={!isOpen}
        hidden={!mounted}
        className={`glass-popup mobile-nav-panel ${isOpen && !closing ? 'is-open' : 'is-closing'} ${reduceMotion ? 'reduce-motion' : ''}`}
      >
        <div className="mobile-nav-topline">
          <span>M&amp;J Water Wells</span>
          <button type="button" onClick={onClose} className="mobile-nav-close" aria-label="Close menu">
            <X className="size-6" />
          </button>
        </div>

        <div className="mobile-nav-links">
          {mainNavLinks.map((link, index) => (
            <NavLink
              key={link.href}
              ref={index === 0 ? firstLinkRef : undefined}
              to={link.href}
              onClick={onClose}
              style={{ '--mobile-link-index': index } as CSSProperties}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="mobile-nav-contact">
          <a href={`tel:${siteData.phoneClean}`} className="mobile-nav-phone">
            <Phone className="size-5" />
            <span>{siteData.phone}</span>
          </a>
          <button type="button" onClick={() => { onClose(); onEstimate() }} className="mobile-nav-estimate">
            Free estimate
          </button>
        </div>
      </nav>
    </div>
  )
}
