import React from 'react'
import { motion } from 'motion/react'
import { siteContent } from '@/data/site'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export const SuccessCheck: React.FC = () => {
  const reduced = useReducedMotion()

  return (
    <svg className="success-check" viewBox="0 0 64 64" role="img"     aria-label={siteContent.contact.form.successTitle.value}>
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2" />
      <motion.path
        d="M18 33.5 27 42l19-20"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}

export default SuccessCheck
