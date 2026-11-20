import { Link } from 'react-router-dom'
import { SEO } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { DepthFloat } from '@/components/motion/DepthFloat'
import { siteData, mainNavLinks } from '@/data/site'
import { Phone, ArrowRight } from 'lucide-react'

export function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found (404) | M&J Water Wells"
        description="The page you are looking for has been moved or does not exist. Navigate back to M&J Water Wells in Casnovia, MI."
        canonicalUrl="/"
      />

      <section className="min-h-[60vh] flex items-center bg-surface-muted py-20">
        <Container size="sm">
          <div className="text-center space-y-6">
            {/* Floating Logo with DepthFloat: up & down 6px, 4s loop, pauses on hover */}
            <div className="flex justify-center">
              <DepthFloat distance={6} duration={4}>
                <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-water-900 border border-water-700 text-white shadow-xl">
                  <img
                    src="/images/mj-mark.svg"
                    alt="M&J Water Wells, Casnovia, Michigan"
                    width={220}
                    height={48}
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </div>
              </DepthFloat>
            </div>

            {/* 404 Heading */}
            <div>
              <span className="text-6xl sm:text-8xl font-black text-water-300 block font-condensed">404</span>
              <h1 className="text-2xl sm:text-3xl font-black text-ink-dark mt-2 font-condensed uppercase">
                This Well Came Up Dry
              </h1>
              <p className="text-ink mt-3 max-w-md mx-auto">
                The page you are looking for has been moved or no longer exists. Let us help you find what you need.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-4">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-bold uppercase tracking-wider font-condensed text-ink-dark bg-white border border-slate-200 rounded-lg px-4 py-3 hover:bg-water-50 hover:border-water-300 hover:text-water-600 transition-colors text-center shadow-xs"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button href="/" variant="primary" size="lg" className="font-condensed uppercase tracking-wider">
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Go to Homepage</span>
              </Button>
              <Button href={`tel:${siteData.phoneClean}`} variant="dark" size="lg" className="font-condensed uppercase tracking-wider">
                <Phone className="w-4 h-4 fill-current" />
                <span>Call: {siteData.phone}</span>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
