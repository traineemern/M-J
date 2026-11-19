import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, MessageSquare, ArrowRight } from 'lucide-react'
import { chatData, type ChatAction, type ChatQuestionItem } from '@/data/chat'
import { ManagerAvatar } from './ManagerAvatar'
import { ChatMessage } from './ChatMessage'
import { useEnquiry } from '@/features/enquiry/EnquiryContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface MessageRecord {
  id: string
  sender: 'manager' | 'user'
  text: string
  action?: ChatAction
}

export const ManagerChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<MessageRecord[]>([
    {
      id: 'greeting',
      sender: 'manager',
      text: chatData.initialGreeting,
    },
  ])

  const { openEnquiry } = useEnquiry()
  const shouldReduceMotion = useReducedMotion()

  const chatButtonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of message stream
  useEffect(() => {
    if (isOpen && typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' })
    }
  }, [messages, isTyping, isOpen, shouldReduceMotion])

  // Esc key listener & focus management
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
        chatButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    chatButtonRef.current?.focus()
  }

  const handleSelectQuestion = (q: ChatQuestionItem) => {
    if (isTyping) return

    // 1. Add user question bubble
    const userMsg: MessageRecord = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q.question,
    }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    // 2. Typing indicator delay (600 ms)
    setTimeout(() => {
      const managerMsg: MessageRecord = {
        id: `manager-${Date.now()}`,
        sender: 'manager',
        text: q.answer,
        action: q.action,
      }
      setMessages((prev) => [...prev, managerMsg])
      setIsTyping(false)
    }, 600)
  }

  const handleActionClick = (action: ChatAction) => {
    if (action.type === 'enquiry') {
      openEnquiry()
      setIsOpen(false)
    }
  }

  const handleFallbackClick = () => {
    openEnquiry()
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <button
        ref={chatButtonRef}
        type="button"
        onClick={handleOpen}
        aria-label="Chat with our manager"
        aria-expanded={isOpen}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2.5 p-1.5 sm:px-4 sm:py-2.5 rounded-full bg-water-700 hover:bg-water-800 text-white shadow-xl hover:shadow-2xl border-2 border-water-400/50 transition-transform active:scale-95 cursor-pointer ${
          isOpen ? 'hidden' : 'flex'
        }`}
      >
        <ManagerAvatar size={36} className="border border-white/40" />
        <span className="hidden sm:inline font-condensed font-bold uppercase tracking-wider text-xs pr-1">
          Chat with our manager
        </span>
        <span className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-water-800 text-white">
          <MessageSquare className="w-4 h-4" />
        </span>
      </button>

      {/* Chat Panel Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col justify-end">
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="sm:hidden fixed inset-0 bg-water-950/40 backdrop-blur-xs cursor-pointer"
              aria-hidden="true"
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Chat with our site manager"
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 20,
                scale: shouldReduceMotion ? 1 : 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 20,
                scale: shouldReduceMotion ? 1 : 0.96,
              }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full sm:w-[380px] h-full sm:h-[540px] max-h-[100dvh] sm:max-h-[580px] bg-white sm:rounded-2xl shadow-2xl border border-water-200 flex flex-col overflow-hidden z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-water-800 text-white border-b border-water-900">
                <div className="flex items-center gap-3">
                  <ManagerAvatar size={38} className="border border-white/50" />
                  <div>
                    <h2 className="text-sm font-bold font-condensed uppercase tracking-wider text-white leading-tight">
                      {chatData.managerName}
                    </h2>
                    <p className="text-[11px] text-water-200 leading-tight">
                      {chatData.managerRole}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close chat"
                  className="p-1 rounded-lg text-water-200 hover:text-white hover:bg-water-700/60 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Scroll Area */}
              <div
                className="flex-1 p-4 overflow-y-auto space-y-3 bg-water-50/40"
                aria-live="polite"
              >
                {messages.map((m) => (
                  <ChatMessage
                    key={m.id}
                    sender={m.sender}
                    text={m.text}
                    action={m.action}
                    onActionClick={handleActionClick}
                  />
                ))}

                {/* Typing Indicator (600ms) */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-water-100 text-water-700 max-w-[80px] mr-auto">
                    <span className="sr-only">Manager is typing</span>
                    <span className="w-2 h-2 rounded-full bg-water-500 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-water-500 animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-water-500 animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Prebuilt Questions Section (No free-text input) */}
              <div className="p-3 border-t border-water-200 bg-white">
                <p className="text-[11px] font-bold text-water-600 font-condensed uppercase tracking-wider mb-2">
                  Choose a question:
                </p>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {chatData.questions.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      disabled={isTyping}
                      onClick={() => handleSelectQuestion(q)}
                      className="w-full text-left px-3 py-1.5 rounded-lg bg-water-50 hover:bg-water-100 active:bg-water-200 border border-water-200 text-water-900 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {q.question}
                    </button>
                  ))}
                </div>

                {/* Bottom Fallback Callout */}
                <div className="mt-3 pt-2.5 border-t border-water-100 flex items-center justify-between text-[11px] text-water-700">
                  <span className="truncate pr-2">{chatData.fallbackNote}</span>
                  <button
                    type="button"
                    onClick={handleFallbackClick}
                    className="shrink-0 inline-flex items-center gap-1 font-bold text-water-700 hover:text-water-900 font-condensed uppercase tracking-wider cursor-pointer underline"
                  >
                    <span>{chatData.fallbackButtonText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ManagerChat
