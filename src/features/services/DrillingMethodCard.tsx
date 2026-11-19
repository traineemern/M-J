import { Compass, CheckCircle2 } from 'lucide-react'
import type { DrillingMethodItem } from '@/types'
import { Card } from '@/components/ui/Card'

interface DrillingMethodCardProps {
  method: DrillingMethodItem
}

export function DrillingMethodCard({ method }: DrillingMethodCardProps) {
  return (
    <Card variant="default" className="flex flex-col h-full bg-water-50/60 border-t-2 border-t-water-600">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-water-600 text-white flex items-center justify-center shrink-0">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-water-900 font-condensed uppercase">{method.name}</h3>
        </div>
      </div>

      <p className="text-sm text-water-800 leading-relaxed mb-4">
        {method.description}
      </p>

      <div className="mb-4 p-3 bg-white rounded-lg border border-water-200 text-xs">
        <span className="font-bold text-water-900 block mb-0.5 font-condensed uppercase">Primary Geological Fit:</span>
        <span className="text-water-700">{method.geology}</span>
      </div>

      <div className="mt-auto pt-3 border-t border-water-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-water-900 mb-2 font-condensed">
          Method Advantages:
        </h4>
        <ul className="space-y-1.5 text-xs text-water-800">
          {method.advantages.map((adv: string, idx: number) => (
            <li key={idx} className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-aqua shrink-0 mt-0.5" />
              <span>{adv}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
