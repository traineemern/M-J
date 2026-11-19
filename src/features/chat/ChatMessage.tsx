import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, ArrowRight, ExternalLink } from 'lucide-react'
import type { ChatAction } from '@/data/chat'

export interface ChatMessageProps {
  sender: 'manager' | 'user'
  text: string
  action?: ChatAction
  onActionClick?: (action: ChatAction) => void
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  sender,
  text,
  action,
  onActionClick,
}) => {
  const isManager = sender === 'manager'

  return (
    <div
      className={`flex flex-col ${
        isManager ? 'items-start mr-auto' : 'items-end ml-auto'
      } max-w-[88%] space-y-1.5`}
    >
      <div
        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isManager
            ? 'bg-water-50 text-water-900 border border-water-200 rounded-tl-xs shadow-xs'
            : 'bg-water-700 text-white rounded-tr-xs shadow-xs font-medium'
        }`}
      >
        <p>{text}</p>
      </div>

      {/* Optional action button or link attached to manager's response */}
      {isManager && action && (
        <div className="pt-1">
          {action.type === 'enquiry' && (
            <button
              type="button"
              onClick={() => onActionClick && onActionClick(action)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-water-600 hover:bg-water-700 text-white text-xs font-condensed font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              <span>{action.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {action.type === 'call' && (
            <a
              href={action.href || 'tel:+16166754875'}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-water-700 hover:bg-water-800 text-white text-xs font-condensed font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>{action.label}</span>
            </a>
          )}

          {action.type === 'link' && action.href && (
            <Link
              to={action.href}
              onClick={() => onActionClick && onActionClick(action)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-water-100 hover:bg-water-200 text-water-900 text-xs font-condensed font-bold uppercase tracking-wider transition-colors"
            >
              <span>{action.label}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatMessage
