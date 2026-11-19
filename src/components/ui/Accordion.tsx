import React from 'react'
import { ChevronDown } from 'lucide-react'

export interface AccordionItemData {
  id: string
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItemData[]
  className?: string
  summaryClassName?: string
  contentClassName?: string
}

/**
 * Accessible Accordion component using native <details> and <summary> elements.
 * - Works 100% without JavaScript for search engines, SEO, and screen readers.
 * - Starts closed by default (no `open` attribute).
 * - Opens cleanly on mouse click or keyboard (Enter/Space).
 */
export function Accordion({
  items,
  className = '',
  summaryClassName = '',
  contentClassName = '',
}: AccordionProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <details
          key={item.id}
          className="group rounded-xl border border-water-200 bg-white shadow-2xs overflow-hidden transition-colors open:bg-water-50/40"
        >
          <summary
            className={`flex w-full items-center justify-between p-4 sm:p-5 text-left font-bold text-water-900 hover:text-water-700 transition-colors cursor-pointer gap-4 select-none list-none [&::-webkit-details-marker]:hidden font-condensed text-lg uppercase tracking-wide ${summaryClassName}`}
          >
            <span>{item.title}</span>
            <ChevronDown className="w-5 h-5 text-water-600 shrink-0 transition-transform duration-200 group-open:rotate-180" />
          </summary>

          <div
            className={`p-4 sm:p-5 pt-0 text-sm sm:text-base text-water-900/90 leading-relaxed border-t border-water-100 font-sans ${contentClassName}`}
          >
            {item.content}
          </div>
        </details>
      ))}
    </div>
  )
}

export default Accordion
