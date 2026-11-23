import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ContactForm } from '@/features/contact/ContactForm'
import { Phone, MapPin, Clock, Mail, ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { siteData } from '@/data/site'
import { PaymentLogos } from '@/features/trust/PaymentLogos'

const directions = `https://maps.google.com/?q=${encodeURIComponent(siteData.address.full)}`

export function ContactPage() {
  return <div className="contact-redesign bg-white text-ink">
    <SEO title="Contact M&J Water Wells | Well Drilling in Casnovia, MI" description="Contact M&J Water Wells in Casnovia, MI for well drilling, pump repair, or a free estimate." canonicalUrl="/contact" jsonLd={generateLocalBusinessSchema({ pagePath: '/contact', pageName: 'Contact' })} />
    <div className="bg-water-950 text-white text-xs"><Container className="flex h-9 items-center justify-between"><span className="hidden sm:inline">Family owned &amp; operated</span><div className="ml-auto flex items-center gap-5"><span className="hidden sm:inline">Casnovia, Michigan</span><a href={`tel:${siteData.phoneClean}`} className="inline-flex min-h-9 items-center gap-2"><Phone size={14}/>{siteData.phone}</a></div></Container></div>

    <section className="bg-sand py-14 sm:py-20 lg:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="contact-eyebrow">Contact · Casnovia, MI</p>
          <h1 className="mt-5 max-w-2xl font-condensed text-[clamp(2.5rem,6vw,5rem)] font-black leading-[.98] text-water-900">Let&apos;s talk about your <em className="text-water-600">water.</em></h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink">Local, family-owned and operated rotary well drilling and repair serving West Michigan.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Button href={`tel:${siteData.phoneClean}`} variant="primary" className="rounded-full"><Phone size={17}/>{siteData.phone}</Button><Button href="#contact-form" variant="outline" className="rounded-full">Request a free estimate</Button></div>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-water-900">{['Family owned & operated','Free estimates','Serving West Michigan'].map((item)=><li key={item} className="inline-flex items-center gap-2"><Check size={15} className="text-water-600"/>{item}</li>)}</ul>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <img src="/images/homepage-hero-1920.webp" alt="M&J Water Wells team, drilling rig, and facility" width={1920} height={1080} fetchPriority="high" className="aspect-[16/10] w-full rounded-2xl border border-water-100 object-cover shadow-xl"/>
          <div className="absolute -bottom-4 left-4 rounded-xl border border-water-100 bg-white p-4 shadow-lg sm:left-8"><p className="text-xs font-bold uppercase tracking-widest text-water-700">Typical reply</p><p className="mt-1 text-sm font-bold text-water-900">[CONFIRM: response time]</p></div>
        </div>
      </Container>
    </section>

    <div className="contact-ticker" aria-label="Family owned, Casnovia Michigan, free estimates, all major cards"><div>✦ FAMILY OWNED ✦ CASNOVIA, MI ✦ FREE ESTIMATES ✦ ALL MAJOR CARDS ✦ FAMILY OWNED ✦ CASNOVIA, MI ✦ FREE ESTIMATES ✦ ALL MAJOR CARDS</div></div>

    <section className="py-12"><Container className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="contact-quick-card"><Phone className="text-water-600"/><p className="contact-eyebrow">Call</p><a className="font-bold text-water-900" href={`tel:${siteData.phoneClean}`}>{siteData.phone}</a></Card>
      <Card className="contact-quick-card"><Mail className="text-water-600"/><p className="contact-eyebrow">Email</p><a className="break-all font-bold text-water-900" href={`mailto:${siteData.email}`}>{siteData.email}</a></Card>
      <Card className="contact-quick-card"><MapPin className="text-water-600"/><p className="contact-eyebrow">Visit</p><p className="font-bold text-water-900">{siteData.address.full}</p><a className="text-sm font-bold text-water-700 underline" href={directions} target="_blank" rel="noreferrer">Get directions</a></Card>
      <Card className="contact-quick-card"><Clock className="text-water-600"/><p className="contact-eyebrow">Hours</p><p className="font-bold text-water-900">[CONFIRM: business hours]</p></Card>
    </Container></section>

    <section className="bg-sand py-14 sm:py-20"><Container className="grid items-start gap-8 lg:grid-cols-[1.2fr_.8fr]">
      <div id="contact-form" className="scroll-mt-24"><ContactForm title="Request a free estimate" subtitle="Tell us about your property location and water needs."/></div>
      <aside className="grid gap-4">
        <Card variant="dark" className="!bg-water-950"><p className="contact-eyebrow">Prefer to talk?</p><a className="mt-2 block text-2xl font-black text-white" href={`tel:${siteData.phoneClean}`}>{siteData.phone}</a><Button href={`tel:${siteData.phoneClean}`} variant="primary" className="mt-4 rounded-full"><Phone size={16}/>Call now</Button></Card>
        <Card><h2 className="font-condensed text-xl font-black uppercase text-water-900">Service area</h2><p className="mt-2 text-ink">Casnovia, Sand Lake, Newaygo, Fremont &amp; Hesperia, and across West Michigan.</p><a className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-water-700" href="/areas/newaygo">Explore service areas <ArrowRight size={15}/></a></Card>
        <Card><h2 className="font-condensed text-xl font-black uppercase text-water-900">Payments</h2><p className="mt-2 text-ink">We accept all major credit cards.</p><PaymentLogos/></Card>
        <Card><ShieldCheck className="text-water-600"/><h2 className="mt-2 font-condensed text-xl font-black uppercase text-water-900">Warranty</h2><p className="mt-2 text-ink">Review warranty information for your well and pump work.</p><a className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-water-700" href="/warranty">Warranty details <ArrowRight size={15}/></a></Card>
      </aside>
    </Container></section>

    <section className="py-16"><Container className="grid gap-8 md:grid-cols-3">{[['01','Tell us about your project'],['02','We visit and give a free estimate'],['03','We schedule your work']].map(([n,text])=><div key={n} className="border-t-2 border-water-600 pt-4"><span className="font-condensed text-5xl font-black text-water-600">{n}</span><p className="mt-2 font-bold text-water-900">{text}</p></div>)}</Container></section>

    <section className="bg-sand py-14"><Container className="grid items-center gap-6 md:grid-cols-2"><div className="flex min-h-56 items-center justify-center rounded-2xl border-2 border-dashed border-water-300 bg-white text-center font-bold text-water-700">[CONFIRM: map embed]</div><div><p className="contact-eyebrow">Find us</p><h2 className="mt-3 font-condensed text-3xl font-black uppercase text-water-900">Casnovia, Michigan</h2><p className="mt-3 text-ink">{siteData.address.full}</p><a className="mt-3 inline-block font-bold text-water-700 underline" href={directions} target="_blank" rel="noreferrer">Get directions</a></div></Container></section>

    <section className="bg-water-950 py-14 text-white sm:py-20"><Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><h2 className="font-condensed text-3xl font-black uppercase sm:text-4xl">Ready to tap into clean water?</h2><p className="mt-2 text-white/80">Talk with our family team about your well or pump project.</p></div><div className="flex flex-wrap gap-3"><Button href="#contact-form" variant="primary" className="rounded-full">Free estimate</Button><Button href={`tel:${siteData.phoneClean}`} variant="outline" className="rounded-full"><Phone size={16}/>Call</Button></div></Container></section>
    <div className="contact-mobile-bar"><Button href={`tel:${siteData.phoneClean}`} variant="outline" className="flex-1 rounded-full">Call now</Button><Button href="#contact-form" variant="primary" className="flex-1 rounded-full">Free estimate</Button></div>
  </div>
}

export default ContactPage
