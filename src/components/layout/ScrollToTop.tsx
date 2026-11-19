import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      className="fixed bottom-20 md:bottom-8 right-6 z-40 p-3 rounded-full bg-water-600 text-white shadow-xl hover:bg-water-700 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-water-600"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
