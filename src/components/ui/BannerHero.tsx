import { Container } from './Container'
import { Button } from './Button'

export function BannerHero({ title, description, image, action, size = 'inner', align = 'left', id }: { title: string; description?: string; image?: string; action?: { label: string; href: string }; size?: 'home' | 'inner'; align?: 'left' | 'center'; id?: string }) {
  const home = size === 'home'
  return <section id={id} aria-labelledby="banner-hero-title" className={`relative isolate flex ${home ? 'min-h-[640px] h-[100svh]' : 'min-h-[60vh]'} items-end overflow-hidden bg-water-950 text-white`}>
    {image && <img src={image} alt="" aria-hidden="true" width={1920} height={795} fetchPriority={home ? 'high' : undefined} loading={home ? 'eager' : 'lazy'} className="absolute inset-0 -z-20 h-full w-full object-cover" />}
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-water-950 via-water-950/70 to-water-950/15" />
    <Container className={`relative z-10 w-full pb-14 pt-28 sm:pb-20 ${align === 'center' ? 'text-center' : ''}`}>
      <h1 id="banner-hero-title" className="max-w-4xl font-condensed text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-water-100 sm:text-xl">{description}</p>}
      {action && <Button href={action.href} variant="primary" size="lg" className="mt-7">{action.label}</Button>}
    </Container>
  </section>
}
