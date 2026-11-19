import React from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { DURATIONS, EASINGS, TRANSFORMS } from '@/lib/motion'

interface PressableButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
  className?: string
}

export function PressableButton({
  children,
  className = '',
  disabled,
  ...props
}: PressableButtonProps) {
  const shouldReduceMotion = useReducedMotion()
  const isMobile = useIsMobile()

  if (shouldReduceMotion || disabled) {
    return (
      <button className={className} disabled={disabled} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    )
  }

  return (
    <motion.button
      whileHover={isMobile ? undefined : { scale: TRANSFORMS.buttonHoverScale }}
      whileTap={{ scale: TRANSFORMS.buttonPressScale }}
      transition={{
        duration: DURATIONS.micro,
        ease: EASINGS.easeOut,
      }}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}
