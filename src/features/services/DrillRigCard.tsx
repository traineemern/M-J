import { Cog, CheckCircle2 } from 'lucide-react'
import type { DrillRigItem } from '@/types'
import { Card } from '@/components/ui/Card'

interface DrillRigCardProps {
  rig: DrillRigItem
}

export function DrillRigCard({ rig }: DrillRigCardProps) {
  return (
    <Card variant="default" className="flex flex-col h-full border-t-4 border-t-water-600 bg-white">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-water-100 text-water-700 flex items-center justify-center shrink-0">
          <Cog className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-water-700 font-condensed">
            {rig.type}
          </span>
          <h3 className="text-xl font-bold text-water-900 font-condensed uppercase">{rig.name}</h3>
        </div>
      </div>

      <p className="text-sm text-water-800 leading-relaxed mb-5">
        {rig.description}
      </p>

      <div className="mt-auto space-y-4 pt-4 border-t border-water-100">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-water-900 mb-2 font-condensed">
            Ideal Applications:
          </h4>
          <ul className="space-y-1.5 text-xs text-water-800">
            {rig.idealFor.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-aqua shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-water-900 mb-2 font-condensed">
            Rig Capability Highlights:
          </h4>
          <ul className="space-y-1 text-xs text-water-700">
            {rig.specs.map((spec: string, idx: number) => (
              <li key={idx}>• {spec}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}
