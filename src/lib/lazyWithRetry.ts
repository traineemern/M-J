import { lazy, type ComponentType } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    try {
      return await factory()
    } catch (error) {
      console.warn('Dynamic import failed, retrying once in 400ms...', error)
      await new Promise((resolve) => setTimeout(resolve, 400))
      return await factory()
    }
  })
}
