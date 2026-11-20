import type { ReactNode } from 'react'

export function SectionHeading({ title, eyebrow, children, className = '' }: { title: string; eyebrow?: string; children?: ReactNode; className?: string }) {
  return <div className={`mb-8 ${className}`}>{eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-aqua">{eyebrow}</p>}<h2 className="font-condensed text-3xl font-black uppercase tracking-tight text-water-900 sm:text-4xl">{title}</h2>{children && <div className="mt-3 text-water-800">{children}</div>}</div>
}
