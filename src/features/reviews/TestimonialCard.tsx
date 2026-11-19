import { Star, MapPin } from 'lucide-react'
import type { TestimonialItem } from '@/types'
import { Card } from '@/components/ui/Card'

interface TestimonialCardProps {
  testimonial: TestimonialItem
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card variant="interactive" className="flex flex-col justify-between h-full bg-white border-t-2 border-t-water-600">
      <div>
        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-amber-500 mb-3" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-500" />
          ))}
        </div>

        {/* Text */}
        <p className="text-water-900 text-sm sm:text-base leading-relaxed italic mb-6">
          &ldquo;{testimonial.text}&rdquo;
        </p>
      </div>

      {/* Author and Location info */}
      <div className="pt-4 border-t border-water-100 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-water-900 text-sm font-condensed uppercase tracking-wider">
            {testimonial.author}
          </h4>
          <span className="text-xs text-water-700 font-semibold">{testimonial.projectType}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-water-700">
          <MapPin className="w-3.5 h-3.5 text-aqua" />
          <span>{testimonial.city}</span>
        </div>
      </div>
    </Card>
  )
}
