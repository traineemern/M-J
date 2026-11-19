import { ScrollRestoration, Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PhoneCTA } from '@/components/layout/PhoneCTA'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { PageTransition } from '@/components/motion/PageTransition'
import { EnquiryProvider } from '@/features/enquiry/EnquiryContext'
import { EnquiryPopup } from '@/features/enquiry/EnquiryPopup'
import { DrillingVideoProvider } from '@/features/drilling-video/DrillingVideoContext'
import { WatchDemoModal } from '@/features/drilling-video/WatchDemoModal'
import { ManagerChat } from '@/features/chat/ManagerChat'

export function RootLayout() {
  const location = useLocation()

  return (
    <EnquiryProvider>
        <DrillingVideoProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
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
    </EnquiryProvider >
  )
}

export default RootLayout
