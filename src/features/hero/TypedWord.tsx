import React, { useEffect, useRef } from 'react'
import Typed from 'typed.js'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface TypedWordProps {
  words?: string[]
  className?: string
}

export const TypedWord: React.FC<TypedWordProps> = ({
  words = ['homes', 'farms', 'businesses'],
  className = 'text-sky-600 font-bold',
}) => {
  const elRef = useRef<HTMLSpanElement>(null)
  const typedRef = useRef<Typed | null>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    // Under reduced motion or server render, do not run Typed.js
    if (shouldReduceMotion || !elRef.current) return

    typedRef.current = new Typed(elRef.current, {
      strings: words,
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 1500,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    })

    return () => {
      typedRef.current?.destroy()
      typedRef.current = null
    }
  }, [words, shouldReduceMotion])

  return (
    <span className={className}>
      {/* Fallback & first word rendered directly in HTML before JS runs */}
      <span ref={elRef}>{words[0]}</span>
    </span>
  )
}

export default TypedWord
