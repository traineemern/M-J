import React, { useRef, useState, useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxTilt?: number
  perspective?: number
  className?: string
  enableHoverShadow?: boolean
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  maxTilt = 8,
  perspective = 1000,
  className = '',
  enableHoverShadow = true,
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [canHover, setCanHover] = useState(false)
  const [transformStyle, setTransformStyle] = useState<string>('')
  const [shadowStyle, setShadowStyle] = useState<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    setCanHover(media.matches)

    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !canHover || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Normalize coordinates: -1 to 1 from center
    const xPct = (mouseX / width - 0.5) * 2
    const yPct = (mouseY / height - 0.5) * 2

    const rotX = -yPct * maxTilt
    const rotY = xPct * maxTilt

    setTransformStyle(`perspective(${perspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px)`)

    if (enableHoverShadow) {
      const shadowX = (-xPct * 12).toFixed(1)
      const shadowY = (Math.abs(yPct) * 16 + 10).toFixed(1)
      setShadowStyle(`${shadowX}px ${shadowY}px 28px -6px rgba(2, 132, 199, 0.25), 0 8px 12px -4px rgba(0, 0, 0, 0.1)`)
    }
  }

  const handleMouseLeave = () => {
    if (shouldReduceMotion || !canHover) return
    setTransformStyle(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translateZ(0px)`)
    setShadowStyle('')
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-[transform,box-shadow] duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: shouldReduceMotion || !canHover ? undefined : transformStyle || undefined,
        boxShadow: shouldReduceMotion || !canHover ? undefined : shadowStyle || undefined,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default TiltCard
