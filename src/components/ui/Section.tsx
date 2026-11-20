import React from 'react'
import { cn } from '@/lib/utils'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  variant?: 'default' | 'muted' | 'brand' | 'dark'
}

export function Section({
  children,
  className,
  variant = 'default',
  ...props
}: SectionProps) {
  const variants = {
    default: 'bg-white text-slate-900',
    muted: 'bg-slate-50 text-slate-900 border-y border-slate-200/70',
    brand: 'bg-gradient-to-b from-sky-900 to-slate-950 text-white',
    dark: 'bg-slate-950 text-white',
  }

  const { id, ...rest } = props
  return <section id={id} className={cn('py-14 lg:py-24', variants[variant], className)} {...rest}><div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">{children}</div></section>
}
