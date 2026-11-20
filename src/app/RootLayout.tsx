import { useEffect } from 'react'
import { ScrollRestoration, Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PhoneCTA } from '@/components/layout/PhoneCTA'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { PageTransition } from '@/components/motion/PageTransition'
import { ScrollProgressBar } from '@/components/motion/ScrollProgressBar'
import { EnquiryProvider } from '@/features/enquiry/EnquiryContext'
import { EnquiryPopup } from '@/features/enquiry/EnquiryPopup'
import { DrillingVideoProvider } from '@/features/drilling-video/DrillingVideoContext'
import { WatchDemoModal } from '@/features/drilling-video/WatchDemoModal'
import { ManagerChat } from '@/features/chat/ManagerChat'

export function RootLayout() {
  const location = useLocation()

  useEffect(() => {
    // Only dynamically load & initialize Lenis on desktop (min-width 1024px, pointer: fine) when reduced motion is off
    if (typeof window === 'undefined') return
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isDesktop && hasFinePointer && !prefersReduced) {
      let cleanup: (() => void) | undefined
      import('@/lib/smoothScroll').then((m) => {
        cleanup = m.initSmoothScroll()
      })
      return () => {
        cleanup?.()
      }
    }
  }, [])

  return (
    <EnquiryProvider>
      <DrillingVideoProvider>
        <div className="theme-charcoal flex flex-col min-h-screen">
          {/* Top Scroll Progress Line (All Pages) */}
          <ScrollProgressBar />
          <Header />
          <main className={`flex-1 ${location.pathname !== '/' ? 'pt-[72px]' : ''}`}>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </main>
          <Footer />
          <PhoneCTA />
          <ScrollToTop />
          <ScrollRestoration />

          {/* Global Modals & Floating Tools */}
          <EnquiryPopup />
          <WatchDemoModal />
          <ManagerChat />
        </div>
      </DrillingVideoProvider>
    </EnquiryProvider>
  )
}

export default RootLayout
