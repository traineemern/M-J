import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/testUtils'
import { ManagerChat } from './ManagerChat'
import { chatData } from '@/data/chat'

describe('ManagerChat Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Renders floating trigger button with manager avatar and label', () => {
    render(<ManagerChat />)

    const trigger = screen.getByRole('button', { name: /Chat with our manager/i })
    expect(trigger).toBeInTheDocument()
  })

  it('Opens chat panel on click and displays manager greeting', () => {
    render(<ManagerChat />)

    const trigger = screen.getByRole('button', { name: /Chat with our manager/i })
    fireEvent.click(trigger)

    const dialog = screen.getByRole('dialog', { name: /Chat with our site manager/i })
    expect(dialog).toBeInTheDocument()

    // Manager name and role displayed in header
    expect(screen.getByText(chatData.managerName)).toBeInTheDocument()
    expect(screen.getByText(chatData.managerRole)).toBeInTheDocument()

    // Initial greeting appears
    expect(screen.getByText(chatData.initialGreeting)).toBeInTheDocument()
  })

  it('Does NOT render any free-text input fields', () => {
    render(<ManagerChat />)

    fireEvent.click(screen.getByRole('button', { name: /Chat with our manager/i }))

    // Confirm no text input or textarea exists
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  it('Tapping a question button shows the question bubble and manager answer after typing delay', async () => {
    render(<ManagerChat />)

    fireEvent.click(screen.getByRole('button', { name: /Chat with our manager/i }))

    // First question: "How much does a well cost?"
    const firstQ = chatData.questions[0]
    const qButton = screen.getByRole('button', { name: firstQ.question })
    expect(qButton).toBeInTheDocument()

    fireEvent.click(qButton)

    // User question bubble appears (in addition to the question button in list)
    const matches = screen.getAllByText(firstQ.question)
    expect(matches.length).toBeGreaterThanOrEqual(2)

    // Typing indicator is active
    expect(screen.getByText(/Manager is typing/i)).toBeInTheDocument()

    // Manager answer appears after typing delay (600ms)
    await waitFor(
      () => {
        expect(screen.getByText(firstQ.answer)).toBeInTheDocument()
      },
      { timeout: 2000 },
    )

    // Action button "Request a quote" appears
    if (firstQ.action) {
      expect(screen.getByRole('button', { name: firstQ.action.label })).toBeInTheDocument()
    }
  })

  it('Closes on Esc key and restores focus to trigger button', async () => {
    render(<ManagerChat />)

    const trigger = screen.getByRole('button', { name: /Chat with our manager/i })
    trigger.focus()
    fireEvent.click(trigger)

    expect(screen.getByRole('dialog', { name: /Chat with our site manager/i })).toBeInTheDocument()

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull()
    })
    expect(document.activeElement).toBe(trigger)
  })
})
