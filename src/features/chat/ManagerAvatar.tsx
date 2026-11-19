import React from 'react'

interface ManagerAvatarProps {
  className?: string
  size?: number
}

export const ManagerAvatar: React.FC<ManagerAvatarProps> = ({
  className = 'w-10 h-10',
  size = 40,
}) => {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={`rounded-full shrink-0 select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Background circle in water-100 */}
      <circle cx="20" cy="20" r="20" fill="#D6EEF8" />

      {/* Shirt collar in water-700 (#0E5A84) */}
      <path d="M 6,40 Q 20,30 34,40 Z" fill="#0E5A84" />
      <path d="M 16,33 L 20,38 L 24,33 Z" fill="#FFFFFF" />

      {/* Neck */}
      <rect x="17" y="24" width="6" height="7" rx="2" fill="#E8B896" />

      {/* Head */}
      <ellipse cx="20" cy="19" rx="6" ry="6.5" fill="#E8B896" />

      {/* Eyes & Eyebrows */}
      <circle cx="18" cy="18.5" r="0.9" fill="#082F48" />
      <circle cx="22" cy="18.5" r="0.9" fill="#082F48" />
      <path d="M 16.8,16.5 Q 18,15.8 19.2,16.5" stroke="#082F48" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M 20.8,16.5 Q 22,15.8 23.2,16.5" stroke="#082F48" strokeWidth="0.8" fill="none" strokeLinecap="round" />

      {/* Hard hat yellow crown with highlight */}
      <path d="M 13,15 C 13,8 27,8 27,15 Z" fill="#EAB308" />
      <path d="M 15,13 Q 18,9.5 22,10" stroke="#FEF08A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.8" />

      {/* Hard hat darker brim */}
      <ellipse cx="20" cy="15" rx="9" ry="2" fill="#CA8A04" />
      <rect x="19" y="10" width="2" height="3" rx="1" fill="#CA8A04" />
    </svg>
  )
}

export default ManagerAvatar
