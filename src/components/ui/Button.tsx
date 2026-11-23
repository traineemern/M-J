import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useVisibleGlowPulse } from '@/hooks/useVisibleGlowPulse'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  isExternal?: boolean
  pulse?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  href,
  isExternal,
  pulse = false,
  children,
  ...props
}: ButtonProps) {
  const { pulseRef, pulseActive } = useVisibleGlowPulse(pulse)
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-97 hover:-translate-y-0.5'

  const variants = {
    primary:
      'glass-button bg-water-600 border border-white/30 text-white hover:bg-water-700 active:bg-water-700 shadow-md hover:shadow-lg focus-visible:ring-water-400',
    secondary:
      'glass-button bg-white/8 border border-white/30 text-white hover:bg-white/14 active:bg-white/10 shadow-xs focus-visible:ring-white',
    dark:
      'bg-button-dark text-white hover:bg-button-dark-hover active:bg-black shadow-md hover:shadow-lg focus-visible:ring-button-dark',
    outline:
      'glass-button border border-water-700 text-water-700 bg-transparent hover:bg-water-50 active:bg-water-100 focus-visible:ring-water-700',
    ghost:
      'glass-button text-water-900 hover:bg-white/10 hover:text-white focus-visible:ring-white',
    white:
      'glass-button bg-white/10 border border-white/30 text-white hover:bg-white/14 active:bg-white/10 shadow-md hover:shadow-lg focus-visible:ring-white',
  }

  const sizes = {
    sm: 'text-sm px-3.5 py-1.5 gap-1.5',
    md: 'text-base px-5 py-2.5 gap-2',
    lg: 'text-lg px-6 py-3.5 gap-2.5',
  }

  const combinedClasses = cn(baseStyles, 'ui-button-glow', variant === 'primary' && 'glass-button-primary', pulse && pulseActive && 'ui-button-glow--pulse', variants[variant], sizes[size], className)

  if (href) {
    if (isExternal || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) {
      return (
        <a
          href={href}
          ref={pulseRef as React.Ref<HTMLAnchorElement>}
          {...(variant === 'primary' ? { 'data-glass-blur': 'true' } : {})}
          className={combinedClasses}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    }

    return (
      <Link to={href} ref={pulseRef as React.Ref<HTMLAnchorElement>} className={combinedClasses} {...(variant === 'primary' ? { 'data-glass-blur': 'true' } : {})}>
        {children}
      </Link>
    )
  }

  return (
    <button ref={pulseRef as React.Ref<HTMLButtonElement>} className={combinedClasses} {...(variant === 'primary' ? { 'data-glass-blur': 'true' } : {})} {...props}>
      {children}
    </button>
  )
}
