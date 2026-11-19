import { trustBrands } from '@/data/brands'
import { Container } from '@/components/ui/Container'

interface BrandMarqueeProps {
  compact?: boolean
}

export function BrandMarquee({ compact = false }: BrandMarqueeProps) {
  if (compact) {
    return (
      <div className="py-6 border-y border-water-100 bg-water-50/50">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {trustBrands.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-water-200 shadow-xs hover:border-water-400 hover:shadow-md card-hover-lift transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-water-100 text-water-700 flex items-center justify-center font-black text-sm font-condensed">
                  {brand.name.charAt(0)}
                </div>
                <span className="font-bold text-water-900 text-xs sm:text-sm tracking-tight font-condensed uppercase">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </div>
    )
  }

  return (
    <section className="py-8 bg-water-50 border-y border-water-100">
      <Container>
        {/* Single row of trust logos */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {trustBrands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-water-200 shadow-xs hover:border-water-400 hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-water-100 text-water-700 flex items-center justify-center font-black text-base font-condensed">
                {brand.name.charAt(0)}
              </div>
              <span className="font-bold text-water-900 text-sm tracking-tight font-condensed uppercase">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
