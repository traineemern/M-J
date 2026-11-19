import React, { Suspense, useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface LazyLottieProps {
  animationData?: unknown
  animationPath?: string
  loop?: boolean
  autoplay?: boolean
  className?: string
  fallback: React.ReactNode
}

// Lazy load lottie-react to keep the main bundle ultra lightweight
const LottieComponent = React.lazy(async () => {
  const mod = await import('lottie-react')
  const Component = mod.Lottie || (mod as unknown as { default: unknown }).default || mod
  return {
    default: Component as unknown as React.ComponentType<{
      animationData: unknown
      loop?: boolean
      autoplay?: boolean
    }>,
  }
})

export const LazyLottie: React.FC<LazyLottieProps> = ({
  animationData,
  animationPath,
  loop = true,
  autoplay = true,
  className = '',
  fallback,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const [data, setData] = useState<unknown>(animationData)

  useEffect(() => {
    if (animationPath && !data && !shouldReduceMotion) {
      fetch(animationPath)
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch(() => {})
    }
  }, [animationPath, data, shouldReduceMotion])

  if (shouldReduceMotion) {
    return <div className={className}>{fallback}</div>
  }

  if (!data) {
    return <div className={className}>{fallback}</div>
  }

  return (
    <div className={className}>
      <Suspense fallback={<>{fallback}</>}>
        <LottieComponent
          animationData={data}
          loop={loop}
          autoplay={autoplay}
        />
      </Suspense>
    </div>
  )
}

export default LazyLottie
