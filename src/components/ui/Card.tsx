import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'muted' | 'interactive' | 'accent' | 'dark'
}

export function Card({
  children,
  className,
  variant = 'default',
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white border border-water-200/80 shadow-xs',
    muted: 'bg-surface-muted border border-water-200/60',
    interactive:
      'bg-white border border-water-200 shadow-xs hover:shadow-lg hover:border-water-400/80 hover:-translate-y-1.5 transition-all duration-250 cursor-pointer',
    accent: 'bg-water-50 border border-water-200 shadow-xs',
    dark: 'bg-water-900 border border-water-800 text-white shadow-xl',
  }

  return (
    <div
      className={cn('rounded-2xl p-6 sm:p-8 card-hover-lift', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
}
