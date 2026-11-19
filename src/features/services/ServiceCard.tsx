import {
  Home,
  Building2,
  Tractor,
  Cog,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ServiceItem } from '@/types'
import { Card } from '@/components/ui/Card'

const iconMap = {
  Home,
  Building2,
  Tractor,
  Cog,
  ShieldCheck,
  Wrench,
}

interface ServiceCardProps {
  service: ServiceItem
  showLink?: boolean
}

export function ServiceCard({ service, showLink = true }: ServiceCardProps) {
  const IconComponent = iconMap[service.iconName as keyof typeof iconMap] || Wrench

  return (
    <Card variant="interactive" className="flex flex-col h-full group border-t-4 border-t-water-600 bg-white">
      <div className="flex items-center gap-3.5 mb-4">
        <div className="w-12 h-12 rounded-xl bg-water-100 text-water-700 flex items-center justify-center shrink-0 group-hover:bg-water-600 group-hover:text-white transition-colors duration-200">
          <IconComponent className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-water-700 block font-condensed">
            {service.category.replace('-', ' ')}
          </span>
          <h3 className="text-xl font-bold text-water-900 font-condensed uppercase tracking-wide group-hover:text-water-700 transition-colors">
            {service.title}
          </h3>
        </div>
      </div>

      <p className="text-sm text-water-800 leading-relaxed mb-6">
        {service.shortDescription}
      </p>

      <ul className="space-y-2 mb-6 flex-1 text-xs sm:text-sm text-water-900">
        {service.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-aqua shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {showLink && (
        <div className="pt-4 border-t border-water-100 mt-auto">
          <Link
            to="/#contact-estimate"
            className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider font-condensed text-water-700 hover:text-water-800 transition-colors group/link"
          >
            <span>Get a Free Estimate</span>
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </Card>
  )
}
