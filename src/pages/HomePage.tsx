import { useRef } from 'react'
import { X } from 'lucide-react'
import { SEO, generateLocalBusinessSchema } from '@/lib/seo'
import { ContentText } from '@/components/content/ContentText'
import { Hero } from '@/sections/homepage/Hero'
import { StatStrip } from '@/sections/homepage/StatStrip'
import { ServicesGrid } from '@/sections/homepage/ServicesGrid'
import { WhyChooseUs } from '@/sections/homepage/WhyChooseUs'
import { ProjectsCarousel } from '@/sections/homepage/ProjectsCarousel'
import { Testimonials } from '@/sections/homepage/Testimonials'
import { CtaBand } from '@/sections/homepage/CtaBand'
import { resolveContent, siteContent } from '@/data/site'

export function HomePage() {
  const videoDialogRef = useRef<HTMLDialogElement>(null)

  function openVideo() {
    videoDialogRef.current?.showModal()
  }

  function closeVideo() {
    videoDialogRef.current?.close()
  }

  return (
    <>
      <SEO
        title={siteContent.pages.home.title.value}
        description={siteContent.pages.home.description.value}
        canonicalUrl="/"
        jsonLd={generateLocalBusinessSchema({ pagePath: '/', pageName: 'Home' })}
      />
      <Hero onWatchVideo={openVideo} />
      <StatStrip />
      <ServicesGrid />
      <WhyChooseUs onWatchVideo={openVideo} />
      <ProjectsCarousel />
      <Testimonials />
      <CtaBand />
      <dialog
        ref={videoDialogRef}
        className="home-video-dialog"
        aria-labelledby="home-video-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeVideo()
        }}
      >
        <div className="home-video-dialog__top">
          <strong id="home-video-title"><ContentText field={siteContent.homepage.hero.videoTitle} /></strong>
          <button type="button" onClick={closeVideo} aria-label={resolveContent(siteContent.homepage.labels.closeVideo) ?? ''}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <video controls playsInline poster={resolveContent(siteContent.homepage.hero.videoPoster) ?? undefined}>
          <source src={resolveContent(siteContent.homepage.hero.videoSrc) ?? ''} type="video/mp4" />
        </video>
      </dialog>
    </>
  )
}

export default HomePage
