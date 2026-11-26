import type { ReactNode } from 'react'
import { SectionTitle } from '@/components/typography/Typography'

export function SectionHeading({ title, eyebrow, children, className = '' }: { title: string; eyebrow?: string; children?: ReactNode; className?: string }) {
  return <SectionTitle title={title} eyebrow={eyebrow} className={`mb-8 ${className}`}>{children}</SectionTitle>
}
