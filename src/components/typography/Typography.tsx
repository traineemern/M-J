import type { HTMLAttributes, ReactNode } from 'react'
import type { MotionPreset } from '@/lib/motion/presets'

interface EyebrowProps {
  children: ReactNode
  className?: string
}

interface DisplayHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3
  lines: string[]
  outlinedLine?: number
  motionPreset?: MotionPreset
  fit?: boolean
  fitRatio?: number
  ripple?: boolean
}

export function Eyebrow({ children, className = '' }: EyebrowProps) {
  return <p className={`typo-eyebrow ${className}`}>{children}</p>
}

export function MonoLabel({ children, className = '' }: EyebrowProps) {
  return <span className={`typo-mono ${className}`}>{children}</span>
}

export function DisplayHeading({
  level = 2,
  lines,
  outlinedLine,
  motionPreset = 'heading',
  fit = false,
  fitRatio,
  ripple = false,
  className = '',
  ...props
}: DisplayHeadingProps) {
  const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'
  return (
    <Tag
      {...props}
      aria-label={props['aria-label'] ?? lines.join(' ')}
      className={`typo-display ${level === 1 ? '' : 'typo-display--section'} ${className}`}
      data-fit-text={fit ? 'true' : undefined}
      data-fit-ratio={fit && fitRatio ? fitRatio : undefined}
    >
      {lines.map((line, index) => (
        <span
          className={`typo-display__line${outlinedLine === index ? ' typo-display__line--outline' : ''}`}
          data-fit-line={fit ? 'true' : undefined}
          data-motion={motionPreset}
          data-hero-ripple={ripple ? 'true' : undefined}
          data-split={motionPreset === 'hero-chars' ? 'chars' : 'words'}
          key={`${index}-${line}`}
        >
          {line}
        </span>
      ))}
    </Tag>
  )
}

interface SectionTitleProps {
  title: string
  eyebrow?: string
  children?: ReactNode
  className?: string
}

export function SectionTitle({ title, eyebrow, children, className = '' }: SectionTitleProps) {
  return (
    <div className={className}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <DisplayHeading level={2} lines={[title]} className="typo-display--section" />
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

export function Lede({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={`typo-lede ${className}`}>{children}</p>
}
