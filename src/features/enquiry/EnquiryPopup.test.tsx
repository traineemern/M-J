import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/testUtils'
import { EnquiryPopup } from './EnquiryPopup'
import { useEnquiry } from './EnquiryContext'

// Test wrapper component with trigger button
function TestEnquiryHarness() {
  const { openEnquiry } = useEnquiry()
  return (
    <div>
      <button type="button" onClick={() => openEnquiry()}>
        Open Estimate Modal
      </button>
      <EnquiryPopup />
    </div>
  )
}

describe('EnquiryPopup Modal & Form Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Opens dialog on trigger click and traps focus', async () => {
    render(<TestEnquiryHarness />)

    // Dialog is initially not rendered
    expect(screen.queryByRole('dialog')).toBeNull()

    // Click trigger
    const openBtn = screen.getByRole('button', { name: 'Open Estimate Modal' })
    fireEvent.click(openBtn)

    // Dialog appears
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText(/Request a Free Estimate/i)).toBeInTheDocument()
  })

  it('Closes on Esc key and returns focus to trigger', async () => {
    render(<TestEnquiryHarness />)

    const openBtn = screen.getByRole('button', { name: 'Open Estimate Modal' })
    openBtn.focus()
    fireEvent.click(openBtn)

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toBeInTheDocument()

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    // Focus restored to trigger button
    expect(document.activeElement).toBe(openBtn)
  })

  it('Shows validation errors on incomplete submission', async () => {
    render(<TestEnquiryHarness />)

    fireEvent.click(screen.getByRole('button', { name: 'Open Estimate Modal' }))
    await screen.findByRole('dialog')

    // Submit without filling required fields
    const submitBtn = screen.getByRole('button', { name: /Send Estimate Request/i })
    fireEvent.click(submitBtn)

    expect(await screen.findByText(/Please enter your name/i)).toBeInTheDocument()
    expect(await screen.findByText(/Please enter a valid phone number/i)).toBeInTheDocument()
    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument()
    expect(await screen.findByText(/Please specify your city or township/i)).toBeInTheDocument()
    expect(await screen.findByText(/Please check the box to consent/i)).toBeInTheDocument()
  })

  it('Submits successfully and renders success state', async () => {
    render(<TestEnquiryHarness />)

    fireEvent.click(screen.getByRole('button', { name: 'Open Estimate Modal' }))
    await screen.findByRole('dialog')

    // Fill form
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '(616) 555-0123' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText(/City or Township/i), { target: { value: 'Casnovia' } })
    fireEvent.click(screen.getByLabelText(/I agree to allow M&J Water Wells/i))

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Send Estimate Request/i })
    fireEvent.click(submitBtn)

    // Verify success message with CONFIRM placeholder
    expect(
      await screen.findByText(/Thanks\. We will call you within \[CONFIRM hours\] hours\./i),
    ).toBeInTheDocument()
  })
})
