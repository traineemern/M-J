import React from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface AnimatedListProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  duration?: number
  as?: React.ElementType
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  duration = 200,
  as: Component = 'div',
  className,
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion()

  const [parentRef, enable] = useAutoAnimate<HTMLElement>({
    duration,
    easing: 'ease-in-out',
  })

  React.useEffect(() => {
    enable(!shouldReduceMotion)
  }, [enable, shouldReduceMotion])

  return (
    <Component ref={parentRef} className={className} {...rest}>
      {children}
    </Component>
  )
}

export default AnimatedList
