import { ScrollRestoration, Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/layout/Header'
import { Footer } from '@/layout/Footer'
import { MobileActionBar } from '@/layout/MobileActionBar'
import { PageTransition } from '@/layout/PageTransition'
import { EnquiryProvider } from '@/features/enquiry/EnquiryContext'
import { EnquiryPopup } from '@/features/enquiry/EnquiryPopup'
import { IntroLoader } from '@/layout/IntroLoader'
import { siteContent } from '@/data/site'

export function Layout() {
  const location = useLocation()

  return (
    <EnquiryProvider>
      <div className={`night-site theme-charcoal flex min-h-screen flex-col${location.pathname !== '/' ? ' inner-page-active' : ''}`}>
        <a className="skip-link" href="#main-content">{siteContent.pages.labels.skipToContent.value}</a>
        {location.pathname !== '/' && <div className="motion-scroll-progress" data-scroll-progress aria-hidden="true" />}
        <Header />
        <main id="main-content" className={`flex-1 ${location.pathname !== '/' ? 'pt-[72px]' : ''}`}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
        <MobileActionBar />
        <IntroLoader />
        <ScrollRestoration />
        <EnquiryPopup />
      </div>
    </EnquiryProvider>
  )
}

export default Layout
