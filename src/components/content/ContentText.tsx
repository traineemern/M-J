import type { ReactNode } from 'react'
import { resolveContent, type Tagged } from '@/data/site'

interface ContentTextProps {
  field: Tagged<string | number | null>
  className?: string
  children?: ReactNode
}

export function ContentText({ field, className, children }: ContentTextProps) {
  const value = resolveContent(field)
  if (value === undefined || value === null || value === '') return null

  return (
    <>
      <span className={className}>{value}</span>
      {children}
    </>
  )
}
