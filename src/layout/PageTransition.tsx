import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useMotion } from '@/lib/motion/useMotion'
import { motionConfig } from '@/lib/motion/config'
import { siteContent } from '@/data/site'

const pageTitles: Record<string, string> = {
  '/': siteContent.pages.labels.home.value,
  '/services': siteContent.pages.services.title.value,
  '/about': siteContent.pages.about.title.value,
  '/faq': siteContent.pages.faq.title.value,
  '/contact': siteContent.pages.contact.title.value,
  '/warranty': siteContent.pages.warranty.title.value,
  '/areas/newaygo': siteContent.pages.newaygo.title.value,
  '/not-found': siteContent.pages.notFound.title.value,
}

function getPageMotionName(pathname: string): string {
  if (pathname === '/') return 'home'
  if (pathname === '/areas/newaygo') return 'newaygo'
  if (['/services', '/about', '/faq', '/contact', '/warranty'].includes(pathname)) {
    return pathname.slice(1)
  }
  return 'not-found'
}

export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()
  const motionRoot = useRef<HTMLDivElement>(null)
  const pageMotionName = getPageMotionName(pathname)
  useMotion(motionRoot)

  return (
    <>
      <div
        ref={motionRoot}
        className={`page-motion-root page-motion-root--${pageMotionName}`}
        data-page-motion={pageMotionName}
      >
        {children}
      </div>
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          className="page-curtain"
          initial={{ clipPath: 'inset(0 0 0 0)' }}
          animate={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: motionConfig.duration.pageCurtain, ease: motionConfig.ui.curtain }}
        >
          <motion.span
            className="page-curtain__title"
            initial={{ opacity: 0, y: motionConfig.distance.curtainTitleIn }}
            animate={{ opacity: [0, 1, 0], y: [motionConfig.distance.curtainTitleIn, 0, -motionConfig.distance.curtainTitleOut] }}
            transition={{ duration: motionConfig.duration.pageCurtain, times: [0, motionConfig.timings.curtainTitlePeak, 1], ease: motionConfig.ui.curtain }}
          >
            {pageTitles[pathname] || '404'}
          </motion.span>
        </motion.div>
      )}
    </>
  )
}
