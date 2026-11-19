import { paymentMethods } from '@/data/brands'
import { CreditCard } from 'lucide-react'

export function PaymentLogos() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 font-condensed">
        <CreditCard className="w-4 h-4 text-aqua" />
        <span>Payments Accepted</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {paymentMethods.map((method) => (
          <span
            key={method.name}
            className="inline-flex items-center px-3 py-1.5 rounded-md bg-water-900 border border-water-800 text-xs font-semibold text-slate-200 tracking-wide"
          >
            {method.name}
          </span>
        ))}
      </div>
    </div>
  )
}
