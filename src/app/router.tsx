import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './RootLayout'
import { RouteErrorBoundary } from '@/components/common/RouteErrorBoundary'
import { HomePage } from '@/pages/HomePage'
import { ServicesPage } from '@/pages/ServicesPage'
import { WarrantyPage } from '@/pages/WarrantyPage'
import { AboutPage } from '@/pages/AboutPage'
import { FaqPage } from '@/pages/FaqPage'
import { ContactPage } from '@/pages/ContactPage'
import { NewaygoAreaPage } from '@/pages/NewaygoAreaPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'warranty', element: <WarrantyPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'areas/newaygo', element: <NewaygoAreaPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
