import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('merges class names', () => {
    const result = cn('px-4', 'py-2')
    expect(result).toContain('px-4')
    expect(result).toContain('py-2')
  })

  it('handles conditional classes', () => {
    const isHidden = false
    const result = cn('base', isHidden && 'skipped', 'included')
    expect(result).toContain('base')
    expect(result).toContain('included')
    expect(result).not.toContain('skipped')
  })

  it('resolves tailwind conflicts', () => {
    const result = cn('px-4', 'px-6')
    // tailwind-merge should keep only px-6
    expect(result).toBe('px-6')
  })
})
