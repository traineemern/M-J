import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  label?: string
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { children, label, className = '', ...props },
  ref,
) {
  return (
    <section ref={ref} className={`night-section ${className}`} {...props}>
      {label && <p className="night-section__eyebrow">{label}</p>}
      {children}
    </section>
  )
})
