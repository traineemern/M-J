import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/layout/Layout'
import { RouteErrorBoundary } from '@/components/common/RouteErrorBoundary'
import { HomePage } from '@/pages/HomePage'
import { ServicesPage } from '@/pages/ServicesPage'
import { WarrantyPage } from '@/pages/WarrantyPage'
import { AboutPage } from '@/pages/AboutPage'
import { FaqPage } from '@/pages/FaqPage'
import { ContactPage } from '@/pages/ContactPage'
import { NewaygoPage } from '@/pages/NewaygoPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'warranty', element: <WarrantyPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'areas/newaygo', element: <NewaygoPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
