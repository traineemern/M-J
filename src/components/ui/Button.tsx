import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  isExternal?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  href,
  isExternal,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-97 hover:-translate-y-0.5'

  const variants = {
    primary:
      'bg-water-600 text-white hover:bg-water-700 active:bg-water-800 shadow-md hover:shadow-lg focus-visible:ring-water-600',
    secondary:
      'bg-white border-2 border-water-700 text-water-700 hover:bg-water-50 active:bg-water-100 shadow-xs focus-visible:ring-water-700',
    dark:
      'bg-button-dark text-white hover:bg-button-dark-hover active:bg-black shadow-md hover:shadow-lg focus-visible:ring-button-dark',
    outline:
      'border-2 border-water-700 text-water-700 bg-white hover:bg-water-50 active:bg-water-100 focus-visible:ring-water-700',
    ghost:
      'text-water-900 hover:bg-water-100 hover:text-water-950 focus-visible:ring-water-400',
    white:
      'bg-white text-water-700 hover:bg-water-50 active:bg-water-100 shadow-md hover:shadow-lg focus-visible:ring-white',
  }

  const sizes = {
    sm: 'text-sm px-3.5 py-1.5 gap-1.5',
    md: 'text-base px-5 py-2.5 gap-2',
    lg: 'text-lg px-6 py-3.5 gap-2.5',
  }

  const combinedClasses = cn(baseStyles, variants[variant], sizes[size], className)

  if (href) {
    if (isExternal || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) {
      return (
        <a
          href={href}
          className={combinedClasses}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    }

    return (
      <Link to={href} className={combinedClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  )
}
