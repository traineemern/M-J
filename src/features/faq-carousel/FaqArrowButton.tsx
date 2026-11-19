import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface FaqArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'prev' | 'next'
  onClick: () => void
  className?: string
}

export const FaqArrowButton: React.FC<FaqArrowButtonProps> = ({
  direction,
  onClick,
  className = '',
  ...props
}) => {
  const isPrev = direction === 'prev'
  const label = isPrev ? 'Previous question' : 'Next question'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`w-12 h-12 rounded-full bg-water-600 hover:bg-water-700 active:scale-95 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-400 focus-visible:ring-offset-2 shrink-0 ${className}`}
      {...props}
    >
      {isPrev ? (
        <ChevronLeft className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
      ) : (
        <ChevronRight className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
      )}
    </button>
  )
}

export default FaqArrowButton
