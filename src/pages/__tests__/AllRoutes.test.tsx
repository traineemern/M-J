import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { router } from '@/app/router'

describe('All Application Routes', () => {
  const routesToTest = [
    { path: '/', expectedText: 'well drilling specialists' },
    { path: '/services', expectedText: 'Services' },
    { path: '/warranty', expectedText: 'Warranty' },
    { path: '/about', expectedText: 'About' },
    { path: '/faq', expectedText: 'Frequently Asked Questions' },
    { path: '/contact', expectedText: 'Contact' },
    { path: '/areas/newaygo', expectedText: 'Newaygo' },
  ]

  routesToTest.forEach(({ path, expectedText }) => {
    it(`renders route "${path}" cleanly without error boundary triggering`, async () => {
      const memoryRouter = createMemoryRouter(router.routes, {
        initialEntries: [path],
      })

      const { unmount } = render(<RouterProvider router={memoryRouter} />)

      // Ensure the error boundary did NOT catch an error
      expect(screen.queryByText(/Something Went Wrong/i)).toBeNull()
      expect(screen.queryByText(/Module Updating/i)).toBeNull()

      // Ensure page-specific content appears
      const found = await screen.findAllByText(new RegExp(expectedText, 'i'))
      expect(found.length).toBeGreaterThan(0)

      unmount()
    })
  })
})
